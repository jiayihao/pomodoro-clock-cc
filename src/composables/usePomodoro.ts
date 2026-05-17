import { computed, onBeforeUnmount, ref, watch } from 'vue';

type PomodoroPhase = 'work' | 'break';

type PomodoroState = {
  phase: PomodoroPhase;
  remainingSeconds: number;
  completedPomodoros: number;
};

type StoredPomodoroState = Partial<Record<keyof PomodoroState, unknown>>;

const WORK_SECONDS = 25 * 60;
const BREAK_SECONDS = 5 * 60;
const STORAGE_KEY = 'pomodoro-state';

const phaseDurations: Record<PomodoroPhase, number> = {
  work: WORK_SECONDS,
  break: BREAK_SECONDS,
};

const phaseLabels: Record<PomodoroPhase, string> = {
  work: '专注中',
  break: '休息中',
};

function readStoredState(): PomodoroState {
  const fallback: PomodoroState = {
    phase: 'work',
    remainingSeconds: WORK_SECONDS,
    completedPomodoros: 0,
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;

    const parsed = JSON.parse(raw) as StoredPomodoroState;
    const { phase, remainingSeconds, completedPomodoros } = parsed;

    if (phase !== 'work' && phase !== 'break') return fallback;
    if (!Number.isInteger(remainingSeconds) || typeof remainingSeconds !== 'number' || remainingSeconds < 0) return fallback;
    if (!Number.isInteger(completedPomodoros) || typeof completedPomodoros !== 'number' || completedPomodoros < 0) return fallback;

    return {
      phase,
      remainingSeconds: Math.min(remainingSeconds, phaseDurations[phase]),
      completedPomodoros,
    };
  } catch {
    return fallback;
  }
}

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}

export function usePomodoro() {
  const storedState = readStoredState();
  const phase = ref<PomodoroPhase>(storedState.phase);
  const remainingSeconds = ref(storedState.remainingSeconds);
  const completedPomodoros = ref(storedState.completedPomodoros);
  const isRunning = ref(false);
  const intervalId = ref<number>();
  const endsAt = ref<number>();

  const formattedTime = computed(() => formatTime(remainingSeconds.value));
  const phaseLabel = computed(() => phaseLabels[phase.value]);
  const buttonLabel = computed(() => (isRunning.value ? '暂停' : '开始'));
  const progress = computed(() => {
    const duration = phaseDurations[phase.value];
    return 1 - remainingSeconds.value / duration;
  });

  function persist() {
    const state: PomodoroState = {
      phase: phase.value,
      remainingSeconds: remainingSeconds.value,
      completedPomodoros: completedPomodoros.value,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updateTitle() {
    document.title = `${formattedTime.value} · ${phaseLabel.value}`;
  }

  function stopInterval() {
    if (intervalId.value) {
      window.clearInterval(intervalId.value);
      intervalId.value = undefined;
    }
  }

  function switchPhase() {
    if (phase.value === 'work') {
      completedPomodoros.value += 1;
      phase.value = 'break';
    } else {
      phase.value = 'work';
    }

    remainingSeconds.value = phaseDurations[phase.value];
    endsAt.value = Date.now() + remainingSeconds.value * 1000;
    persist();
  }

  function tick() {
    if (!endsAt.value) return;

    const nextRemainingSeconds = Math.max(0, Math.ceil((endsAt.value - Date.now()) / 1000));
    if (nextRemainingSeconds === remainingSeconds.value) return;

    remainingSeconds.value = nextRemainingSeconds;

    if (nextRemainingSeconds === 0) {
      switchPhase();
    }
  }

  function start() {
    if (isRunning.value) return;

    isRunning.value = true;
    endsAt.value = Date.now() + remainingSeconds.value * 1000;
    tick();
    intervalId.value = window.setInterval(tick, 250);
  }

  function pause() {
    if (!isRunning.value) return;

    tick();
    isRunning.value = false;
    endsAt.value = undefined;
    stopInterval();
    persist();
  }

  function toggle() {
    if (isRunning.value) {
      pause();
    } else {
      start();
    }
  }

  function reset() {
    isRunning.value = false;
    endsAt.value = undefined;
    stopInterval();
    remainingSeconds.value = phaseDurations[phase.value];
    persist();
  }

  watch([phase, remainingSeconds], () => {
    updateTitle();
    if (!isRunning.value) persist();
  });

  updateTitle();

  onBeforeUnmount(() => {
    stopInterval();
  });

  return {
    phase,
    phaseLabel,
    formattedTime,
    remainingSeconds,
    completedPomodoros,
    isRunning,
    buttonLabel,
    progress,
    toggle,
    reset,
  };
}

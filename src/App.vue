<script setup lang="ts">
import TimerControls from './components/TimerControls.vue';
import TimerDisplay from './components/TimerDisplay.vue';
import { usePomodoro } from './composables/usePomodoro';

const {
  buttonLabel,
  completedPomodoros,
  formattedTime,
  isRunning,
  phaseLabel,
  progress,
  reset,
  toggle,
} = usePomodoro();
</script>

<template>
  <main class="app-shell">
    <section class="hero">
      <p class="eyebrow">Pomodoro Timer</p>
      <h1>桌面番茄钟</h1>
      <p class="subtitle">保持专注 25 分钟，然后休息 5 分钟。</p>
    </section>

    <TimerDisplay
      :phase-label="phaseLabel"
      :formatted-time="formattedTime"
      :completed-pomodoros="completedPomodoros"
      :progress="progress"
    />

    <TimerControls
      :button-label="buttonLabel"
      :is-running="isRunning"
      @toggle="toggle"
      @reset="reset"
    />
  </main>
</template>

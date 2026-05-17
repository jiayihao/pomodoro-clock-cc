<script setup lang="ts">
defineProps<{
  phaseLabel: string;
  formattedTime: string;
  completedPomodoros: number;
  progress: number;
}>();
</script>

<template>
  <section class="timer-card" aria-live="polite">
    <div class="phase-pill">{{ phaseLabel }}</div>
    <div class="timer-time">{{ formattedTime }}</div>
    <div class="progress-track" aria-hidden="true">
      <div class="progress-bar" :style="{ width: `${Math.round(progress * 100)}%` }" />
    </div>
    <p class="timer-count">已完成 {{ completedPomodoros }} 个番茄</p>
  </section>
</template>

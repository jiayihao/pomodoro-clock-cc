<script setup lang="ts">
defineProps<{
  buttonLabel: string;
  isRunning: boolean;
}>();

const emit = defineEmits<{
  toggle: [];
  reset: [];
}>();
</script>

<template>
  <div class="timer-controls">
    <button class="primary-button" type="button" @click="emit('toggle')">
      {{ buttonLabel }}
    </button>
    <button class="secondary-button" type="button" :disabled="isRunning" @click="emit('reset')">
      重置
    </button>
  </div>
</template>

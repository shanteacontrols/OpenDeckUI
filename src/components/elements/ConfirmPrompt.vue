<template>
  <teleport to="body">
    <div
      v-if="state.visible"
      class="confirm-prompt"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-prompt-title"
      @keydown.esc="cancelConfirmPrompt"
    >
      <div class="confirm-prompt-backdrop" @click="cancelConfirmPrompt"></div>
      <div class="confirm-prompt-panel" tabindex="-1">
        <h2 id="confirm-prompt-title" class="confirm-prompt-title">
          Confirm action
        </h2>
        <p class="confirm-prompt-message">
          {{ state.message }}
        </p>
        <div class="confirm-prompt-actions">
          <Button @click="cancelConfirmPrompt">
            Cancel
          </Button>
          <Button class="btn-primary" @click="acceptConfirmPrompt">
            Continue
          </Button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  acceptConfirmPrompt,
  cancelConfirmPrompt,
  confirmPromptState,
} from "../../composables";

export default defineComponent({
  name: "ConfirmPrompt",
  setup() {
    return {
      state: confirmPromptState,
      acceptConfirmPrompt,
      cancelConfirmPrompt,
    };
  },
});
</script>

<style scoped>
.confirm-prompt {
  @apply fixed inset-0 z-50 flex items-center justify-center px-4;
}

.confirm-prompt-backdrop {
  @apply absolute inset-0 bg-black opacity-75;
}

.confirm-prompt-panel {
  @apply relative w-full max-w-md rounded-lg bg-surface p-6 shadow-lg;
}

.confirm-prompt-title {
  @apply mb-3 text-xl font-bold text-foreground;
}

.confirm-prompt-message {
  @apply text-gray-300;
}

.confirm-prompt-actions {
  @apply mt-6 flex flex-wrap justify-end gap-3;
}
</style>

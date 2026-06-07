<template>
  <Section>
    <div class="section-content">
      <div class="mb-6">
        <h2 class="text-2xl font-bold mb-2">Device flashing</h2>
      </div>

      <div class="flash-board-grid">
        <div
          v-for="board in boards"
          :key="board.target"
          class="flash-board-card surface-neutral border rounded"
          :class="{ 'flash-board-card-disabled': board.action === FlashAction.None }"
        >
          <img
            class="flash-board-image"
            :src="boardImageUrl(board.target)"
            :alt="board.name"
            loading="lazy"
          />
          <div class="flash-board-body">
            <div class="flash-board-title">
              <h3 class="font-bold">{{ board.name }}</h3>
            </div>
            <div class="flash-board-actions">
              <router-link
                v-if="board.action !== FlashAction.None"
                class="btn btn-sm"
                :to="{ name: 'device-flashing-board', params: { target: board.target } }"
              >
                Select
              </router-link>
              <button v-else class="btn btn-sm" disabled>Select</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { boardImageUrl, FlashAction, FlashBoards } from "./boards";

export default defineComponent({
  name: "BoardFlashSelect",
  setup() {
    return {
      boards: FlashBoards,
      FlashAction,
      boardImageUrl,
    };
  },
});
</script>

<style scoped>
.flash-board-grid {
  @apply grid gap-4;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
}

.flash-board-card {
  @apply overflow-hidden;
  display: flex;
  flex-direction: column;
  min-height: 22rem;
}

.flash-board-card-disabled {
  @apply opacity-75;
}

.flash-board-image {
  @apply block w-full bg-white;
  aspect-ratio: 4 / 3;
  object-fit: contain;
}

.flash-board-body {
  @apply p-4;
  display: flex;
  flex: 1;
  flex-direction: column;
}

.flash-board-title {
  @apply text-center;
  align-items: center;
  display: flex;
  flex: 1;
  justify-content: center;
}

.flash-board-actions {
  @apply mt-auto pt-4 text-center;
}
</style>

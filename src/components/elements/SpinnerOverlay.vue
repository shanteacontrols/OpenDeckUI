<template>
  <div
    class="spinner-overlay"
    :class="{
      'spinner-overlay-fixed': fixed,
      'spinner-overlay-local': !fixed,
    }"
  >
    <div v-if="message" class="spinner-overlay-panel">
      <p class="spinner-overlay-message">
        {{ message }}
      </p>
      <Spinner class="self-center" />
    </div>
    <Spinner v-else class="self-center" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SpinnerOverlay",
  props: {
    fixed: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
      default: "",
    },
  },
});
</script>

<style>
.spinner-overlay {
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.spinner-overlay-local {
  position: absolute;
  opacity: 0.75;
  background: #202020;
}

.spinner-overlay-fixed {
  position: fixed;
  background: rgba(0, 0, 0, 0.62);
  z-index: 20;
}

.spinner-overlay-panel {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem 1.5rem;
  border: 1px solid #d97706;
  border-radius: 0.375rem;
  background: #1f1f1f;
  box-shadow: 0 1rem 2rem rgba(0, 0, 0, 0.25);
}

.spinner-overlay-message {
  color: #f9fafb;
  font-size: 1.125rem;
  font-weight: 600;
  line-height: 1.5rem;
}
</style>

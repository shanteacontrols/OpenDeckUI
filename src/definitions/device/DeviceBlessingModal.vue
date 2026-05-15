<template>
  <teleport to="body">
    <div
      v-if="visible"
      class="device-blessing-modal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="device-blessing-modal-title"
    >
      <div class="device-blessing-modal-backdrop"></div>
      <div class="device-blessing-modal-panel" tabindex="-1">
        <h2 id="device-blessing-modal-title" class="device-blessing-modal-title">
          Configuration locked
        </h2>

        <p v-if="showUnknownBoardMessage" class="device-blessing-modal-message">
          This board ID is not recognized by this configurator. The UI will
          remain connected, but write actions are disabled for this board.
        </p>
        <p v-else class="device-blessing-modal-message">
          This device is running firmware that requires a blessed serial number
          before configuration changes are allowed. The UI will remain connected,
          but write actions are disabled for this board.
        </p>

        <div v-if="serialNumber" class="device-blessing-modal-serial">
          <small>Serial number</small>
          <strong>{{ serialNumber }}</strong>
        </div>
        <div v-else-if="boardIdDisplay" class="device-blessing-modal-serial">
          <small>Board ID</small>
          <strong>{{ boardIdDisplay }}</strong>
        </div>

        <p v-if="showContactMessage" class="device-blessing-modal-detail">
          <span>
            Contact Shantea Controls for access:
            <a :href="contactMailto">{{ contactEmail }}</a>
          </span>
          <span>{{ contactInstruction }}</span>
        </p>
        <p v-else-if="blessingError" class="device-blessing-modal-detail">
          {{ blessingError }}
        </p>

        <div class="device-blessing-modal-actions">
          <Button class="btn-primary" @click="dismiss">
            OK
          </Button>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script lang="ts">
import { computed, defineComponent, ref, watch } from "vue";
import { deviceStoreMapped } from "../../store";
import Button from "../../components/elements/Button.vue";
import { BLESSING_ACCESS_CONTACT_MESSAGE } from "../blessing";

const contactEmail = "shanteacontrols@shanteacontrols.com";

export default defineComponent({
  name: "DeviceBlessingModal",
  components: {
    Button,
  },
  setup() {
    const {
      isBlessingRequired,
      isConfigBlessed,
      blessingError,
      serialNumber,
      boardId,
      isKnownBoard,
    } = deviceStoreMapped;
    const visible = ref(false);
    const dismissedForSerial = ref("");

    const lockKey = computed(
      () => serialNumber.value || blessingError.value || "missing-serial",
    );
    const showContactMessage = computed(
      () => blessingError.value === BLESSING_ACCESS_CONTACT_MESSAGE,
    );
    const boardIdDisplay = computed(() =>
      Array.isArray(boardId.value) && boardId.value.length
        ? `[${boardId.value.join(", ")}]`
        : "",
    );
    const showUnknownBoardMessage = computed(
      () =>
        !isKnownBoard.value && !serialNumber.value && !!boardIdDisplay.value,
    );
    const contactInstruction = computed(() =>
      showUnknownBoardMessage.value
        ? "Please include the board ID in your message."
        : "Please include the serial number in your message.",
    );
    const contactMailto = computed(() => `mailto:${contactEmail}`);

    watch(
      () => [isBlessingRequired.value, isConfigBlessed.value, lockKey.value],
      () => {
        if (
          isBlessingRequired.value &&
          !isConfigBlessed.value &&
          dismissedForSerial.value !== lockKey.value
        ) {
          visible.value = true;
        }
      },
      { immediate: true },
    );

    const dismiss = (): void => {
      dismissedForSerial.value = lockKey.value;
      visible.value = false;
    };

    return {
      visible,
      serialNumber,
      boardIdDisplay,
      blessingError,
      contactEmail,
      contactMailto,
      contactInstruction,
      showUnknownBoardMessage,
      showContactMessage,
      dismiss,
    };
  },
});
</script>

<style scoped>
.device-blessing-modal {
  @apply fixed inset-0 z-50 flex items-center justify-center px-4;
}

.device-blessing-modal-backdrop {
  @apply absolute inset-0 bg-black opacity-75;
}

.device-blessing-modal-panel {
  @apply relative w-full max-w-md rounded-lg bg-surface p-6 shadow-lg;
  text-align: center;
}

.device-blessing-modal-title {
  @apply mb-3 text-xl font-bold text-foreground;
}

.device-blessing-modal-message {
  @apply text-gray-300;
  line-height: 1.45;
}

.device-blessing-modal-serial {
  @apply mt-5 rounded bg-gray-900 px-4 py-3;
}

.device-blessing-modal-serial small {
  @apply block text-accent;
  font-size: 0.85rem;
  margin-bottom: 0.2rem;
  text-transform: uppercase;
}

.device-blessing-modal-serial strong {
  @apply block text-foreground;
  font-family: monospace;
  font-size: 0.95rem;
  overflow-wrap: anywhere;
}

.device-blessing-modal-detail {
  @apply mt-4 text-foreground;
  font-weight: 400;
  line-height: 1.45;
}

.device-blessing-modal-detail span {
  display: block;
}

.device-blessing-modal-actions {
  @apply mt-6 flex justify-center;
}
</style>

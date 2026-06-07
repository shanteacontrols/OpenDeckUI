<template>
  <Section v-if="board">
    <div class="section-content">
      <div class="flash-details">
        <img
          class="flash-details-image"
          :src="boardImageUrl(board.target)"
          :alt="board.name"
        />

        <div>
          <h2 class="text-2xl font-bold mb-4">{{ board.name }}</h2>
          <p class="flash-details-description">
            {{ board.description }}
            <a
              v-if="board.descriptionLinkText && board.descriptionLinkUrl"
              class="flash-details-link"
              :href="board.descriptionLinkUrl"
              target="_blank"
              rel="noopener noreferrer"
            >{{ board.descriptionLinkText }}</a>{{ board.descriptionAfterLink || "" }}
          </p>

    <a
      v-if="board.action === FlashAction.Download && board.artifactFileName"
      class="btn mt-6"
      :href="artifactDownloadUrl(board.artifactFileName)"
    >
      Download latest firmware
    </a>

          <Button
            v-else-if="isDirectFlashBoard"
            class="mt-6"
            :disabled="flashing || isConnected"
            @click="connectDevice"
          >
            {{ isConnected ? "Connected" : "Connect" }}
          </Button>

          <template v-if="isDirectFlashBoard && board.artifactFileName">
            <p class="help-text mt-6">
              Download or select the firmware file.
            </p>
            <div class="flash-action-row">
          <a
            class="btn btn-sm"
            :href="artifactDownloadUrl(board.artifactFileName)"
          >
            Download latest firmware
          </a>
              <label class="btn btn-sm">
                Select file
                <input
                  class="hidden"
                  type="file"
                  accept=".bin,.hex,application/octet-stream,text/plain"
                  @change="onFileSelected"
                />
              </label>
              <Button
                :disabled="flashing || !selectedFile || !isConnected"
                @click="flashBoard"
              >
                {{ flashing ? "Flashing" : "Flash" }}
              </Button>
            </div>
          </template>
        </div>
      </div>

      <div v-if="flashing || flashStatus || flashError" class="flash-status section wide mt-8">
        <div class="section-heading">
          <div class="section-heading-inner-sm">
            <strong>Flashing status</strong>
          </div>
        </div>
        <div class="section-content pb-6 relative">
          <p v-if="flashStatus" class="mb-4">{{ flashStatus }}</p>
          <div v-if="flashingProgress !== null" class="flash-progress">
            <ProgressBar :percentage="flashingProgress" />
          </div>
          <p v-if="flashError" class="flash-error mt-4">{{ flashError }}</p>
        </div>
      </div>
    </div>
  </Section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import router from "../../router";
import {
  artifactDownloadUrl,
  boardImageUrl,
  FlashAction,
  FlashBoards,
} from "./boards";
import {
  closeStm32DfuSeDevice,
  flashStm32DfuSe,
  openStm32DfuSeDevice,
  Stm32DfuSeSession,
} from "./web-dfu";
import {
  closeEsp32SerialDevice,
  Esp32SerialSession,
  flashEsp32MergedBinary,
  openEsp32SerialDevice,
} from "./web-esp32";
import {
  closeTeensyHidDevice,
  flashTeensyFirmware,
  openTeensyHidDevice,
  TeensyHidSession,
} from "./web-teensy";
import {
  BossaSerialSession,
  closeBossaSerialDevice,
  flashBossaFirmware,
  openBossaSerialDevice,
} from "./web-bossa";

const sleep = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export default defineComponent({
  name: "BoardFlashDetails",
  setup() {
    const flashing = ref(false);
    const flashingProgress = ref((null as unknown) as number);
    const flashStatus = ref("");
    const flashError = ref("");
    const selectedFile = ref((null as unknown) as File);
    const dfuSession = ref((null as unknown) as Stm32DfuSeSession);
    const esp32Session = ref((null as unknown) as Esp32SerialSession);
    const teensySession = ref((null as unknown) as TeensyHidSession);
    const bossaSession = ref((null as unknown) as BossaSerialSession);
    const board = computed(() =>
      FlashBoards.find(
        (item) => item.target === router.currentRoute.value.params.target,
      ),
    );
    const isDirectFlashBoard = computed(
      () =>
        board.value &&
        [FlashAction.DfuSe, FlashAction.Esp32, FlashAction.Teensy, FlashAction.Bossa].includes(board.value.action),
    );
    const isConnected = computed(
      () =>
        !!dfuSession.value ||
        !!esp32Session.value ||
        !!teensySession.value ||
        !!bossaSession.value,
    );

    const isPickerCancel = (error: Error): boolean =>
      error && String(error.message || error).includes("No device selected");

    const connectDfuDevice = async (): Promise<void> => {
      flashStatus.value = "Select the USB DFU device";
      dfuSession.value = await openStm32DfuSeDevice();
      flashStatus.value = "USB DFU device connected";
    };

    const connectEsp32Device = async (): Promise<void> => {
      flashStatus.value = "Select the USB serial device";
      esp32Session.value = await openEsp32SerialDevice((message) => {
        flashStatus.value = message;
      });
      flashStatus.value = `USB serial device connected: ${esp32Session.value.chip}`;
    };

    const connectTeensyDevice = async (): Promise<void> => {
      flashStatus.value = "Select the Teensy bootloader device";
      teensySession.value = await openTeensyHidDevice();
      flashStatus.value = `Teensy bootloader connected: ${teensySession.value.productName}`;
    };

    const connectBossaDevice = async (): Promise<void> => {
      flashStatus.value = "Select the Arduino bootloader serial device";
      bossaSession.value = await openBossaSerialDevice();
      flashStatus.value = `Arduino bootloader connected: ${bossaSession.value.chip}`;
    };

    const connectDevice = async (): Promise<void> => {
      if (!board.value || flashing.value || isConnected.value) {
        return;
      }

      flashingProgress.value = (null as unknown) as number;
      flashError.value = "";

      try {
        if (board.value.action === FlashAction.DfuSe) {
          await connectDfuDevice();
        } else if (board.value.action === FlashAction.Esp32) {
          await connectEsp32Device();
        } else if (board.value.action === FlashAction.Teensy) {
          await connectTeensyDevice();
        } else if (board.value.action === FlashAction.Bossa) {
          await connectBossaDevice();
        }
      } catch (error) {
        if (isPickerCancel(error)) {
          flashStatus.value = "";
          return;
        }

        flashError.value =
          error && error.message ? error.message : String(error);
      }
    };

    const flashBoard = async (): Promise<void> => {
      if (
        !board.value ||
        !selectedFile.value ||
        !isConnected.value ||
        flashing.value
      ) {
        return;
      }

      flashing.value = true;
      flashingProgress.value = 1;
      flashError.value = "";

      try {
        flashingProgress.value = 1;
        flashStatus.value = `Reading ${selectedFile.value.name}`;
        const payload = new Uint8Array(await selectedFile.value.arrayBuffer());

        if (board.value.action === FlashAction.DfuSe) {
          await flashStm32DfuSe(dfuSession.value, payload, (progress, message) => {
            flashingProgress.value = progress;
            if (message) {
              flashStatus.value = message;
            }
          });
        } else if (board.value.action === FlashAction.Esp32) {
          await flashEsp32MergedBinary(esp32Session.value, payload, (progress, message) => {
            flashingProgress.value = progress;
            if (message) {
              flashStatus.value = message;
            }
          });
        } else if (board.value.action === FlashAction.Teensy) {
          await flashTeensyFirmware(
            teensySession.value,
            payload,
            selectedFile.value.name,
            (progress, message) => {
              flashingProgress.value = progress;
              if (message) {
                flashStatus.value = message;
              }
            },
          );
        } else if (board.value.action === FlashAction.Bossa) {
          await flashBossaFirmware(bossaSession.value, payload, (progress, message) => {
            flashingProgress.value = progress;
            if (message) {
              flashStatus.value = message;
            }
          });
        }

        flashStatus.value = "Flashing complete.";
        flashingProgress.value = 100;
        await sleep(1000);
        flashStatus.value = "Returning to home screen...";
        await sleep(1000);
        window.location.assign("/");
      } catch (error) {
        flashError.value =
          error && error.message ? error.message : String(error);
      } finally {
        await closeStm32DfuSeDevice(dfuSession.value);
        dfuSession.value = (null as unknown) as Stm32DfuSeSession;
        await closeEsp32SerialDevice(esp32Session.value);
        esp32Session.value = (null as unknown) as Esp32SerialSession;
        await closeTeensyHidDevice(teensySession.value);
        teensySession.value = (null as unknown) as TeensyHidSession;
        await closeBossaSerialDevice(bossaSession.value);
        bossaSession.value = (null as unknown) as BossaSerialSession;
        flashing.value = false;
      }
    };

    const onFileSelected = (event: Event): void => {
      const input = event.target as HTMLInputElement;
      selectedFile.value =
        input.files && input.files.length
          ? input.files[0]
          : ((null as unknown) as File);
      flashError.value = "";
      if (selectedFile.value) {
        flashStatus.value = `Selected firmware file: ${selectedFile.value.name}`;
      }
      flashingProgress.value = (null as unknown) as number;
    };

    return {
      board,
      FlashAction,
      boardImageUrl,
      artifactDownloadUrl,
      flashBoard,
      connectDevice,
      flashing,
      flashingProgress,
      flashStatus,
      flashError,
      selectedFile,
      dfuSession,
      esp32Session,
      teensySession,
      bossaSession,
      isConnected,
      isDirectFlashBoard,
      onFileSelected,
    };
  },
});
</script>

<style scoped>
.flash-details {
  @apply grid gap-6;
  grid-template-columns: minmax(220px, 360px) minmax(0, 1fr);
}

.flash-details-image {
  @apply block w-full bg-white border rounded;
  aspect-ratio: 4 / 3;
  object-fit: contain;
}

.flash-details-description {
  @apply max-w-2xl text-gray-300;
  line-height: 1.55;
}

.flash-details-link {
  @apply text-white underline;
}

.flash-action-row {
  @apply mt-4 flex flex-wrap items-center gap-3;
}

.flash-status {
  @apply border-b;
}

.flash-progress {
  @apply relative;
  height: 1.5rem;
}

.flash-error {
  @apply text-red-400;
}

@media (max-width: 767px) {
  .flash-details {
    grid-template-columns: 1fr;
  }
}
</style>

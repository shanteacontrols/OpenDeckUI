<template>
  <div
    v-if="isBlessingRequired && !isConfigBlessed"
    class="device-blessing-status"
    :class="{ locked: true }"
  >
    <span class="device-blessing-status-indicator"></span>
    <span>
      <strong>Configuration locked</strong>
      <span v-if="statusDetail">{{ statusDetail }}</span>
      <span class="device-blessing-status-more">
        Click
        <a
          :href="moreInformationUrl"
          target="_blank"
          rel="noopener noreferrer"
        >
          here
        </a>
        for more information.
      </span>
    </span>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { deviceStoreMapped } from "../../store";
import { BLESSING_MORE_INFORMATION_URL } from "../blessing";

export default defineComponent({
  name: "DeviceBlessingStatus",
  setup() {
    const {
      isBlessingRequired,
      isConfigBlessed,
      blessingError,
    } = deviceStoreMapped;

    const statusDetail = computed(() => {
      return (
        blessingError.value ||
        "Contact Shantea Controls for access: shanteacontrols@shanteacontrols.com"
      );
    });

    return {
      isBlessingRequired,
      isConfigBlessed,
      moreInformationUrl: BLESSING_MORE_INFORMATION_URL,
      statusDetail,
    };
  },
});
</script>

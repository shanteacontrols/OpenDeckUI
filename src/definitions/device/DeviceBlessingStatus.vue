<template>
  <div
    v-if="isBlessingRequired && !isConfigBlessed"
    class="device-blessing-status"
    :class="{ locked: true }"
  >
    <span class="device-blessing-status-indicator"></span>
    <span>
      <strong>Configuration locked</strong>
      <span v-if="showContactMessage">
        Contact Shantea Controls for access:
        <a :href="contactMailto">{{ contactEmail }}</a>.
      </span>
      <span v-else-if="blessingError">{{ blessingError }}</span>
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
import {
  BLESSING_ACCESS_CONTACT_MESSAGE,
  BLESSING_MORE_INFORMATION_URL,
} from "../blessing";

const contactEmail = "shanteacontrols@shanteacontrols.com";

export default defineComponent({
  name: "DeviceBlessingStatus",
  setup() {
    const {
      isBlessingRequired,
      isConfigBlessed,
      blessingError,
    } = deviceStoreMapped;

    const showContactMessage = computed(
      () =>
        !blessingError.value ||
        blessingError.value === BLESSING_ACCESS_CONTACT_MESSAGE,
    );
    const contactMailto = computed(() => `mailto:${contactEmail}`);

    return {
      blessingError,
      contactEmail,
      contactMailto,
      isBlessingRequired,
      isConfigBlessed,
      moreInformationUrl: BLESSING_MORE_INFORMATION_URL,
      showContactMessage,
    };
  },
});
</script>

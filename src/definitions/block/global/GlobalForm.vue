<template>
  <DeviceSettings class="global flex flex-wrap flex-grow" :block="Block.Global">
    <template #default="{ form, showField, onSettingChange }">
      <Section v-if="supportedPresetsCount > 1" title="Presets">
        <div class="form-grid">
        <FormField
            v-if="showField(sections.DisableForcedValueRefreshAfterPresetChange)"
            :value="form.disableForcedValueRefreshAfterPresetChange"
            :field-definition="sections.DisableForcedValueRefreshAfterPresetChange"
            @modified="onSettingChange"
          />
        <FormField
            v-if="showField(sections.EnablePresetChangeWithProgramChangeIn)"
            :value="form.enablePresetChangeWithProgramChangeIn"
            :field-definition="sections.EnablePresetChangeWithProgramChangeIn"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.PreservePresetState)"
            class="col-span-2"
            :value="form.preservePresetState"
            :field-definition="sections.PreservePresetState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.ActivePreset)"
            :value="form.activePreset"
            :field-definition="sections.ActivePreset"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <Section title="MIDI">
        <div class="form-grid">
          <FormField
            v-if="showField(sections.UseGlobalChannel)"
            :value="form.useGlobalChannel"
            :field-definition="sections.UseGlobalChannel"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.GlobalChannel)"
            :value="form.globalChannel"
            :field-definition="sections.GlobalChannel"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.StandardNoteOff)"
            :value="form.standardNoteOff"
            :field-definition="sections.StandardNoteOff"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DinMidiState)"
            :value="form.dinMidiState"
            :field-definition="sections.DinMidiState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.BleMidiState)"
            :value="form.bleMidiState"
            :field-definition="sections.BleMidiState"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.RunningStatus)"
            :value="form.runningStatus"
            :field-definition="sections.RunningStatus"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.MIDIClock)"
            :value="form.midiClock"
            :field-definition="sections.MIDIClock"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.UsbToDinThru)"
            :value="form.usbToDinThru"
            :field-definition="sections.UsbToDinThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.UsbToUsbThru)"
            :value="form.usbToUsbThru"
            :field-definition="sections.UsbToUsbThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.UsbToBleThru)"
            :value="form.usbToBleThru"
            :field-definition="sections.UsbToBleThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DinToDinThru)"
            :value="form.dinToDinThru"
            :field-definition="sections.DinToDinThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DinToUsbThru)"
            :value="form.dinToUsbThru"
            :field-definition="sections.DinToUsbThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.DinToBleThru)"
            :value="form.dinToBleThru"
            :field-definition="sections.DinToBleThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.BleToDinThru)"
            :value="form.bleToDinThru"
            :field-definition="sections.BleToDinThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.BleToUsbThru)"
            :value="form.bleToUsbThru"
            :field-definition="sections.BleToUsbThru"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.BleToBleThru)"
            :value="form.bleToBleThru"
            :field-definition="sections.BleToBleThru"
            @modified="onSettingChange"
          />
        </div>
      </Section>

      <Section title="Network">
        <div class="form-grid">
          <div class="form-field lg:col-span-2">
            <label class="label">
              mDNS hostname
              <small class="instructions">optional</small>
            </label>
            <input
              v-model="mdnsHostnameDraft"
              class="form-input mt-1 py-2 text-base block w-full max-w-md"
              type="text"
              :maxlength="MDNS_HOSTNAME_MAX_LENGTH"
              placeholder="auto generated"
              :disabled="mdnsHostnameLoading || !isConfigBlessed"
              @change="onMdnsHostnameChange"
            />
            <p class="help-text">
              Leave empty to use the generated hostname.
            </p>
            <p v-if="mdnsHostnameError" class="help-text text-red-400">
              {{ mdnsHostnameError }}
            </p>
          </div>
        </div>
      </Section>

      <Section title="OSC">
        <div class="form-grid">
          <div
            v-if="showField(sections.OscDestIpv4Octet0)"
            class="form-field lg:col-span-2"
          >
            <label class="label">
              Destination IPv4 address
              <small class="instructions">0 - 255</small>
            </label>
            <div class="osc-ipv4-inputs">
              <FormInput
                :value="form.oscDestIpv4Octet0"
                :min="0"
                :max="255"
                name="oscDestIpv4Octet0"
                :disabled="!isConfigBlessed"
                @changed="
                  onOscSettingChange(
                    $event,
                    sections.OscDestIpv4Octet0,
                    onSettingChange
                  )
                "
              />
              <span class="osc-ipv4-dot">.</span>
              <FormInput
                :value="form.oscDestIpv4Octet1"
                :min="0"
                :max="255"
                name="oscDestIpv4Octet1"
                :disabled="!isConfigBlessed"
                @changed="
                  onOscSettingChange(
                    $event,
                    sections.OscDestIpv4Octet1,
                    onSettingChange
                  )
                "
              />
              <span class="osc-ipv4-dot">.</span>
              <FormInput
                :value="form.oscDestIpv4Octet2"
                :min="0"
                :max="255"
                name="oscDestIpv4Octet2"
                :disabled="!isConfigBlessed"
                @changed="
                  onOscSettingChange(
                    $event,
                    sections.OscDestIpv4Octet2,
                    onSettingChange
                  )
                "
              />
              <span class="osc-ipv4-dot">.</span>
              <FormInput
                :value="form.oscDestIpv4Octet3"
                :min="0"
                :max="255"
                name="oscDestIpv4Octet3"
                :disabled="!isConfigBlessed"
                @changed="
                  onOscSettingChange(
                    $event,
                    sections.OscDestIpv4Octet3,
                    onSettingChange
                  )
                "
              />
            </div>
            <p class="help-text">
              IPv4 address of the destination that receives OSC packets from OpenDeck.
            </p>
          </div>
          <FormField
            v-if="showField(sections.OscDestPort)"
            :value="form.oscDestPort"
            :field-definition="sections.OscDestPort"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.OscListenPort)"
            :value="form.oscListenPort"
            :field-definition="sections.OscListenPort"
            @modified="onSettingChange"
          />
          <FormField
            v-if="showField(sections.OscRestrictIncomingToDestIp)"
            :value="form.oscRestrictIncomingToDestIp"
            :field-definition="sections.OscRestrictIncomingToDestIp"
            @modified="onSettingChange"
          />
        </div>
      </Section>
    </template>
  </DeviceSettings>

  <GlobalHardware />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import { Block, ISectionSetting } from "../../interface";
import { GlobalBlock } from "./global";
import { deviceStore, deviceStoreMapped } from "../../device/device-store";

import GlobalHardware from "./GlobalHardware.vue";
import FormInput from "../../../components/form/FormInput.vue";
import { confirmPrompt } from "../../../composables";

const MDNS_HOSTNAME_SECTION = 4;
const MDNS_HOSTNAME_SIZE = 64;
const MDNS_HOSTNAME_MAX_LENGTH = MDNS_HOSTNAME_SIZE - 1;
const MDNS_HOSTNAME_PATTERN = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const MDNS_HOSTNAME_REBOOT_PROMPT =
  "The mDNS hostname change will take effect only after reboot. Do you want to reboot now?";

const normalizeMdnsHostname = (value: string): string =>
  value.trim().replace(/\.local$/i, "").toLowerCase();

const validateMdnsHostname = (value: string): string => {
  if (!value) {
    return "";
  }

  if (value.length > MDNS_HOSTNAME_MAX_LENGTH) {
    return `Use ${MDNS_HOSTNAME_MAX_LENGTH} characters or less.`;
  }

  if (!MDNS_HOSTNAME_PATTERN.test(value)) {
    return "Use letters, numbers, and dashes. The first and last character must not be a dash.";
  }

  return "";
};

export default defineComponent({
  name: "Global",
  components: {
    FormInput,
    GlobalHardware,
  },
  setup() {
    const { sections } = GlobalBlock;
    const { supportedPresetsCount } = deviceStoreMapped;
    const { isConfigBlessed } = deviceStoreMapped;
    const mdnsHostnameDraft = ref("");
    const mdnsHostnameSaved = ref("");
    const mdnsHostnameError = ref("");
    const mdnsHostnameLoading = ref(false);

    const loadMdnsHostname = async () => {
      mdnsHostnameLoading.value = true;
      mdnsHostnameError.value = "";

      try {
        const hostname = await deviceStore.actions.getConfigByteString(
          Block.Global,
          MDNS_HOSTNAME_SECTION,
          MDNS_HOSTNAME_SIZE,
        );
        mdnsHostnameDraft.value = hostname;
        mdnsHostnameSaved.value = hostname;
      } catch {
        mdnsHostnameError.value = "Failed to load mDNS hostname.";
      } finally {
        mdnsHostnameLoading.value = false;
      }
    };

    const onMdnsHostnameChange = async (event: Event) => {
      if (!isConfigBlessed.value) {
        return;
      }

      const input = event.target as HTMLInputElement;
      const hostname = normalizeMdnsHostname(input.value);
      const error = validateMdnsHostname(hostname);

      if (hostname === mdnsHostnameSaved.value) {
        mdnsHostnameDraft.value = mdnsHostnameSaved.value;
        mdnsHostnameError.value = "";
        return;
      }

      if (error) {
        mdnsHostnameDraft.value = mdnsHostnameSaved.value;
        mdnsHostnameError.value = error;
        return;
      }

      if (!(await confirmPrompt(MDNS_HOSTNAME_REBOOT_PROMPT))) {
        mdnsHostnameDraft.value = mdnsHostnameSaved.value;
        mdnsHostnameError.value = "";
        return;
      }

      mdnsHostnameLoading.value = true;
      mdnsHostnameError.value = "";

      try {
        await deviceStore.actions.setConfigByteString(
          Block.Global,
          MDNS_HOSTNAME_SECTION,
          MDNS_HOSTNAME_SIZE,
          hostname,
        );
        mdnsHostnameDraft.value = hostname;
        mdnsHostnameSaved.value = hostname;
        await deviceStore.actions.startReboot();
      } catch {
        mdnsHostnameError.value = "Failed to save mDNS hostname.";
      } finally {
        mdnsHostnameLoading.value = false;
      }
    };

    const onOscSettingChange = (
      value: string | number,
      section: ISectionSetting,
      onSettingChange: (params: any) => void,
    ) => {
      if (!isConfigBlessed.value) {
        return;
      }

      onSettingChange({
        key: section.key,
        value: Number(value),
        section: section.section,
        settingIndex: section.settingIndex,
      });
    };

    onMounted(loadMdnsHostname);

    return {
      Block,
      MDNS_HOSTNAME_MAX_LENGTH,
      sections,
      mdnsHostnameDraft,
      mdnsHostnameError,
      mdnsHostnameLoading,
      onMdnsHostnameChange,
      onOscSettingChange,
      isConfigBlessed,
      supportedPresetsCount,
    };
  },
});
</script>

<style scoped>
.osc-ipv4-inputs {
  @apply flex flex-wrap items-center gap-2;
}

.osc-ipv4-dot {
  @apply mt-1 text-xl font-bold text-foreground;
}
</style>

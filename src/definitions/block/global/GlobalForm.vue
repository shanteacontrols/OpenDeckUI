<template>
  <DeviceSettings class="global flex flex-wrap flex-grow" :block="Block.Global">
    <template #default="{ form, showField, onSettingChange }">
      <Section v-if="supportedPresetsCount > 1" title="Presets">
        <div class="form-grid">
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
      <Section title="DMX">
        <div class="form-grid">
          <FormField
            v-if="showField(sections.DmxEnabled)"
            :value="form.dmxEnabled"
            :field-definition="sections.DmxEnabled"
            @modified="onSettingChange"
          />
        </div>
      </Section>
    </template>
  </DeviceSettings>

  <GlobalHardware />
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";
import { GlobalBlock } from "./global";
import { deviceStoreMapped } from "../../device/device-store";

import GlobalHardware from "./GlobalHardware.vue";

export default defineComponent({
  name: "Global",
  components: {
    GlobalHardware,
  },
  setup() {
    const { sections } = GlobalBlock;
    const { supportedPresetsCount } = deviceStoreMapped;

    return {
      Block,
      sections,
      supportedPresetsCount,
    };
  },
});
</script>

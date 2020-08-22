<template>
  <div class="leds">
    <DeviceSettings class="w-full" :block="Block.Led">
      <template #default="{ form, showField, onSettingChange }">
        <Section title="Global">
          <div class="form-grid">
            <FormField
              v-if="showField(sections.BlinkWithMidiClock)"
              :value="form.blinkWithMidiClock"
              :field-definition="sections.BlinkWithMidiClock"
              @modified="onSettingChange"
            />
            <FormField
              v-if="showField(sections.FadeSpeed)"
              :value="form.fadeSpeed"
              :field-definition="sections.FadeSpeed"
              @modified="onSettingChange"
            />
            <FormField
              v-if="showField(sections.StartupAnimation)"
              :value="form.startupAnimation"
              :field-definition="sections.StartupAnimation"
              @modified="onSettingChange"
            />
          </div>
        </Section>
      </template>
    </DeviceSettings>

    <DeviceGrid
      class="w-full"
      route-name="device-leds-form"
      :block="Block.Led"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Block } from "../../interface";
import { LedBlock } from "./led";

export default defineComponent({
  name: "LedList",
  setup() {
    const { sections } = LedBlock;

    return {
      Block,
      sections,
    };
  },
});
</script>

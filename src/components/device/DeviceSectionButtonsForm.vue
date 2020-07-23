<template>
  <div>
    <DeviceComponentForm
      :component-block="Block.Button"
      :component-index="componentIndex"
      :component-count="count"
      :component-definition="ButtonSectionDefinitions"
      component-name="Button"
      route-name="device-buttons"
      :default-data="defaultButtonData"
    >
      <template #default="{ form, onValueChange }">
        <Section class="w-full">
          <div
            class="w-full pb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10"
          >
            <FormField
              :value="form.midiType"
              :field-definition="ButtonSectionDefinitions.MidiType"
              @modified="onValueChange"
            />

            <FormField
              :value="form.midiMessage"
              :field-definition="ButtonSectionDefinitions.MidiMessage"
              @modified="onValueChange"
            />

            <FormField
              :value="form.midiChannel"
              :field-definition="ButtonSectionDefinitions.MidiChannel"
              @modified="onValueChange"
            />

            <FormField
              :value="form.midiId"
              :field-definition="ButtonSectionDefinitions.MidiId"
              @modified="onValueChange"
            />

            <FormField
              :value="form.onVelocity"
              :field-definition="ButtonSectionDefinitions.OnVelocity"
              @modified="onValueChange"
            />
          </div>
        </Section>
      </template>
    </DeviceComponentForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  Block,
  defaultButtonData,
  ButtonSectionDefinitions,
} from "../../definitions";
import { deviceStoreMapped } from "../../store";
import router from "../../router";
import DeviceComponentForm from "./DeviceComponentForm.vue";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "DeviceSectionButtonsForm",
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex)
    );

    return {
      ...defaultTheme,
      componentIndex,
      count: deviceStoreMapped.buttons,
      Block,
      defaultButtonData,
      ButtonSectionDefinitions,
    };
  },
  components: {
    DeviceComponentForm,
  },
});
</script>

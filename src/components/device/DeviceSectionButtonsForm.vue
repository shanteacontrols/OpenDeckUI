<template>
  <div>
    <DeviceForm
      :component-block="Block.Button"
      :component-index="componentIndex"
      :component-count="count"
      :component-definition="ButtonSectionDefinitions"
      component-name="Button"
      route-name="device-buttons"
      :default-data="defaultButtonData"
    >
      <template #default="{ form, showField, onValueChange }">
        <Section class="w-full">
          <div
            class="w-full pb-8 grid gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 xl:gap-10"
          >
            <FormField
              v-if="showField(ButtonSectionDefinitions.Type)"
              :value="form.Type"
              :field-definition="ButtonSectionDefinitions.Type"
              @modified="onValueChange"
            />
            <FormField
              v-if="showField(ButtonSectionDefinitions.MidiMessage)"
              :value="form.midiMessage"
              :field-definition="ButtonSectionDefinitions.MidiMessage"
              @modified="onValueChange"
            />
            <FormField
              v-if="showField(ButtonSectionDefinitions.MidiChannel)"
              :value="form.midiChannel"
              :field-definition="ButtonSectionDefinitions.MidiChannel"
              @modified="onValueChange"
            />
            <FormField
              v-if="showField(ButtonSectionDefinitions.MidiId)"
              :value="form.midiId"
              :field-definition="ButtonSectionDefinitions.MidiId"
              @modified="onValueChange"
            />
            <FormField
              v-if="showField(ButtonSectionDefinitions.OnVelocity)"
              :value="form.onVelocity"
              :field-definition="ButtonSectionDefinitions.OnVelocity"
              @modified="onValueChange"
            />
          </div>
        </Section>
      </template>
    </DeviceForm>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  Block,
  defaultButtonData,
  ButtonSectionDefinitions,
  defaultTheme,
  HideVelocityOnTypes,
  HideMidiIdOnTypes,
} from "../../definitions";
import { deviceStoreMapped } from "../../store";
import router from "../../router";
import DeviceForm from "./DeviceForm.vue";

export default defineComponent({
  name: "DeviceSectionButtonsForm",
  components: {
    DeviceForm,
  },
  setup() {
    const componentIndex = computed(() =>
      Number(router.currentRoute.value.params.componentIndex),
    );

    return {
      ...defaultTheme,
      componentIndex,
      count: deviceStoreMapped.buttons,
      HideVelocityOnTypes,
      HideMidiIdOnTypes,
      Block,
      defaultButtonData,
      ButtonSectionDefinitions,
    };
  },
});
</script>

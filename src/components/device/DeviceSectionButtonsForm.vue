<template>
  <DeviceForm
    :component-block="Block.Button"
    :component-index="componentIndex"
    :component-definition="ButtonSectionDefinitions"
    component-name="Button"
    route-name="device-buttons"
    :default-data="defaultButtonData"
  >
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid">
        <FormField
          v-if="showField(ButtonSectionDefinitions.Type)"
          class="col-span-2"
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
    </template>
  </DeviceForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import {
  Block,
  defaultButtonData,
  ButtonSectionDefinitions,
  HideVelocityOnTypes,
  HideMidiIdOnTypes,
} from "../../definitions";
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
      componentIndex,
      HideVelocityOnTypes,
      HideMidiIdOnTypes,
      Block,
      defaultButtonData,
      ButtonSectionDefinitions,
    };
  },
});
</script>

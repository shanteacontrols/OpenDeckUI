<template>
  <DeviceForm :block="Block.Button" :index="index">
    <template #default="{ form, showField, onValueChange }">
      <div class="form-grid">
        <FormField
          v-if="showField(sections.Type)"
          class="col-span-2"
          :value="form.type"
          :field-definition="sections.Type"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiMessage)"
          :value="form.midiMessage"
          :field-definition="sections.MidiMessage"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiChannel)"
          :value="form.midiChannel"
          :field-definition="sections.MidiChannel"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.MidiId)"
          :value="form.midiId"
          :field-definition="sections.MidiId"
          @modified="onValueChange"
        />
        <FormField
          v-if="showField(sections.OnVelocity)"
          :value="form.onVelocity"
          :field-definition="sections.OnVelocity"
          @modified="onValueChange"
        />
      </div>
    </template>
  </DeviceForm>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { Block } from "../../interface";
import { ButtonBlock } from "./button";
import router from "../../../router";

export default defineComponent({
  name: "ButtonForm",
  setup() {
    const { sections } = ButtonBlock;
    const index = computed(() =>
      Number(router.currentRoute.value.params.index),
    );

    return {
      index,
      Block,
      sections,
    };
  },
});
</script>

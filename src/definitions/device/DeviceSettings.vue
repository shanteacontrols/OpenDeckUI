<template>
  <form class="relative flex flex-wrap flex-grow" novalidate @submit.prevent="">
    <div v-if="loading" class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>

    <slot
      :form="formData"
      :onSettingChange="onSettingChange"
      :showField="showField"
    >
      <Section :title="title" class="w-full">
        <div class="form-grid">
          <template v-for="section in sections">
            <FormField
              v-if="showField(section)"
              :key="section.key"
              :value="formData[section.key]"
              :field-definition="section"
              @modified="onSettingChange"
            />
          </template>
        </div>
      </Section>
    </slot>
  </form>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { SectionType } from "../../definitions";
import { useDeviceForm } from "../../composables";

export default defineComponent({
  name: "DeviceSettings",
  props: {
    block: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      default: "null",
    },
  },
  setup(props) {
    return {
      ...useDeviceForm(props.block, SectionType.Setting),
    };
  },
});
</script>

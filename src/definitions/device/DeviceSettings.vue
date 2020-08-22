<template>
  <form class="relative" novalidate @submit.prevent="">
    <div v-if="loading" class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>
    <slot
      :form="formData"
      :onSettingChange="onSettingChange"
      :showField="showField"
    ></slot>
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
  },
  setup(props) {
    return {
      ...useDeviceForm(props.block, SectionType.Settings),
    };
  },
});
</script>

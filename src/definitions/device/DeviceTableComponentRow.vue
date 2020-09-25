<template>
  <div class="form-table-row">
    <div>
      {{ index }}
    </div>
    <template v-for="section in sections">
      <FormField
        v-if="showField(section, formData)"
        :key="section.key"
        :index="index"
        :value="formData[section.key]"
        :field-definition="section"
        @modified="onValueChange"
      />
    </template>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "DeviceTableComponentRow",
  props: {
    formData: {
      type: Object,
      default: () => ({}),
    },
    showField: {
      required: true,
      type: Function,
    },
    onValueChange: {
      required: true,
      type: Function,
    },
    index: {
      required: true,
      type: Number,
    },
    sections: {
      required: true,
      type: Object,
    },
  },
});
</script>

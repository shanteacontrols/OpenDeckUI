<template>
  <div class="">
    <p
      class="text-base leading-4 text-indigo-600 font-semibold tracking-wide uppercase"
    >
      {{ deviceStore.manufacturer }}
    </p>
    <h3
      class="mt-2 text-3xl leading-6 font-extrabold tracking-tight text-gray-900 sm:text-4xl sm:leading-10"
    >
      {{ deviceStore.name }}
    </h3>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { deviceStoreMapped } from "../../store";

export default defineComponent({
  name: "DeviceHeader",
  setup() {
    return {
      deviceStore: deviceStoreMapped,
    };
  },
});
</script>

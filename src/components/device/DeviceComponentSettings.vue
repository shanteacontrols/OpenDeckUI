<template>
  <form class="" novalidate @submit.prevent="">
    <slot :form="form" :onValueChange="onValueChange"></slot>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { IBlockDefinition, DefinitionType } from "../../definitions";
import { deviceStore } from "../../store";
import { defaultTheme } from "./../../definitions";

import Chevron from "../icons/Chevron.vue";

export default defineComponent({
  name: "DeviceComponentSettings",
  props: {
    componentBlock: {
      type: Number,
      required: true,
    },
    defaultData: {
      type: Object,
      required: true,
    },
    componentDefinition: {
      type: Object as () => Dictionary<IBlockDefinition>,
      required: true,
    },
  },
  setup(props) {
    const form = reactive(props.defaultData);
    // @TODO: show spinner while loading
    const loading = ref(true);

    onMounted(async () => {
      loading.value = true;
      const componentConfig = await deviceStore.actions.getComponentSettings(
        props.componentDefinition,
        props.componentBlock,
        DefinitionType.Setting
      );
      Object.assign(form, componentConfig);
      // prevent initial value change from writing to device
      setTimeout(() => (loading.value = false), 100);
    });

    const onValueChange = ({
      key,
      value,
      section,
      settingIndex,
    }: {
      key: string;
      value: number;
      section: number;
      settingIndex: number;
    }) => {
      if (loading.value) {
        return;
      }
      loading.value = true;

      const onSuccess = () => {
        form[key] = value;
        loading.value = false;
      };
      return deviceStore.actions.setComponentSectionValue(
        {
          block: props.componentBlock,
          section,
          index: settingIndex,
        },
        value,
        onSuccess
      );
    };

    return {
      ...defaultTheme,
      form: {
        ...toRefs(form),
      },
      loading,
      onValueChange,
    };
  },
  components: {
    Chevron,
  },
});
</script>

<template>
  <form class="" novalidate @submit.prevent="">
    <slot :form="form" :onSettingChange="onSettingChange"></slot>
    <div v-if="loading" class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { IBlockDefinition, DefinitionType } from "../../definitions";
import { deviceStore } from "../../store";
import { defaultTheme } from "./../../definitions";

import Chevron from "../icons/Chevron.vue";
import { logger } from "../../util";

export default defineComponent({
  name: "DeviceSettings",
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

    const loadData = async () => {
      loading.value = true;
      const componentConfig = await deviceStore.actions.getComponentSettings(
        props.componentDefinition,
        props.componentBlock,
        DefinitionType.Setting
      );
      Object.assign(form, componentConfig);
      // prevent initial value change from writing to device
      setTimeout(() => (loading.value = false), 100);
    };

    onMounted(async () => {
      return loadData();
    });

    const onSettingChange = ({
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
      return deviceStore.actions
        .setComponentSectionValue(
          {
            block: props.componentBlock,
            section,
            index: settingIndex,
          },
          value,
          onSuccess
        )
        .catch((error) => {
          logger.error("ERROR WHILE SAVING SETTING DATA", error);
          // Try reloading the form to reinit without failed fields
          return loadData();
        });
    };

    return {
      ...defaultTheme,
      form: {
        ...toRefs(form),
      },
      loading,
      onSettingChange,
    };
  },
  components: {
    Chevron,
  },
});
</script>

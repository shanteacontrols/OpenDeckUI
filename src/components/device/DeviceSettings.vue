<template>
  <form class="relative" novalidate @submit.prevent="">
    <div v-if="loading" class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>
    <slot
      :form="form"
      :onSettingChange="onSettingChange"
      :showField="showField"
    ></slot>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted } from "vue";
import { IBlockDefinition, DefinitionType } from "../../definitions";
import { deviceStore } from "../../store";
import { defaultTheme } from "./../../definitions";

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
    const loading = ref(true);

    const showField = (definition: IBlockDefinition) =>
      !definition.showIf || definition.showIf(form);

    const loadData = async () => {
      loading.value = true;
      const componentConfig = await deviceStore.actions.getComponentSettings(
        props.componentDefinition,
        props.componentBlock,
        DefinitionType.Setting,
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
      onLoad,
    }: {
      key: string;
      value: number;
      section: number;
      settingIndex: number;
      onLoad?: (value: number) => void;
    }) => {
      if (loading.value) {
        return;
      }
      loading.value = true;

      const onSuccess = () => {
        form[key] = value;
        loading.value = false;
        if (onLoad) {
          onLoad.value(value);
        }
      };
      return deviceStore.actions
        .setComponentSectionValue(
          {
            block: props.componentBlock,
            section,
            index: settingIndex,
          },
          value,
          onSuccess,
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
      showField,
      loading,
      onSettingChange,
    };
  },
});
</script>

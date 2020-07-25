<template>
  <form novalidate @submit.prevent="">
    <Heading preset="section-title" class="flex w-full">
      <router-link class="mr-6" :to="{ name: routeName }">
        <h2>{{ componentName }}s</h2>
      </router-link>
      <span class="mr-6">&rsaquo;</span>
      <h3 class="mr-6 text-gray-400">
        {{ componentName }}
        <strong>
          {{ componentIndex }}
        </strong>
      </h3>
      <div class="hidden md:block md:flex-grow text-right">
        <router-link
          v-if="componentIndex > 0"
          class="ml-6"
          :class="{
            'cursor-pointer': componentIndex > 0,
            'text-yellow-700': componentIndex === 0,
          }"
          :to="{ params: { inputId, componentIndex: componentIndex - 1 } }"
        >
          <Chevron type="left" class="inline fill-current h-6 w-6" />
          <small>previous</small>
        </router-link>

        <router-link
          v-if="componentIndex < componentCount - 1"
          class="ml-6"
          :class="{
            'cursor-pointer': componentIndex < componentCount,
            'text-yellow-700': componentIndex === componentCount - 1,
          }"
          :to="{ params: { inputId, componentIndex: componentIndex + 1 } }"
        >
          <small>next</small>
          <Chevron type="right" class="inline fill-current h-6 w-6" />
        </router-link>
      </div>
    </Heading>

    <slot
      :form="form"
      :showMsbContros="showMsbControls"
      :onValueChange="onValueChange"
    ></slot>

    <div v-if="loading" class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted, watch } from "vue";
import { IBlockDefinition, DefinitionType } from "../../definitions";
import Chevron from "../icons/Chevron.vue";
import { deviceStoreMapped } from "../../store";
import { logger } from "../../util";

export default defineComponent({
  name: "DeviceForm",
  props: {
    componentBlock: {
      type: Number,
      required: true,
    },
    componentIndex: {
      type: Number,
      required: true,
    },
    componentCount: {
      type: Number,
      required: true,
    },
    componentName: {
      type: String,
      required: true,
    },
    componentDefinition: {
      type: Object as () => Dictionary<IBlockDefinition>,
      required: true,
    },
    defaultData: {
      type: Object,
      required: true,
    },
    routeName: {
      type: String,
      required: false,
    },
  },
  setup(props) {
    const loading = ref(true);
    const form = reactive(props.defaultData);
    const componentIndex = toRefs(props).componentIndex;

    const loadData = async () => {
      loading.value = true;
      Object.assign(form, props.defaultData);

      const componentConfig = await deviceStoreMapped.getComponentSettings(
        props.componentDefinition,
        props.componentBlock,
        DefinitionType.ComponentValue,
        componentIndex.value
      );
      Object.assign(form, componentConfig);
      // prevent initial value change from writing to device
      setTimeout(() => (loading.value = false), 100);
    };

    onMounted(() => loadData());
    watch([componentIndex], () => loadData());

    const onValueChange = ({
      key,
      value,
      section,
    }: {
      key: string;
      value: number;
      section: number;
    }) => {
      if (loading.value) {
        return;
      }
      loading.value = true;

      const onSuccess = () => {
        form[key] = value;
        loading.value = false;
      };

      return deviceStoreMapped
        .setComponentSectionValue(
          {
            block: props.componentBlock,
            section,
            index: componentIndex.value,
          },
          value,
          onSuccess
        )
        .catch((error) => {
          logger.error("ERROR WHILE SAVING COMPONENT VALUE DATA", error);
          // Try reloading the form to reinit without failed fields
          return loadData();
        });
    };

    return {
      ...deviceStoreMapped,
      form: {
        ...toRefs(form),
      },
      loading,
      onValueChange,
      componentIndex,
    };
  },
  components: {
    Chevron,
  },
});
</script>

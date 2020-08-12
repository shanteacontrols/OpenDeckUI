<template>
  <form class="relative" novalidate @submit.prevent="">
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

    <div v-if="loading" class="absolute flex inset-0 opacity-75 bg-gray-900">
      <Spinner class="self-center" />
    </div>

    <slot :form="form" :onValueChange="onValueChange"></slot>
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
  components: {
    Chevron,
  },
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
      default: "",
    },
  },
  setup(props) {
    const loading = ref(true);
    const form = reactive(props.defaultData);
    const index = toRefs(props).componentIndex;

    const loadData = async () => {
      loading.value = true;
      Object.assign(form, props.defaultData);

      const componentConfig = await deviceStoreMapped.getComponentSettings(
        props.componentDefinition,
        props.componentBlock,
        DefinitionType.ComponentValue,
        index.value,
      );
      Object.assign(form, componentConfig);
      // prevent initial value change from writing to device
      setTimeout(() => (loading.value = false), 100);
    };

    onMounted(() => loadData());
    watch([index], () => loadData());

    const onValueChange = ({
      key,
      value,
      section,
      onLoad,
    }: {
      key: string;
      value: number;
      section: number;
      onLoad?: (value: number) => void;
    }) => {
      if (loading.value) {
        return;
      }
      loading.value = true;

      const onSuccess = () => {
        form[key] = value;
        setTimeout(() => (loading.value = false), 100);
        if (onLoad) {
          onLoad.value(value);
        }
      };

      // Fix for unreliable value (ref.value vs value)
      const sectionValue = section.value || section;

      return deviceStoreMapped
        .setComponentSectionValue(
          {
            block: props.componentBlock,
            section: sectionValue,
            index: index.value,
          },
          value,
          onSuccess,
        )
        .catch((error) => {
          logger.error("ERROR WHILE SAVING COMPONENT VALUE DATA", error);
          // Try reloading the form to reinit without failed fields
          return loadData();
        });
    };

    return {
      inputId: deviceStoreMapped.inputId,
      form: {
        ...toRefs(form),
      },
      loading,
      onValueChange,
    };
  },
});
</script>

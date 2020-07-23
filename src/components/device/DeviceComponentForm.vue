<template>
  <form novalidate @submit.prevent="">
    <Heading
      preset="section-title"
      class="flex w-full"
      :class="`${sectionTitle}`"
    >
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

      <router-link
        v-if="componentIndex > 1"
        class="ml-2"
        :class="{
          'text-gray-600 hover:text-gray-400 cursor-pointer':
            componentIndex > 1,
          'text-gray-700': componentIndex === 1,
        }"
        :to="{ params: { inputId, componentIndex: componentIndex - 1 } }"
      >
        <Chevron type="left" class="fill-current h-6 w-6" />
      </router-link>

      <router-link
        v-if="componentIndex < componentCount"
        :class="{
          'text-gray-600 hover:text-gray-400 cursor-pointer':
            componentIndex < componentCount,
          'text-gray-700': componentIndex === componentCount,
          'ml-8': componentIndex === 1,
        }"
        :to="{ params: { inputId, componentIndex: componentIndex + 1 } }"
      >
        <Chevron type="right" class="fill-current h-6 w-6" />
      </router-link>
    </Heading>

    <slot
      :form="form"
      :showMsbContros="showMsbControls"
      :onValueChange="onValueChange"
    ></slot>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted, watch } from "vue";
import { IBlockDefinition, DefinitionType } from "../../definitions";
import Chevron from "../icons/Chevron.vue";
import { deviceStoreMapped } from "../../store";
import { defaultTheme } from "./../../definitions";

export default defineComponent({
  name: "DeviceComponentForm",
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
    // const index1 = computed(() => router.currentRoute.value.params.index);
    // const index = ref(Number(router.currentRoute.value.params.index));
    const componentIndex = toRefs(props).componentIndex;

    const changed = async () => {
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

    onMounted(() => changed());
    watch([componentIndex], () => changed());

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

      return deviceStoreMapped.setComponentSectionValue(
        {
          block: props.componentBlock,
          section,
          index: componentIndex.value,
        },
        value,
        onSuccess
      );
    };

    return {
      ...deviceStoreMapped,
      ...defaultTheme,
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

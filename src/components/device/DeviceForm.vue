<template>
  <form class="relative section" novalidate @submit.prevent="">
    <h1 class="w-full section-heading">
      <div class="section-heading-inner flex">
        <router-link class="mr-6" :to="{ name: routeName }">
          <h2>{{ componentName }}s</h2>
        </router-link>
        <span class="mr-6">&rsaquo;</span>
        <div class="mr-6 text-gray-400">
          {{ componentName }}
          <strong>
            {{ componentIndex }}
          </strong>
        </div>
        <div class="hidden md:block md:flex-grow text-right">
          <Siblinks
            param-key="componentIndex"
            :current="componentIndex"
            :total="numberOfComponents[componentBlock]"
            :params="{ outputId }"
          />
        </div>
      </div>
    </h1>

    <SpinnerOverlay v-if="loading" />

    <div class="section-content">
      <slot
        :form="form"
        :showField="showField"
        :onValueChange="onValueChange"
      ></slot>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, ref, onMounted, watch } from "vue";
import { ISectionDefinition, DefinitionType } from "../../definitions";
import { deviceStoreMapped } from "../../store";
import { logger } from "../../util";

export default defineComponent({
  name: "DeviceForm",
  props: {
    componentBlock: {
      required: true,
      type: Number as () => Block,
    },
    componentIndex: {
      type: Number,
      required: true,
    },
    componentName: {
      type: String,
      required: true,
    },
    componentDefinition: {
      type: Object as () => Dictionary<ISectionDefinition>,
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

    const showField = (definition: ISectionDefinition) =>
      !definition.showIf || definition.showIf(form);

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

    const { numberOfComponents, outputId } = deviceStoreMapped;

    return {
      outputId,
      numberOfComponents,
      form: {
        ...toRefs(form),
      },
      showField,
      loading,
      onValueChange,
    };
  },
});
</script>

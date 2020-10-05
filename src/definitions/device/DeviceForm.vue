<template>
  <form class="relative section" novalidate @submit.prevent="">
    <h1 class="w-full section-heading">
      <div class="section-heading-inner flex">
        <router-link class="mr-6" :to="{ name: blockDefinition.routeName }">
          <h2>{{ blockDefinition.title }}s</h2>
        </router-link>
        <span class="mr-6">&rsaquo;</span>
        <div class="mr-6 text-gray-400">
          {{ blockDefinition.title }}
          <strong>
            {{ index }}
          </strong>
        </div>
        <div class="hidden md:block md:flex-grow text-right">
          <Siblinks
            param-key="index"
            :current="index"
            :total="numberOfComponents[block]"
            :params="{ outputId }"
          />
        </div>
      </div>
    </h1>

    <SpinnerOverlay v-if="loading" />

    <div class="section-content">
      <div class="form-grid" :class="`lg:grid-cols-${gridCols}`">
        <template v-for="section in sections">
          <FormField
            v-if="showField(section)"
            :key="section.key"
            :class="`col-span-${section.colspan || 1}`"
            :value="formData[section.key]"
            :field-definition="section"
            @modified="onValueChange"
          />
        </template>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { SectionType, Block } from "../../definitions";
import { deviceStoreMapped } from "../../store";
import router from "../../router";
import { useDeviceForm } from "../../composables";

export default defineComponent({
  name: "DeviceForm",
  props: {
    block: {
      required: true,
      type: Number as () => Block,
    },
    gridCols: {
      default: 3,
      type: Number,
    },
  },
  setup(props) {
    const { numberOfComponents, outputId } = deviceStoreMapped;
    const index = computed(() =>
      Number(router.currentRoute.value.params.index),
    );

    return {
      outputId,
      numberOfComponents,
      index,
      ...useDeviceForm(props.block, SectionType.Value, index),
    };
  },
});
</script>

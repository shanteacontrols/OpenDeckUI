<template>
  <Section :title="title" :wide="viewSetting.viewListAsTable">
    <div v-if="!showMsbControls" class="-mt-2 pb-6 clearfix">
      <span class="">
        <span
          class="btn btn-xs mr-2"
          :class="{ 'btn-active': !viewSetting.viewListAsTable }"
          @click="() => setViewSetting(block, { viewListAsTable: false })"
        >
          Grid
        </span>
        <span
          class="btn btn-xs"
          :class="{ 'btn-active': viewSetting.viewListAsTable }"
          @click="() => setViewSetting(block, { viewListAsTable: true })"
        >
          Table
        </span>
      </span>

      <span
        v-if="viewSetting.viewListAsTable && pageSizes.length"
        class="ml-6 float-right"
      >
        <span class="text-xs">Show</span>
        <span
          v-for="itemsPerPage in pageSizes"
          :key="`page-size-${itemsPerPage}`"
          class="btn btn-xs ml-1"
          :class="{ 'btn-active': itemsPerPage === viewSetting.itemsPerPage }"
          @click="() => setViewSetting(block, { itemsPerPage })"
        >
          {{ itemsPerPage }}
        </span>
      </span>

      <span
        v-if="viewSetting.viewListAsTable && pages > 1"
        class="ml-6 mt-4 md:mt-0 float-right"
      >
        <span class="text-xs ml-4">Page</span>
        <span
          v-for="page in pages"
          :key="`page-size-${page}`"
          class="btn btn-xs ml-1"
          :class="{ 'btn-active': page === viewSetting.currentPage }"
          @click="() => setViewSetting(block, { currentPage: page })"
        >
          {{ page }}
        </span>
      </span>
    </div>

    <template v-if="!viewSetting.viewListAsTable">
      <div v-if="!segments || !segments.length" class="device-grid">
        <DeviceGridButton
          v-for="index in componentCount"
          :key="`button-${index}`"
          :output-id="outputId"
          :route-name="routeName"
          :index="index - 1"
          :highlight="highlights[block][index - 1]"
        >
          <span class="text-xl font-bold">{{ index - 1 }}</span>
        </DeviceGridButton>
      </div>
      <template v-else>
        <Section
          v-for="(segment, idx) in segments"
          :key="`grid-segment-${idx}`"
        >
          <h3 class="mb-8 font-lg text-center">{{ segment.title }}</h3>
          <div class="device-grid">
            <DeviceGridButton
              v-for="index in segment.indexArray"
              :key="`button-${index}`"
              :output-id="outputId"
              :route-name="routeName"
              :index="index"
              :highlight="highlights[block][index]"
            >
              <span class="text-xl font-bold">{{ index }}</span>
            </DeviceGridButton>
          </div>
        </Section>
      </template>
    </template>

    <form v-else class="relative pb-8" novalidate @submit.prevent="">
      <SpinnerOverlay v-if="loading" />
      <div class="form-table">
        <DeviceTableComponentRow
          v-for="index in indexRange"
          :key="`table-form-${index}`"
          :index="index"
          :form-data="columnViewData[index]"
          :show-field="showField"
          :sections="sections"
          :on-value-change="onValueChange"
          :highlight="highlights[block][index]"
        />
      </div>
    </form>
  </Section>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
import { Block } from "./../../definitions";
import { deviceStoreMapped, requestLogMapped } from "../../store";
import {
  useDeviceTableView,
  useViewSettings,
  useGridSegments,
  GridSegment,
} from "../../composables";
import DeviceGridButton from "./DeviceGridButton.vue";
import DeviceTableComponentRow from "./DeviceTableComponentRow.vue";

export default defineComponent({
  name: "DeviceGrid",
  components: {
    DeviceGridButton,
    DeviceTableComponentRow,
  },
  props: {
    title: {
      default: "",
      type: String,
    },
    block: {
      required: true,
      type: Number as () => Block,
    },
    gridSegments: {
      type: Array as () => GridSegment[],
      default: null,
    },
    routeName: {
      required: true,
      type: String,
    },
  },
  setup(props) {
    const { outputId, setViewSetting, showMsbControls } = deviceStoreMapped;
    const { highlights } = requestLogMapped;
    const { block, gridSegments } = toRefs(props);
    const { segments } = useGridSegments(gridSegments);

    const {
      columnViewData,
      loading,
      showField,
      onValueChange,
    } = useDeviceTableView(block.value);
    const {
      componentCount,
      indexRange,
      pages,
      pageSizes,
      sections,
      viewSetting,
    } = useViewSettings(block.value);

    return {
      outputId,
      highlights,
      columnViewData,
      loading,
      showField,
      onValueChange,
      setViewSetting,
      componentCount,
      viewSetting,
      indexRange,
      pages,
      pageSizes,
      sections,
      showMsbControls,
      segments,
    };
  },
});
</script>

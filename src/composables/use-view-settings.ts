import { computed } from "vue";
import { Block, BlockMap, ISectionDefinition } from "../definitions";
import { deviceStore } from "../store";
import { IViewSettingState } from "../definitions/device/device-store/state";

interface IViewSettings {
  componentCount: Computed<number>;
  indexRange: Computed<Array<number>>;
  pages: Computed<Array<number>>;
  pageSizes: Computed<Array<number>>;
  sections: Dictionary<ISectionDefinition>;
  viewSetting: Computed<IViewSettingState>;
}

export const useViewSettings = (block: Block): IViewSettings => {
  const viewSetting = computed(() => deviceStore.state.viewSettings[block]);
  const componentCount = computed(
    () => deviceStore.state.numberOfComponents[block] || 0,
  );

  const pages = computed(() =>
    Math.ceil(componentCount.value / viewSetting.value.itemsPerPage),
  );
  const min = computed(
    () => (viewSetting.value.currentPage - 1) * viewSetting.value.itemsPerPage,
  );

  const maxCalc = computed(() => min.value + viewSetting.value.itemsPerPage);
  const max = computed(() =>
    maxCalc.value > componentCount.value ? componentCount.value : maxCalc.value,
  );

  const allowedPageSizes = [16, 32, 56, 112];

  const pageSizes = computed(() =>
    allowedPageSizes.filter((size: number) => size < componentCount.value),
  );

  const indexRange = computed(() => {
    const items = [];
    for (let i = min.value; i < max.value; i++) {
      items.push(i);
    }
    return items;
  });

  const sections = computed(() => BlockMap[block].sections);

  return {
    componentCount,
    indexRange,
    pages,
    pageSizes,
    sections,
    viewSetting,
  };
};

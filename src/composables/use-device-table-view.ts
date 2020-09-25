import { ref, reactive, onMounted } from "vue";
import {
  Block,
  SectionType,
  ISectionDefinition,
  getDefaultDataForBlock,
} from "../definitions";
import { delay, logger } from "../util";
import { deviceStore } from "../store";

interface IDeviceTableView {
  loadData: Promise<void>;
  loading: Ref<boolean>;
  columnViewData: Ref<any>;
  onValueChange: Promise<void>;
  showField(definition: ISectionDefinition): boolean;
}

export const useDeviceTableView = (block: Block): IDeviceTableView => {
  const loading = ref(true);
  const defaultData = getDefaultDataForBlock(block, SectionType.Value);
  const columnViewData = reactive({});

  const showField = (sectionDef: ISectionDefinition, formData: any): boolean =>
    sectionDef && (!sectionDef.showIf || sectionDef.showIf(formData));

  const loadData = async () => {
    loading.value = true;

    const fetchedValues = await deviceStore.actions.getSectionValues(block);
    Object.keys(fetchedValues).forEach((key) => {
      fetchedValues[key].forEach((value: number, index: number) => {
        if (!columnViewData[index]) {
          columnViewData[index] = { ...defaultData };
        }
        columnViewData[index][key] = value;
      });
    });

    // prevent initial value change from writing to device
    delay(100).then(() => (loading.value = false));
  };

  interface IColumnValueChangeParams {
    key: string;
    value: number;
    section: number;
    index: number;
    onLoad?: (value: number) => void;
  }

  const onValueChange = (params: IColumnValueChangeParams) => {
    const { key, value, section, index, onLoad } = params;
    const config = { block, section, index, value };

    if (loading.value) {
      return;
    }
    loading.value = true;

    const onSuccess = () => {
      columnViewData[index][key] = config.value;
      delay(100).then(() => (loading.value = false));
      if (onLoad) {
        onLoad(config.value);
      }
    };

    return deviceStore.actions
      .setComponentSectionValue(config, onSuccess)
      .catch((error) => {
        logger.error("ERROR WHILE SAVING SETTING DATA", error);
        // Try reloading the data to reinit without failed fields
        return loadData();
      });
  };

  onMounted(() => loadData());

  return {
    columnViewData,
    loading,
    loadData,
    showField,
    onValueChange,
  };
};

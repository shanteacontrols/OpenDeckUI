import { ref, reactive, onMounted, watch } from "vue";
import {
  Block,
  BlockMap,
  SectionType,
  ISectionDefinition,
  getDefaultDataForBlock,
  IBlockDefinition,
} from "../definitions";
import { delay, logger } from "../util";
import { deviceStore } from "../store";

interface IDeviceForm {
  formData: Ref<any>;
  loading: Ref<boolean>;
  loadData: Promise<void>;
  onSettingChange: Promise<void>;
  onValueChange: Promise<void>;
  showField(definition: ISectionDefinition): boolean;
  sections: Array<ISectionDefinition>;
  blockDefinition: IBlockDefinition;
}

export const useDeviceForm = (
  block: Block,
  sectionType: SectionType,
  indexRef?: Ref<number>,
): IDeviceForm => {
  const loading = ref(true);
  const defaultData = getDefaultDataForBlock(block, sectionType);
  const formData = reactive(defaultData);

  const showField = (sectionDef: ISectionDefinition): boolean =>
    sectionDef && (!sectionDef.showIf || sectionDef.showIf(formData));

  const sections = deviceStore.actions.getFilteredSectionsForBlock(
    block,
    sectionType,
  );

  const loadData = async () => {
    loading.value = true;
    const indexVal =
      sectionType === SectionType.Value && indexRef
        ? indexRef.value
        : undefined;

    const componentConfig = await deviceStore.actions.getComponentSettings(
      block,
      sectionType,
      indexVal,
    );
    Object.assign(formData, componentConfig);

    // prevent initial value change from writing to device
    delay(100).then(() => (loading.value = false));
  };

  const onChange = (
    key: string,
    config: IRequestConfig,
    onLoad?: (value: number) => void,
  ) => {
    if (loading.value) {
      return;
    }
    loading.value = true;

    const onSuccess = () => {
      formData[key] = config.value;
      delay(100).then(() => (loading.value = false));
      if (onLoad) {
        onLoad(config.value);
      }
    };

    return deviceStore.actions
      .setComponentSectionValue(config, onSuccess)
      .catch((error) => {
        logger.error("ERROR WHILE SAVING SETTING DATA", error);
        // Try reloading the formData to reinit without failed fields
        return loadData();
      });
  };

  interface IValueChangeParams {
    key: string;
    value: number;
    section: number;
    settingIndex: number;
    onLoad?: (value: number) => void;
  }

  const onSettingChange = (params: IValueChangeParams) => {
    const { key, value, section, settingIndex, onLoad } = params;
    const config = { block, section, index: settingIndex, value };

    return onChange(key, config, onLoad);
  };

  const onValueChange = (params: IValueChangeParams) => {
    const { key, value, section, onLoad } = params;
    const config = { block, section, index: indexRef.value, value };

    return onChange(key, config, onLoad);
  };

  onMounted(() => loadData());
  if (indexRef) {
    watch([indexRef], () => loadData());
  }

  return {
    formData,
    loading,
    loadData,
    onSettingChange,
    onValueChange,
    showField,
    sections,
    blockDefinition: BlockMap[block],
  };
};

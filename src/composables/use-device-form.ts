import { ref, reactive, onMounted, watch } from "vue";
import {
  Block,
  SectionType,
  ISectionDefinition,
  getDefaultDataForBlock,
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
}

export const useDeviceForm = (
  block: Block,
  sectionType: SectionType,
  indexRef?: Ref<number>,
): IDeviceForm => {
  const loading = ref(true);
  const defaultData = getDefaultDataForBlock(block, sectionType);
  const formData = reactive(defaultData);

  const showField = (blockDef: ISectionDefinition): boolean =>
    blockDef && (!blockDef.showIf || blockDef.showIf(formData));

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
      formData[key] = value;
      loading.value = false;
      if (onLoad) {
        onLoad.value(value);
      }
    };

    return deviceStore.actions
      .setComponentSectionValue(
        {
          block,
          section,
          index: settingIndex,
        },
        value,
        onSuccess,
      )
      .catch((error) => {
        logger.error("ERROR WHILE SAVING SETTING DATA", error);
        // Try reloading the formData to reinit without failed fields
        return loadData();
      });
  };

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
      formData[key] = value;
      delay(100).then(() => (loading.value = false));
      if (onLoad) {
        onLoad.value(value);
      }
    };

    // Fix for unreliable value (ref.value vs value)
    const sectionValue = section.value || section;
    return deviceStore.actions
      .setComponentSectionValue(
        {
          block,
          section: sectionValue,
          index: indexRef.value,
        },
        value,
        onSuccess,
      )
      .catch((error) => {
        logger.error("ERROR WHILE SAVING COMPONENT VALUE DATA", error);
        // Try reloading the formData to reinit without failed fields
        return loadData();
      });
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
  };
};

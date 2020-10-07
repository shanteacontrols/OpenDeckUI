import { markRaw } from "vue";
import {
  Block,
  IBlockDefinition,
  ISectionDefinition,
  SectionType,
  FormInputComponent,
} from "../../interface";
import { deviceStore } from "../../../store";

import GlobalForm from "./GlobalForm.vue";
import GlobalFirmware from "./GlobalFirmware.vue";
import GlobalIcon from "./GlobalIcon.vue";

const sections: Dictionary<ISectionDefinition> = {
  PreservePresetState: {
    block: Block.Global,
    key: "preservePresetState",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Preserve preset setting",
    helpText: `When disabled, first preset will always be loaded on device power on.
      Otherwise, preset specified with "Active preset" option is remembered. This is not related to saving of configuration
      to specified preset - the configuration data is always retained even after power off.`,
  },
  ActivePreset: {
    block: Block.Global,
    key: "activePreset",
    type: SectionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Select,
    // Note: Read supported preset count from state
    options: (): any => {
      const count = deviceStore.state.supportedPresetsCount || 1;
      const options = [];
      for (let value = 0; value < count; value++) {
        options.push({
          value,
          text: String(value + 1),
        });
      }
      return options;
    },
    // Note: update separate state property (different UI segment than the form) when loading value
    onLoad: (value: number): void => {
      deviceStore.state.activePreset = value;
    },
    label: "Active preset",
    helpText: `Preset stores the entire configuration for device.`,
  },
  StandardNoteOff: {
    block: Block.Global,
    key: "standardNoteOff",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 0,
    component: FormInputComponent.Toggle,
    label: "Standard note off",
    helpText: `When disabled, Note On with velocity 0 will be sent as note off. If enabled, true Note Off event will be sent instead.`,
  },
  RunningStatus: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "runningStatus",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Running status",
    helpText: `This setting applies only to DIN MIDI out. When enabled,
    MIDI output bandwidth increases due to lower amount of bytes being sent. This setting can cause issues on older MIDI gear so it's best to leave it disabled.`,
  },
  DinMidiState: {
    block: Block.Global,
    key: "dinMidiState",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "DIN MIDI state",
    helpText: `Enable or disable DIN MIDI input and output.`,
  },
  MidiMergeEnable: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "midiMergeEnable",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "MIDI merge",
    helpText: `When enabled, all data received via DIN MIDI can be forwarded to USB, DIN MIDI out or both interfaces.`,
  },
  PassUSBtoDIN: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "passUSBtoDIN",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 4,
    component: FormInputComponent.Toggle,
    label: "Pass USB MIDI to DIN MIDI",
    helpText: `When enabled, all data received via USB MIDI will be forwarded to DIN MIDI output.`,
  },
  MidiMergeType: {
    showIf: (formState: FormState): boolean => !!formState.midiMergeEnable,
    block: Block.Global,
    key: "midiMergeType",
    type: SectionType.Setting,
    section: 1,
    settingIndex: 0,
    component: FormInputComponent.Select,
    options: [
      {
        value: 0,
        text: "DIN to USB",
      },
      {
        value: 1,
        text: "DIN to DIN",
      },
      {
        value: 2,
        text: "OpenDeck master",
      },
      {
        value: 3,
        text: "OpenDeck slave",
      },
    ],
    label: "MIDI merge type",
    helpText: `Interface to which incoming MIDI data is forwarded to.`,
  },
};

export const GlobalBlock: IBlockDefinition = {
  block: Block.Global,
  title: "Global",
  routeName: "device-global",
  iconComponent: markRaw(GlobalIcon),
  sections,
  routes: [
    {
      path: "",
      name: "device-global",
      component: GlobalForm,
    },
    {
      path: "firmware-update",
      name: "device-firmware-update",
      component: GlobalFirmware,
    },
  ],
};

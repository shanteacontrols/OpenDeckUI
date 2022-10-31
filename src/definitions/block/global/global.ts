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
  UseGlobalChannel: {
    block: Block.Global,
    key: "useGlobalChannel",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 13,
    component: FormInputComponent.Toggle,
    label: "Use global channel",
    helpText: `When enabled, specified global MIDI channel will be used for all components. Individual channels for components will be ignored.`,
  },
  GlobalChannel: {
    showIf: (formState: FormState): boolean => !!formState.useGlobalChannel,
    block: Block.Global,
    key: "globalChannel",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 14,
    min: 1,
    max: 17,
    component: FormInputComponent.Input,
    label: "Global channel",
    helpText: `Setting the channel to value 17 will cause sending of data on each MIDI channel, and incoming channel for LEDs and other components will be ignored.`,
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
  MIDIClock: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "midiClock",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 15,
    component: FormInputComponent.Toggle,
    label: "Send MIDI clock",
    helpText: `This setting applies only to DIN MIDI out.
    When enabled, MIDI clock will be sent out at default BPM of 120. The tempo can be changed with buttons or encoders.`,
  },
  DinMidiState: {
    block: Block.Global,
    key: "dinMidiState",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 3,
    component: FormInputComponent.Toggle,
    label: "DIN MIDI",
    helpText: `Enable or disable DIN MIDI input and output.`,
  },
  BleMidiState: {
    block: Block.Global,
    key: "bleMidiState",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 9,
    component: FormInputComponent.Toggle,
    label: "BLE MIDI",
    helpText: `Enable or disable BLE (Bluetooth Low Energy) MIDI input and output.`,
  },
  UsbToDinThru: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "usbToDinThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 4,
    component: FormInputComponent.Toggle,
    label: "USB to DIN Thru",
    helpText: `When enabled, all data received via USB will be forwarded to DIN out.`,
  },
  UsbToUsbThru: {
    block: Block.Global,
    key: "usbToUsbThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 5,
    component: FormInputComponent.Toggle,
    label: "USB to USB Thru",
    helpText: `When enabled, all data received via USB will be forwarded to USB out.`,
  },
  UsbToBleThru: {
    showIf: (formState: FormState): boolean => !!formState.bleMidiState,
    block: Block.Global,
    key: "usbToBleThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 6,
    component: FormInputComponent.Toggle,
    label: "USB to BLE Thru",
    helpText: `When enabled, all data received via USB will be forwarded to BLE out.`,
  },
  DinToDinThru: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "dinToDinThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 7,
    component: FormInputComponent.Toggle,
    label: "DIN to DIN Thru",
    helpText: `When enabled, all data received via DIN will be forwarded to DIN out.`,
  },
  DinToUsbThru: {
    showIf: (formState: FormState): boolean => !!formState.dinMidiState,
    block: Block.Global,
    key: "dinToUsbThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "DIN to USB Thru",
    helpText: `When enabled, all data received via DIN will be forwarded to USB out.`,
  },
  DinToBleThru: {
    showIf: (formState: FormState): boolean =>
      !!formState.dinMidiState && !!formState.bleMidiState,
    block: Block.Global,
    key: "dinToBleThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 8,
    component: FormInputComponent.Toggle,
    label: "DIN to BLE Thru",
    helpText: `When enabled, all data received via DIN will be forwarded to BLE out.`,
  },
  BleToDinThru: {
    showIf: (formState: FormState): boolean =>
      !!formState.dinMidiState && !!formState.bleMidiState,
    block: Block.Global,
    key: "bleToDinThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 10,
    component: FormInputComponent.Toggle,
    label: "BLE to DIN Thru",
    helpText: `When enabled, all data received via BLE will be forwarded to DIN out.`,
  },
  BleToUsbThru: {
    showIf: (formState: FormState): boolean => !!formState.bleMidiState,
    block: Block.Global,
    key: "bleToUsbThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 11,
    component: FormInputComponent.Toggle,
    label: "BLE to USB Thru",
    helpText: `When enabled, all data received via BLE will be forwarded to USB out.`,
  },
  BleToBleThru: {
    showIf: (formState: FormState): boolean => !!formState.bleMidiState,
    block: Block.Global,
    key: "bleToBleThru",
    type: SectionType.Setting,
    section: 0,
    settingIndex: 12,
    component: FormInputComponent.Toggle,
    label: "BLE to BLE Thru",
    helpText: `When enabled, all data received via BLE will be forwarded to BLE out.`,
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

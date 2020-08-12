import { IBlockDefinition, FormInputComponent, DefinitionType } from ".";
import { Block } from "./definitions-device";
import { deviceStore } from "../store";

export const defaultGlobalData: Dictionary<number> = {
  preservePresetState: (null as unknown) as number,
  activePreset: (null as unknown) as number,
  standardNoteOff: (null as unknown) as number,
  runningStatus: (null as unknown) as number,
  midiMergeEnable: (null as unknown) as number,
  midiMergeType: (null as unknown) as number,
  dinMidiState: (null as unknown) as number,
};

type FormState = typeof defaultGlobalData;

export const GlobalDefinitions: Dictionary<IBlockDefinition> = {
  PreservePresetState: {
    block: Block.Global,
    key: "preservePresetState",
    type: DefinitionType.Setting,
    section: 2,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Preserve preset setting",
    helpText: `When disabled, first preset will always be loaded on board power on.
    Otherwise, preset index configured here is remembered. This is not related to saving of configuration
    to specified preset - the configuration data is always retained even after power off.`,
  },
  ActivePreset: {
    block: Block.Global,
    key: "activePreset",
    type: DefinitionType.Setting,
    section: 2,
    settingIndex: 0,
    component: FormInputComponent.Select,
    // Note: Read supported preset count from state
    options: (): any => {
      const count = deviceStore.state.supportedPresetsCount || 1;
      const options = [];
      for (let value = 1; value <= count; value++) {
        options.push({
          value,
          text: String(value),
        });
      }
      return options;
    },
    // Note: update separate state property (different UI segment than the form) when loading value
    onLoad: (value: number): void => {
      deviceStore.state.activePreset = value;
    },
    label: "Active preset",
    helpText: ``,
  },
  StandardNoteOff: {
    block: Block.Global,
    key: "standardNoteOff",
    type: DefinitionType.Setting,
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
    type: DefinitionType.Setting,
    section: 0,
    settingIndex: 1,
    component: FormInputComponent.Toggle,
    label: "Running status",
    helpText: `This setting applies only to DIN MIDI out. This setting can cause issues on older MIDI gear so it's best to leave it disabled.`,
  },
  DinMidiState: {
    block: Block.Global,
    key: "dinMidiState",
    type: DefinitionType.Setting,
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
    type: DefinitionType.Setting,
    section: 0,
    settingIndex: 2,
    component: FormInputComponent.Toggle,
    label: "MIDI merge",
    helpText: `When enabled, all data received via DIN MIDI can be forwarded to USB, DIN MIDI out or both interfaces.`,
  },
  MidiMergeType: {
    showIf: (formState: FormState): boolean => !!formState.midiMergeEnable,
    block: Block.Global,
    key: "midiMergeType",
    type: DefinitionType.Setting,
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

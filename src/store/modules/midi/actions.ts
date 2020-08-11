import WebMidi, { Input, Output } from "webmidi";
import { state, MidiConnectionState, ControlDisableType } from "./state";
import { isConnected, isConnecting } from "./computed";
import { logger } from "../../../util";
import router from "../../../router";
import { IBlockDefinition } from "../../../definitions";

// Local states

let loadMidiPromise = (null as unknown) as Promise<void>;

let connectionWatcherTimer = null;

// Helpers

const setConnectionState = (value: MidiConnectionState): void => {
  state.connectionState = value;
};

const connectionWatcher = async (): Promise<void> => {
  stopMidiConnectionWatcher();

  try {
    if (!isConnected() && !isConnecting()) {
      await loadMidi();
    }

    assignInputs();

    const isDevicePageOpen = router.currentRoute.value.matched.some(
      (r) => r.name === "device",
    );

    // If only one input is available, open it right away
    if (state.inputs.length === 1 && !isDevicePageOpen) {
      router.push({
        name: "device",
        params: {
          inputId: state.inputs[0].id,
        },
      });
    }
  } catch (err) {
    logger.error("MIDI Connection watcher error", err);
  }

  connectionWatcherTimer = setTimeout(connectionWatcher, 1000);
};

const startMidiConnectionWatcher = (): Promise<void> => connectionWatcher();

const stopMidiConnectionWatcher = (): Promise<void> => {
  if (connectionWatcherTimer) {
    clearTimeout(connectionWatcherTimer);
    connectionWatcherTimer = null;
  }
};

const filterByName = (input: Input) => input.name.startsWith("OpenDeck");

const assignInputs = () => {
  state.inputs = WebMidi.inputs.filter(filterByName);
  state.outputs = WebMidi.outputs;
};

// Actions

export const findInputOutput = async (
  inputId: string,
): Promise<{ input: Input; output: Output }> => {
  await loadMidi();

  const input = WebMidi.inputs.find((input: Input) => input.id === inputId);
  if (!input) {
    // @TODO: show alert warning
    throw new Error(`CANNOT FIND INPUT ${inputId}`);
  }
  const output = WebMidi.outputs.find(
    (output: Output) => output.name === input.name,
  );
  if (!output) {
    // @TODO: show alert warning
    throw new Error(`CANNOT FIND OUTPUT FOR INPUT ${inputId}`);
  }

  return { input, output };
};

export const loadMidi = async (): Promise<void> => {
  if (loadMidiPromise) {
    return loadMidiPromise;
  }
  if (WebMidi.enabled) {
    setConnectionState(MidiConnectionState.Open);
    return;
  }

  loadMidiPromise = newMidiLoadPromise();

  return loadMidiPromise;
};

const newMidiLoadPromise = async (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (WebMidi.enabled) {
      setConnectionState(MidiConnectionState.Open);
      return resolve();
    }

    setConnectionState(MidiConnectionState.Pending);
    WebMidi.enable(function (error) {
      if (error) {
        logger.error("Failed to load WebMidi", error);
        reject(error);
      } else {
        assignInputs();
        setConnectionState(MidiConnectionState.Open);
        loadMidiPromise = (null as unknown) as Promise<void>;
        return resolve();
      }
    }, true);
  });

const isControlDisabled = (
  def: IBlockDefinition,
  type?: ControlDisableType,
): boolean =>
  state.disableUiControls.some(
    (d) =>
      d.key === def.key && d.block === def.block && (!type || d.type === type),
  );

const disableControl = (
  def: IBlockDefinition,
  type: ControlDisableType,
): void => {
  const isDisabled = isControlDisabled(def);
  if (!isDisabled) {
    const { block, key } = def;
    state.disableUiControls.push({ block, key, type });
  }
};

// Export

export interface IMidiActions {
  loadMidi: () => Promise<void>;
  findInputOutput: (
    inputId: string,
  ) => Promise<{ input: Input; output: Output }>;
  disableControl: (def: IBlockDefinition, type: ControlDisableType) => void;
  isControlDisabled: (
    def: IBlockDefinition,
    type?: ControlDisableType,
  ) => boolean;
  startMidiConnectionWatcher: () => void;
  stopMidiConnectionWatcher: () => void;
}

export const midiStoreActions: IMidiActions = {
  loadMidi,
  findInputOutput,
  disableControl,
  isControlDisabled,
  startMidiConnectionWatcher,
  stopMidiConnectionWatcher,
};

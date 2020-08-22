import WebMidi, { Input, Output } from "webmidi";
import {
  openDeckManufacturerId,
  ISectionDefinition,
} from "../../../definitions";
import { logger, delay } from "../../../util";
import router from "../../../router";

import { MidiConnectionState, ControlDisableType } from "./interface";
import { midiState } from "./state";
import { isConnected, isConnecting } from "./computed";

// Local states

let loadMidiPromise = (null as unknown) as Promise<void>;

let connectionWatcherTimer = null;

// Helpers

const setConnectionState = (value: MidiConnectionState): void => {
  midiState.connectionState = value;
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
    if (midiState.outputs.length === 1 && !isDevicePageOpen) {
      router.push({
        name: "device",
        params: {
          outputId: midiState.outputs[0].id,
        },
      });
    }
  } catch (err) {
    logger.error("MIDI Connection watcher error", err);
  }

  connectionWatcherTimer = setTimeout(connectionWatcher, 250);
};

const startMidiConnectionWatcher = (): Promise<void> => connectionWatcher();

const stopMidiConnectionWatcher = (): Promise<void> => {
  if (connectionWatcherTimer) {
    clearTimeout(connectionWatcherTimer);
    connectionWatcherTimer = null;
  }
};

export const assignInputs = async (): Promise<void> => {
  midiState.inputs = WebMidi.inputs.filter((input: Input) =>
    input.name.startsWith("OpenDeck"),
  );
  midiState.outputs = WebMidi.outputs.filter((output: Output) =>
    output.name.startsWith("OpenDeck"),
  );
};

// Actions

export const findOutputById = (outputId: string): Output => {
  return WebMidi.outputs.find((output: Output) => output.id === outputId);
};

const pingOutput = async (output: Output, inputs: Inputs[]) => {
  return new Promise((resolve, reject) => {
    let input;

    const handleInitialHandShake = (event: InputEventBase<"sysex">): void => {
      input = event.target;

      inputs.forEach((input: Input) => {
        input.removeListener("sysex", "all");
      });

      resolve({ input, output });
    };

    inputs.forEach((input: Input) => {
      input.removeListener("sysex", "all");
      input.addListener("sysex", "all", handleInitialHandShake);
    });

    // Send HandShake to find which input will reply
    output.sendSysex(openDeckManufacturerId, [0, 0, 1]);

    return delay(250).then(() => reject("TIMED OUT"));
  }).catch(() => pingOutput(output, inputs));
};

export const matchInputOutput = async (
  outputId: string,
): Promise<{ input: Input; output: Output }> => {
  await loadMidi();

  const output = WebMidi.outputs.find((output: Output) => {
    return output.id === outputId;
  });
  if (!output) {
    return delay(250).then(() => matchInputOutput(outputId));
  }

  const inputs = WebMidi.inputs.filter(
    (input: Input) => input.name === output.name,
  );
  if (!inputs.length) {
    return delay(250).then(() => matchInputOutput(outputId));
  }

  return pingOutput(output, inputs);
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
  def: ISectionDefinition,
  type?: ControlDisableType,
): boolean =>
  midiState.disableUiControls.some(
    (d) =>
      d.key === def.key && d.block === def.block && (!type || d.type === type),
  );

const disableControl = (
  def: ISectionDefinition,
  type: ControlDisableType,
): void => {
  const isDisabled = isControlDisabled(def);
  if (!isDisabled) {
    const { block, key } = def;
    midiState.disableUiControls.push({ block, key, type });
  }
};

// Export

export interface IMidiActions {
  loadMidi: () => Promise<void>;
  assignInputs: () => Promise<void>;
  matchInputOutput: (
    outputId: string,
  ) => Promise<{ input: Input; output: Output }>;
  disableControl: (def: ISectionDefinition, type: ControlDisableType) => void;
  isControlDisabled: (
    def: ISectionDefinition,
    type?: ControlDisableType,
  ) => boolean;
  startMidiConnectionWatcher: () => void;
  stopMidiConnectionWatcher: () => void;
}

export const midiStoreActions: IMidiActions = {
  loadMidi,
  matchInputOutput,
  assignInputs,
  findOutputById,
  disableControl,
  isControlDisabled,
  startMidiConnectionWatcher,
  stopMidiConnectionWatcher,
};

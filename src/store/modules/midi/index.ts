import { IMidiState, state } from "./state";
import { midiStoreActions, IMidiActions } from "./actions";
import { midiStoreComputed, IMidiComputed } from "./computed";
import { mapStore, IStore, IMappedStore } from "../../store-util";

export type IMidiStore = IStore<IMidiState, IMidiComputed, IMidiActions>;

export type IMappedMidiStore = IMappedStore<
  IMidiState,
  IMidiComputed,
  IMidiActions
>;

export const midiStore: IMidiStore = {
  state,
  computed: midiStoreComputed,
  actions: midiStoreActions,
};

export const midiStoreMapped = mapStore(midiStore) as IMappedMidiStore;

import { IDeviceState, state } from "./state";
import { deviceStoreActions, IDeviceActions } from "./actions";
import { deviceStoreComputed, IDeviceComputed } from "./computed";
import { mapStore, IStore, IMappedStore } from "../../store-util";

export type IDeviceStore = IStore<
  IDeviceState,
  IDeviceComputed,
  IDeviceActions
>;

export type IMappedDeviceStore = IMappedStore<
  IDeviceState,
  IDeviceComputed,
  IDeviceActions
>;

export const deviceStore: IDeviceStore = {
  state,
  computed: deviceStoreComputed,
  actions: deviceStoreActions,
};

export const deviceStoreMapped = mapStore(deviceStore) as IMappedDeviceStore;

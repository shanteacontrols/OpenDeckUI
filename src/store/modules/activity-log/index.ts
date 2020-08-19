import { IActivityLogState, state } from "./state";
import { activityLogActions, IActivityLogActions } from "./actions";
import { mapStore, IStore, IMappedStore } from "../../store-util";

export type IActivityLog = IStore<IActivityLogState, any, IActivityLogActions>;

export type IMappedActivityLog = IMappedStore<
  IActivityLogState,
  IActivityLogActions
>;

export const activityLog: IActivityLog = {
  state,
  actions: activityLogActions,
};

export const activityLogMapped: IMappedActivityLog = mapStore(activityLog);

export * from "./state";
export * from "./log-type-error";
export * from "./log-type-info";
export * from "./log-type-midi";
export * from "./log-type-request";

import { IRequestLogState, state } from "./state";
import { requestLogActions, IRequestLogActions } from "./actions";
import { mapStore, IStore, IMappedStore } from "../../../util";

export type IRequestLog = IStore<IRequestLogState, any, IRequestLogActions>;

export type IMappedRequestLog = IMappedStore<
  IRequestLogState,
  IRequestLogActions
>;

export const requestLog: IRequestLog = {
  state,
  actions: requestLogActions,
};

export const requestLogMapped: IMappedRequestLog = mapStore(requestLog);

export * from "./state";
export * from "./actions";
export * from "./log-type-error";
export * from "./log-type-info";
export * from "./log-type-midi";
export * from "./log-type-request";

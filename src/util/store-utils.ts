import { ToRefs, Ref, UnwrapRef, toRefs, readonly } from "vue";

/**
 * Make all properties in T readonly
 */
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

declare type UnwrapNestedRefs<T> = T extends Ref ? T : UnwrapRef<T>;

type IStoreState = Record<string, any>;

export interface IStore<S extends IStoreState, C, A> {
  state: S;
  computed: C;
  actions: A;
}

export type IMappedStore<S extends IStoreState, C, A> = ToRefs<
  Readonly<UnwrapNestedRefs<S>>
> &
  C &
  A;

export const mapStore = <S extends IStoreState, C, A>(
  store: IStore<S, C, A>,
): IMappedStore<S, C, A> => {
  return {
    ...toRefs(readonly<S>(store.state)),
    ...store.computed,
    ...store.actions,
  };
};

export const readFromStorage = (key: string): any =>
  JSON.parse(localStorage.getItem(key));

export const saveToStorage = (key: string, value: any): any =>
  localStorage.setItem(key, JSON.stringify(value));

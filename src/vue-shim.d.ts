declare module "*.vue" {
  import { Component } from "vue";
  const _default: Component;
  export default _default;
}

declare interface Dictionary<T> {
  [key: string]: T;
}

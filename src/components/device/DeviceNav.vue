<template>
  <div v-if="isConnected" class="device-nav">
    <DeviceNavItem
      v-for="item in items"
      :key="item.name"
      class="item clearfix"
      :item="item"
      :params="{ outputId }"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { deviceStoreMapped } from "../../store";
import router from "../../router";
import { Block } from "../../definitions";

import DeviceNavItem from "./DeviceNavItem.vue";

const routeLinks: INavItem[] = [
  {
    block: Block.Global,
    title: "Global",
    name: "device-global",
    icon: "global",
  },
  {
    block: Block.Button,
    title: "Button",
    name: "device-buttons",
    icon: "button",
  },
  {
    block: Block.Encoder,
    title: "Encoder",
    name: "device-encoders",
    icon: "encoder",
  },
  {
    block: Block.Analog,
    title: "Analog",
    name: "device-analogs",
    icon: "analog",
  },
  {
    block: Block.Led,
    title: "LED",
    name: "device-leds",
    icon: "led",
  },
  {
    block: Block.Display,
    title: "Display",
    name: "device-displays",
    icon: "display",
  },
];

interface INavItem {
  active?: boolean;
  name: string;
  title: string;
  icon: string;
  count?: number;
  block?: BLOCK;
  to?: RouteLink;
}

export default defineComponent({
  name: "DeviceNav",
  components: {
    DeviceNavItem,
  },
  setup() {
    const items = computed(() => {
      const matched = router.currentRoute.value.matched;
      const setActiveRoute = (routeLink: INavItem): INavItem => ({
        ...routeLink,
        active: matched.some((r) => r.name === routeLink.name),
      });

      return routeLinks.map(setActiveRoute);
    });

    const routeName = computed(() => router.currentRoute.value.name);
    const { outputId, isConnected } = deviceStoreMapped;

    return {
      items,
      isConnected,
      routeName,
      outputId,
    };
  },
});
</script>

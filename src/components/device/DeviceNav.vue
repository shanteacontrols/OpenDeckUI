<template>
  <div
    v-if="isConnected"
    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 xl:grid-cols-1 justify-center capitalize"
  >
    <router-link
      v-for="link in links"
      :key="link.name"
      class="relative block clearfix py-3 lg:w-full lg:text-center xl:text-left text-gray-500 font-bold cursor-pointer"
      :to="{ name: link.name, params: { outputId } }"
      :class="{
        'border-transparent': !link.active,
        'text-yellow-500': link.active,
      }"
    >
      <span class="mx-2 lg:mb-1 lg:block xl:mx-2 xl:inline-block relative">
        <span
          class="inline-block py-1 px-2 md:py-2 bg-gray-800 rounded-full"
          :class="{
            ' bg-yellow-400 text-gray-900': link.active,
          }"
        >
          <Icon
            class="inline-block w-4 h-4 md:w-6 md:h-6 lg:w-7 lg:h-7"
            :icon="link.icon"
          />
        </span>
        <span
          v-if="link.count"
          class="absolute left-0 top-0 -ml-4 lg:ml-5 xl:-ml-4 px-1 py-0 text-xs bg-gray-800 font-medium rounded-full"
          :class="{
            ' bg-yellow-400 text-gray-900': link.active,
          }"
          >{{ link.count }}</span
        >
      </span>
      <span class="lg:inline-block text-sm">
        {{ link.title }}
      </span>
    </router-link>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { deviceStoreMapped } from "../../store";
import router from "../../router";

export default defineComponent({
  name: "DeviceNav",
  setup() {
    const routeName = computed(() => router.currentRoute.value.name);

    const {
      analogInputs,
      buttons,
      LEDs,
      encoders,
      outputId,
      isConnected,
    } = deviceStoreMapped;

    interface IRouteLink {
      active?: boolean;
      name: string;
      title: string;
      icon: string;
      count?: number;
    }
    const links = computed(() => {
      const matched = router.currentRoute.value.matched;

      const setActiveRoute = (routeLink: IRouteLink): IRouteLink => ({
        ...routeLink,
        active: matched.some((r) => r.name === routeLink.name),
      });

      const routeLinks: IRouteLink[] = [
        {
          title: "Global",
          name: "device-global",
          icon: "global",
        },
        {
          title: "Buttons",
          name: "device-buttons",
          icon: "button",
          count: buttons.value,
        },
        {
          title: "Encoders",
          name: "device-encoders",
          icon: "encoder",
          count: encoders.value,
        },
        {
          title: "Analogs",
          name: "device-analogs",
          icon: "analog",
          count: analogInputs.value,
        },
        {
          title: "LEDs",
          name: "device-leds",
          icon: "led",
          count: LEDs.value,
        },
        {
          title: "Displays",
          name: "device-displays",
          icon: "display",
        },
      ];

      return routeLinks.map(setActiveRoute);
    });

    return {
      isConnected,
      links,
      routeName,
      outputId,
    };
  },
});
</script>

<template>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "RouteWrapper",
});
</script>

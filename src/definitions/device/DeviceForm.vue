<template>
  <form class="relative section" novalidate @submit.prevent="">
    <h1 class="w-full section-heading">
      <div class="section-heading-inner flex">
        <router-link class="mr-6" :to="{ name: blockDefinition.routeName }">
          <h2>{{ blockDefinition.pluralTitle || `${blockDefinition.title}s` }}</h2>
        </router-link>
        <span class="mr-6">&rsaquo;</span>
        <div class="mr-6 text-foreground">
          {{ blockDefinition.title }}
          <strong>
            {{ index }}
          </strong>
        </div>
        <div class="hidden md:block md:flex-grow text-right">
          <Siblinks
            param-key="index"
            :current="index"
            :total="numberOfComponents[block]"
            :params="{ outputId }"
          />
        </div>
      </div>
    </h1>

    <SpinnerOverlay v-if="loading" />

    <div class="section-content device-form-content">
      <div
        v-for="group in sectionGroups"
        :key="group.key"
        class="device-form-group"
      >
        <div v-if="group.title" class="device-form-group-heading">
          <h3>{{ group.title }}</h3>
          <p v-if="group.helpText" class="help-text">
            {{ group.helpText }}
          </p>
        </div>

        <div class="form-grid" :class="`lg:grid-cols-${gridCols}`">
          <template v-for="section in group.sections">
            <FormField
              v-if="showField(section)"
              :key="section.key"
              :class="`col-span-${section.colspan || 1}`"
              :value="formData[section.key]"
              :field-definition="section"
              @modified="onValueChange"
            />
          </template>
        </div>
      </div>
    </div>
  </form>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import { SectionType, Block, ISectionDefinition } from "../../definitions";
import { deviceStoreMapped } from "../../store";
import router from "../../router";
import { useDeviceForm } from "../../composables";

interface ISectionGroup {
  key: string;
  title: string;
  helpText?: string;
  sections: ISectionDefinition[];
}

export default defineComponent({
  name: "DeviceForm",
  props: {
    block: {
      required: true,
      type: Number as () => Block,
    },
    gridCols: {
      default: 3,
      type: Number,
    },
  },
  setup(props) {
    const { numberOfComponents, outputId } = deviceStoreMapped;
    const index = computed(() =>
      Number(router.currentRoute.value.params.index),
    );
    const form = useDeviceForm(props.block, SectionType.Value, index);

    const sectionGroups = computed(() =>
      form.sections.reduce((groups: ISectionGroup[], section) => {
        const groupKey = section.sectionGroup?.key || "default";
        let group = groups.find((item) => item.key === groupKey);

        if (!group) {
          group = {
            key: groupKey,
            title: section.sectionGroup?.title || "",
            helpText: section.sectionGroup?.helpText,
            sections: [],
          };
          groups.push(group);
        }

        group.sections.push(section);
        return groups;
      }, []),
    );

    return {
      outputId,
      numberOfComponents,
      index,
      ...form,
      sectionGroups,
    };
  },
});
</script>

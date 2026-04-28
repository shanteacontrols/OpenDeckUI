<template>
  <div
    ref="root"
    :key="keyHash"
    class="form-select-custom mt-1 block w-full max-w-sm"
    :class="{ open: isOpen }"
    @focusout="closeOnFocusOut"
    @keydown="onKeydown"
  >
    <button
      type="button"
      class="form-select-button"
      :aria-expanded="isOpen"
      @click="toggleOpen"
    >
      <span>{{ selectedOption ? selectedOption.text : value }}</span>
      <span class="form-select-chevron"></span>
    </button>
    <ul v-if="isOpen" class="form-select-options" role="listbox">
      <li
        v-for="(opt, idx) in optionsArray"
        :key="idx"
        class="form-select-option"
        :class="{
          highlighted: idx === highlightedIndex,
          selected: opt.value === value,
        }"
        role="option"
        :aria-selected="opt.value === value"
        @mouseenter="highlightedIndex = idx"
        @mousedown.prevent="selectOption(opt)"
      >
        {{ opt.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref } from "vue";
import { IFormSelectOption } from "../../definitions";

export default defineComponent({
  name: "FormSelect",
  props: {
    value: {
      default: "",
      type: [String, Number],
    },
    options: {
      required: true,
      type: [Array as () => Array<IFormSelectOption>, Function],
    },
  },
  setup(props, { emit }) {
    const root = ref<HTMLElement | null>(null);
    const isOpen = ref(false);
    const highlightedIndex = ref(0);

    // Force vue to rerender when options change
    const keyHash = ref(String(props.value));

    const optionsArray = computed<Array<IFormSelectOption>>(() => {
      const opts =
      props.options && typeof props.options === "function"
        ? props.options()
        : props.options;

      keyHash.value = `${String(props.value)}-${opts.map((v) => v.value)}`;

      return opts;
    });

    const selectedIndex = computed(() =>
      optionsArray.value.findIndex((opt) => opt.value === props.value),
    );

    const selectedOption = computed(() =>
      selectedIndex.value >= 0 ? optionsArray.value[selectedIndex.value] : null,
    );

    const open = () => {
      highlightedIndex.value = Math.max(selectedIndex.value, 0);
      isOpen.value = true;
    };

    const close = () => {
      isOpen.value = false;
    };

    const toggleOpen = () => {
      if (isOpen.value) {
        close();
        return;
      }

      open();
    };

    const selectOption = (option: IFormSelectOption) => {
      emit("changed", option.value);
      close();
    };

    const closeOnFocusOut = (event: FocusEvent) => {
      const nextTarget = event.relatedTarget as Node | null;

      if (nextTarget && root.value?.contains(nextTarget)) {
        return;
      }

      close();
    };

    const onKeydown = (event: KeyboardEvent) => {
      if (!optionsArray.value.length) {
        return;
      }

      if (event.key === "ArrowDown") {
        event.preventDefault();
        if (!isOpen.value) {
          open();
          return;
        }

        highlightedIndex.value =
          (highlightedIndex.value + 1) % optionsArray.value.length;
      }

      if (event.key === "ArrowUp") {
        event.preventDefault();
        if (!isOpen.value) {
          open();
          return;
        }

        highlightedIndex.value =
          (highlightedIndex.value - 1 + optionsArray.value.length) %
          optionsArray.value.length;
      }

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        if (!isOpen.value) {
          open();
          return;
        }

        selectOption(optionsArray.value[highlightedIndex.value]);
      }

      if (event.key === "Escape") {
        close();
      }
    };

    return {
      closeOnFocusOut,
      highlightedIndex,
      isOpen,
      keyHash,
      onKeydown,
      optionsArray,
      root,
      selectedOption,
      selectOption,
      toggleOpen,
    };
  },
});
</script>

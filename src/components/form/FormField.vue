<template>
  <div v-if="(!isMsb || showMsbControls)" class="form-field">
    <label
      class="block mb-2 text-sm font-bold"
      :class="{
        'text-gray-600': isDisabled,
        'text-gray-400': !isDisabled,
      }"
    >
      {{
        !showMsbControls && isLsb
          ? label.replace("(LSB)", "").replace("LSB", "")
          : label
      }}
      <small v-if="min || max" class="ml-2 text-gray-700"
        >{{ min }} - {{ max }}</small
      >
    </label>
    <div v-if="!isDisabled">
      <div class="mb-2">
        <component
          :is="fieldComponent"
          :value="input"
          v-bind="componentProps"
          :class="{
            'border-red-500 text-red-500': errors.length,
          }"
          @changed="onValueChange"
        />
      </div>
    </div>
    <p v-else class="text-red-500 text-sm mb-2">
      <template v-if="isFirmwareOld">
        Not supported on current firmware. Consider updating the firmware.
      </template>
      <template v-if="isNotSupported">
        Not supported on this board.
      </template>
    </p>

    <FormErrorDisplay class="text-red-500" :errors="errors" />

    <p
      v-if="helpText"
      class="text-sm leading-5"
      :class="{
        'text-gray-700': isDisabled,
        'text-gray-500': !isDisabled,
      }"
    >
      {{
        !showMsbControls && helpText
          ? helpText.replace("(LSB)", "").replace("LSB", "")
          : helpText
      }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from "vue";
import {
  FormInputComponent,
  IBlockDefinition,
  IBlockSettingDefinition,
} from "../../definitions";
import {
  required,
  minValue,
  maxValue,
  allowedValues,
} from "../../composables/validators";
import useInputValidator from "../../composables/use-input-validator";
import FormSelect from "./FormSelect.vue";
import FormToggle from "./FormToggle.vue";
import FormInput from "./FormInput.vue";
import FormErrorDisplay from "./FormErrorDisplay.vue";
import { midiStoreMapped, deviceStoreMapped } from "../../store";
import { ControlDisableType } from "../../store/modules/midi/state";

const getValidatorForDefinition = (definition: IBlockDefinition) => {
  const validators = [required()] as any[];

  switch (definition.component) {
    case FormInputComponent.Toggle:
      validators.push(minValue(0), maxValue(1));
      break;

    case FormInputComponent.Input:
      if (definition.min !== undefined) {
        validators.push(minValue(definition.min));
      }
      if (definition.max !== undefined) {
        // For newer versions with 2-byte data protocol values can be bigger
        let maxSize =
          definition.isLsb && deviceStoreMapped.showMsbControls
            ? 16383
            : definition.max;
        validators.push(maxValue(maxSize));
      }
      break;

    case FormInputComponent.Select:
      if (definition.options && Array.isArray(definition.options)) {
        validators.push(
          allowedValues(definition.options.map((opt) => opt.value)),
        );
      }
      break;

    default:
      throw new Error(
        `Unknown component type ${definition.component} for ${definition.key}`,
      );
  }

  return validators;
};

export default defineComponent({
  name: "FormField",
  components: {
    FormSelect,
    FormInput,
    FormToggle,
    FormErrorDisplay,
  },
  props: {
    value: {
      default: null,
      type: [String, Number],
    },
    fieldDefinition: {
      type: Object as () => IBlockDefinition,
      required: true,
    },
  },
  emits: ["modified"],
  setup(props, { emit }) {
    const {
      key,
      section,
      label,
      helpText,
      isMsb,
      isLsb,
      min,
      max,
      options,
      onLoad,
    } = toRefs(props.fieldDefinition);

    const settingIndex = (props.fieldDefinition as IBlockSettingDefinition)
      .settingIndex;

    const isNotSupported = computed(() =>
      midiStoreMapped.isControlDisabled(
        props.fieldDefinition,
        ControlDisableType.NotSupported,
      ),
    );
    const isFirmwareOld = computed(() =>
      midiStoreMapped.isControlDisabled(
        props.fieldDefinition,
        ControlDisableType.MissingIndex,
      ),
    );
    const isDisabled = computed(
      () => isFirmwareOld.value || isNotSupported.value,
    );

    const valueRef = toRefs(props).value;
    const validators = getValidatorForDefinition(props.fieldDefinition);
    const valueChangeHandler = (value: any) => {
      if (Number(value) !== valueRef.value) {
        emit("modified", {
          key: key.value,
          value: Number(value),
          section: section.value,
          settingIndex, // defined for settings only
          onLoad, // handles storing value to special store sections (ie active preset)
        });
      }
    };
    const { input, errors, onValueChange } = useInputValidator(
      valueRef,
      validators,
      valueChangeHandler,
    );

    const componentProps = {
      label,
      helpText,
      name: key,
    } as any;

    if (props.fieldDefinition.component === FormInputComponent.Select) {
      componentProps.options =
        typeof options.value === "function" ? computed(options.value) : options;
    }

    return {
      fieldComponent: props.fieldDefinition.component,
      showMsbControls: deviceStoreMapped.showMsbControls,
      componentProps,
      emit,
      input,
      errors,
      onValueChange,
      label,
      helpText,
      isDisabled,
      isNotSupported,
      isFirmwareOld,
      isMsb,
      isLsb,
      min,
      max,
      ...midiStoreMapped,
    };
  },
});
</script>

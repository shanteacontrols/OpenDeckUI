<template>
  <div
    v-if="(!isMsb || showMsbControls)"
    class="form-field"
    :class="{
      error: errors.length,
    }"
  >
    <label class="label">
      {{
        !showMsbControls && isLsb
          ? label.replace("(LSB)", "").replace("LSB", "")
          : label
      }}
      <small v-if="!isDisabled && (min || max)" class="instructions"
        >{{ min }} - {{ (!showMsbControls && max2Byte) || max }}</small
      >
    </label>

    <component
      :is="fieldComponent"
      v-if="!isDisabled"
      :value="input"
      v-bind="componentProps"
      @changed="onValueChange"
    />
    <p v-else class="error-message text-red-500">
      <template v-if="isDisabled === ControlDisableType.NotSupported">
        Not supported on current firmware.
      </template>
      <template v-if="isDisabled === ControlDisableType.MissingIndex">
        Not supported on this board.
      </template>
    </p>

    <p v-if="helpText && !simpleLayout" class="help-text">
      {{
        !showMsbControls && helpText
          ? helpText.replace("(LSB)", "").replace("LSB", "")
          : helpText
      }}
    </p>

    <FormErrorDisplay class="error-message" :errors="errors" />
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from "vue";
import {
  FormInputComponent,
  ISectionDefinition,
  ISectionSetting,
  ControlDisableType,
} from "../../definitions";
import { deviceStoreMapped } from "../../store";
import {
  required,
  minValue,
  maxValue,
  allowedValues,
} from "../../composables/validators";
import { useInputValidator } from "../../composables";
import FormSelect from "./FormSelect.vue";
import FormToggle from "./FormToggle.vue";
import FormInput from "./FormInput.vue";
import FormErrorDisplay from "./FormErrorDisplay.vue";

const getValidatorForDefinition = (definition: ISectionDefinition) => {
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
          definition.max2Byte && deviceStoreMapped.showMsbControls
            ? definition.max2Byte
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
      type: Object as () => ISectionDefinition,
      required: true,
    },
    index: {
      type: Number,
      default: undefined, // Used in table-view
    },
    simpleLayout: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["modified"],
  setup(props, { emit }) {
    const { fieldDefinition } = toRefs(props);
    const {
      component,
      key,
      section,
      label,
      helpText,
      isMsb,
      isLsb,
      min,
      max,
      max2Byte,
      options,
      onLoad,
    } = fieldDefinition.value;

    const settingIndex = (props.fieldDefinition as ISectionSetting)
      .settingIndex;

    const isDisabled = computed(() =>
      deviceStoreMapped.isControlDisabled(props.fieldDefinition),
    );

    const valueRef = toRefs(props).value;
    const validators = getValidatorForDefinition(props.fieldDefinition);
    const valueChangeHandler = (value: any) => {
      if (Number(value) !== valueRef.value) {
        emit("modified", {
          key,
          value: Number(value),
          section,
          settingIndex, // defined for settings only
          index: props.index, // defined for column view only
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

    if (component === FormInputComponent.Select) {
      componentProps.options = options;
    }

    const { showMsbControls } = deviceStoreMapped;

    return {
      fieldComponent: props.fieldDefinition.component,
      showMsbControls,
      componentProps,
      emit,
      input,
      errors,
      onValueChange,
      label,
      helpText,
      isDisabled,
      isMsb,
      isLsb,
      min,
      max,
      max2Byte,
      ControlDisableType,
    };
  },
});
</script>

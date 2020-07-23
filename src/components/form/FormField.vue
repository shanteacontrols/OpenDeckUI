<template>
  <div class="form-field">
    <label class="block mb-2 text-sm text-gray-400 font-bold">
      {{ label }}
    </label>
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

    <FormErrorDisplay class="text-red-500" :errors="errors" />

    <div v-if="helpText" class="text-xs leading-5 text-gray-500">
      {{ helpText }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";
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
        validators.push(maxValue(definition.max));
      }
      break;

    case FormInputComponent.Select:
      if (definition.options) {
        validators.push(
          allowedValues(definition.options.map((opt) => opt.value))
        );
      }
      break;

    default:
      throw new Error(
        `Unknown component type ${definition.component} for ${definition.key}`
      );
      break;
  }

  return validators;
};

export default defineComponent({
  name: "FormField",
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
  setup(props, { emit }) {
    const { key, section, label, helpText } = props.fieldDefinition;

    const settingIndex = (props.fieldDefinition as IBlockSettingDefinition)
      .settingIndex;

    const valueRef = toRefs(props).value;
    const validators = getValidatorForDefinition(props.fieldDefinition);
    const { input, errors, onValueChange } = useInputValidator(
      valueRef,
      validators,
      (value) => {
        if (Number(value) !== valueRef.value) {
          emit("modified", {
            key,
            value: Number(value),
            section,
            settingIndex, // defined for settings only
          });
        }
      }
    );

    const componentProps = {
      label,
      helpText,
      name: key,
    } as any;

    if (props.fieldDefinition.component === FormInputComponent.Select) {
      componentProps.options = props.fieldDefinition.options;
    }

    return {
      fieldComponent: props.fieldDefinition.component,
      componentProps,
      emit,
      key,
      section,
      helpText,
      label,
      input,
      errors,
      onValueChange,
    };
  },
  components: {
    FormSelect,
    FormInput,
    FormToggle,
    FormErrorDisplay,
  },
});
</script>

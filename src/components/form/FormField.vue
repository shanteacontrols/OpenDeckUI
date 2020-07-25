<template>
  <div class="form-field">
    <label
      class="block mb-2 text-sm font-bold"
      :class="{
        'text-gray-600': isDisabled,
        'text-gray-400': !isDisabled,
      }"
    >
      {{ label }}
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
    <p v-else class="text-red-500 text-sm mb-2">Not supported by hardware</p>

    <FormErrorDisplay class="text-red-500" :errors="errors" />

    <div
      v-if="helpText"
      class="text-sm leading-5"
      :class="{
        'text-gray-700': isDisabled,
        'text-gray-500': !isDisabled,
      }"
    >
      {{ helpText }}
    </div>
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
import { midiStoreMapped } from "../../store";

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
    const { block, key, section, label, helpText } = props.fieldDefinition;

    const settingIndex = (props.fieldDefinition as IBlockSettingDefinition)
      .settingIndex;

    const isDisabled = computed(() =>
      midiStoreMapped.isControlDisabled(block, key)
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
        });
      }
    };
    const { input, errors, onValueChange } = useInputValidator(
      valueRef,
      validators,
      valueChangeHandler
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
      isDisabled,
      ...midiStoreMapped,
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

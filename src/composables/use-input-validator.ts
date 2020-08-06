import { ref, Ref, watch } from "vue";
import { validatorInputValue, validator } from "./validators";

type validationAction = (val: validatorInputValue) => void;

interface InputValidatorObject {
  input: Ref<validatorInputValue>;
  errors: Ref<Array<string>>;
  onValueChange: validationAction;
}

const useInputValidator = (
  startValue: Ref<validatorInputValue>,
  validators: validator[],
  onValidChange: validationAction,
): InputValidatorObject => {
  const input = ref(startValue.value);
  const errors = ref<Array<string>>([]);

  const onValueChange = (value: validatorInputValue) => {
    // Update value shown in form
    input.value = value;

    // Validate
    errors.value = (validators || [])
      .map((validator) => validator(value))
      .filter((errorMessage) => !!errorMessage) as Array<string>;

    // If invalid, skip
    if (errors.value.length) {
      return;
    }

    // Call update method
    onValidChange(value);
  };

  // If passed prop changes, update
  watch(startValue, onValueChange);

  return {
    input,
    errors,
    onValueChange,
  };
};

export default useInputValidator;

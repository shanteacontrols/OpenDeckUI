type validateString = (input: string) => string | null;

type validateNumber = (input: number) => string | null;

export const minLength = (min: number): validateString => {
  return (input: string) =>
    input.length < min ? `Value must be at least ${min} characters` : null;
};

export const allowedValues = (allowed: number[]): validateNumber => {
  return (val: string | number) =>
    !allowed.includes(Number(val)) ? `Invalid value ${val}` : null;
};

export const minValue = (min: number): validateNumber => {
  return (val: number) =>
    Number(val) < min ? `Minimum value is ${min}` : null;
};

export const maxValue = (max: number): validateNumber => {
  return (val: number) =>
    Number(val) > max ? `Maximum value is ${max}` : null;
};

export const required = (): validateAny => {
  return (val: any) =>
    val === undefined || val === null ? "Value is required" : null;
};

export const isEmail = (): validateString => {
  const re = /\S+@\S+\.\S+/;
  return (input: string) =>
    re.test(input) ? null : "Must be a valid email address";
};

export type validator = (val: any) => string | null;

export type validatorInputValue = string | number | null;

export type validatorBuilder = (val?: any) => validator;

// export type validator = validateString | validateNumber | validateAny;
export type validateAny = (input: validatorInputValue) => string | null;

export default {
  required,
  minLength,
  minValue,
  maxValue,
  isEmail,
  allowedValues,
};

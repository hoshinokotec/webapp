// validate interface
export interface validate {
  value: string | number;
  required?: boolean;
  minlength?: number;
  maxlength?: number;
  min?: number;
  max?: number;
}

export function validate(validatableInput: validate) {
  let isvalid = true;
  if (validatableInput.required) {
    isvalid = isvalid && validatableInput.value.toString().trim().length !== 0;
  }
  if (
    validatableInput.minlength != null &&
    typeof validatableInput.value === "string"
  ) {
    isvalid =
      isvalid && validatableInput.value.length >= validatableInput.minlength;
  }
  if (
    validatableInput.maxlength != null &&
    typeof validatableInput.value === "string"
  ) {
    isvalid =
      isvalid && validatableInput.value.length <= validatableInput.maxlength;
  }
  if (
    validatableInput.min != null &&
    typeof validatableInput.value === "number"
  ) {
    isvalid = isvalid && validatableInput.value >= validatableInput.min;
  }
  if (
    validatableInput.max != null &&
    typeof validatableInput.value === "number"
  ) {
    isvalid = isvalid && validatableInput.value <= validatableInput.max;
  }
  return isvalid;
}

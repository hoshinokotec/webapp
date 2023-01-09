export function validate(validatableInput) {
    let isvalid = true;
    if (validatableInput.required) {
        isvalid = isvalid && validatableInput.value.toString().trim().length !== 0;
    }
    if (validatableInput.minlength != null &&
        typeof validatableInput.value === "string") {
        isvalid =
            isvalid && validatableInput.value.length >= validatableInput.minlength;
    }
    if (validatableInput.maxlength != null &&
        typeof validatableInput.value === "string") {
        isvalid =
            isvalid && validatableInput.value.length <= validatableInput.maxlength;
    }
    if (validatableInput.min != null &&
        typeof validatableInput.value === "number") {
        isvalid = isvalid && validatableInput.value >= validatableInput.min;
    }
    if (validatableInput.max != null &&
        typeof validatableInput.value === "number") {
        isvalid = isvalid && validatableInput.value <= validatableInput.max;
    }
    return isvalid;
}
//# sourceMappingURL=validater.js.map
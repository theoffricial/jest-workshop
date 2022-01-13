export function sum(a: number, b: number) {
    return a + b;
}

export function divide(a: number, b: number) {
    return a / b;
}

export function throwIfNotANumber(a: any) {
    if (typeof a !== "number") {
        throw new Error("Argument 'a' should be a number");
    }
}

function sum(a, b) {
    return a + b;
}

function divide(a, b) {
    return a / b;
}

function throwIfNotANumber(a) {
    if (typeof a !== "number") {
        throw new Error("Argument 'a' should be a number");
    }
}

module.exports = {
    sum,
    divide,
    throwIfNotANumber
}
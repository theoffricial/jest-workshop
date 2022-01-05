const { divide, sum, throwIfNotANumber } = require("./calculator");


describe("calculator", () => {
    describe(sum.name, () => {

        it("happy path", () => {
            expect(sum(1, 2)).toBe(3);
        })
    });

    describe(divide.name, () => {
        it("happy path", () => {
            expect(divide(2, 2)).toBe(1);
        })

        it("return infinity", () => {
            expect(divide(2, 0)).toBe(Infinity);
        })
    })

    describe(throwIfNotANumber.name, () => {
        it("happy path", () => {
            const nothing = throwIfNotANumber(2);
        })

        it("sad path", () => {
            expect(() => throwIfNotANumber("a")).toThrow();
        })
    })
})
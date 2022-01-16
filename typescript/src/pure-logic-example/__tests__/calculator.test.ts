import { divide, sum, throwIfNotANumber } from "../calculator";


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

    it("should fail because 1 is not equal to 2", () => {
        expect(1).toBe(2);
    })

    it("should fail because 3 is not equal to 4", someNamedFn)
})

function someNamedFn() {
    expect(3).toBe(4);
}
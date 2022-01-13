const { getWorkshopConnection } = require("../../shared/db-setup");
const { saveCalculation } = require("../save-caculation");

const { sum } = require("../../pure-logic-example/calculator")

jest.setTimeout(30000);

jest.mock("../../shared/db-setup")

// , () => {
//     return jest.genMockFromModule("../../shared/db-setup")
// });


describe("save-calculation", () => {
    const actualDbSetup = jest.requireActual("../../shared/db-setup");
    beforeAll(async () => {
        try {

            await actualDbSetup.dbSetup();
            await actualDbSetup.dbSeed();
        } catch (e) {

        }
    })

    afterAll(async () => {
        try {

            const res = await actualDbSetup.dbCleanUp().catch(e => {
                console.error(e)
            });
        } catch (e) { }
    })

    it("should save calculation successfully", async () => {
        getWorkshopConnection.mockResolvedValueOnce({ model: () => ({ create: async () => 42 }) })
        const conn = await getWorkshopConnection();
        const result = await saveCalculation(conn, sum, 12, 12);

        expect(result).toBe(42);
        // expect(result.action).toBe("sum(12, 12)")
        // expect(result.result).toBe(24);
    })

    it("should add new action of sum(2,7)", async () => {
        const conn = await actualDbSetup.getWorkshopConnection();
        const result = await saveCalculation(conn, sum, 2, 7);

        expect(result.action).toBe("sum(2, 7)")
        expect(result.result).toBe(9)
        // .toEqual({ "__v": 0, "_createdAt": "2022-01-10T20:05:30.531Z", "_id": "61dc918aa748031e31ffadbc", "action": "sum(12, 12)", "actionName": "sum", "result": 24 });
    })
})
import { getWorkshopConnection } from "../../shared/db-setup";
import { saveCalculation } from "../save-caculation";
import { createMock } from 'ts-jest-mock'
import { sum } from "../../pure-logic-example/calculator";
jest.setTimeout(30000);

jest.mock("../../shared/db-setup")

// , () => {
//     return jest.genMockFromModule("../../shared/db-setup")
// });


describe("save-calculation", () => {
    const actualDbSetup = jest.requireActual("../../shared/db-setup");

    const mockedGetWorkshopConnection = createMock(getWorkshopConnection);

    beforeAll(async () => {
        await actualDbSetup.dbSetup();
        await actualDbSetup.dbSeed();
    })

    afterAll(async () => {
        const res = await actualDbSetup.dbCleanUp().catch((e: any) => {
            console.error(e)
        });
    })

    it("should save calculation successfully", async () => {
        mockedGetWorkshopConnection.mockResolvedValueOnce({ model: () => ({ create: async () => 42 }) } as any)
        const conn = await getWorkshopConnection();
        const result = await saveCalculation(conn, sum, 12, 12);

        expect(result).toBe(42);
        // expect(result.action).toBe("sum(12, 12)")
        // expect(result.result).toBe(24);
    })

    it("should add new action of sum(2,7)", async () => {
        const conn = await actualDbSetup.getWorkshopConnection();
        const result = await saveCalculation(conn, sum, 2, 7) as any;

        expect(result.action).toBe("sum(2, 7)")
        expect(result.result).toBe(9)
        // .toEqual({ "__v": 0, "_createdAt": "2022-01-10T20:05:30.531Z", "_id": "61dc918aa748031e31ffadbc", "action": "sum(12, 12)", "actionName": "sum", "result": 24 });
    })
})
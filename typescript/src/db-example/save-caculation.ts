import mongoose from "mongoose";
import { workshopDbClose } from "../shared/db-setup";
import { sum } from "../pure-logic-example/calculator";
import { getConnectionModel } from "../shared/model";

export async function saveCalculation(connection: mongoose.Connection, action: (...args: any) => {}, numA: number, numB: number) {
    try {
        const { Calculation } = await getConnectionModel(connection);

        const result = await Calculation.create({
            actionName: sum.name,
            action: `${action.name}(${numA}, ${numB})`,
            result: action(numA, numB),
            _createdAt: new Date(),
        })

        return result;

    } catch (e) {
        console.error(e);
    } finally {
        workshopDbClose();
    }

}


// saveCalculation();

// module.exports = {
//     saveCalculation,
// }

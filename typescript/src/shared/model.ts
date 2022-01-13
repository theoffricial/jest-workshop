import mongoose from "mongoose";
import { DB_WORKSHOP_CONSTANTS } from "./db.constants";

// setup schema & model
const calculationSchema = new mongoose.Schema({
    actionName: String,
    action: String,
    result: Number,
    _createdAt: Date
});


export function getConnectionModel(connection: mongoose.Connection) {
    const Calculation = connection.model('Calculation', calculationSchema, DB_WORKSHOP_CONSTANTS.calculationCollection);
    return { Calculation };
}


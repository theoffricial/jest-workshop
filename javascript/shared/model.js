const mongoose = require("mongoose");
const { DB_WORKSHOP_CONSTANTS } = require("./db.constants");

// setup schema & model
const calculationSchema = new mongoose.Schema({
    actionName: String,
    action: String,
    result: Number,
    _createdAt: Date
});

/**
 * 
 * @param {mongoose.Connection} connection 
 */
module.exports.getConnectionModel = (connection) => {
    const Calculation = connection.model('Calculation', calculationSchema, DB_WORKSHOP_CONSTANTS.calculationCollection);
    return { Calculation };
}

// module.exports.Calculation = mongoose.model('Calculation', calculationSchema, DB_WORKSHOP_CONSTANTS.calculationCollection);


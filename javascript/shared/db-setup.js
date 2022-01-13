const mongoose = require("mongoose");

const { DB_WORKSHOP_CONSTANTS } = require('./db.constants')
const { getConnectionModel } = require("./model");
const { divide, sum, throwIfNotANumber } = require("../pure-logic-example/calculator");


let workshopConnection;
let adminConnection;
let adminMongooseConn;

async function dbSetup() {
    // connect
    const adminConn = await getAdminConnection();
    const adminDb = adminConn.db;
    const workshopDb = adminConn.useDb(DB_WORKSHOP_CONSTANTS.workshopDbName);


    // remove assets or ignore
    const removeUserResponse = await adminDb.removeUser(DB_WORKSHOP_CONSTANTS.user, { dbName: DB_WORKSHOP_CONSTANTS.workshopDbName }).catch(e => e);

    const dropCollectionResponse = await workshopDb.dropCollection(DB_WORKSHOP_CONSTANTS.calculationCollection).catch(e => e);

    const dropDbResponse = adminConn.dropDatabase(DB_WORKSHOP_CONSTANTS.workshopDbName).catch(e => e);

    // add db assets
    const userCreationRes = await adminDb.addUser(
        DB_WORKSHOP_CONSTANTS.user,
        DB_WORKSHOP_CONSTANTS.pass,
        // See: https://docs.mongodb.com/manual/reference/built-in-roles/
        {

            dbName: DB_WORKSHOP_CONSTANTS.workshopDbName,
            roles: [
                { role: 'readWrite', db: DB_WORKSHOP_CONSTANTS.workshopDbName },
                { role: 'dbAdmin', db: DB_WORKSHOP_CONSTANTS.workshopDbName }
            ],
            comment: "User for the jest-workshop only."
        }
    );

    const collection = await workshopDb.createCollection(DB_WORKSHOP_CONSTANTS.calculationCollection);
}

async function getWorkshopConnection() {
    if (workshopConnection) {
        return workshopConnection;
    }

    const connection = await mongoose.createConnection(
        DB_WORKSHOP_CONSTANTS.workshopConnString,
        {
            appName: "jest-workshop-javascript",
            dbName: DB_WORKSHOP_CONSTANTS.workshopDbName,
            user: DB_WORKSHOP_CONSTANTS.user,
            pass: DB_WORKSHOP_CONSTANTS.pass,
            auth: {
                username: DB_WORKSHOP_CONSTANTS.user,
                password: DB_WORKSHOP_CONSTANTS.pass
            },
            authSource: DB_WORKSHOP_CONSTANTS.workshopDbName,
            w: "majority",
        });

    workshopConnection = connection;
    connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    return connection;
}

async function getAdminConnection() {
    if (adminConnection) {
        return adminConnection;
    }
    const adminConn = await mongoose.connect(DB_WORKSHOP_CONSTANTS.adminConnString, {
        dbName: DB_WORKSHOP_CONSTANTS.adminDbName,
        w: "majority",
        // w: 0,

    });
    adminConn.connection.on('error', function (err) {
        console.log('Mongoose default connection error: ' + err);
    });

    adminConnection = adminConn.connection;
    adminMongooseConn = adminConn;

    return adminConn.connection;
}

/**
 * 
 * @param {mongoose.Connection} connection 
 */
async function dbSeed() {
    const connection = await getWorkshopConnection();
    const { Calculation } = getConnectionModel(connection);
    const result = await Calculation.create({
        actionName: sum.name,
        action: "sum(1, 1)",
        result: sum(1, 1),
        _createdAt: new Date(),
    });

    const result2 = await Calculation.create({
        actionName: divide.name,
        action: "divide(6, 3)",
        result: divide(6, 3),
        _createdAt: new Date(),
    });
}

async function dbCleanSeed() {
    const connection = await getWorkshopConnection();
    const { Calculation } = getConnectionModel(connection);
    const delResult = await Calculation.deleteOne({ action: 'sum' }, { limit: 1 });
}

async function dbCleanUp() {
    const adminConn = await getAdminConnection();
    const adminDb = adminConn.db;
    const workshopDb = adminConn.useDb(DB_WORKSHOP_CONSTANTS.workshopDbName);

    const removeUserResponse = await adminDb.removeUser(DB_WORKSHOP_CONSTANTS.user, { dbName: DB_WORKSHOP_CONSTANTS.workshopDbName }).catch(e => e);

    const dropCollectionResponse = await workshopDb.dropCollection(DB_WORKSHOP_CONSTANTS.calculationCollection).catch(e => e);

    const dropDbResponse = adminConn.dropDatabase(DB_WORKSHOP_CONSTANTS.workshopDbName).catch(e => e);

    await Promise.all([
        workshopDbClose(),
        adminDbClose()
    ]);

}

async function adminDbClose() {
    await adminMongooseConn.disconnect();
    adminConnection.close();
    adminConnection = undefined;
}

async function workshopDbClose() {
    // workshopConnection.close();
    await workshopConnection.close(true)
    workshopConnection = undefined;
}

module.exports = {
    dbCleanUp,
    dbCleanSeed,
    dbSeed,
    dbSetup,
    getAdminConnection,
    getWorkshopConnection,
    adminDbClose,
    workshopDbClose,
}
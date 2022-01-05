const mongoose = require("mongoose");
const { MongoClient } = require("mongodb");
const { sum } = require("../pure-logic-example/calculator");

async function saveCalculation() {
    try {
        // const client = new MongoClient("mongodb://root:example@127.0.0.1:27017", { connectTimeoutMS: 1000, socketTimeoutMS: 1000 });
        // const connection = await client.connect();
        // console.log(connection);
        const jestWorkshopUser = "jest-workshop-user";
        const jestWorkshopPassword = "jest-workshop-password-1234";
        const jestWorkshopDb = 'jest-db';
        const adminConnection = await mongoose.connect("mongodb://root:example@127.0.0.1:27017", { dbName: "admin", maxPoolSize: 2 });
        const calculationCollection = "calculations";


        const adminDatabase = adminConnection.connection.db;
        try {
            // const db = adminConnection.useDb(jestWorkshopDb);
            const removeUserRes = await adminDatabase.removeUser(jestWorkshopUser, { dbName: jestWorkshopDb });
        } catch (e) {
            console.error(e);
        }
        try {
            const dropCollectionRes = await adminConnection.connection.useDb(jestWorkshopDb).dropCollection(calculationCollection);
        } catch (error) {
            console.error(error);
        }
        try {
            // const adminDb = adminConnection.connection.useDb("admin").dropDatabase;
            adminConnection.connection.dropDatabase(jestWorkshopDb).catch(e => {
                console.error(e)
            });
        } catch (error) {
            console.error(error);
        }

        const userCreationRes = await adminConnection.connection.db.addUser(
            jestWorkshopUser,
            jestWorkshopPassword,
            // See: https://docs.mongodb.com/manual/reference/built-in-roles/
            {

                dbName: jestWorkshopDb,
                roles: [{ role: 'readWrite', db: jestWorkshopDb }, { role: 'dbAdmin', db: jestWorkshopDb }],
                comment: "User for the jest-workshop only."
            }
        );

        // throw new Error('bla');
        // const db = await adminConnection.connection.useDb(jestWorkshopDb);
        // connection.
        const collection = await adminConnection.connection.useDb(jestWorkshopDb).createCollection(calculationCollection);

        // adminConnection.connection.db.admin()

        await adminConnection.disconnect();

        await adminConnection.connection.close(true);
        // await adminConnection.disconnect();
        // await mongoose.connections[0].close(true);

        console.log(mongoose.connections.length);
        const connection = await mongoose.createConnection(
            `mongodb://${jestWorkshopUser}:${jestWorkshopPassword}@127.0.0.1:27017/${jestWorkshopDb}`,
            {
                maxPoolSize: 2,
                appName: "jest-workshop-javascript",
                dbName: jestWorkshopDb,
                user: jestWorkshopUser,
                pass: jestWorkshopPassword,
                auth: {
                    username: jestWorkshopUser,
                    password: jestWorkshopPassword
                },
                authSource: jestWorkshopDb,
                w: 'majority',
            });

        // setup schema & model
        const calculationSchema = new mongoose.Schema({
            action: String,
            result: Number,
            _createdAt: Date
        });

        const Calculation = connection.model('Calculation', calculationSchema, calculationCollection);
        // const calculationModel = new Calculation({
        //     action: 'sum',
        //     result: sum(2, 7),
        //     _createdAt: new Date(),
        // })

        // creates
        console.log(1)
        const result = await Calculation.create({
            action: 'sum',
            result: sum(2, 7),
            _createdAt: new Date(),
        });
        // const result = await calculationModel.save();


        // deletes
        const delResult = await Calculation.deleteOne({ action: 'sum' }, { limit: 1 });

        // drop collection
        const dropCollectionRes = await connection.dropCollection(calculationCollection);

        try {

            // drop databse
            const dropDbRes = await connection.connection.dropDatabase(jestWorkshopDb);
        } catch (error) {
            console.error(error);
        }

        await connection.close(true);

        console.log("Done!");
    } catch (e) {
        console.error(e);
    }

}


saveCalculation();
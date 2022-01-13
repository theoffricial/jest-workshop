const WORKSHOP_USER = "jest-workshop-user";
const WORKSHOP_PASS = "jest-workshop-password-1234";
const WORKSHOP_DB_NAME = 'jest-db';
const ADMIN_DB_NAME = 'admin';
const ADMIN_CONN_STRING = "mongodb://root:example@127.0.0.1:27017";
const CALCULATION_COLLECTION = "calculations";

export const DB_WORKSHOP_CONSTANTS = {
    user: WORKSHOP_USER,
    pass: WORKSHOP_PASS,
    workshopDbName: WORKSHOP_DB_NAME,
    adminDbName: ADMIN_DB_NAME,
    adminConnString: ADMIN_CONN_STRING,
    workshopConnString: `mongodb://${WORKSHOP_USER}:${WORKSHOP_PASS}@127.0.0.1:27017/${WORKSHOP_DB_NAME}`,
    calculationCollection: CALCULATION_COLLECTION,
}

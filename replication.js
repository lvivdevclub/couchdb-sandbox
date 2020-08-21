const COUCHDB1_URL = 'http://admin:password@localhost:5984';
const COUCHDB2_URL = 'http://admin:password@localhost:5984';
const nano = require('nano')(COUCHDB1_URL);
const nano2 = require('nano')(COUCHDB2_URL);
const DB_NAME = 'test';
const DB2_NAME = 'test2';

async function init() {
    const [dbs, dbs2] = await Promise.all([
        nano.db.list(),
        nano2.db.list()
    ]);
    console.log('dbs', dbs);
    await Promise.all([
        createIfNotExists(nano, dbs, DB_NAME),
        createIfNotExists(nano, dbs, '_users'),
        createIfNotExists(nano, dbs, '_replicator'),
        createIfNotExists(nano2, dbs2, DB2_NAME),
        createIfNotExists(nano2, dbs2, '_users'),
        createIfNotExists(nano2, dbs2, '_replicator')
    ]);
}

// async function testCRUD() {
//     const db = nano.use(DB_NAME);
//     const insertResult = await db.insert({testField: 'test1'});
//     console.log('insertResult', insertResult);
//     const getResult = await db.get(insertResult.id);
//     console.log('getResult', getResult);
//     const updateResult = await db.insert({_id: insertResult.id, _rev: insertResult.rev, testField: 'test2'});
//     console.log('updateResult', updateResult);
//     const getResultAfterUpdate = await db.get(insertResult.id);
//     console.log('getResultAfterUpdate', getResultAfterUpdate);
//     const destroyResult = await db.destroy(getResultAfterUpdate._id, getResultAfterUpdate._rev);
//     console.log('destroyResult', destroyResult);
//     const fetchRevsResult = await db.fetchRevs({keys: [getResultAfterUpdate._id]});
//     console.log('fetchRevsResult', util.inspect(fetchRevsResult, false, null));
// }
async function test() {
    await init();
    await replicate();
}

async function createIfNotExists(client, dbs, dbName) {
    if (dbs.includes(dbName)) return;
    await client.db.create(dbName);
}

test();

async function replicate() {
    const db1 = nano.use(DB_NAME);
    const db2 = nano2.use(DB2_NAME);
    const insertResult = await db1.insert({testField: 'test1'});
    console.log('insertResult', insertResult);
    const replicationResult = await nano.db.replicate(DB_NAME, `${COUCHDB2_URL}/${DB2_NAME}`, {create_target: true});
    console.log('replicationResult', replicationResult);

    const updateResult2 = await db2.insert({_id: insertResult.id, _rev: insertResult.rev, testField: 'test3'});
    console.log('updateResult db2', updateResult2);

    const updateResult1 = await db1.insert({_id: insertResult.id, _rev: insertResult.rev, testField: 'test2'});
    console.log('updateResult db1', updateResult1);

    const replicationResult2 = await nano.db.replicate(DB_NAME, `${COUCHDB2_URL}/${DB2_NAME}`, {create_target: true});
    console.log('replicationResult db => db2', replicationResult2);

    const getResultAfterUpdate = await db2.get(insertResult.id);
    console.log('getResultAfterReplicate db2', getResultAfterUpdate);
}
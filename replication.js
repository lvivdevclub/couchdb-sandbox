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
    const db = nano.use(DB_NAME);
    const insertResult = await db.insert({testField: 'test1'});
    console.log('insertResult', insertResult);
    const replicationResult = await nano2.db.replicate(DB_NAME, `${COUCHDB2_URL}/${DB2_NAME}`, {create_target: true});
    console.log('replicationResult', replicationResult);
}
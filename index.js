const nano = require('nano')('http://admin:password@localhost:5984');
const util = require('util');
const DB_NAME = 'test';

async function init() {
    const dbs = await nano.db.list();
    console.log('dbs', dbs);
    if (dbs.includes(DB_NAME)) return;
    await nano.db.create(DB_NAME);
}

async function test() {
    await init();
    await testCRUD();
    await clear();
}

async function testCRUD() {
    const db = nano.use(DB_NAME);
    const insertResult = await db.insert({testField: 'test1'});
    console.log('insertResult', insertResult);
    const getResult = await db.get(insertResult.id);
    console.log('getResult', getResult);
    const updateResult = await db.insert({_id: insertResult.id, _rev: insertResult.rev, testField: 'test2'});
    console.log('updateResult', updateResult);
    const getResultAfterUpdate = await db.get(insertResult.id);
    console.log('getResultAfterUpdate', getResultAfterUpdate);
    const destroyResult = await db.destroy(getResultAfterUpdate._id, getResultAfterUpdate._rev);
    console.log('destroyResult', destroyResult);
    const fetchRevsResult = await db.fetchRevs({keys: [getResultAfterUpdate._id]});
    console.log('fetchRevsResult', util.inspect(fetchRevsResult, false, null));
}

async function clear() {
    await nano.db.destroy(DB_NAME);
}

test();
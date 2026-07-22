const { v4: uuidv4 } = require('uuid');

let db = null;

function getDb() {
  if (!db) {
    db = require('../../data/seed.js').seed();
  }
  return db;
}

function generateId() {
  return uuidv4();
}

function now() {
  return new Date().toISOString();
}

function findById(collection, id) {
  return getDb()[collection].find(item => String(item.id) === String(id));
}

function findAll(collection, filterFn) {
  const items = getDb()[collection];
  if (!filterFn) return items;
  return items.filter(filterFn);
}

function create(collection, data) {
  const item = {
    ...data,
    id: data.id || generateId(),
    created_at: data.created_at || now(),
    updated_at: now(),
  };
  getDb()[collection].push(item);
  return item;
}

function update(collection, id, data) {
  const items = getDb()[collection];
  const index = items.findIndex(item => String(item.id) === String(id));
  if (index === -1) return null;
  items[index] = { ...items[index], ...data, updated_at: now() };
  return items[index];
}

function remove(collection, id) {
  const items = getDb()[collection];
  const index = items.findIndex(item => String(item.id) === String(id));
  if (index === -1) return false;
  items.splice(index, 1);
  return true;
}

function count(collection, filterFn) {
  return findAll(collection, filterFn).length;
}

module.exports = {
  getDb,
  generateId,
  now,
  findById,
  findAll,
  create,
  update,
  remove,
  count,
};

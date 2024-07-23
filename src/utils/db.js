const { QuickDB } = require('quick.db');

const db = new QuickDB({ filePath: './economy.db' });

module.exports = db;

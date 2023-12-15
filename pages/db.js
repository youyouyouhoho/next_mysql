// db.js

const mysql = require('serverless-mysql');

export const db = mysql({
  config: {
    host: '127.0.0.1',
    database: 'graduation_defense_test_1205',
    user: 'ex_username',
    password: '823543',
  },
});

export default db;

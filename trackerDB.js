const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Exeter$556',
  database: 'trackerDB',
});

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId}`);
  connection.end();
});
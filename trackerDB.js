const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Exeter$556',
  database: 'trackerDB',
});

const queryDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, name }) => {
      console.log(`${id} | ${name}`);
    });
    console.log('----------------------------------------');
  });
};

const queryRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, title, salary }) => {
      console.log(`${id} | ${title} | ${salary}`);
    });
    console.log('----------------------------------------');
  });
};

const queryEmployees = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name }) => {
      console.log(`${id} | ${first_name} | ${last_name}`);
    });
    console.log('----------------------------------------');
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId}`);
  queryDepartments();
  queryRoles();
  queryEmployees();
  connection.end();
});

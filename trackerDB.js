const mysql = require('mysql');
const inquirer = require('inquirer');

const connection = mysql.createConnection({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Exeter$556',
  database: 'trackerDB',
});

const start = () => {
  inquirer
    .prompt({
      name: 'action',
      type: 'list',
      message: 'What would you like to do?',
      choices: [
        'View All Employees',
        'View All Roles',
        'View All Departments',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View All Employees':
          queryEmployees();
          break;
        case 'View All Roles':
          queryRoles();
          break;
        case 'View All Departments':
          queryDepartments();
          break;
        case 'Exit':
          connection.end();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          break;
      }
    });
};

const queryDepartments = () => {
  connection.query('SELECT * FROM department', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, name }) => {
      console.log(`${id} | ${name}`);
    });
    console.log('----------------------------------------');
    start();
  });
};

const queryRoles = () => {
  connection.query('SELECT * FROM role', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, title, salary }) => {
      console.log(`${id} | ${title} | ${salary}`);
    });
    console.log('----------------------------------------');
    start();
  });
};

const queryEmployees = () => {
  connection.query('SELECT * FROM employee', (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name }) => {
      console.log(`${id} | ${first_name} | ${last_name}`);
    });
    console.log('----------------------------------------');
    start();
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId}`);
  start();
});

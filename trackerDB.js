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
        'Add Role',
        'View All Departments',
        'Add Department',
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
        case 'Add Department':
          addDepartment();
          break;
        case 'Add Role':
          addRole();
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

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: 'name',
        type: 'input',
        message: 'What department would you like to add?',
      },
    ])
    .then((answer) => {
      connection.query(
        'INSERT INTO department SET ?',
        {
          name: answer.name,
        },
        (err) => {
          if (err) throw err;
          console.log('Your department was created successfully!');
          start();
        }
      );
    });
};

const addRole = () => {
  connection.query('SELECT * FROM department', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'title',
          type: 'input',
          message: 'What role would you like to add?',
        },
        {
          name: 'salary',
          type: 'input',
          message: 'How much is the salary for the role?',
        },
        {
          name: 'department_id',
          type: 'list',
          choices() {
            const choiceArray = [];
            results.forEach(({ name }) => {
              choiceArray.push(name);
            });
            return choiceArray;
          },
          message: 'What department does the role belong to?',
        },
      ])
      .then((answer) => {
        let chosenItem;
        results.forEach((item) => {
          if (item.name === answer.department_id) {
            chosenItem = item;
          }
        });
        connection.query(
          'INSERT INTO role SET ?',
          {
            title: answer.title,
            salary: answer.salary,
            department_id: chosenItem.id,
          },
          (err) => {
            if (err) throw err;
            console.log('Your role was created successfully!');
            start();
          }
        );
      });
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId}`);
  start();
});

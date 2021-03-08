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
        'Add Employee',
        'View All Roles',
        'Add Role',
        'Update Role',
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
        case 'Add Employee':
          addEmployee();
          break;
        case 'Update Role':
          updateRole();
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

const addEmployee = () => {
  connection.query('SELECT * FROM role', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'first_name',
          type: 'input',
          message: "What is the employee's first name?",
        },
        {
          name: 'last_name',
          type: 'input',
          message: "What is the employee's last name?",
        },
        {
          name: 'roleTitle',
          type: 'list',
          choices() {
            const choiceArray = [];
            results.forEach(({ title }) => {
              choiceArray.push(title);
            });
            return choiceArray;
          },
          message: "What is the employee's role?",
        },
      ])
      .then((answer) => {
        const firstName = answer.first_name;
        const lastName = answer.last_name;
        let chosenRole;
        results.forEach((item) => {
          if (item.title === answer.roleTitle) {
            chosenRole = item;
          }
        });
        connection.query('SELECT * FROM employee', (err, results) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: 'managerName',
                type: 'list',
                choices() {
                  const choiceArray = ["None"];
                  results.forEach(({ first_name, last_name }) => {
                    choiceArray.push(`${first_name} ${last_name}`);
                  });
                  return choiceArray;
                },
                message: "Who is the employee's manager?",
              },
            ])
            .then((answer) => {
              let chosenManager;
              if ("None" === answer.managerName) {
                chosenManager = {};
              } else {
                results.forEach((item) => {
                  if (`${item.first_name} ${item.last_name}` === answer.managerName) {
                    chosenManager = item;
                  }
                });
              }
              connection.query(
                'INSERT INTO employee SET ?',
                {
                  first_name: firstName,
                  last_name: lastName,
                  role_id: chosenRole.id,
                  manager_id: chosenManager.id,
                },
                (err) => {
                  if (err) throw err;
                  console.log('Your employee was created successfully!');
                  start();
                }
              );
            });
        });
      });
  });
};

const updateRole = () => {
  connection.query('SELECT * FROM employee', (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: 'employeeName',
          type: 'list',
          choices() {
            const choiceArray = [];
            results.forEach(({ first_name, last_name }) => {
              choiceArray.push(`${first_name} ${last_name}`);
            });
            return choiceArray;
          },
          message: "Which employee would you like to update?",
        },
      ])
      .then((answer) => {
        let chosenEmployee;
        results.forEach((item) => {
          if (`${item.first_name} ${item.last_name}` === answer.employeeName) {
            chosenEmployee = item;
          }
        });
        connection.query('SELECT * FROM role', (err, results) => {
          if (err) throw err;
          inquirer
            .prompt([
              {
                name: 'roleTitle',
                type: 'list',
                choices() {
                  const choiceArray = [];
                  results.forEach(({ title }) => {
                    choiceArray.push(title);
                  });
                  return choiceArray;
                },
                message: "What is the employee's new role?",
              },
            ])
            .then((answer) => {
              let chosenRole;
              results.forEach((item) => {
                if (item.title === answer.roleTitle) {
                  chosenRole = item;
                }
              });
              connection.query(
                'UPDATE employee SET ? WHERE ?',
                [
                  {
                    role_id: chosenRole.id,
                  },
                  {
                    id: chosenEmployee.id,
                  },
                ],
                (err) => {
                  if (err) throw err;
                  console.log("The employee's role was updated successfully!");
                  start();
                }
              );
            });
        });
      });
  });
};

connection.connect((err) => {
  if (err) throw err;
  console.log(`Connected as id ${connection.threadId}`);
  start();
});

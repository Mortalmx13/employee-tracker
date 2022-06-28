const mysql = require('mysql2');
const inquirer = require('inquirer');
require('console.table');

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employeeTracker_db'
  },
  console.log(`Connected to the employeeTracker_db database.`)
);

const fn = {
    viewAllDepartments() {
    db.query('SELECT * FROM students', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  viewAllRoles() {
    db.query('SELECT * FROM students WHERE enrolled = 1', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  viewAllEmployees() {
    db.query(`SELECT employee.id,CONCAT(employee.first_name," ", employee.last_name) AS name.employee,
    AS name.role.title AS role,
    CONCAT(manager.first_name," ", manager.last_name) AS name.manager,
    LEFT JOIN role ON employee.role_id = role.id,
    LEFT JOIN employee manager ON employee.manager_id = manager.id;
     `,
       (err, results) =>{
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  addADepartment(name) {
    const department = name.trim();
     db.query('INSERT INTO department (name) VALUES (?)',  
     (err, results) => {
      if (err) return console.error(err);
      console.log(`Added ${department}  to departments!`); 
      return init();
    });
  },
  addARole() {
    db.query('SELECT * FROM students', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  addAnEmployee() {
    db.query('SELECT * FROM students', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  updateAnEmployeeRole() {
    db.query('SELECT * FROM students', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  exit() {
    process.exit();
  },
};

const init = () => {
  const choices = [
    { name: 'View all Departments', value: 'viewAllDepartments' },
    { name: 'View all Roles', value: 'viewAllRoles' },
    { name: 'View all Employees', value: 'viewAllEmployees' },
    { name: 'Add a Department', value: 'addADepartment' },
    { name: 'Add a Role', value: 'addARole' },
    { name: 'Add an Employee', value: 'addAnEmployee' },
    { name: 'Update an Employee role', value: 'updateAnEmployeeRole' },
    { name: 'Exit', value: 'exit' },
  ];

  inquirer.prompt([
    {
      type: 'rawlist',
      name: 'query',
      message: 'What option would you like to select?',
      choices,
    }
  ]).then((answers) => fn[answers.query]());
};

init();
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
    db.query('SELECT * FROM department', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  viewAllRoles() {
    db.query('SELECT * FROM role', function (err, results) {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  viewAllEmployees() {
    db.query(`SELECT e.id,CONCAT(e.first_name," ", e.last_name) AS name,
     role.title AS role,
    CONCAT(m.first_name," ", m.last_name) AS manager_name,
    LEFT JOIN role ON e.role_id = role.id,
    LEFT JOIN e manager ON e.manager_id = m.id;
     `,
       (err, results) =>{
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  addADepartment(name) {
    const department = name.trim();
     db.query('INSERT INTO department (name) VALUES (?)',department,  
     (err, results) => {
      if (err) return console.error(err);
      console.log(`Added ${department}  to departments!`); 
      return init();
    });
  },
  addARole(answers) {
    const title = answers.title.trim();
    const salary = parseInt(answers.salary.trim());
    const id = parseInt(answers.department);
    db.query('INSERT INTO role(title, salary, department_id) VALUES(?,?,?)', [salary, id],
    (err, results) => {
      if (err) return console.error(err);
      console.log(`Added ${title} to roles`);
      return init();
    });
  },

addManager(roles){
db.query(`SELECT id, firrst_name, last_name FROM employee WHERE manager_id IS NULL`,
(err, results) => {
if (err) return console.error(err);
      const managers = [{name: "none", value:null}];
      results.forEach((person) => managers.push({name: person.first_name + ' ' + person.last_name}))
      return this.promptAddEmployee(roles, managers);
})
},

//prompts the user to inter the new aspect of the new employee
promptAddEmployee(roles,managers){
    inquirer.prompt([
    {
        type: 'input', name: 'fistName',message: "What is the employee's first name?",
        validate: addFirst => {
              if (addFirst) { return true; }
                else {
                  console.log('Please enter a first name');
                  return false;
              }
            }
          },
          {
        type: 'input',name: 'lastName',message: "What is the employee's last name?",
        validate: addLast => {
              if (addLast) {return true;} 
              else {
                console.log('Please enter a last name');
                return false;
              }
            }
          },
          {
            type: 'list',name: 'role',message: "What is the employees role?",choices: roles,
            validate: role => {
                  if (role) {return true;} 
                  else {
                    console.log('enter a role');
                    return false;
                  }
                }
              },
              {
                type: 'input',name: 'lastName',message: "Who is the employees manager?",choices: managers,
            
                      
                    
                  },
        ])
        .then((answers)=> this.addAnEmployee(answers))
        .catch((err)=> console.log(err))
},



//add a new employee to the table
  addAnEmployee(answers) {

    const first = answers.first.trim();
    const last = answers.last.trim();
    const roleId = parseInt(answers.role);
    const managerId = parseInt(answers.manager);
    db.query('INSERT INTO employee (first_name, last_name, role_id, manager_id', 
    (err, results) =>{
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
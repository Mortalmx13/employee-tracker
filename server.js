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
    //used to view the diffeent departments
    viewAllDepartments() {
    db.query('SELECT * FROM department',  (err, results) => {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  //used to see the roles which inclues title, salary, department_id
  viewAllRoles() {
    db.query(`SELECT role.id, role.title,  department.name AS department, role.salary FROM department
    LEFT JOIN role ON role.department_id = department.id
    `, 
     (err, results) => {
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  //for viewing all employees and all the diffeent aspects
  viewAllEmployees() {
    db.query(`SELECT e.id
    ,CONCAT(e.first_name," ", e.last_name) AS name,
     role.title AS title, department.name AS department,role.salary,
     CONCAT(m.first_name," ", m.last_name) AS manager
     FROM employee e
    LEFT JOIN role ON  role.id = e.role_id 
    LEFT JOIN department ON role.department_id = department.id
     LEFT JOIN employee m ON e.manager_id = m.id `,

       (err, results) =>{
      if (err) return console.error(err);
      console.table(results);
      return init();
    });
  },
  //function for adding a new department
  addADepartment() {
    inquirer.prompt([
        {
            type: 'input', name: 'adddepartment',message: "What is the name of the department?",
            validate: adddepartment => {
                  if (adddepartment) { return true; }
                    else {
                      console.log('Please enter a department');
                      return false;
                  }
                }
              },
            ])
    .then(answers => {
        console.log(answers)
     var sql = `INSERT INTO department (name)
     VALUES (?)`;
     db.query(sql, answers.adddepartment, 
     (err, results) => {
      if (err) return console.error(err);
      console.log('Added '+ answers.adddepartment + ' to departments!'); 
      return init();
    });
    })
  },


//function for addeing a new role
  addARole()  {
    //get the list of all department with department_id to make the choices object list for prompt question
    const departments = [];
    db.query("SELECT * FROM DEPARTMENT", (err, results) => {
        if (err) return console.error(err);
  
      results.forEach(dep => {
        let obj = {
          name: dep.name,
          value: dep.id
        }
        departments.push(obj);
      });
  
      //question list to get arguments for making new roles
      let questions = [
        {
          type: "input",name: "addtitle ",message: "What is the title of the new role?"
        },
        {
          type: "input",name: "addsalary ",message: "What is the salary of the new role?"
        },
        {
          type: "list",name: "department",choices: departments,message: "Which department is this role in?"
        }
      ];
  
      inquirer.prompt(questions)
      .then(response => {
        const query = `INSERT INTO ROLE (title, salary, department_id) VALUES (?)`;
        db.query(query, [[response.addtitle , response.addsalary , response.department]], (err, results) => {
            if (err) return console.error(err);
          console.log(`Successfully inserted ${response.addtitle } role at id ${results.insertId}`);
        return init();
        });
      })
      .catch(err => {
        if (err) return console.error(err);
      });
     
    });
    
  },

// addManager(roles){
// db.query(`SELECT id, firrst_name, last_name FROM employee WHERE manager_id IS NULL`,
// (err, results) => {
// if (err) return console.error(err);
//       const managers = [{name: "none", value:null}];
//       results.forEach((person) => managers.push({name: person.first_name + ' ' + person.last_name}))
//       return this.promptAddEmployee(roles, managers);
// })
// },



//add a new employee to the table
  addAnEmployee() {


db.query("SELECT * FROM EMPLOYEE", (err, emplRes) => {
    if (err) throw err;
    const managers = [
      {
        name: 'None',
        value: 0
      }
    ]; //an employee could have no manager
    emplRes.forEach(({ first_name, last_name, id }) => {
        managers.push({
        name: first_name + " " + last_name,
        value: id
      });
    });
    
    //get all the role list to make choice of employee's role
    db.query("SELECT * FROM ROLE", (err, rolRes) => {
      if (err) throw err;
      const roles = [];
      rolRes.forEach(({ title, id }) => {
        roles.push({
          name: title,
          value: id
          });
        });



   let questions =[
    {
        type: 'input', name: 'first_name',message: "What is the employee's first name?",
    },
    {
        type: 'input',name: 'last_name',message: "What is the employee's last name?",
    },
    {
        type: 'list',name: 'role_id',message: "What is the employees role?",choices: roles,
    },
    {
        type: 'list',name: 'manager_id',message: "Who is the employees manager?",choices: managers,
    }
   ]






   inquirer.prompt(questions)
   .then(answer => {
     const query = `INSERT INTO EMPLOYEE (first_name, last_name, role_id, manager_id) VALUES (?)`;
     let manager_id = answer.manager_id !== 0? answer.manager_id: null;
     db.query(query, [
        [
            answer.first_name,
            answer.last_name, 
            answer.role_id,
            manager_id
            ]],
         (err, results) => {
        if (err) return console.error(err);
       console.log(`successfully inserted employee ${answer.first_name} ${answer.last_name} with id ${results.insertId}`);
       return init();
     });
   })
   .catch(err => {
     console.error(err);
   });
})
})

},





exit() {
    process.exit();
  }
}




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
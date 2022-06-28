/* PROVIDED BY INSTRUCTOR */
DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;
/* department table */
CREATE TABLE department (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,PRIMARY KEY(id),
  name VARCHAR(30) NOT NULL,
);

/* employee table */
CREATE TABLE employee (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,PRIMARY KEY(id),
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER(11) NOT NULL,
  INDEX role_ind (role_id),
  CONSTRANT fk_role FOREIGN KEY(role_id) REFERENCES role(id) ON DELETE CASCADE,
  manager_id INTEGER(11),
  manager_id INTEGER(11),
  INDEX man_ind (manager_id),
  CONSTRANT fk_manager FOREIGN KEY(manager_id) REFERENCES employee(id) ON DELETE SET NULL
);
/* table for roles */
CREATE TABLE role (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,PRIMARY KEY(id),
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
department_id INTEGER(11) NOT NULL,
INDEX dep_ind (department_id),
CONSTRANT fk_department FOREIGN KEY(department_id) REFERENCES department(id) ON DELETE CASCADE
);
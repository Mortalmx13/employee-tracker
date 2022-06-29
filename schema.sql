/* PROVIDED BY INSTRUCTOR */
DROP DATABASE IF EXISTS employeeTracker_db;
CREATE DATABASE employeeTracker_db;

USE employeeTracker_db;
/* department table */
CREATE TABLE department (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,PRIMARY KEY(id),
  name VARCHAR(30) NOT NULL
);
/* table for roles */
CREATE TABLE role (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,PRIMARY KEY(id),
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10,2) NOT NULL,
department_id INTEGER(11) NOT NULL

);

/* employee table */
CREATE TABLE employee (
  id INTEGER(11) AUTO_INCREMENT NOT NULL,PRIMARY KEY(id),
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INTEGER(11) NOT NULL,
  manager_id INTEGER(11)
);
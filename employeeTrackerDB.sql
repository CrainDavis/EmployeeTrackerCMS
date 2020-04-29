DROP DATABASE IF EXISTS employeeTrackerDB;

CREATE DATABASE employeeTrackerDB;

USE employeeTrackerDB;

CREATE TABLE departments(
	id INT NOT NULL AUTO_INCREMENT,
	department VARCHAR(30) NOT NULL,
    
	PRIMARY KEY (id)
);

CREATE TABLE roles(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INT,
    
	PRIMARY KEY (id),
    
    FOREIGN KEY(department_id) REFERENCES departments(id)
);

CREATE TABLE employees(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT,
    
    PRIMARY KEY (id),
    
    FOREIGN KEY(role_id) REFERENCES roles(id),
    FOREIGN KEY(manager_id) REFERENCES employees(id)
);

-- ==============================================================================

-- create the departments
INSERT INTO departments (department) VALUES 
("Administration"), 
("Employee Resources"), 
("Distribution"), 
("Design & Marketing"), 
("Store Operations");

-- create the roles in each department
INSERT INTO roles (title, salary, department_id) VALUES 
("Chief Executive Officer", 1000000, 1), -- 1

("Chief of Finance", 700000, 1), -- 1
("Chief of Distribution", 450000, 1), -- 1
("Chief of Production", 620000, 1), -- 1
("Chief of Retail", 360000, 1), -- 1

("Head of Employment", 180000, 2), -- 1
("Accountant", 76000, 2), -- 3
("HR Generalist", 40000, 2), -- 3

("Distribution Director", 80000, 3), -- 3
("Distribution Operator", 23000, 3), -- 6

("Head of Production", 50000, 4), -- 1
("Creative Designer", 50000, 4), -- 3
("Marketing Specialist", 65000, 4), -- 3

("Store Director", 85000, 5), -- 3
("Store Clerk", 20000, 5), -- 5
("Customer Service Rep", 32000, 5); -- 6

-- create the CEO (has no manager)
INSERT INTO employees (first_name, last_name, role_id) VALUES 
("Andrew", "Buchanan", 1);

-- create the other employees (all have a manager)
INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES 
("Ora", "Evans", 2, 1), -- 2
("Jill", "Vega", 3, 1), -- 3
("Luther", "Carr", 4, 1), -- 4
("Winifred", "Rogers", 5, 1), -- 5

("Ron", "Clark", 6, 2), -- 6
("Todd", "Carter", 7, 6), -- 7
("Donald", "Christensen", 7, 6), -- 8
("Ismael", "Rivera", 7, 6), -- 9
("Rosie", "Rowe", 8, 6), -- 10
("Herbert", "Hampton", 8, 6), -- 11
("Sue", "Gray", 8, 6), -- 12

("Donald", "Alvarez", 9, 3), -- 13
("Melvin", "Gregory", 9, 3), -- 14
("Corey", "Walton", 9, 3), -- 15

("Terry", "Shaw", 10, 13), -- 16
("Jack", "Miller", 10, 13), -- 17
("Simon", "Barnes", 10, 14), -- 18
("Russell", "Knight", 10, 14), -- 19
("Nicole", "Daniels", 10, 15), -- 20
("Francis", "Mason", 10, 15), -- 21

("Luke", "Johnson", 11, 4), -- 22
("Jeannette", "Love", 12, 22), -- 23
("Welsey", "Poole", 12, 22), -- 24
("Paulette", "Becker", 12, 22), -- 25
("Randolph", "Massey", 13, 22), -- 26
("Vincent", "Goodwin", 13, 22), -- 27
("Carol", "Sanchez", 13, 22), -- 28

("Wendy", "Brooks", 14, 5), -- 29
("Shawn", "Carlson", 14, 5), -- 30
("Spencer", "Green", 14, 5), -- 31

("Brad", "Sharp", 15, 29), -- 32
("Cody", "Norris", 15, 29), -- 33
("Jeffrey", "Barker", 15, 30), -- 34
("Jon", "Reyes", 15, 30), -- 35
("Bernard", "Klein", 15, 31), -- 36
("Bradley", "Sullivan", 16, 29), -- 37
("Violet", "Ortega", 16, 30), -- 38
("Phyllis", "Carpenter", 16, 31), -- 39
("Clayton", "Moran", 16, 31); -- 40

-- ==============================================================================

SELECT * FROM departments;

SELECT * FROM roles;

SELECT * FROM employees;

-- ==============================================================================

SELECT roles.id, roles.title, roles.salary, departments.department 
FROM roles
INNER JOIN departments ON roles.department_id = departments.id;

-- ==============================================================================

SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary, 
CONCAT(mgr.first_name, ' ', mgr.last_name) AS manager
FROM employees AS mgr
RIGHT JOIN employees ON mgr.id = employees.manager_id
LEFT JOIN roles ON employees.role_id = roles.id
LEFT JOIN departments ON roles.department_id = departments.id;
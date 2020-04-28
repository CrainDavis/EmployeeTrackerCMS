// =======================================================================================
// SET UP
// =======================================================================================

// dependencies
const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

// establish connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "r00tPa$$",
    database: "employeeTracker_db"
});

connection.connect(function (err) {
    if (err) throw err;
    mainAction();
});

// =======================================================================================
// MAIN ACTION SELECTION
// =======================================================================================

function mainAction() {
    inquirer.prompt([
        {
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "View All Departments",
                "View All Roles",
                "View All Employees",
                "Add Department",
                "Add Role",
                "Add Employee",
                "Update Employee Role",
                "Update Employee Manager",
                "View Employees by Manager",
                "Delete Department",
                "Delete Role",
                "Delete Employee",
                "View Total Utilized Budget of a Department",
                "EXIT"
            ]
        }
    ]).then(function (answer) {
        if (answer.action === "View All Departments") {
            viewAllDepartments();
        } else if (answer.action === "View All Roles") {
            viewAllRoles();
        } else if (answer.action === "View All Employees") {
            viewAllEmployees();
        } else if (answer.action === "Add Department") {
            addDepartment();
        } else if (answer.action === "Add Role") {
            addRole();
        } else if (answer.action === "Add Employee") {
            addEmployee();
        } else if (answer.action === "Update Employee Role") {
            updateEmployeeRole();
        } else if (answer.action === "Update Employee Manager") {
            updateEmployeeManager();
        } else if (answer.action === "View Employees by Manager") {
            viewEmployeesByManager();
        } else if (answer.action === "Delete Department") {
            deleteDepartment();
        } else if (answer.action === "Delete Role") {
            deleteRole();
        } else if (answer.action === "Delete Employee") {
            deleteEmployee();
        } else if (answer.action === "View Total Utilized Budget of a Department") {
            viewDepartmentBudget();
        } else {
            connection.end(); // if user selects "EXIT"
        };
    });
};

// =======================================================================================
// GET ALL DEPARTMENTS, ROLES, EMPLOYEES, & MANAGERS --> array
// =======================================================================================

var getFunctions = {
    getDepartments: function (cb) {
        connection.query("SELECT department FROM departments", function (err, res) {
            var departmentsArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                departmentsArray.push(res[i].department);
            };
            // console.log(departmentsArray);
            cb(departmentsArray);
        });
    },

    getRoles: function (cb) {
        connection.query("SELECT title FROM roles", function (err, res) {
            var rolesArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                rolesArray.push(res[i].title);
            };
            // console.log(rolesArray);
            cb(rolesArray);
        });
    },

    getEmployees: function (cb) {
        connection.query(`SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS full_names FROM employees`, function (err, res) {
            var employeesArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                employeesArray.push(res[i].full_names);
            };
            // console.log(employeesArray);
            cb(employeesArray);
        });
    },

    getManagers: function (cb) {
        connection.query(`
        SELECT CONCAT (employees.first_name, ' ', employees.last_name) AS manager_names
        FROM employees
        JOIN roles ON employees.role_id = roles.id
        WHERE (roles.title = "Chief Executive Officer") OR (roles.title = "Chief of Finance") OR (roles.title = "Chief of Distribution") OR (roles.title = "Chief of Production") OR (roles.title = "Chief of Retail") OR (roles.title = "Head of Employment") OR (roles.title = "Distribution Director") OR (roles.title = "Head of Production") OR (roles.title = "Store Director")
        ORDER BY employees.id ASC`, function (err, res) {
            var managerNamesArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                managerNamesArray.push(res[i].manager_names);
            }
            // console.log(managerNamesArray);
            cb(managerNamesArray);
        })
    }
};

// =======================================================================================
// VALIDATE USER INPUT (for appropriate string length or use of numbers)
// =======================================================================================

// =======================================================================================
// FUNCTIONS FOR ALL ACTIONS
// =======================================================================================

function viewAllDepartments() {
    connection.query(`SELECT * FROM departments`, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------");
        mainAction();
    })
};

// ---------------------------------------------------------------------------------------

function viewAllRoles() {
    connection.query(`
    SELECT roles.id, roles.title, roles.salary, departments.department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------");
        mainAction();
    })
};

// ---------------------------------------------------------------------------------------

function viewAllEmployees() {
    connection.query(`
    SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.department, roles.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employees AS manager
    RIGHT JOIN employees ON manager.id = employees.manager_id
    LEFT JOIN roles ON employees.role_id = roles.id
    LEFT JOIN departments ON roles.department_id = departments.id;`, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("-----------------------");
        mainAction();
    })
};

// ---------------------------------------------------------------------------------------

function addDepartment() {};

// ---------------------------------------------------------------------------------------

function addRole() {};

// ---------------------------------------------------------------------------------------

function addEmployee() {};

// ---------------------------------------------------------------------------------------

function updateEmployeeRole() {};

// ---------------------------------------------------------------------------------------

function updateEmployeeManager() {};

// ---------------------------------------------------------------------------------------

function viewEmployeesByManager() {};

// ---------------------------------------------------------------------------------------

function deleteDepartment() {};

// ---------------------------------------------------------------------------------------

function deleteRole() {};

// ---------------------------------------------------------------------------------------

function deleteEmployee() {};

// ---------------------------------------------------------------------------------------

function viewDepartmentBudget() {};
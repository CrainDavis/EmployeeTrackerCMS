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

// =======================================================================================
// VALIDATE USER INPUT (for appropriate string length or use of numbers)
// =======================================================================================

// =======================================================================================
// FUNCTIONS FOR ALL ACTIONS
// =======================================================================================

function viewAllDepartments() {};

// ---------------------------------------------------------------------------------------

function viewAllRoles() {};

// ---------------------------------------------------------------------------------------

function viewAllEmployees() {};

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
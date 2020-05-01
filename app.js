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
    database: "employeeTrackerDB"
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
    getDepartments: function (arr) {
        connection.query("SELECT name FROM department", function (err, res) {
            var departmentsArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                departmentsArray.push(res[i].name);
            };
            // console.log(departmentsArray);
            arr(departmentsArray);
        });
    },

    getRoles: function (arr) {
        connection.query("SELECT title FROM role", function (err, res) {
            var rolesArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                rolesArray.push(res[i].title);
            };
            // console.log(rolesArray);
            arr(rolesArray);
        });
    },

    getEmployees: function (arr) {
        connection.query(`SELECT CONCAT (employee.first_name, ' ', employee.last_name) AS full_name FROM employee`, function (err, res) {
            var employeesArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                employeesArray.push(res[i].full_name);
            };
            // console.log(employeesArray);
            arr(employeesArray);
        });
    },

    getManagers: function (arr) {
        connection.query(`
        SELECT CONCAT (employee.first_name, ' ', employee.last_name) AS manager_name
        FROM employee
        JOIN role ON employee.role_id = role.id
        WHERE (role.title = "Chief Executive Officer") OR (role.title = "Chief of Finance") OR 
        (role.title = "Chief of Distribution") OR (role.title = "Chief of Production") OR 
        (role.title = "Chief of Retail") OR (role.title = "Head of Employment") OR 
        (role.title = "Distribution Director") OR (role.title = "Head of Production") OR 
        (role.title = "Store Director")
        ORDER BY employee.id ASC`, function (err, res) {
            var managerNamesArray = [];
            if (err) throw err;
            for (var i = 0; i < res.length; i++) {
                managerNamesArray.push(res[i].manager_name);
            }
            // console.log(managerNamesArray);
            arr(managerNamesArray);
        })
    }
};

// =======================================================================================
// VALIDATE USER INPUT (for appropriate string length or use of numbers)
// =======================================================================================

function validateInput(input) {
    if (input.length > 30 || input.length < 1) {
        return "input must be between 1 and 30 characters";
    }
    return true;
};

function validateNumber(number) {
    var reg = /^\d+$/;
    return reg.test(number) || "enter a NUMBER"
};

// =======================================================================================
// FUNCTIONS FOR ALL ACTIONS
// =======================================================================================

function viewAllDepartments() {
    connection.query(`SELECT * FROM department`, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("----------------------------------------------");
        mainAction();
    })
};

// ---------------------------------------------------------------------------------------

function viewAllRoles() {
    connection.query(`
    SELECT role.id, role.title, role.salary, department.name
    FROM role
    INNER JOIN department ON role.department_id = department.id`, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("----------------------------------------------");
        mainAction();
    })
};

// ---------------------------------------------------------------------------------------

function viewAllEmployees() {
    connection.query(`
    SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name, role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee AS manager
    RIGHT JOIN employee ON manager.id = employee.manager_id
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN department ON role.department_id = department.id;`, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log("----------------------------------------------");
        mainAction();
    })
};

// ---------------------------------------------------------------------------------------

function addDepartment() {
    inquirer.prompt([
        {
            name: "name",
            type: "input",
            message: "enter the NAME of the DEPARTMENT to be added",
            validate: validateInput
        }
    ]).then(function (answer) {
        connection.query("INSERT INTO department SET ?",
            {
                name: answer.name
            },
            function (err, res) {
                if (err) throw err;
                console.log("the " + answer.name + " Department has been added");
                console.log("----------------------------------------------");
                mainAction();
            });
    });
};

// ---------------------------------------------------------------------------------------

function addRole() {
    getFunctions.getDepartments(function (result) {
        var departmentNames = result;
        inquirer.prompt([
            {
                name: "title",
                type: "input",
                message: "enter the ROLE to be added",
                validate: validateInput
            },
            {
                name: "salary",
                type: "input",
                message: "enter the SALARY of the new ROLE",
                validate: validateNumber
            },
            {
                name: "department",
                type: "list",
                message: "select which DEPARTMENT the new role is in",
                choices: departmentNames
            }
        ]).then(function (answers) {
            connection.query("SELECT id FROM department WHERE ?",
                { name: answers.department },
                function (err, department) {
                    if (err) throw err;
                    connection.query(`
                    INSERT INTO role (title, salary, department_id) 
                    VALUES ("${answers.title}", "${answers.salary}", "${department[0].id}")`,
                        function (err1, res1) {
                            if (err1) throw err1;
                            console.log("the role of " + answers.title + " with a salary of $" + answers.salary + " has been added to the " + answers.department + " Department");
                            console.log("----------------------------------------------");
                            mainAction();
                        });
                });
        });
    })
};

// ---------------------------------------------------------------------------------------

function addEmployee() {
    getFunctions.getRoles(function(result) {
        var rolesList = result;
        getFunctions.getManagers(function(result) {
            var managersList = result;
            inquirer.prompt([
                {
                    name: "firstName",
                    type: "input",
                    message: "enter the new employee's FIRST NAME",
                    validate: validateInput
                },
                {
                    name: "lastName",
                    type: "input",
                    message: "enter the new employee's LAST NAME",
                    validate: validateInput
                },
                {
                    name: "role",
                    type: "list",
                    message: "select the new employee's ROLE",
                    choices: rolesList
                },
                {
                    name: "manager",
                    type: "list",
                    message: "select the new employee's MANAGER",
                    choices: managersList
                }
            ]).then(function(answers) {
                connection.query("SELECT id FROM role WHERE ?", { title: answers.role }, function(err, roleId) {
                    if (err) throw err;
                    var managerFirstName = answers.manager.split(' ').slice(0, -1).join(' ');
                    var managerLastName = answers.manager.split(' ').slice(-1).join(' ');
                    connection.query("SELECT id FROM employee WHERE ? AND ?", [{ first_name: managerFirstName }, { last_name: managerLastName }], function(err, managerId) {
                        if (err) throw err;
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) 
                        VALUES ("${answers.firstName}", "${answers.lastName}", ${roleId[0].id}, ${managerId[0].id})`, function(err, res) {
                            if (err) throw err;
                            console.log(answers.firstName + " " + answers.lastName + " officially works as a(n) " + answers.role);
                            console.log("----------------------------------------------");
                            mainAction();
                        });
                    });
                });
            });
        });
    });
};

// ---------------------------------------------------------------------------------------

function updateEmployeeRole() {
    getFunctions.getEmployees(function(result) {
        var employeesList = result;
        getFunctions.getRoles(function(result) {
            var rolesList = result;
            inquirer.prompt([
                {
                    name: "name",
                    type: "list",
                    message: "select EMPLOYEE to change role of",
                    choices: employeesList
                },
                {
                    name: "title",
                    type: "list",
                    message: "select the employee's NEW ROLE",
                    choices: rolesList
                }
            ]).then(function(answers) {
                var firstName = answers.name.split(' ').slice(0, -1).join(' ');
                var lastName = answers.name.split(' ').slice(-1).join(' ');
                connection.query("SELECT id FROM role WHERE ?", {title:answers.title}, function(err, res) {
                    if (err) throw err;
                    connection.query("UPDATE employee SET ? WHERE ? AND ?", [{role_id:res[0].id}, {first_name:firstName}, {last_name:lastName}], function(err, res) {
                        if (err) throw err;
                        console.log(answers.name + "'s role successfully updated to " + answers.title);
                        console.log("----------------------------------------------");
                        mainAction();
                    });
                });
            });
        });
    });
};

// ---------------------------------------------------------------------------------------

function updateEmployeeManager() {
    getFunctions.getEmployees(function(result) {
        var employeesList = result;
        getFunctions.getManagers(function(result) {
            var managersList = result;
            inquirer.prompt([
                {
                    name: "employee",
                    type: "list",
                    message: "select EMPLOYEE that is changing managers",
                    choices: employeesList
                },
                {
                    name: "manager",
                    type: "list",
                    message: "select the employee's NEW MANAGER",
                    choices: managersList
                }
            ]).then(function(answers) {
                var managerFirstName = answers.manager.split(' ').slice(0, -1).join(' ');
                var managerLastName = answers.manager.split(' ').slice(-1).join(' ');
                var employeeFirstName = answers.employee.split(' ').slice(0, -1).join(' ');
                var employeeLastName = answers.employee.split(' ').slice(-1).join(' ');
                connection.query("SELECT id FROM employee WHERE ? AND ?", [{first_name:managerFirstName}, {last_name:managerLastName}], function(err, res) {
                    if (err) throw err;
                    connection.query("UPDATE employee SET ? WHERE ? AND ?", [{manager_id:res[0].id}, {first_name:employeeFirstName}, {last_name:employeeLastName}], function(err, res) {
                        if (err) throw err;
                        console.log(answers.employee + "'s manager has been updated to " + answers.manager);
                        console.log("----------------------------------------------");
                        mainAction();
                    });
                });
            });
        });
    });
};

// ---------------------------------------------------------------------------------------

var viewRelation = {
    managersSubordinates: function(manager_name, arr) {
        connection.query(`
        SELECT CONCAT(first_name, ' ', last_name) AS subordinates 
        FROM employee WHERE manager_id 
        IN (SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = ?)`, manager_name, function(err, res) {
            if (err) throw err;
            arr(res);
        });
    }
}; 

function viewEmployeesByManager() {
    getFunctions.getManagers(function(result) {
        var managersList = result;
        inquirer.prompt([
            {
                name: "manager",
                type: "list",
                message: "select a MANAGER to view employees working under them",
                choices: managersList
            }
        ]).then(function(answers) {
            viewRelation.managersSubordinates(answers.manager, function(result) {
                console.log("all employees working under " + answers.manager + ":\n");
                console.table(result);
                console.log("----------------------------------------------");
                mainAction();
            });
        });
    });
};

// ---------------------------------------------------------------------------------------

function deleteDepartment() {
    getFunctions.getDepartments(function(result) {
        var departmentsList = result;
        inquirer.prompt([
            {
                name: "departmentName",
                type: "list",
                message: "select DEPARTMENT to remove",
                choices: departmentsList
            }
        ]).then(function(answers) {
            connection.query("DELETE FROM department WHERE ?", {name:answers.departmentName}, function(err, res) {
                if (err) throw err;
                console.log("the " + answers.departmentName + " Department has been removed");
                console.log("----------------------------------------------");
                mainAction();
            });
        });
    });
};

// ---------------------------------------------------------------------------------------

function deleteRole() {
    getFunctions.getRoles(function(result) {
        var rolesList = result;
        inquirer.prompt([
            {
                name: "roleTitle",
                type: "list",
                message: "select ROLE to remove",
                choices: rolesList
            }
        ]).then(function(answers) {
            connection.query("DELETE FROM role WHERE ?", {title:answers.roleTitle}, function(err, res) {
                if (err) throw err;
                console.log("the role of " + answers.roleTitle + " has been removed");
                console.log("----------------------------------------------");
                mainAction();
            })
        })
    })
};

// ---------------------------------------------------------------------------------------

function deleteEmployee() {
    getFunctions.getEmployees(function(result) {
        var employeesList = result;
        inquirer.prompt([
            {
                name: "employeeName",
                type: "list",
                message: "select EMPLOYEE to remove",
                choices: employeesList
            }
        ]).then(function(answers) {
            var employeeFirstName = answers.employeeName.split(' ').slice(0, -1).join(' ');
            var employeeLastName = answers.employeeName.split(' ').slice(-1).join(' ');
            connection.query("DELETE FROM employee WHERE ? AND ?", [{first_name:employeeFirstName}, {last_name:employeeLastName}], function(err, res) {
                if (err) throw err;
                console.log(answers.employeeName + " has been removed");
                console.log("----------------------------------------------");
                mainAction();
            });
        });
    });
};

// ---------------------------------------------------------------------------------------

function viewDepartmentBudget() {
    getFunctions.getDepartments(function(result) {
        var departmentsList = result;
        inquirer.prompt([
            {
                name: "depName",
                type: "list",
                message: "select DEPARTMENT to view budget",
                choices: departmentsList
            }
        ]).then(function(answers) {
            connection.query(`
            SELECT name, SUM(salary) AS 'utilized_budget'
            FROM employee, role, department
            WHERE employee.role_id = role.id AND role.department_id = department.id AND department.name = ?`, answers.depName, function(err, res) {
                if (err) throw err;
                console.table(res);
                console.log("----------------------------------------------");
                mainAction();
            });
        });
    });
};
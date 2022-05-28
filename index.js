const inquirer = require('inquirer');
const db = require('./db/connection');
require('console.table');

const next_choices = [
    'view all departments', 
    'view all roles', 
    'view all employees', 
    'add a department', 
    'add a role', 
    'add an employee', 
    'update an employee role',
]

const promptNext = () => {
    return inquirer.prompt([
      {
        type: 'list',
        name: 'nextChoice',
        message: 'Choose an option',
        choices: next_choices
      },      
    ]).then(choice => { 
        switch(choice.nextChoice){
            case 'view all departments':
                sql = `SELECT id, d_name AS department FROM departments;`;
                db.promise().query(sql)
                .then(([rows,fields]) => {
                    console.table(rows);
                })
                .catch(console.log)
                .then( () => {promptNext();}); 
                break; 
            case 'view all roles':     
                sql = `SELECT title, roles.id, departments.d_name AS department, salary FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id;`;
                db.promise().query(sql)
                .then(([rows,fields]) => {
                    console.table(rows);
                })
                .catch(console.log)
                .then( () => {promptNext();});  
                break;
            case 'view all employees':     
                sql = `SELECT 
                employee.id,
                employee.first_name,
                employee.last_name,
                roles.title,
                departments.d_name AS department,
                roles.salary,
                CONCAT(manager.first_name,' ', manager.last_name) AS manager
                FROM employees employee
                LEFT JOIN roles ON employee.role_id = roles.id
                LEFT JOIN departments ON roles.department_id = departments.id
                LEFT JOIN employees manager ON employee.manager_id = manager.id
                ORDER BY department_id, employee.role_id;`;
                db.promise().query(sql)
                .then(([rows,fields]) => {
                    console.table(rows);
                })
                .catch(console.log)
                .then( () => {promptNext();});  
                break;
            case 'add a department': 
                let depName = "";
                addDepartment().then(input => {
                    depName = input.name;
                    sql = `INSERT INTO departments (d_name) VALUES (?)`;   
                    db.promise().query(sql, depName)
                    .then(() => console.log(`Added ${depName} to the database`))
                    .catch(console.log)
                    .then( () => {promptNext();});                   
                });
                break;
            case 'add a role':     
                let deps = [], depIDs = [], roleName = "";
                sql = `SELECT id, d_name FROM departments;`;
                db.promise().query(sql)
                .then(([rows,fields]) => {                 
                    rows.forEach(row => {
                        deps.push(row.d_name);
                        depIDs.push(row.id);
                    });
                })
                .then(() => addRole(deps))
                .then(input => {
                    roleName = input.name;
                    let depID = depIDs[deps.indexOf(input.department)];
                    let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
                    let params = [roleName, input.salary, depID];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`Added ${roleName} to the database`))
                .catch(console.log)
                .then( () => {promptNext();});                
                break;
            case 'add an employee':   
                let roles = [], roleIDs = [], managers = [], managerIDs = [], employeeName = "";
                let sqlRole = `SELECT id, title FROM roles;`;
                let sqlManager = `SELECT id, CONCAT(first_name,' ', last_name) AS manager FROM employees
                WHERE manager_id IS NULL;`;
                db.promise().query(sqlRole)
                .then(([rows,fields]) => {                 
                    rows.forEach(row => {
                        roles.push(row.title);
                        roleIDs.push(row.id);
                    });
                }).then(() => db.promise().query(sqlManager))
                .then(([rows,fields]) => {                 
                    rows.forEach(row => {
                        managers.push(row.manager);
                        managerIDs.push(row.id);
                    });
                })
                .then(() => addEmployee(roles, managers))
                .then(input => {
                    employeeName = input.first_name + " " + input.last_name;
                    let roleID = roleIDs[roles.indexOf(input.role)];
                    let managerID = managerIDs[managers.indexOf(input.manager)];
                    let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                    VALUES (?, ?, ?, ?);`;
                    let params = [input.first_name, input.last_name, roleID, managerID];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`Added ${employeeName} to the database`))
                .catch(console.log)
                .then( () => {promptNext();}); 
                break;
            case 'update an employee role':     
                let empRoles = [], empRoleIDs = [], emps = [], empIDs = [], empName = "", empRoleName = "";
                let sqlRoles = `SELECT id, title FROM roles;`;
                let sqlEmployees = `SELECT id, CONCAT(first_name,' ', last_name) AS name FROM employees;`;
                db.promise().query(sqlRoles)
                .then(([rows,fields]) => {                 
                    rows.forEach(row => {
                        empRoles.push(row.title);
                        empRoleIDs.push(row.id);
                    });
                }).then(() => db.promise().query(sqlEmployees))
                .then(([rows,fields]) => {                 
                    rows.forEach(row => {
                        emps.push(row.name);
                        empIDs.push(row.id);
                    });
                })
                .then(() => updateEmployee(empRoles, emps))
                .then(input => {
                    empName = input.employee;
                    empRoleName = input.role;
                    let roleID = empRoleIDs[empRoles.indexOf(input.role)];
                    let employeeID = empIDs[emps.indexOf(input.employee)];
                    let sql = `UPDATE employees SET role_id = ? WHERE id = ?;`;
                    let params = [roleID, employeeID];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`${employeeName}'s role has been changed to ${empRoleName}`))
                .catch(console.log)
                .then( () => {promptNext();}); 
                break;
        }                
    });
};

const addDepartment = () => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the department’s name',
            validate: nameInput => {
                if (isNaN(nameInput) && nameInput) {
                return true;
                } else {
                return 'Please enter the department’s name';
                }
            }
        }     
    ]);
};

const addRole = deps => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Enter the role’s name',
            validate: nameInput => {
                if (isNaN(nameInput) && nameInput) {
                return true;
                } else {
                return 'Please enter the role’s name';
                }
            }
        }, 
        {
            type: 'input',
            name: 'salary',
            message: 'Enter the role’s salary',
            validate: (numInput) => {
              if (!isNaN(numInput) && numInput) {
                return true;              
              }else{
                return "Invalid entry, salary must be a number";
              }
            }
        }, 
        {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to?',
            choices: deps
        },
    ]);
};

const addEmployee = (roles, managers) => {
    return inquirer.prompt([
        {
            type: 'input',
            name: 'first_name',
            message: 'Enter the employee’s first name',
            validate: nameInput => {
                if (isNaN(nameInput) && nameInput) {
                return true;
                } else {
                return 'Please enter the employee’s first name';
                }
            }
        }, 
        {
            type: 'input',
            name: 'last_name',
            message: 'Enter the employee’s last name',
            validate: nameInput => {
                if (isNaN(nameInput) && nameInput) {
                return true;
                } else {
                return 'Please enter the employee’s last name';
                }
            }
        },    
        {
            type: 'list',
            name: 'role',
            message: 'What is the employee’s role?',
            choices: roles
        },    
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee’s manager?',
            choices: managers
        },    
    ]);
};
const updateEmployee = (roles, employees) => {
    return inquirer.prompt([            
        {
            type: 'list',
            name: 'employee',
            message: 'Which employee do you want to update?',
            choices: employees
        },    
        {
            type: 'list',
            name: 'role',
            message: 'What is their new role?',
            choices: roles
        },    
    ]);
};

promptNext();
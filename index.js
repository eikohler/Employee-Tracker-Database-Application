const inquirer = require('inquirer');
const db = require('./db/connection');
const Query = require('./lib/Query.js');
require('console.table');

const business = new Query();

const next_choices = [
    'view all departments', 
    'view all roles', 
    'view all employees', 
    'add a department', 
    'add a role', 
    'add an employee', 
    'update an employee role',
    'update a manager role',
    'view employees by manager',
    'view employees by department',
    'delete department',
    'delete role',
    'delete employee',
    'view total utilized budget of a department',
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
        let sql = "";
        switch(choice.nextChoice){
            case 'view all departments':
                db.promise().query(`SELECT id, d_name AS department FROM departments;`)
                .then(([rows,fields]) => {
                    console.table(rows);
                })
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext()); 
                break; 
            case 'view all roles':     
                sql = `SELECT title, roles.id, departments.d_name AS department, salary FROM roles
                LEFT JOIN departments ON roles.department_id = departments.id;`;
                db.promise().query(sql)
                .then(([rows,fields]) => {
                    console.table(rows);
                })
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext());  
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
                .then(()=>business.updateAll())  
                .then(()=>promptNext());  
                break;
            case 'add a department': 
                addDepartment().then(input => {
                    let sql = `INSERT INTO departments (d_name) VALUES (?)`;
                    return [sql, input.name];                                         
                }).then(([sql, name])=>db.promise().query(sql, name))
                .then(() => console.log(`Added to the departments table`))
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext()); 
                break;
            case 'add a role':  
                addRole()
                .then(input => {
                    let sql = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`;
                    let params = [input.name, input.salary, business.getID(input.department)];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`Added to the roles table`))
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext());                
                 break;
            case 'add an employee':   
                addEmployee()
                .then(input => {                                    
                    let sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                    VALUES (?, ?, ?, ?);`;
                    let params = [input.first_name, input.last_name, business.getID(input.role), business.getID(input.manager)];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`Added to the employees table`))
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext()); 
                break;
            case 'update an employee role':                     
                updateEmployee(business.getEmployees())
                .then(input => {                    
                    let sql = `UPDATE employees SET role_id = ? WHERE id = ?;`;
                    let params = [business.getID(input.role), business.getID(input.employee)];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`Updated the employee`))
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext()); 
                break;
            case 'update a manager role':
                updateEmployee(business.getManagers())
                .then(input => {                    
                    let sql = `UPDATE employees SET role_id = ? WHERE id = ?;`;
                    let params = [business.getID(input.role), business.getID(input.employee)];
                    return [sql, params];
                }).then(([sql, params]) => db.promise().query(sql, params))
                .then(() => console.log(`Updated the manager`))
                .catch(console.log)
                .then(()=>business.updateAll())  
                .then(()=>promptNext());
                break;
            case 'view employees by manager':
                break;
            case 'view employees by department':
                break;
            case 'delete department':
                break;
            case 'delete role':
                break;
            case 'delete employee':
                break;
            case 'view total utilized budget of a department':
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

const addRole = () => {
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
            choices: business.getDepartments()
        },
    ]);
};

const addEmployee = () => {
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
            choices: business.getRoles()
        },    
        {
            type: 'list',
            name: 'manager',
            message: 'Who is the employee’s manager?',
            choices: business.getManagers()
        },    
    ]);
};
const updateEmployee = (employees) => {
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
            choices: business.getRoles()
        },    
    ]);
};

business.updateAll().then(()=>promptNext());
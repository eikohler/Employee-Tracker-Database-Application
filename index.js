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
        // let sql = "";
        // let params = [];
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
                
                break;
            case 'add a role':     
                
                break;
            case 'add an employee':     
            case 'update an employee role':     
        }                
    });
};



promptNext();
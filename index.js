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
                const sql = `SELECT id, d_name AS departments FROM departments`;
                db.promise().query(sql)
                .then(([rows,fields]) => {
                    console.table(rows);
                })
                .catch(console.log)
                .then( () => {promptNext();});  
            case 'view all roles':     
            case 'view all employees':     
            case 'add a department':     
            case 'add a role':     
            case 'add an employee':     
            case 'update an employee role':     
        }                
    });
};

promptNext();
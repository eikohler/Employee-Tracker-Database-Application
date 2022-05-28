const db = require('../db/connection');

class Query {
    constructor() {
        this.resetAll();
        this.sqlDepartments = `SELECT id, d_name AS name FROM departments;`;
        this.sqlRoles = `SELECT id, title AS name FROM roles;`;
        this.sqlManagers = `SELECT CONCAT(first_name,' ', last_name) AS name FROM employees
        WHERE manager_id IS NULL;`;
        this.sqlEmployees = `SELECT id, CONCAT(first_name,' ', last_name) AS name FROM employees;`;
    }

    resetAll(){
        this.departments = [];
        this.departmentIDs = [];
        this.roles = [];
        this.roleIDs = [];
        this.managers = [];
        this.employees = [];
        this.employeeIDs = [];
    }

    updateAll(){
        return new Promise((resolve, reject) => {
            this.resetAll();            
            resolve();
        }).then(()=>db.promise().query(this.sqlDepartments))
        .then(([rows,fields]) => {                 
            rows.forEach(row => {
                this.departments.push(row.name);
                this.departmentIDs.push(row.id);
            });
        }).then(()=>db.promise().query(this.sqlRoles))
        .then(([rows,fields]) => {                 
            rows.forEach(row => {
                this.roles.push(row.name);
                this.roleIDs.push(row.id);
            });
        }).then(()=>db.promise().query(this.sqlManagers))
        .then(([rows,fields]) => {                 
            rows.forEach(row => {
                this.managers.push(row.name);
            });
        }).then(()=>db.promise().query(this.sqlEmployees))
        .then(([rows,fields]) => {                 
            rows.forEach(row => {
                this.employees.push(row.name);
                this.employeeIDs.push(row.id);
            });
        }).catch(console.log)
    }

    getRoles(){
        return this.roles;
    }
    
    getEmployees(){
        return this.employees;
    }
    
    getDepartments(){
        return this.departments;
    }
    
    getManagers(){
        return this.managers;
    }
    
    getRoleIDs(){
        return this.roleIDs;
    }
    
    getEmployeeIDs(){
        return this.employeeIDs;
    }
    
    getDepartmentIDs(){
        return this.departmentIDs;
    }

    getID(key){
        if(this.employees.includes(key)){
            return this.employeeIDs[this.employees.indexOf(key)];
        }else if(this.departments.includes(key)){
            return this.departmentIDs[this.departments.indexOf(key)];
        }else{
            return this.roleIDs[this.roles.indexOf(key)];
        }
    }
}

module.exports = Query;
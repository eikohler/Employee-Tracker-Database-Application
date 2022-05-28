const db = require('../db/connection');

const getRoles = () => {

};

const getEmployees = () => {

};

const getDepartments = () => (db.promise().query(`SELECT d_name FROM departments;`))
.then(([rows,fields]) => {
    let result = [];
    rows.forEach(row => result.push(row.d_name)); 
    return result;
});

const getManagers = () => {

};

const getRoleID = () => {

};

const getEmployeeID = () => {

};

const getDepartmentID = () => {

};

module.exports = {
    getRoles: getRoles,
    getEmployees: getEmployees,
    getDepartments: getDepartments,
    getManagers: getManagers,
    getRoleID: getRoleID,
    getEmployeeID: getEmployeeID,
    getDepartmentID: getDepartmentID,
};
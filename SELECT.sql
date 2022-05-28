SELECT 
CONCAT(employee.first_name,' ', employee.last_name) AS employee,
departments.d_name AS department,
roles.salary
FROM employees employee
JOIN roles ON employee.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
AND departments.id = 2;

SELECT 
departments.d_name AS department,
SUM(roles.salary) AS total_utilized_budget
FROM employees employee
JOIN roles ON employee.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
AND departments.id = 2;


SELECT roles.id AS role_id, title AS role_title, departments.d_name AS dep_name, departments.id AS dep_id FROM roles
LEFT JOIN departments ON roles.department_id = departments.id;

INSERT INTO roles (title, salary, department_id) VALUES ('dummy role', 40000, 2);

SELECT id, CONCAT(first_name,' ', last_name) AS manager FROM employees
WHERE manager_id IS NULL;

SELECT * FROM employees
WHERE manager_id = 9;

SELECT 
employee.id,
employee.first_name,
employee.last_name,
roles.title,
departments.d_name AS department,
roles.salary,
CONCAT(manager.first_name,' ', manager.last_name) AS manager
FROM employees employee
JOIN roles ON employee.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
JOIN employees manager ON employee.manager_id = manager.id
AND employee.manager_id = 9
ORDER BY department_id, employee.role_id;

SELECT 
employee.id,
employee.first_name,
employee.last_name,
roles.title,
departments.d_name AS department,
roles.salary,
CONCAT(manager.first_name,' ', manager.last_name) AS manager
FROM employees employee
JOIN roles ON employee.role_id = roles.id
JOIN departments ON roles.department_id = departments.id
AND departments.id = 2
LEFT JOIN employees manager ON employee.manager_id = manager.id
ORDER BY department_id, employee.role_id;

DELETE FROM roles WHERE id = 2;

SELECT SUM(salary)
FROM OrderDetails;

SELECT * FROM roles
LEFT JOIN departments ON roles.department_id = departments.id
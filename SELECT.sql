SELECT 
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
ORDER BY department_id, employee.role_id;


SELECT title, roles.id, departments.d_name AS department, salary FROM roles
LEFT JOIN departments ON roles.department_id = departments.id;
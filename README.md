# Employee Tracker Content Management Database Application
- In this assignment I was tasked with creating a text based content management system that can interact with the setup employee data base. 
- This database has three tables; Departments, Roles and Employees.
- The employee table has a foreign key that connects to the Roles table and the roles table is connected to the departments table. If a department is removed then the roles connected to that department are also removed. However the employees are not removed, just without a role and department.
- Each employee also has a manager referenced by that manager's id
- The user has many options to choose from
1. View all departments
2. View all roles
3. View all employees
4. View employees by manager
5. View employees by department
6. View the total utilized budget of a department (the combined salaries of all employees within a specific department)
7. Add a department
8. Add a role
9. Add an employee
10. Update an employee's role
11. Update a manager's role
12. Delete a department
13. Delete a role
14. Delete an employee

- I used the inquirer npm module to prompt the user for input and the mysql2 npm module to run a query based on the user's input to the database
- I also used the console.table npm module to display the table data that would be returned when the user would request to view the database
- Finally, to add abstraction and ease of coding I setup a Query.js class that would return arrays for the necessary lists that would be displayed for the user's input, i.e. getDepartments, getEmployees, getRoles
- These lists would be updated after each user request/change through mysql queries setup on that class in promise chains, and it would make for easy lookups to the table ids aswell.


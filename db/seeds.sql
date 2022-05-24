INSERT INTO departments (d_name)
VALUES
  ('IT'),
  ('Marketing'),
  ('Engineering'),
  ('HR');

INSERT INTO roles (title, salary, department_id)
VALUES
  ('IT Manager', '98000.19', 1),
  ('Help Desk', '80100.23', 1),
  ('Database Admin', '91100.23', 1),
  ('Network Admin', '90100.23', 1),
  ('Marketing Manager', '92000.02', 2),
  ('Business Analyst', '85000.02', 2),
  ('Social Media Marketer', '82000.02', 2),
  ('Content Writer', '81000.02', 2),
  ('Engineering Manager', '100000.77', 3),
  ('Senior Engineer', '98000.77', 3),
  ('Junior Engineer', '65000.77', 3),
  ('Schematics Specialist', '96000.77', 3),
  ('HR Manager', '80000.23', 4),
  ('Employment Tracker', '77000.23', 4),
  ('Conflict Resolver', '79000.23', 4),
  ('Guidelines Advisor', '78000.23', 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES
  ('James', 'Fraser', 1, null),
  ('Jack', 'London', 2, 1),
  ('Robert', 'Bruce', 3, 1),
  ('Peter', 'Greenaway', 4, 1),
  ('Derek', 'Jarman', 5, null),
  ('Paolo', 'Pasolini', 6, 5),
  ('Heathcote', 'Williams', 7, 5),
  ('Sandy', 'Powell', 8, 5),
  ('Emil', 'Zola', 9, null),
  ('Sissy', 'Coalpits', 10, 9),
  ('Antoinette', 'Capet', 11, 9),
  ('Samuel', 'Delany', 12, 9),
  ('Tony', 'Duvert', 13, null),
  ('Dennis', 'Cooper', 14, 13),
  ('Monica', 'Bellucci', 15, 13),
  ('Samuel', 'Johnson', 16, 13),
  ('Bob', 'Parker', 2, 1);
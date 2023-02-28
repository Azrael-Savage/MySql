USE company_db;

INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES ('Salesperson', 50000.00, 1),
       ('Sales Manager', 80000.00, 1),
       ('Software Engineer', 70000.00, 2),
       ('Senior Software Engineer', 100000.00, 2),
       ('Accountant', 60000.00, 3),
       ('Financial Analyst', 80000.00, 3),
       ('Marketing Coordinator', 45000.00, 4),
       ('Marketing Manager', 75000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 2, NULL),
       ('Jane', 'Doe', 1, 2),
       ('Bob', 'Smith', 3, NULL),
       ('Alice', 'Jones', 4, 3),
       ('Bill', 'Johnson', 6, 3),
       ('Sue', 'Lee', 8, 4);
USE company_db;

INSERT INTO departments (name)
VALUES ('Sales'), ('Engineering'), ('Finance'), ('Marketing');

INSERT INTO roles (title, salary, department_id)
VALUES ('Salesperson', 50000.00, 1),
       ('Sales Manager', 80000.00, 1),
       ('Software Engineer', 70000.00, 2),
       ('Senior Software Engineer', 100000.00, 2),
       ('Accountant', 60000.00, 3),
       ('Financial Analyst', 80000.00, 3),
       ('Marketing Coordinator', 45000.00, 4),
       ('Marketing Manager', 75000.00, 4);

INSERT INTO employees (first_name, last_name, role_id, manager_id)
VALUES ('John', 'Doe', 2, NULL),
       ('Jane', 'Doe', 1, 2),
       ('Bob', 'Smith', 3, NULL),
       ('Alice', 'Jones', 4, 3),
       ('Bill', 'Johnson', 6, 3),
       ('Sue', 'Lee', 8, 4);

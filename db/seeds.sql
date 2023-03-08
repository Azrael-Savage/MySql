CREATE DATABASE IF NOT EXISTS company_db;

USE company_db;

CREATE TABLE departments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(30) NOT NULL
);

CREATE TABLE roles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL(10, 2) NOT NULL,
  department_id INT NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

CREATE TABLE employees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT,
  FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  FOREIGN KEY (manager_id) REFERENCES employees(id) ON DELETE SET NULL
);

CREATE TABLE department_budgets (
  id INT AUTO_INCREMENT PRIMARY KEY,
  department_id INT NOT NULL,
  budget DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE
);

DELIMITER //

CREATE TRIGGER set_default_budget AFTER INSERT ON departments
FOR EACH ROW
BEGIN
  INSERT INTO department_budgets (department_id, budget)
  VALUES (NEW.id, RAND() * 100000 + 50000);
END//

DELIMITER ;

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

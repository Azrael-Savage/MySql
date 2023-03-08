const db = require('./db');

async function getAllEmployees() {
  const [rows] = await db.query(`
    SELECT 
      e.id, 
      e.first_name, 
      e.last_name, 
      r.title, 
      d.name AS department, 
      r.salary, 
      CONCAT(m.first_name, " ", m.last_name) AS manager
    FROM employees e
    JOIN roles r ON e.role_id = r.id
    JOIN departments d ON r.department_id = d.id
    LEFT JOIN employees m ON e.manager_id = m.id
  `);
  return rows;
}

async function addEmployee(first_name, last_name, role_id, manager_id) {
  await db.query('INSERT INTO employees SET ?', { first_name, last_name, role_id, manager_id });
}

async function updateEmployeeRole(employee_id, role_id) {
  await db.query('UPDATE employees SET role_id = ? WHERE id = ?', [role_id, employee_id]);
}

async function updateEmployeeManager(employee_id, manager_id) {
  await db.query('UPDATE employees SET manager_id = ? WHERE id = ?', [manager_id, employee_id]);
}

async function deleteEmployee(id) {
  await db.query('DELETE FROM employees WHERE id = ?', [id]);
}

async function viewAllEmployees(callback) {
  const employees = await getAllEmployees();
  console.table(employees);
  callback();
}

module.exports = { getAllEmployees, addEmployee, updateEmployeeRole, updateEmployeeManager, deleteEmployee, viewAllEmployees };

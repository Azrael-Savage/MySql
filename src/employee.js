const db = require('./db');

// View all employees
async function viewAllAsync() {
  return new Promise((resolve, reject) => {
    db.query(
      `
      SELECT employees.*, CONCAT_WS(' ', manager.first_name, manager.last_name) AS manager_name, roles.title, roles.salary, departments.name AS department
      FROM employees
      LEFT JOIN employees manager ON manager.id = employees.manager_id
      INNER JOIN roles ON employees.role_id = roles.id
      INNER JOIN departments ON roles.department_id = departments.id
      ORDER BY employees.id ASC
    `,
      (err, res) => {
        if (err) reject(err);
        resolve(res);
      }
    );
  });
}

// Add an employee
async function add(callback) {
    const roles = await viewAllAsync();
    const { default: inquirer } = await import('inquirer');
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the employee:',
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the employee:',
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the employee role:',
                choices: roles.map((role) => ({
                    name: role.title,
                    value: role.id,
                })),
            },
            {
                type: 'number',
                name: 'manager_id',
                message: 'Enter the ID of the employee manager (if any):',
            },
        ])
        .then((answer) => {
            db.query('INSERT INTO employees SET ?', answer, (err, res) => {
                if (err) throw err;
                console.log(`Added employee ${answer.first_name} ${answer.last_name}`);
                callback();
            });
        });
}

// Update an employee role
function updateRole(callback) {
  viewAllAsync().then((employees) => {
    const roles = employees.reduce((acc, curr) => {
      if (!acc.find((r) => r.id === curr.role_id)) {
        acc.push({
          id: curr.role_id,
          title: curr.title,
          salary: curr.salary,
          department: curr.department,
        });
      }
      return acc;
    }, []);

    inquirer
      .prompt([
        {
          type: 'list',
          name: 'employee_id',
          message: 'Select an employee to update:',
          choices: employees.map((employee) => ({
            name: `${employee.first_name} ${employee.last_name}`,
            value: employee.id,
          })),
        },
        {
          type: 'list',
          name: 'role_id',
          message: 'Select the employee role:',
          choices: roles.map((role) => ({
            name: role.title,
            value: role.id,
          })),
        },
      ])
      .then((answer) => {
        db.query(
          'UPDATE employees SET role_id = ? WHERE id = ?',
          [answer.role_id, answer.employee_id],
          (err, res) => {
            if (err) throw err;
            console.log('Employee role updated');
            callback();
          }
        );
      });
  });
}

module.exports = { viewAllAsync, add, updateRole };

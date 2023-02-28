const department = require('./department');
const role = require('./role');
const employee = require('./employee');


async function show() {
  const inquirer = await import('inquirer');

  await inquirer.default
    .prompt({
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View all departments',
        'View all roles',
        'View all employees',
        'Add a department',
        'Add a role',
        'Add an employee',
        'Update an employee role',
        'Exit',
      ],
    })
    .then((answer) => {
      switch (answer.action) {
        case 'View all departments':
          department.viewAll(show);
          break;
        case 'View all roles':
          role.viewAll(show);
          break;
          case 'View all employees':
            employee.viewAllAsync().then((employees) => {
              console.table(employees);
              show();
            });
            break;          
        case 'Add a department':
          department.add(show);
          break;
        case 'Add a role':
          role.add(show);
          break;
        case 'Add an employee':
          employee.add(show);
          break;
        case 'Update an employee role':
          employee.updateRole(show);
          break;
        case 'Exit':
          console.log('Goodbye!');
          process.exit();
          break;
        default:
          console.log(`Invalid action: ${answer.action}`);
          show();
          break;
      }
    });
}

module.exports = { show };

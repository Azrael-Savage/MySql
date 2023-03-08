const runSearch = async () => {
  const { default: inquirer } = await import('inquirer');
  const { default: consoleTable } = await import('console.table');
  const db = require('./db');
  const Department = require('./department');
  const Role = require('./role');
  const Employee = require('./employee');

  const mainMenu = async () => {
    const { choice } = await inquirer.prompt([
      {
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: [
          'View all departments',
          'View all roles',
          'View all employees',
          'Add a department',
          'Add a role',
          'Add an employee',
          'Update an employee role',
          'Exit'
        ]
      }
    ]);

    switch (choice) {
      case 'View all departments':
        await Department.viewAllDepartments(consoleTable);
        break;
      case 'View all roles':
        await Role.viewAll(consoleTable);
        break;
      case 'View all employees':
        await Employee.viewAllEmployees(consoleTable);
        break;
      case 'Add a department':
        await Department.addDepartment(inquirer, db);
        break;
      case 'Add a role':
        await Role.addRole(inquirer, db, Department);
        break;
      case 'Add an employee':
        await Employee.addEmployee(inquirer, db, Role, Employee);
        break;
      case 'Update an employee role':
        await Employee.updateEmployeeRole(inquirer, db, Role, Employee);
        break;
      case 'Exit':
        db.end();
        process.exit(0);
      default:
        console.log(`Invalid choice: ${choice}`);
        break;
    }

    mainMenu();
  };

  mainMenu();
};

module.exports = { runSearch };

const db = require("./db");

// View all departments
function viewAll(callback) {
  db.query("SELECT * FROM departments", (err, res) => {
    if (err) throw err;
    console.table(res);
    callback();
  });
}

// View all departments (using viewAll)
async function viewAllDepartments(callback) {
  await viewAll(callback);
}

// Add a department
async function add(callback) {
  const { default: inquirer } = await import('inquirer');

  inquirer
    .prompt([
      {
        type: "input",
        name: "name",
        message: "Enter the name of the department:",
      },
    ])
    .then((answer) => {
      db.query("INSERT INTO departments SET ?", answer, (err, res) => {
        if (err) throw err;
        console.log(`Added department ${answer.name}`);
        callback();
      });
    });
}

module.exports = { viewAllDepartments, add };

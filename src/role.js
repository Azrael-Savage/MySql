const db = require("./db");
const department = require("./department");

// View all roles
function viewAll(callback) {
	db.query(
		`
    SELECT roles.id, roles.title, roles.salary, departments.name AS department
    FROM roles
    INNER JOIN departments ON roles.department_id = departments.id
  `,
		(err, res) => {
			if (err) throw err;
			console.table(res);
			callback();
		}
	);
}

// Add a role
function add(callback) {
	department.viewAll((departments) => {
		
		inquirer
			.prompt([
				{
					type: "input",
					name: "title",
					message: "Enter the name of the role:",
				},
				{
					type: "number",
					name: "salary",
					message: "Enter the salary for the role:",
				},
				{
					type: "list",
					name: "department_id",
					message: "Select the department for the role:",
					choices: departments.map((department) => ({
						name: department.name,
						value: department.id,
					})),
				},
			])
			.then((answer) => {
				db.query("INSERT INTO roles SET ?", answer, (err, res) => {
					if (err) throw err;
					console.log(`Added role ${answer.title}`);
					callback();
				});
			});
	});
}

module.exports = { viewAll, add };

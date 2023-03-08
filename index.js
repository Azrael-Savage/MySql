const inquirer = require("inquirer");
const mysql = require("mysql2");

const db = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "password",
	database: "company_db",
});

const prompts = [
	{
		type: "list",
		message: "What would you like to do?",
		choices: [
			"View all departments",
			"View all roles",
			"View all employees",
			"Add a department",
			"Add a role",
			"Add an employee",
			"Update an employee role",
			"Update an employee manager",
			"View employees by manager",
			"View employees by department",
			"Delete a department",
			"Delete a role",
			"View the total utilized budget of a department",
			"Exit",
		],
		name: "action",
	},
];

const startUp = () => {
	inquirer.prompt(prompts).then((answers) => {
		switch (answers.action) {
			case "View all departments":
				db.query("SELECT * FROM departments", (err, results) => {
					if (err) throw err;
					console.table(results);
					bootMain();
				});
				break;

			case "View all roles":
				db.query(
					"SELECT roles.id, roles.title, departments.name AS department, roles.salary FROM roles JOIN departments ON roles.department_id = departments.id",
					(err, results) => {
						if (err) throw err;
						console.table(results);
						bootMain();
					}
				);
				break;

			case "View all employees":
				db.query(
					'SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary, CONCAT(managers.first_name, " ", managers.last_name) AS manager FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id',
					(err, results) => {
						if (err) throw err;
						console.table(results);
						bootMain();
					}
				);
				break;

			case "Add a department":
				inquirer
					.prompt([
						{
							type: "input",
							message: "Enter the name of the department:",
							name: "name",
						},
					])
					.then((answers) => {
						db.query(
							"INSERT INTO departments SET ?",
							{ name: answers.name },
							(err, results) => {
								if (err) throw err;
								console.log(`Added department: ${answers.name}`);
								bootMain();
							}
						);
					});
				break;

			case "Add a role":
				db.query("SELECT * FROM departments", (err, results) => {
					if (err) throw err;
					const choices = results.map((department) => ({
						name: department.name,
						value: department.id,
					}));
					inquirer
						.prompt([
							{
								type: "input",
								message: "Enter the title of the role:",
								name: "title",
							},
							{
								type: "input",
								message: "Enter the salary for the role:",
								name: "salary",
							},
							{
								type: "list",
								message: "Select the department for the role:",
								choices,
								name: "departmentId",
							},
						])
						.then((answers) => {
							db.query(
								"INSERT INTO roles SET ?",
								{
									title: answers.title,
									salary: answers.salary,
									department_id: answers.departmentId,
								},
								(err, results) => {
									if (err) throw err;
									console.log(`Added role: ${answers.title}`);
									bootMain();
								}
							);
						});
				});
				break;

			case "Add an employee":
				db.query("SELECT * FROM roles", (err, results) => {
					if (err) throw err;
					const choices = results.map((role) => ({
						name: role.title,
						value: role.id,
					}));
					inquirer
						.prompt([
							{
								type: "input",
								message: "Enter the first name of the employee:",
								name: "firstName",
							},
							{
								type: "input",
								message: "Enter the last name of the employee:",
								name: "lastName",
							},
							{
								type: "list",
								message: "Select the role for the employee:",
								choices,
								name: "roleId",
							},
							{
								type: "number",
								message: "Enter the ID of the employee's manager:",
								name: "managerId",
							},
						])
						.then((answers) => {
							db.query(
								"INSERT INTO employees SET ?",
								{
									first_name: answers.firstName,
									last_name: answers.lastName,
									role_id: answers.roleId,
									manager_id: answers.managerId || null,
								},
								(err, results) => {
									if (err) throw err;
									console.log(
										`Added employee: ${answers.firstName} ${answers.lastName}`
									);
									bootMain();
								}
							);
						});
				});
				break;
			case "Update an employee role":
				db.query("SELECT * FROM employees", (err, results) => {
					if (err) throw err;
					const employeeChoices = results.map((employee) => ({
						name: `${employee.first_name} ${employee.last_name}`,
						value: employee.id,
					}));
					db.query("SELECT * FROM roles", (err, results) => {
						if (err) throw err;
						const roleChoices = results.map((role) => ({
							name: role.title,
							value: role.id,
						}));
						inquirer
							.prompt([
								{
									type: "list",
									message: "Select the employee you want to update:",
									choices: employeeChoices,
									name: "employeeId",
								},
								{
									type: "list",
									message: "Select the new role for the employee:",
									choices: roleChoices,
									name: "roleId",
								},
							])
							.then((answers) => {
								db.query(
									"UPDATE employees SET role_id = ? WHERE id = ?",
									[answers.roleId, answers.employeeId],
									(err, results) => {
										if (err) throw err;
										console.log("Employee role updated successfully");
										bootMain();
									}
								);
							});
					});
				});
				break;

			case "Update an employee manager":
				db.query("SELECT * FROM employees", (err, results) => {
					if (err) throw err;
					const employeeChoices = results.map((employee) => ({
						name: `${employee.first_name} ${employee.last_name}`,
						value: employee.id,
					}));
					inquirer
						.prompt([
							{
								type: "list",
								message: "Select the employee you want to update:",
								choices: employeeChoices,
								name: "employeeId",
							},
							{
								type: "list",
								message: "Select the new manager for the employee:",
								choices: employeeChoices,
								name: "managerId",
							},
						])
						.then((answers) => {
							db.query(
								"UPDATE employees SET manager_id = ? WHERE id = ?",
								[answers.managerId, answers.employeeId],
								(err, results) => {
									if (err) throw err;
									console.log("Employee manager updated successfully");
									bootMain();
								}
							);
						});
				});
				break;
			case "View employees by manager":
				db.query(
					'SELECT CONCAT(managers.first_name, " ", managers.last_name) AS manager, employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department, roles.salary FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id LEFT JOIN employees AS managers ON employees.manager_id = managers.id ORDER BY manager',
					(err, results) => {
						if (err) throw err;
						console.table(results);
						bootMain();
					}
				);
				break;

			case "View employees by department":
				db.query("SELECT * FROM departments", (err, results) => {
					if (err) throw err;
					const choices = results.map((department) => ({
						name: department.name,
						value: department.id,
					}));
					inquirer
						.prompt([
							{
								type: "list",
								message: "Select the department:",
								choices,
								name: "departmentId",
							},
						])
						.then((answers) => {
							db.query(
								"SELECT employees.id, employees.first_name, employees.last_name, roles.title, departments.name AS department FROM employees JOIN roles ON employees.role_id = roles.id JOIN departments ON roles.department_id = departments.id WHERE departments.id = ?",
								answers.departmentId,
								(err, results) => {
									if (err) throw err;
									console.table(results);
									bootMain();
								}
							);
						});
				});
				break;
			case "Delete a department":
				db.query("SELECT * FROM departments", (err, results) => {
					if (err) throw err;
					const choices = results.map((department) => ({
						name: department.name,
						value: department.id,
					}));
					choices.push({ name: "Go back", value: "goBack" }); // Add "Go back" option
					inquirer
						.prompt([
							{
								type: "list",
								message: "Select the department to delete:",
								choices,
								name: "departmentId",
							},
						])
						.then((answers) => {
							if (answers.departmentId === "goBack") {
								// Check if user wants to go back
								bootMain();
							} else {
								db.query(
									"DELETE FROM departments WHERE id = ?",
									answers.departmentId,
									(err, results) => {
										if (err) throw err;
										console.log("Department deleted successfully");
										bootMain();
									}
								);
							}
						});
				});
				break;

			case "Delete a role":
				db.query("SELECT * FROM roles", (err, results) => {
					if (err) throw err;
					const choices = results.map((role) => ({
						name: role.title,
						value: role.id,
					}));
					inquirer
						.prompt([
							{
								type: "list",
								message: "Select the role to delete:",
								choices,
								name: "roleId",
							},
						])
						.then((answers) => {
							db.query(
								"DELETE FROM roles WHERE id = ?",
								answers.roleId,
								(err, results) => {
									if (err) throw err;
									console.log("Role deleted successfully");
									bootMain();
								}
							);
						});
				});
				break;
			case "View the total utilized budget of a department":
				db.query("SELECT * FROM departments", (err, results) => {
					if (err) throw err;
					const choices = results.map((department) => ({
						name: department.name,
						value: department.id,
					}));
					inquirer
						.prompt([
							{
								type: "list",
								message:
									"Select the department to view the total utilized budget:",
								choices,
								name: "departmentId",
							},
						])
						.then((answers) => {
							db.query(
								"SELECT SUM(salary) AS total_budget FROM roles WHERE department_id = ?",
								[answers.departmentId],
								(err, results) => {
									if (err) throw err;
									console.log(
										`Total utilized budget of the department is $${results[0].total_budget}`
									);
									bootMain();
								}
							);
						});
				});
				break;

			case "Exit":
				console.log("Goodbye!");
				db.end();
				break;
		}
	});
};

startUp();

const bootMain = () => {
	inquirer
		.prompt([
			{
				type: "confirm",
				message: "Would you like to continue?",
				name: "restartCheck",
			},
		])
		.then((res) => {
			if (res.restartCheck === true) {
				startUp();
			} else {
				console.log("Exiting application...");
				db.end();
			}
		});
};

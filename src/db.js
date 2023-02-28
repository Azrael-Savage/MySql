const mysql = require("mysql");

const connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "password",
	database: "company_db",
});

// Connect to the database
function connect(callback) {
	connection.connect((err) => {
		if (err) throw err;
		console.log(`Connected as id ${connection.threadId}`);
		callback();
	});
}

// Query the database
function query(sql, params, callback) {
	connection.query(sql, params, callback);
}

module.exports = { connect, query };

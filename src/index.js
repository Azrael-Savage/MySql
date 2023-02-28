const db = require("./db");
const menu = require("./menu");

// Connect to the database and start the application
db.connect(() => {
	menu.show();
});

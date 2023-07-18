const sqlite3 = require("sqlite3").verbose();

//this is the master 'connection and run sql' command
const db = new sqlite3.Database("./db.db", sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
});

class SQL {

	//create the db table, if it doesn't exist
	async createDB() {
		const createSql = `CREATE TABLE IF NOT EXISTS lookup(id INTEGER PRIMARY KEY,name CHAR(50),status INTEGER, UNIQUE(name));`;
		db.run(createSql);
	}

	//used for update SQLs
	async wrapperUpdate(query) {
		new Promise(function (resolve, reject) {
			db.run(query, function (err, rows) {
				if (err) { return reject(err); }
				resolve(rows);
			});
		});
	}

	//used for insert SQLs
	async wrapperInsert(query) {
		new Promise(function (resolve, reject) {
			db.run(query, function (err, rows) {
				if (err) { return reject(err); }
				resolve(rows);
			});
		});
	}

	//used for select SQLs
	async wrapperSelect(query) {
		const result = new Promise(function (resolve, reject) {
			db.all(query, function (err, rows) {
				if (err) { return reject(err); }
				resolve(rows);
			});
		});
		if (result === null) {
			let result = 0;
			return result;
		} else return await result;
	}

}

module.exports = new SQL;
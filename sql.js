const sqlite3 = require("sqlite3").verbose();

//this is the master 'connection and run sql' command
const db = new sqlite3.Database("./db.db", sqlite3.OPEN_READWRITE, (err) => {
	if (err) return console.error(err.message);
});

//table information
//only 1 table exists 'lookup'
//lookup contains two fields - name || status - the NAME field is unique, if inserting into this table remember to use 'INSERT OR IGNORE INTO'
//all names stored are the cmdr name toLowerCase
//status are - 0 unknown || 1 friend || 2 foe || 3 kos
//when a 200/202 happens from inara search, limpet will log the name and assume unknown status (0)
//a user can update a status for a name using commands; !fr / !foe / !kos / !un
//there are no destructive actions available to the user

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
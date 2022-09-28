const mysql = require('../Scripts/node_modules/mysql2')
const pool = mysql.createPool({
	connectionLimit: 100,
	host: '127.0.0.1',
	user: 'root',
	password: 'root',
	database: 'test'
});
pool.sql_query = function (sql, values, next) {
	pool.getConnection(function (err, conn) {
		if (err) { return next(err, null); }
		conn.query(sql, values, function (err, sql_data) {
			conn.release();
			return next(err, sql_data);
		})
	})
}
pool.sql_insert = function (table, values) {
	pool.getConnection(function (err, conn) {
		if (err) { return next(err, null); }
		conn.query(`INSERT INTO ${table} VALUES (?);`, [values], function (err, sql_data) {
			conn.release();
			if (err) { return console.log(err.message); }
		})
	})
}
pool.sql_query_promise = function (sql, values, next) {
	pool.getConnection(async function (err, conn) {
		if (err) { return next(err, null); }
		return await new Promise(function (success, failed) {
			conn.query(sql, values, function (err, sql_data) {
				conn.release();
				if (err) {
					failed(err);
				}
				else {
					success(sql_data);
				}
			})
		})
			.then(function (sql_data) { return next(null, sql_data); }, function (err) { return next(err, null); })
			.catch(function (err) { return next(err, null); })
	})
}
module.exports = pool;
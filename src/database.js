const mysql = require('mysql');
const util = require('util');

var client = null;

/**
 * Initializes the database connection
 */
function initialize() {
    client = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
    });
}

/**
 * Prepares a statement and executes a query asynchronously
 * @param {String} prepare The statement to be prepared
 * @param {[String|Number]} inserts The values to be inserted into the query
 * @example query('SELECT * FROM USERS WHERE age = ? AND name = ?', [28, 'john'])
 * @example query('SELECT * FROM ?? WHERE id = ? AND name = ?', ['items', 28141])
 * @returns {Promise<[*]>} The query results
 */
function query(prepare, inserts = []) {
    const sql = mysql.format(prepare, inserts);

    return new Promise((ok, fail) => {
        client.query(sql, (error, results, fields) => {
            if (error) {
                fail(error);
            } else {
                ok(results);
            }
        });
    });
}

module.exports = {
    initialize,
    query,
};
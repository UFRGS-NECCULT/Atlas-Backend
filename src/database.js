import pg from 'pg';

let client = null;

/**
 * Initializes the database connection
 */
export const initialize = () => {

    client = new pg.Client({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    });

    client.connect();
}

/**
 * Prepares a statement and executes a query asynchronously
 * @param {String} prepare The statement to be prepared
 * @param {[String|Number]} inserts The values to be inserted into the query
 * @example query('SELECT * FROM USERS WHERE age = ? AND name = ?', [28, 'john'])
 * @example query('SELECT * FROM ?? WHERE id = ? AND name = ?', ['items', 28141])
 * @returns {Promise<[*]>} The query results
 */
export const query = (text, values = []) => {
    return new Promise((ok, fail) => {
        client.query(text, values, (error, results) => {
            if (error) {
                fail(error);
            } else {
                ok(results);
            }
        });
    });
}
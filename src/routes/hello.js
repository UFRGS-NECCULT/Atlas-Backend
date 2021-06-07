const { query } = require('../database');

/**
 * 'Hello World!' route to be removed
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function hello(req, res) {
    var results = await query('SELECT NOW() as now', []);

    if (results.length !== 1) {
        throw 'Unexpected query results';
    }

    var now = results[0].now;

    res.json({
        now: `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`,
    });
}

module.exports = {
    hello,
};
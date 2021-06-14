const { query } = require('../database');
const { fail, valueOrDefault } = require('../utils');

/**
 * Queries and returns necessary data to display bar charts
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getBars(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var uos = valueOrDefault(req.query.uos, false, Boolean);

    // HACK: Adaptação ruim de segregação (Eixo2) para Eixo1
    if (deg > 0) {
        deg = deg - 8;
    }

    if (!(deg == 0 || cad != 0 || [1, 2, 3].includes(variable))) {
        fail(res, 'Invalid parameters!');
        return;
    }

    var idCadeia = !uos ? cad : 1;

    var result;
    try {
        result = await query(`SELECT
                SUM(Valor) as Valor,
                Ano
            FROM Eixo_1 as ex
                INNER JOIN UF as uf ON uf.idUF = ex.idUF
                INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
                INNER JOIN Porte as port ON port.idPorte = ex.idPorte
            WHERE uf.idUF = ? AND
                cad.idcadeia = ? AND
                port.idPorte = ? AND
                ex.Numero = ?
            GROUP BY Ano`, [
            uf,
            idCadeia,
            deg,
            variable,
        ]);
    } catch (e) {
        fail(res, String(e));
        return;
    }

    res.json(result);
}

/**
 * Gets each year's max value of a variable belonging to a Cadeia, of a specic Porte
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getMaxValueSetor(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);

    var result;
    try {
        result = await query(`SELECT MAX(Valor) as Valor, Ano FROM Eixo_1
            WHERE Numero = ? AND
            idCadeia = ? AND
            idPorte = ? AND
            idUF = 0
            GROUP BY Ano`, [
            variable,
            cad,
            deg,
        ]);
    } catch (e) {
        fail(res, String(e));
        return;
    }

    res.json(result);
}

/**
 * Gets each year's max value of a variable having a selected Porte
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getTotalBrasil(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);

    var result;
    try {
        result = await query(`SELECT MAX(Valor) as Valor, Ano FROM Eixo_1
            WHERE Numero = ? AND
            idPorte = ? AND
            idCadeia = 0 AND
            idUF = 0
            GROUP BY Ano`, [
            variable,
            deg,
        ]);
    } catch (e) {
        fail(res, String(e));
        return;
    }

    res.json(result);
}

/**
 * Gets a variable's values at a selected UF
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getTotalSumPrt(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);

    var result;
    try {
        result = await query(`SELECT Valor, Ano FROM Eixo_1
            WHERE Numero = ? AND
            idUF = ? AND
            idPorte = 0 AND
            idCadeia = 0`, [
            variable,
            uf,
        ]);
    } catch (e) {
        fail(res, String(e));
        return;
    }

    res.json(result);
}

/**
 * Gets the latest year available for a variable
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getAnoDefault(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);

    var result;
    try {
        result = await query(`SELECT MAX(Ano) as Ano FROM Eixo_1
            WHERE Numero = ? AND
            idUF = 0
            GROUP BY Numero`, [
            variable,
        ]);
    } catch (e) {
        fail(res, String(e));
        return;
    }

    if (result.length !== 1) {
        fail(res, 'Unexpected query results', 500)
        return;
    }

    res.json(result[0]);
}

/**
 * Gets the values of a variable in each UF
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getterMapa(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var ano = valueOrDefault(req.query.ano, 0, Number);

    var sql;
    var params;

    // HACK: Adaptação ruim de segregação (Eixo2) para Eixo1
    if (deg > 0) {
        deg = deg - 8
    };

    if (deg == 0 || cad != 0 || [1, 2, 3].includes(variable)) {
        sql = `SELECT
                SUM(Valor) as Valor,
                SUM(Percentual) as Percentual,
                uf.idUF as ID
            FROM Eixo_1 as ex
                INNER JOIN UF AS uf ON uf.idUF = ex.idUF
                INNER JOIN Atuacao AS atc ON atc.idAtuacao = ex.idAtuacao
                INNER JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
                INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
            WHERE ex.Numero = ? AND
                atc.idAtuacao = 0 AND
                cad.idCadeia = ? AND
                prt.idPorte = ?`;
        params = [variable, cad, deg];
    } else {
        sql = `SELECT
                SUM(Valor) as Valor,
                SUM(Percentual) as Percentual,
                uf.idUF as ID
            FROM Eixo_1 as ex
                INNER JOIN UF AS uf ON uf.idUF = ex.idUF
                INNER JOIN Atuacao AS atc ON atc.idAtuacao = ex.idAtuacao
                INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
            WHERE ex.Numero = ?
                atc.idAtuacao = 0 AND
                cad.idCadeia = ? AND
                prt.idPorte = ?`;
        params = [variable, deg];
    }

    if (ano > 0) {
        sql += ' AND ex.Ano = ?'
        params.push(ano);
    }
    // We have to concat here because of the above code
    sql += ' GROUP BY uf.idUF';

    res.json(await query(sql, params));
}

/**
 * Gets the values of a variable in each Region
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 */
async function getterRegion(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var ano = valueOrDefault(req.query.ano, 0, Number);

    var regions = [
        'Sul',
        'Sudeste',
        'Centro-Oeste',
        'Nordeste',
        'Norte',
    ];

    var sql;
    var params;

    var result = {};

    for (var region of regions) {
        // FIXME: What is this expression and why does it appear so much?
        if (deg == 0 || cad != 0 || [1, 2, 3].includes(variable)) {
            sql = `SELECT * FROM Eixo_1 as ex
                JOIN UF AS uf ON uf.idUF = ex.idUF
                JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
                JOIN Atuacao AS atc ON atc.idAtuacao = ex.idAtuacao
                JOIN Porte AS prt ON prt.idPorte = ex.idPorte
                WHERE ex.Numero = ? AND
                uf.UFRegiao LIKE ? AND
                cad.idCadeia = ? AND
                atc.idAtuacao = 0 AND
                prt.idPorte = ?`;
            params = [variable, region, cad, deg];
        } else {
            sql = `SELECT * FROM Eixo_1 as ex
                JOIN UF AS uf ON uf.idUF = ex.idUF
                JOIN Porte AS prt ON prt.idPorte = ex.idPorte
                WHERE ex.Numero = ? AND
                uf.UFRegiao LIKE ? AND
                prt.idPorte = ?`;
            params = [variable, region, deg];
        }

        if (ano > 0) {
            sql += ' AND ex.Ano = ?';
            params.push(ano);
        }

        result[region] = await query(sql, params);
    }

    res.json(result);
}


module.exports = {
    getBars,
    getMaxValueSetor,
    getTotalBrasil,
    getTotalSumPrt,
    getAnoDefault,
    getterMapa,
    getterRegion,
}
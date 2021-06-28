
import { fail, valueOrDefault } from '../utils.js';
import { query } from '../database.js';

class Eixo1Controller {

  /**
   * Queries and returns necessary data to display bar charts
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getBars(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var prt = valueOrDefault(req.query.prt, 0, Number);
    var uos = valueOrDefault(req.query.uos, false, Boolean);

    if (!(prt == 0 || cad != 0 || [1, 2, 3].includes(variable))) {
      fail(res, 'Invalid parameters!', 400);
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
        prt,
        variable,
      ]);
    } catch (e) {
      fail(res, String(e));
      return;
    }

    res.json(result);
  }

  /**
  * Queries and returns necessary data to display bar charts
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async getTreemap(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var prt = valueOrDefault(req.query.prt, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    var result;
    try {
      result = await query(`SELECT
            Valor,
            Percentual,
            Taxa,
            cad.idCadeia,
            cad.CadeiaNome
        FROM Eixo_1 as ex
            INNER JOIN UF AS uf ON uf.idUF = ex.idUF
            INNER JOIN Atuacao AS atc ON atc.idAtuacao = ex.idAtuacao
            INNER JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
            INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
        WHERE ex.Numero = ? AND
            atc.idAtuacao = 0 AND
            uf.idUF = ? AND
            cad.idCadeia != 0 AND
            prt.idPorte = ? AND
            ex.Ano = ?`, [
        variable,
        uf,
        prt,
        ano,
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
  async getMaxValueSetor(req, res) {
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
  async getTotalBrasil(req, res) {
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
  async getTotalSumPrt(req, res) {
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
  async getAnoDefault(req, res) {
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
      fail(res, 'Unexpected query results')
      return;
    }

    res.json(result[0]);
  }

  /**
   * Gets the values of a variable in each UF
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getterMapa(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var prt = valueOrDefault(req.query.prt, 0, Number);
    var ano = valueOrDefault(req.query.ano, 0, Number);

    var sql;
    var params;

    if (prt == 0 || cad != 0 || [1, 2, 3].includes(variable)) {
      sql = `SELECT
                SUM(Valor) as valor,
                SUM(Percentual) as percentual,
                uf.idUF as uf,
                uf.UFRegiao as regiao
            FROM Eixo_1 as ex
                INNER JOIN UF AS uf ON uf.idUF = ex.idUF
                INNER JOIN Atuacao AS atc ON atc.idAtuacao = ex.idAtuacao
                INNER JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
                INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
            WHERE ex.Numero = ? AND
                atc.idAtuacao = 0 AND
                cad.idCadeia = ? AND
                prt.idPorte = ?`;
      params = [variable, cad, prt];
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
      params = [variable, prt];
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
  async getterLinhas(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);

    var sql;
    var params;

    // HACK: Adaptação ruim de segregação (Eixo2) para Eixo1
    if (deg > 0) {
      deg -= 8;
    }

    var sql;
    var params;

    if (variable == 3 || variable == 9) {
      sql = `SELECT
                Valor,
                Ano,
                cad.idCadeia as ID
            FROM Eixo_1 as ex
                JOIN UF AS uf ON uf.idUF = ex.idUF
                JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
                JOIN Porte AS prt ON prt.idPorte = ex.idPorte
            WHERE ex.Numero = ?
                AND uf.idUF = ?
                AND cad.idCadeia > 0
                AND prt.idPorte = ?
            ORDER BY ID, Ano`;
      params = [variable, uf, deg];
    } else if (variable >= 10) {
      sql = `SELECT
                Valor,
                Ano,
                cad.idCadeia as ID
            FROM Eixo_1 as ex
                JOIN UF AS uf ON uf.idUF = ex.idUF
                JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
            WHERE ex.Numero = ?
                AND uf.idUF = ?
                AND cad.idCadeia = ?
            ORDER BY ID, Ano`;
      params = [variable, uf, cad];
    } else {
      fail(res, 'Invalid parameters!', 400);
      return;
    }

    res.json(await query(sql, params));

  }

  /**
   * Gets the values of a variable in each Region
   * @param {import('express').Request} req
   * @param {import('express').Response} res
  */
  async getterRegion(req, res) {
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
}

export default Eixo1Controller;
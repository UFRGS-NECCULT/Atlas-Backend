
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

    res.json(await query(`SELECT
          SUM(Valor) as Valor,
          Ano,
          prt.PorteNome as NomeGrupo,
          prt.idPorte as IDGrupo
      FROM Eixo_1 as ex
          INNER JOIN UF as uf ON uf.idUF = ex.idUF
          INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
          INNER JOIN Porte as prt ON prt.idPorte = ex.idPorte
      WHERE uf.idUF = ? AND
          cad.idcadeia = ? AND
          prt.idPorte > 0 AND
          ex.Numero = ?
      GROUP BY Ano, NomeGrupo, IDGrupo`, [
      uf,
      cad,
      variable,
    ]));
  }

  /**
  * Queries and returns necessary data to display a treemap
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async getTreemap(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var prt = valueOrDefault(req.query.prt, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    res.json(await query(`SELECT
        SUM(Valor) as Valor,
        SUM(Taxa) as Taxa,
        SUM(Percentual) as Percentual,
        cad.CadeiaNome as NomeGrupo,
        cad.idCadeia as IDGrupo
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
        ex.Ano = ?
      GROUP BY IDGrupo, NomeGrupo`, [
      variable,
      uf,
      prt,
      ano,
    ]));
  }

  /**
   * Gets each year's max value of a variable belonging to a Cadeia, of a specic Porte
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getMaxValueSetor(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var prt = valueOrDefault(req.query.prt, 0, Number);

    res.json(await query(`SELECT
        MAX(Valor) as Valor,
        Ano
      FROM Eixo_1
      WHERE Numero = ? AND
        idCadeia = ? AND
        idPorte = ? AND
        idUF = 0
        GROUP BY Ano`, [
      variable,
      cad,
      prt,
    ]));
  }

  /**
   * Gets each year's max value of a variable having a selected Porte
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getTotalBrasil(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var prt = valueOrDefault(req.query.prt, 0, Number);

    var result;
    try {
      result = await query(`SELECT MAX(Valor) as Valor, Ano FROM Eixo_1
            WHERE Numero = ? AND
            idPorte = ? AND
            idCadeia = 0 AND
            idUF = 0
            GROUP BY Ano`, [
        variable,
        prt,
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

    sql = `SELECT
          SUM(Valor) as valor,
          uf.idUF as uf
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
    var prt = valueOrDefault(req.query.prt, 0, Number);

    var sql;
    var params;

    var group = 'cad.CadeiaNome';
    if (variable >= 10) {
      group = 'prt.PorteNome';
    }

    var sql = `SELECT
          SUM(Valor) as Valor,
          Ano,
          ${group} as NomeGrupo
      FROM Eixo_1 as ex
          INNER JOIN UF AS uf ON uf.idUF = ex.idUF
          INNER JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
          INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
      WHERE ex.Numero = ?
          AND uf.idUF = ?`;
    var params = [variable, uf];

    if (variable >= 10) {
      sql += ' AND cad.idCadeia = ?';
      params.push(cad);
    } else {
      sql += ' AND cad.idCadeia > 0 AND prt.idPorte = ?';
      params.push(prt);
    }

    sql += ' GROUP BY NomeGrupo, Ano';
    sql += ' ORDER BY NomeGrupo, Ano';

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
    var prt = valueOrDefault(req.query.prt, 0, Number);
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
      if (prt == 0 || cad != 0 || [1, 2, 3].includes(variable)) {
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
        params = [variable, region, cad, prt];
      } else {
        sql = `SELECT * FROM Eixo_1 as ex
                JOIN UF AS uf ON uf.idUF = ex.idUF
                JOIN Porte AS prt ON prt.idPorte = ex.idPorte
                WHERE ex.Numero = ? AND
                uf.UFRegiao LIKE ? AND
                prt.idPorte = ?`;
        params = [variable, region, prt];
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
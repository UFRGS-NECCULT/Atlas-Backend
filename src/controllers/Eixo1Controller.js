
import { fail, valueOrDefault } from '../utils.js';
import { query } from '../database.js';

class Eixo1Controller {

  async getBars(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);

    if (!(deg == 0 || cad != 0 || [1, 2, 3].includes(variable))) {
      fail(res, 'Invalid parameters!', 400);
      return;
    }

    var result;
    try {
      result = await query(`
        select
          ex1.valor,
          ex1.percentual,
          ex1.taxa,
          ex1.variavel_id,
          ano,
          atc.nome as atuacao,
          uf.nome as uf,
          uf.id as uf_id,
          cad.nome as cadeia,
          cad.cor as cor,
          ex.cor_primaria as cor_eixo,
          sdg.id as sdg_id,
          sdg.subdesagregacao_nome as sdg_nome,
          sdg.subdesagregacao_cor as sdg_cor,
          sdg.subdesagregacao_id as sdg_sub_id,
          var.format as formato
        from eixo_1 ex1
          INNER JOIN eixo ex ON ex.id = ex1.eixo_id
          INNER JOIN uf uf ON uf.id = ex1.uf_id
          INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
          INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
          inner join subdesagregacao sdg ON sdg.id = ex1.subdesagregacao_id
          INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
          inner join (
            select d2.id as desagregacao_id from subdesagregacao s2
              inner join desagregacao d2 on s2.desagregacao_id = d2.id
            where s2.id = $1
          ) as filter_deg on filter_deg.desagregacao_id = sdg.desagregacao_id
        WHERE uf.id = $2
            and cad.id = $3
            and ex1.eixo_id = 1
            and var.variavel = $4
        order by ano, sdg_id;
      `, [
        deg,
        uf,
        cad,
        variable,
      ]);
    } catch (e) {
      fail(res, String(e));
      return;
    }

    res.json(result.rows);
  }

  /**
  * Queries and returns necessary data to display a treemap
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async getTreemap(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var atc = valueOrDefault(req.query.atc, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    const result = await query(`
      SELECT
        SUM(valor) as valor,
        SUM(taxa) as taxa,
        SUM(percentual) as percentual,
        ex1.ano as ano,
        cad.nome as cadeia,
        cad.id as cadeia_id,
        cad.cor as cor,
        var.format as formato
      FROM eixo_1 as ex1
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex1.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
      WHERE uf.id = $1
        and ex1.ano = $2
        and atc.id = $3
        and cad.id != 0
        and var.variavel = $4
        and ex1.eixo_id = 1
        and ex1.subdesagregacao_id = $5
      GROUP BY cad.id, cad.nome, cad.cor, ex1.ano, var.format
      order by cadeia_id ASC;
    `, [
      uf,
      ano,
      atc,
      variable,
      deg,
    ])

    res.json(result.rows);
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

    const result = await query(`
      SELECT
        MAX(valor) as valor,
        ano
      from eixo_1 ex1
      WHERE ex1.variavel_id = $1
        and ex1.cadeia_id = $2
        and ex1.subdesagregacao_id = $3
        and ex1.uf_id = 0
      GROUP BY ano
      order by ano ASC`, [
      variable,
      cad,
      deg,
    ])

    res.json(result.rows);
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
      result = await query(`
        SELECT
          MAX(valor) as valor,
          ano
        FROM eixo_1 ex1
        WHERE ex1.variavel_id = $1
          and ex1.cadeia_id = 0
          and ex1.subdesagregacao_id = $2
          and ex1.uf_id = 0
        GROUP BY Ano
        order by ano ASC`, [
        variable,
        deg,
      ]);
    } catch (e) {
      fail(res, String(e));
      return;
    }

    res.json(result.rows);
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
      result = await query(`
        SELECT
          valor,
          ano
        FROM eixo_1 ex1
        WHERE ex1.variavel_id = $1
          and ex1.uf_id = $2
          and ex1.subdesagregacao_id = 0
          and ex1.cadeia_id = 0
        order by ano asc;`,
        [
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
      result = await query(`
        SELECT MAX(ano) as ano
        FROM eixo_1 ex1
        WHERE ex1.variavel_id = $1
          and ex1.uf_id = 0
        GROUP BY variavel_id
      `, [
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

    res.json(result.rows[0]);
  }

  /**
   * Gets the values of a variable in each UF
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getterMapa(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var ano = valueOrDefault(req.query.ano, 0, Number);
    var atc = valueOrDefault(req.query.atc, 0, Number);

    const sql = `
      SELECT
        ex1.valor,
        ex1.percentual,
        ex1.taxa,
        atc.nome,
        uf.id as uf_id,
        uf.nome as uf,
        cad.nome as cadeia,
        cad.id as cadeia_id,
        cad.cor as cor,
        ex.cor_primaria as cor_eixo,
        var.format as formato
      FROM eixo_1 as ex1
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex1.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
      WHERE ex1.ano = $1
        and atc.id = $2
        and cad.id = $3
        and uf.id != 0
        and var.variavel = $4
        and ex1.eixo_id = 1
        and ex1.subdesagregacao_id = $5
      `;

    const params = [ano, atc, cad, variable, deg];

    const result = await query(sql, params);


    res.json(result.rows);
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

    const sql = `
      SELECT
        ex1.valor as valor,
        ex1.percentual as percentual,
        ex1.taxa as taxa,
        ano,
        cad.nome as cadeia,
        cad.cor as cor,
        var.format as formato
      FROM EIXO_1 as ex1
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex1.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
      WHERE var.variavel = $1
        AND ex1.uf_id = $2
        and ex1.subdesagregacao_id = $3
        and ex1.cadeia_id != 0
      order by cad.id, ano asc
    `;

    const params = [variable, uf, deg];

    /* Esse if precisa ser tratado de um jeito diferente... talvez fazer um outro endpoint para as variaveis 10, 11, 12 e 13?
    if (variable >= 10) {
      sql += ' AND cad.idCadeia = ?';
      params.push(cad);
    } else {
      sql += ' AND cad.idCadeia > 0 AND prt.idPorte = ?';
      params.push(prt);
    }
    */

    const result = await query(sql, params);

    res.json(result.rows);
  }

  /**
   * Gets the values of a variable in each Region
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getterDonut(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);

    const sql = `
      SELECT
        ex1.valor as valor,
        ex1.percentual as percentual,
        ex1.taxa as taxa,
        ano,
        cad.nome as cadeia,
        cad.id as cadeia_id,
        cad.cor as cor,
        var.format as formato
      FROM EIXO_1 as ex1
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex1.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
      WHERE var.variavel = $1
        AND ex1.uf_id = $2
        and ex1.subdesagregacao_id = $3
        and ex1.cadeia_id != 0
        and ex1.ano = $4
      order by cad.id, ano asc
    `;

    const params = [variable, uf, deg, ano];

    /* Esse if precisa ser tratado de um jeito diferente... talvez fazer um outro endpoint para as variaveis 10, 11, 12 e 13?
    if (variable >= 10) {
      sql += ' AND cad.idCadeia = ?';
      params.push(cad);
    } else {
      sql += ' AND cad.idCadeia > 0 AND prt.idPorte = ?';
      params.push(prt);
    }
    */

    const result = await query(sql, params);

    res.json(result.rows);
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

  async getBreadcrumb(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);



    const sql_eixo = `select id, nome from eixo ex;`
    const sql_var = `select variavel as id, titulo as nome from variavel v where eixo = 1;`
    const sql_uf = `select distinct(uf_id) as id, uf.nome as nome
                      from eixo_1 ex1
                      inner join uf on uf.id = ex1.uf_id
                      where variavel_id = ${variable}
                      order by uf_id asc;`

    const sql_ano = `select distinct(ano) as id, ano as nome from eixo_1 e1 where variavel_id = ${variable} order by ano ASC;`



    const sql_cad = `select distinct(cadeia_id) as id, c.nome as nome
                      from eixo_1 ex1
                      inner join cadeia c on c.id = ex1.cadeia_id
                      where variavel_id = ${variable}
                      order by cadeia_id asc;`

    const sql_deg = `select distinct(ex1.subdesagregacao_id) as id, s.subdesagregacao_nome as nome from eixo_1 ex1
                      inner join subdesagregacao s on s.id = ex1.subdesagregacao_id
                    where ex1.variavel_id = ${variable}
                    order by ex1.subdesagregacao_id asc;`

    let breadcrumbs = [
      {
        id: 'eixo',
        label: 'Eixo',
        options: query(sql_eixo),
      },
      {
        id: 'var',
        label: 'Variável',
        options: query(sql_var),
      },
      {
        id: 'uf',
        label: 'UF',
        options: query(sql_uf),
      },
      {
        id: 'ano',
        label: 'Ano',
        options: query(sql_ano),
      },
      {
        id: 'cad',
        label: 'Setor',
        options: query(sql_cad),
      },
      {
        id: 'deg',
        label: 'Porte',
        options: query(sql_deg),
      }
    ]

    await Promise.all(breadcrumbs.map(b => b.options))

    breadcrumbs = breadcrumbs.map(b => { return { ...b, options: b.options.rows } })
    res.json(breadcrumbs);
  }

  /**
   * Gets the values of a variable in each Region
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getInfo(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);

    const mainQuery = query(`SELECT
        ex.cor_primaria as cor,
        ex1.valor,
        ex1.ano,
        var.format as formato,
        var.fonte,
        uf.id as id_uf,
        uf.nome as nome_uf,
        cad.id as id_cad,
        cad.nome as nome_cad,
        subdeg.id as id_subdeg,
        subdeg.subdesagregacao_nome as nome_subdeg
      FROM eixo_1 ex1
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN variavel var on var.variavel = ex1.variavel_id and var.eixo = ex.id
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN subdesagregacao subdeg ON subdeg.id = ex1.subdesagregacao_id

      -- O front precisa de alguns valores totais para calcular certos
      -- valores, por isso o "or ... = 0"
      WHERE (uf.id = $1 or uf.id = 0)
        and (cad.id = $2 or cad.id = 0)
        and (subdeg.id = $3 or subdeg.id = 0)
        and ex.id = 1
        and var.variavel = $4
        and ex1.ano = $5;`, [
      uf,
      cad,
      deg,
      variable,
      ano
    ]);

    res.json((await mainQuery).rows);
  }
}

export default Eixo1Controller;
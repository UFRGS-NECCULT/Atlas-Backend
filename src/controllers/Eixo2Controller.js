import { query } from '../database.js';
import { valueOrDefault } from '../utils.js';

import views from '../json/Eixo2Views.js'

class Eixo2Controller {

  async getVariable(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);
    try {
      const result = await query(`select format as formato, titulo, descricao, fonte from variavel v where v.eixo = 2 and v.variavel = $1;`, [variable]);
      const [data] = result.rows;
      return res.json(data)
    } catch (e) {
      fail(res, String(e));
      return;
    }
  }

  async getVisualization(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);
    const box = valueOrDefault(req.query.box, 1, Number);

    const variableData = views.find(visualization => visualization.variable === variable)

    if (!variableData) res.sendStatus(404);

    const boxData = variableData.boxes.find(variable_box => variable_box.box === box);
    if (!boxData) res.sendStatus(404);

    return res.json(boxData.data)
  }


  /**
   * Retorna os dados necessários para a montagem de um gráfico em barras
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getBars(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);
    const uos = valueOrDefault(req.query.uos, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);
    const subdeg = valueOrDefault(req.query.subdeg, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);

    var sql = `
      select
        ex2.valor,
        ex2.percentual,
        ex2.taxa,
        ex2.variavel_id,
        var.format as formato,
        ano,
        ocp.nome as ocupacao,
        uf.nome as uf,
        uf.id as uf_id,
        cad.nome as cadeia,
        cad.cor as cor,
        ex.cor_primaria as cor_eixo,
        sdg.id as sdg_id,
        sdg.subdesagregacao_nome as sdg_nome,
        sdg.subdesagregacao_cor as sdg_cor,
        sdg.subdesagregacao_id as sdg_sub_id
      from eixo_2 ex2
          INNER JOIN eixo ex ON ex.id = ex2.eixo_id
          INNER JOIN uf uf ON uf.id = ex2.uf_id
          INNER JOIN ocupacao ocp ON ocp.id = ex2.ocupacao_id
          INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
          INNER JOIN variavel var ON var.variavel = ex2.variavel_id and var.eixo = ex.id
          inner join subdesagregacao sdg ON sdg.id = ex2.subdesagregacao_id
          inner join (
            select d2.id as desagregacao_id from subdesagregacao s2
              inner join desagregacao d2 on s2.desagregacao_id = d2.id
              where s2.id = $1
            ) as filter_deg on filter_deg.desagregacao_id = sdg.desagregacao_id
      WHERE uf.id = $2
          and cad.id = $3
          and ex2.eixo_id = 2
          and var.variavel = $4
      order by ano, sdg_id;
    `;

    const params = [deg, uf, cad, variable,];

    const result = await query(sql, params);

    res.json(result.rows);
  }

  /**
   * Retorna os dados necessários para a montagem de um gráfico de linhas
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getLines(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);

    var sql = `
      SELECT
        ex2.valor as valor,
        ex2.percentual as percentual,
        ex2.taxa as taxa,
        ano,
        cad.nome as cadeia,
        cad.cor as cor,
        var.format as formato
      FROM eixo_2 as ex2
        INNER JOIN uf uf ON uf.id = ex2.uf_id
        INNER JOIN ocupacao atc ON atc.id = ex2.ocupacao_id
        INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex2.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex2.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex2.variavel_id and var.eixo = ex2.eixo_id
      WHERE var.variavel = $1
        AND ex2.uf_id = $2
        and ex2.subdesagregacao_id = $3
        ${variable >= 12 ? '' : 'and ex2.cadeia_id != 0'}
      order by cad.id, ano asc;
    `

    res.json(await query(sql, params));
  }

  /**
   * Retorna os dados necessários para a montagem do gráfico do mapa
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getMap(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);

    var sql = `
      SELECT
          ex2.valor,
          ex2.percentual,
          ex2.taxa,
          ocp.nome,
          uf.id as uf_id,
          uf.nome as uf,
          cad.nome as cadeia,
          cad.id as cadeia_id,
          cad.cor as cor,
          ex.cor_primaria as cor_eixo,
          var.format as formato
        FROM eixo_2 as ex2
          INNER JOIN uf uf ON uf.id = ex2.uf_id
          INNER JOIN ocupacao ocp ON ocp.id = ex2.ocupacao_id
          INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
          INNER JOIN eixo ex ON ex.id = ex2.eixo_id
          INNER JOIN subdesagregacao subdesag ON subdesag.id = ex2.subdesagregacao_id
          INNER JOIN variavel var ON var.variavel = ex2.variavel_id and var.eixo = ex2.eixo_id
        WHERE ex2.ano = $1
          and ocp.id = $2
          and cad.id = $3
          and uf.id != 0
          and var.variavel = $4
          and ex2.eixo_id = 2
          and ex2.subdesagregacao_id = $5`;

    const params = [ano, ocp, cad, variable, deg];
    res.json(await query(sql, params));
  }

  /**
   * Retorna os dados necessários para a montagem de um treemap
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getTreemapSCC(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var ocp = valueOrDefault(req.query.ocp, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex2.ano,
        cad.id as grupo_id,
        cad.id as item_id,
        cad.nome as grupo_nome,
        cad.nome as item_nome,
        cad.cor as cor,
        var.format as formato
      FROM eixo_2 as ex2
        INNER JOIN uf uf ON uf.id = ex2.uf_id
        INNER JOIN ocupacao ocp ON ocp.id = ex2.ocupacao_id
        INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex2.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex2.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex2.variavel_id and var.eixo = ex2.eixo_id
      WHERE uf.id = $1
        and ex2.ano = $2
        and ocp.id = $3
        and cad.id != 0
        and ex2.eixo_id = 2
        and ex2.variavel_id = $4
        and ex2.subdesagregacao_id = $5
      order by cadeia_id ASC;`, [
      uf,
      ano,
      ocp,
      variable,
      deg,
    ])

    res.json(result.rows);
  }

  /**
  * Busca dados necessários para mostrar um treemap de estados agrupados
  * por região
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
   async getTreemapUF(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ano = valueOrDefault(req.query.ano, 2015, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex2.ano as ano,
        regiao.id as grupo_id,
        regiao.nome as grupo_nome,
        uf.nome as item_nome,
        uf.id as item_id,
        regiao.cor as cor,
        var.format as formato
      FROM eixo_2 as ex2
        INNER JOIN eixo ex ON ex.id = ex2.eixo_id
        INNER JOIN variavel var on var.variavel = ex2.variavel_id and var.eixo = ex.id
        INNER JOIN uf ON uf.id = ex2.uf_id
        INNER JOIN regiao ON regiao.id = uf.regiao_id
        INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
        INNER JOIN subdesagregacao subdeg ON subdeg.id = ex2.subdesagregacao_id
        INNER JOIN ocupacao ocp ON ocp.id = ex2.ocupacao_id
      WHERE regiao.id != 0
        and ex2.ano = $1
        and cad.id = $2
        and var.variavel = $3
        and subdeg.id = $4
        and ocp.id = $5;
    `, [
      ano,
      cad,
      variable,
      deg,
      ocp
    ])

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
        ex2.valor as valor,
        ex2.percentual as percentual,
        ex2.taxa as taxa,
        ano,
        cad.nome as item_nome,
        cad.id as item_id,
        cad.cor as cor
      FROM EIXO_2 as ex2
        INNER JOIN uf uf ON uf.id = ex2.uf_id
        INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex2.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex2.subdesagregacao_id
      WHERE ex2.variavel_id = $1
        AND ex2.uf_id = $2
        and ex2.subdesagregacao_id = $3
        and ex2.cadeia_id != 0
        and ex2.ano = $4
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
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getInfo(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);

    const mainQuery = query(`SELECT
        ex.cor_primaria as cor,
        ex2.valor,
        ex2.ano,
        var.format as formato,
        var.fonte,
        uf.id as id_uf,
        uf.nome as nome_uf,
        uf.preposicao as preposicao_uf,
        cad.id as id_cad,
        cad.nome as nome_cad,
        subdeg.id as id_subdeg,
        subdeg.subdesagregacao_nome as nome_subdeg,
        subdeg.display as display_subdeg,
        ocp.id as id_ocupacao,
        ocp.nome as nome_ocupacao
      FROM eixo_2 ex2
        INNER JOIN eixo ex ON ex.id = ex2.eixo_id
        INNER JOIN variavel var on var.variavel = ex2.variavel_id and var.eixo = ex.id
        INNER JOIN uf uf ON uf.id = ex2.uf_id
        INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id
        INNER JOIN subdesagregacao subdeg ON subdeg.id = ex2.subdesagregacao_id
        INNER JOIN ocupacao ocp ON ocp.id = ex2.ocupacao_id

      -- O front precisa de alguns valores totais para calcular certos
      -- valores, por isso o "or ... = 0"
      WHERE (uf.id = $1 or uf.id = 0)
        and (cad.id = $2 or cad.id = 0)
        and (subdeg.id = $3 or subdeg.id = 0)
        and ex.id = 2
        and var.variavel = $4
        and ex2.ano = $5
        and (ocp.id = $6 or ocp.id = 0);`, [
      uf,
      cad,
      deg,
      variable,
      ano,
      ocp
    ]);

    res.json((await mainQuery).rows);
  }

  async getConfig(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);

    const { cor_primaria: primaryColor } = (await query('SELECT cor_primaria FROM eixo WHERE id = 2')).rows[0];

    const sql_eixo = `select id, nome from eixo ex;`
    const sql_var = `select variavel as id, titulo as nome from variavel v where eixo = 2;`
    const sql_uf = `select distinct(uf_id) as id, uf.nome as nome
                      from eixo_2 ex2
                      inner join uf on uf.id = ex2.uf_id
                      where variavel_id = ${variable}
                      order by uf_id asc;`

    const sql_ano = `select distinct(ano) as id, ano as nome from eixo_2 where variavel_id = ${variable} order by ano ASC;`

    const sql_cad = `select distinct(cadeia_id) as id, c.nome as nome
                      from eixo_2 ex2
                      inner join cadeia c on c.id = ex2.cadeia_id
                      where variavel_id = ${variable}
                      order by cadeia_id asc;`

    const sql_ocp = `select distinct(ocupacao_id) as id, ocp.nome as nome
                      from eixo_2 ex2
                      inner join ocupacao ocp on ocp.id = ex2.ocupacao_id
                      where variavel_id = ${variable}
                      order by ocupacao_id asc;`

    const sql_deg = `select distinct(ex2.subdesagregacao_id) as id, d.nome as grupo, s.subdesagregacao_nome as nome from eixo_2 ex2
                      inner join subdesagregacao s on s.id = ex2.subdesagregacao_id
                      inner join desagregacao d on d.id = s.desagregacao_id
                    where ex2.variavel_id = ${variable}
                    order by ex2.subdesagregacao_id asc;`

    let breadcrumbs = [
      {
        id: 'eixo',
        label: 'Eixo',
        options: await query(sql_eixo),
      },
      {
        id: 'var',
        label: 'Variável',
        options: await query(sql_var),
      },
      {
        id: 'uf',
        label: 'UF',
        options: await query(sql_uf),
      },
      {
        id: 'ano',
        label: 'Ano',
        options: await query(sql_ano),
      },
      {
        id: 'cad',
        label: 'Setor',
        options: await query(sql_cad),
      },
      {
        id: 'ocp',
        label: 'Ocupação',
        options: await query(sql_ocp),
      },
      {
        id: 'deg',
        label: 'Desagregação',
        options: await query(sql_deg),
      }
    ]

    breadcrumbs = breadcrumbs.map(b => { return { ...b, options: b.options.rows } })
    res.json({
      primaryColor,
      breadcrumbs,
    });
  }

}


export default Eixo2Controller;
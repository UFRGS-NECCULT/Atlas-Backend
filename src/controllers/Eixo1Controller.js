
import { fail, valueOrDefault } from '../utils.js';
import { query } from '../database.js';

import views from '../json/Eixo1Views.js'
import path from 'path';

class Eixo1Controller {

  async getVisualization(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);
    const box = valueOrDefault(req.query.box, 1, Number);

    try {
      const variableData = views.find(visualization => visualization.variable === variable)
      const boxData = variableData.boxes.find(variable_box => variable_box.box === box);
      return res.json(boxData.data)
    } catch (e) {
      res.sendStatus(404);
    }
    return res.json(boxData.data)
  }

  async getBars(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var concentracao = valueOrDefault(req.query.concentracao, -1, Number);

    if (!(deg == 0 || cad != 0 || [1, 2, 3].includes(variable))) {
      fail(res, 'Invalid parameters!', 400);
      return;
    }

    const params = [
      deg,
      uf,
      cad,
      variable,
    ]

    if (concentracao >= 0) params.push(concentracao)

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
          cad.gradiente_inferior as cor_inferior,
          cad.gradiente_superior as cor_superior,
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
            ${concentracao >= 0 ? "and concentracao = $5" : ''}
        order by ano, sdg_id;
      `, params);
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
  async getTreemapCad(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var atc = valueOrDefault(req.query.atc, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex1.ano as ano,
        cad.id as grupo_id,
        cad.id as item_id,
        cad.nome as grupo_nome,
        cad.nome as item_nome,
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
        and ex1.subdesagregacao_id = $5;
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
  * Busca dados necessários para mostrar um treemap de estados agrupados
  * por região
  * @param {import('express').Request} req
  * @param {import('express').Response} res
  */
  async getTreemapUF(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var deg = valueOrDefault(req.query.deg, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var atc = valueOrDefault(req.query.atc, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex1.ano as ano,
        regiao.id as grupo_id,
        regiao.nome as grupo_nome,
        uf.nome as item_nome,
        uf.id as item_id,
        regiao.cor as cor,
        var.format as formato
      FROM eixo_1 as ex1
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN regiao ON regiao.id = uf.regiao_id
        INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex1.subdesagregacao_id
        INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
      WHERE uf.regiao_id != 0
        and ex1.ano = $1
        and atc.id = $2
        and cad.id = $3
        and var.variavel = $4
        and ex1.subdesagregacao_id = $5;
    `, [
      ano,
      atc,
      cad,
      variable,
      deg,
    ])

    res.json(result.rows);
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
        cad.gradiente_inferior as cor_inferior,
        cad.gradiente_superior as cor_superior,
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

    const result = await query(`SELECT
        ex1.valor as valor,
        ex1.percentual as percentual,
        ex1.taxa as taxa,
        ano,
        ${variable >= 10 ? `
        CASE
          WHEN concentracao = 0 THEN 'Por UF'
          WHEN concentracao = 1 THEN 'Por SCC'
        end` : `
        subdesag.subdesagregacao_nome as
        `} grupo,
        ${variable >= 10 ? 'NULL' : 'subdesag.id'} as grupo_id,
        ${variable >= 10 ? `
        CASE
          WHEN concentracao = 0 THEN ex.cor_primaria
          WHEN concentracao = 1 THEN ex.cor_secundaria
        end ` : `
        CASE
          WHEN subdesag.desagregacao_id = 0 THEN ex.cor_primaria
          ELSE subdesag.subdesagregacao_cor
        END
        `} cor,
        var.format as formato
      FROM EIXO_1 as ex1
        INNER JOIN uf uf ON uf.id = ex1.uf_id
        INNER JOIN atuacao atc ON atc.id = ex1.atuacao_id
        INNER JOIN cadeia cad ON cad.id = ex1.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex1.eixo_id
        INNER JOIN subdesagregacao subdesag ON subdesag.id = ex1.subdesagregacao_id
        INNER JOIN (
          SELECT
            d2.id as desagregacao_id
          FROM
            subdesagregacao s2
            INNER JOIN desagregacao d2 on s2.desagregacao_id = d2.id
          WHERE s2.id = $3
        ) as desag on desag.desagregacao_id = subdesag.desagregacao_id
      INNER JOIN variavel var ON var.variavel = ex1.variavel_id and var.eixo = ex1.eixo_id
      WHERE var.variavel = $1
        AND ex1.uf_id = $2
        and ex1.cadeia_id = $4
        ${variable >= 10 ? 'and ex1.concentracao IS NOT NULL' : ''}
      ORDER BY cad.id, ano, concentracao ASC;`, [
      variable,
      uf,
      deg,
      cad
    ]);
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
        cad.nome as item_nome,
        cad.id as item_id,
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

  async getConfig(req, res) {
    const varID = valueOrDefault(req.query.var, 1, Number);

    const [variable] = (await query(`select format as formato, titulo, descricao, fonte from variavel v where v.eixo = 1 and v.variavel = $1;`, [varID])).rows;

    const { cor_primaria: primaryColor } = (await query('SELECT cor_primaria FROM eixo WHERE id = 1')).rows[0];

    const sql_eixo = `select id, nome from eixo ex;`
    const sql_var = `select variavel as id, titulo as nome from variavel v where eixo = 1;`
    const sql_uf = `select distinct(uf_id) as id, uf.nome, uf.preposicao
                    from eixo_1 ex1
                      inner join uf on uf.id = ex1.uf_id
                    where variavel_id = ${varID}
                    order by uf_id asc;`

    const sql_ano = `select distinct(ano) as id, ano as nome
                      from eixo_1 e1
                      where variavel_id = ${varID}
                      order by ano ASC;`;



    const sql_cad = `select distinct(cadeia_id) as id, c.nome as nome
                      from eixo_1 ex1
                      inner join cadeia c on c.id = ex1.cadeia_id
                      where variavel_id = ${varID}
                      order by cadeia_id asc;`;

    const sql_deg = `select distinct(ex1.subdesagregacao_id) as id, s.subdesagregacao_nome as nome, s.display from eixo_1 ex1
                      inner join subdesagregacao s on s.id = ex1.subdesagregacao_id
                    where ex1.variavel_id = ${varID}
                    order by ex1.subdesagregacao_id asc;`;

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
        id: 'deg',
        label: 'Porte',
        options: await query(sql_deg),
      }
    ];

    breadcrumbs = breadcrumbs.map(b => ({ ...b, options: b.options.rows }));
    res.json({
      primaryColor,
      variable,
      breadcrumbs,
    });
  }

  /**
   * Pesquisa e retorna dados para serem usados pelo DataInfo no front
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getInfo(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);

    const mainQuery = await query(`SELECT
        ex.cor_primaria as cor,
        ex1.valor,
        ex1.ano,
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
        concentracao as conc
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

    let rows = mainQuery.rows;

    // Essas variáveis seguem uma lógica diferente de exibição:
    // Os valores são sempre mostrados de maneira absoluta (e não como porcentagem),
    // o primeiro valor é referente às UFs e o segundo aos setores.
    if ([10, 11, 12, 13].includes(variable)) {
      rows = rows.map(r => ({
        ...r,
        display_absolute: true,
        display_at: r.conc === 0 ? 1 : 2
      }));
    }

    res.json(rows);
  }

  async getCsv(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);

    try {
      const csvDir = path.resolve('src', 'data', 'sheets');

      const sheets = {
        1: 'E01V01 - NUMERO TOTAL DE EMPRESAS',
        2: 'E01V02 - PARTICIPACAO',
        3: 'E01V03 - VARIACAO TOTAL',
        4: 'E01V04 - RECEITA TOTAL BRUTA',
        5: 'E01V05 - RECEITA OPERACIONAL LIQUIDA',
        6: 'E01V06 - CUSTO',
        7: 'E01V07 - LUCRO',
        8: 'E01V08 - VALOR ADICIONADO',
        9: 'E01V09 - VALOR ADICIONADO PIB',
        10: 'E01V10 - IHH EMPRESAS',
        11: 'E01V11 - IHH VALOR ADICIONADO',
        12: 'E01V12 - C4 EMPRESAS',
        13: 'E01V13 - VALOR ADICIONADO'
      }

      const filename = sheets[variable] + '.xlsx';
      const filepath = path.join(csvDir, filename)

      return res.download(filepath, filename), (err) => console.log(err);
    } catch (e) {
      console.log(e)
      res.sendStatus(404);
    }

  }
}

export default Eixo1Controller;
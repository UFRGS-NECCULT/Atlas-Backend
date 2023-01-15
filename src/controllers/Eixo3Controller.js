
import { fail, valueOrDefault } from '../utils.js';
import { query } from '../database.js';

import views from '../json/Eixo3Views.js'
import path from 'path';

class Eixo3Controller {

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
    var mec = valueOrDefault(req.query.mec, 0, Number);
    var mod = valueOrDefault(req.query.mod, 0, Number);
    var pfj = valueOrDefault(req.query.pfj, 0, Number);
    var rot = valueOrDefault(req.query.rot, -1, Number);
    var concentracao = valueOrDefault(req.query.concentracao, -1, Number);

    // if (!(deg == 0 || cad != 0 || [1, 2, 3].includes(variable))) {
    //   fail(res, 'Invalid parameters!', 400);
    //   return;
    // }

    const params = [
      uf,
      cad,
      mec,
      mod,
      pfj,
      variable,
    ]

    if (concentracao >= 0) params.push(concentracao)
    if (variable >= 18 && rot >= 0) params.push(rot)

    var result;
    try {
      result = await query(`
      select
        ex3.valor,
        ex3.percentual,
        ex3.taxa,
        ex3.variavel_id,
        ano,
        mec.nome as mecanismo,
        mod.nome as modalidade,
        pfj.nome as pessoa,
        uf.nome as uf,
        uf.id as uf_id,
        cad.nome as cadeia,
        cad.cor as cor,
        cad.gradiente_inferior as cor_inferior,
        cad.gradiente_superior as cor_superior,
        ex.cor_primaria as cor_eixo,
        var.format as formato
      from eixo_3 ex3
        INNER JOIN eixo ex ON ex.id = ex3.eixo_id
        INNER JOIN uf uf ON uf.id = ex3.uf_id
        INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
        INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id  
        INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id  
        INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
        INNER JOIN variavel var ON var.variavel = ex3.variavel_id and var.eixo = ex3.eixo_id
      WHERE uf.id = $1
          and cad.id = $2
          and mec.id = $3
          and mod.id = $4
          and pfj.id = $5
          and ex3.eixo_id = 3
          and var.variavel = $6
          ${concentracao >= 0 ? "and concentracao = $7" : ''}
          ${variable >= 18 && rot >= 0 ? "and concentracao = $7" : ''}
      order by ano;
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
    var mec = valueOrDefault(req.query.mec, 0, Number);
    var mod = valueOrDefault(req.query.mod, 0, Number);
    var pfj = valueOrDefault(req.query.pfj, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);
    var rot = valueOrDefault(req.query.rot, -1, Number);

    const params = [
      uf,
      ano,
      mec,
      mod,
      pfj,
      variable]

    if (variable >= 18 && rot >= 0) params.push(rot)

    const result = await query(`
    SELECT
      valor,
      taxa,
      percentual,
      ex3.ano as ano,
      cad.id as grupo_id,
      cad.id as item_id,
      cad.nome as grupo_nome,
      cad.nome as item_nome,
      cad.cor as cor,
      var.format as formato
    FROM eixo_3 as ex3
      INNER JOIN uf uf ON uf.id = ex3.uf_id
      INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
      INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id
      INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id
      INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
      INNER JOIN eixo ex ON ex.id = ex3.eixo_id
      INNER JOIN variavel var ON var.variavel = ex3.variavel_id and var.eixo = ex3.eixo_id
    WHERE uf.id = $1
      and ex3.ano = $2
      and mec.id = $3
      and mod.id = $4
      and pfj.id = $5
      and cad.id != 0
      and var.variavel = $6
      ${variable >= 18 && rot >= 0 ? "and concentracao = $7" : ''}
      and ex3.eixo_id = 3;
    `, params)

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
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var mec = valueOrDefault(req.query.mec, 0, Number);
    var mod = valueOrDefault(req.query.mod, 0, Number);
    var pfj = valueOrDefault(req.query.pfj, 0, Number);
    var ano = valueOrDefault(req.query.ano, 2015, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex3.ano as ano,
        regiao.id as grupo_id,
        regiao.nome as grupo_nome,
        uf.nome as item_nome,
        uf.id as item_id,
        regiao.cor as cor,
        var.format as formato
      FROM eixo_3 as ex3
        INNER JOIN uf uf ON uf.id = ex3.uf_id
        INNER JOIN regiao ON regiao.id = uf.regiao_id
        INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
        INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id
        INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id
        INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex3.eixo_id
        INNER JOIN variavel var ON var.variavel = ex3.variavel_id and var.eixo = ex3.eixo_id
      WHERE uf.regiao_id != 0
        and ex3.ano = $1
        and mec.id = $2
        and mod.id = $3
        and pfj.id = $4
        and cad.id = $5
        and var.variavel = $6;
    `, [
      ano,
      mec,
      mod,
      pfj,
      cad,
      variable,
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
    var ano = valueOrDefault(req.query.ano, 0, Number);
    var mec = valueOrDefault(req.query.mec, 0, Number);
    var mod = valueOrDefault(req.query.mod, 0, Number);
    var pfj = valueOrDefault(req.query.pfj, 0, Number);
    var rot = valueOrDefault(req.query.rot, -1, Number);

    const sql = `
    SELECT
      ex3.valor,
      ex3.percentual,
      ex3.taxa,
      mec.nome as mecanismo,
      mod.nome as modalidade,
      pfj.nome as pessoa,
      uf.id as uf_id,
      uf.nome as uf,
      cad.nome as cadeia,
      cad.id as cadeia_id,
      cad.cor as cor,
      cad.gradiente_inferior as cor_inferior,
      cad.gradiente_superior as cor_superior,
      ex.cor_primaria as cor_eixo,
      var.format as formato
    FROM eixo_3 as ex3
      INNER JOIN uf uf ON uf.id = ex3.uf_id
      INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
      INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id
      INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id
      INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
      INNER JOIN eixo ex ON ex.id = ex3.eixo_id
      INNER JOIN variavel var ON var.variavel = ex3.variavel_id and var.eixo = ex3.eixo_id
    WHERE ex3.ano = $1
      and mec.id = $2
      and mod.id = $3
      and pfj.id = $4
      and cad.id = $5
      and uf.id != 0
      and var.variavel = $6
      ${variable >= 18 && rot >= 0 ? "and concentracao = $7" : ''}
      and ex3.eixo_id = 3
      `;

    const params = [ano, mec, mod, pfj, cad, variable];
    if (variable >= 18 && rot >= 0) params.push(rot)

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
    var mec = valueOrDefault(req.query.mec, 0, Number);
    var mod = valueOrDefault(req.query.mod, 0, Number);
    var pfj = valueOrDefault(req.query.pfj, 0, Number);

    const sql = `
      SELECT
        ex3.valor as valor,
        ex3.percentual as percentual,
        ex3.taxa as taxa,
        ano,
        cad.nome as item_nome,
        cad.id as item_id,
        cad.cor as cor,
        var.format as formato
      FROM EIXO_3 as ex3
        INNER JOIN uf uf ON uf.id = ex3.uf_id
        INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
        INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id
        INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id
        INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex3.eixo_id
        INNER JOIN variavel var ON var.variavel = ex3.variavel_id and var.eixo = ex3.eixo_id
      WHERE var.variavel = $1
        AND ex3.uf_id = $2
        and mec.id = $3
        and mod.id = $4
        and pfj.id = $5
        and ex3.cadeia_id != 0
        and ex3.ano = $6
      order by cad.id, ano asc
    `;

    const params = [variable, uf, mec, mod, pfj, ano];

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

    const [variable] = (await query(`select format as formato, titulo, descricao, fonte from variavel v where v.eixo = 3 and v.variavel = $1;`, [varID])).rows;

    const { cor_primaria: primaryColor } = (await query('SELECT cor_primaria FROM eixo WHERE id = 3')).rows[0];

    const sql_eixo = `select id, nome from eixo ex;`
    const sql_var = `select variavel as id, titulo as nome from variavel v where eixo = 3;`
    const sql_uf = `select distinct(uf_id) as id, uf.nome, uf.preposicao
                    from eixo_3 ex3
                      inner join uf on uf.id = ex3.uf_id
                    where variavel_id = ${varID}
                    order by uf_id asc;`

    const sql_ano = `select distinct(ano) as id, ano as nome
                      from eixo_3 e3
                      where variavel_id = ${varID}
                      order by ano ASC;`;



    const sql_cad = `select distinct(cadeia_id) as id, c.nome as nome
                      from eixo_3 ex3
                      inner join cadeia c on c.id = ex3.cadeia_id
                      where variavel_id = ${varID}
                      order by cadeia_id asc;`;

    const sql_mec = `select distinct(ex3.mecanismo_id) as id, mec.nome as nome from eixo_3 ex3
                      inner join mecanismo mec on mec.id = ex3.mecanismo_id 
                      where ex3.variavel_id = ${varID}
                    order by ex3.mecanismo_id  asc;`;

    const sql_mod = `select distinct(ex3.modalidade_id) as id, mod.nome as nome from eixo_3 ex3
                      inner join modalidade mod on mod.id = ex3.modalidade_id 
                      where ex3.variavel_id = ${varID}
                    order by ex3.modalidade_id  asc;`;

    const sql_pfj = `select distinct(ex3.pessoa_id) as id, pfj.nome as nome from eixo_3 ex3
                      inner join pessoa pfj on pfj.id = ex3.pessoa_id 
                      where ex3.variavel_id = ${varID}
                    order by ex3.pessoa_id  asc;`;

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
        id: 'mec',
        label: 'Mecanismo',
        options: await query(sql_mec),
      },
      {
        id: 'mod',
        label: 'Modalidade',
        options: await query(sql_mod),
      },
      {
        id: 'pfj',
        label: 'Pessoa',
        options: await query(sql_pfj),
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
   * Gets the values of a variable in each Region
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getterLinhas(req, res) {
    var variable = valueOrDefault(req.query.var, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var mec = valueOrDefault(req.query.mec, 0, Number);

    const parameters = [
      variable,
      uf,
      cad, 
    ]

    if(variable >= 15) parameters.push(mec)

    const result = await query(`SELECT
        ex3.valor as valor,
        ex3.percentual as percentual,
        ex3.taxa as taxa,
        ano,
        ${variable >= 15 ? `
        CASE
          WHEN concentracao = 0 THEN 'Por UF'
          WHEN concentracao = 1 THEN 'Por SCC'
        end` : `
        mec.nome as
        `} grupo,
        ${variable >= 15 ? 'NULL' : 'mec.id'} as grupo_id,
        ${variable >= 15 ? `
        CASE
          WHEN concentracao = 0 THEN ex.cor_primaria
          WHEN concentracao = 1 THEN ex.cor_secundaria
        end ` : `
        CASE
          WHEN mec.id = 0 THEN ex.cor_primaria
          ELSE mec.cor
        END
        `} cor,
        var.format as formato
      FROM eixo_3 as ex3
        INNER JOIN uf uf ON uf.id = ex3.uf_id
        INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
        INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id
        INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id
        INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex3.eixo_id
        INNER JOIN variavel var ON var.variavel = ex3.variavel_id and var.eixo = ex3.eixo_id
      WHERE var.variavel = $1
        AND ex3.uf_id = $2
        and ex3.cadeia_id = $3
        ${variable >= 15 ? 'and ex3.concentracao IS NOT NULL and mec.id = $4' : 'and mec.id > 0'}
      ORDER BY cad.id, ano, concentracao ASC;`, parameters);
    res.json(result.rows);
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
    const mec = valueOrDefault(req.query.mec, 0, Number);
    const mod = valueOrDefault(req.query.mod, 0, Number);
    const pfj = valueOrDefault(req.query.pfj, 0, Number);

    const mainQuery = await query(`SELECT
      ex.cor_primaria as cor,
      ex3.valor,
      ex3.ano,
      var.format as formato,
      var.fonte,
      uf.id as id_uf,
      uf.nome as nome_uf,
      uf.preposicao as preposicao_uf,
      cad.id as id_cad,
      cad.nome as nome_cad,
      concentracao as conc
    FROM eixo_3 ex3
      INNER JOIN eixo ex ON ex.id = ex3.eixo_id
      INNER JOIN variavel var on var.variavel = ex3.variavel_id and var.eixo = ex.id
      INNER JOIN uf uf ON uf.id = ex3.uf_id
      INNER JOIN cadeia cad ON cad.id = ex3.cadeia_id
      INNER JOIN mecanismo mec ON mec.id = ex3.mecanismo_id 
      INNER JOIN modalidade mod ON mod.id = ex3.modalidade_id
      INNER JOIN pessoa pfj ON pfj.id = ex3.pessoa_id
    WHERE (uf.id = $1 or uf.id = 0)
      and (cad.id = $2 or cad.id = 0)
      and (mec.id = $3)
      and (mod.id = $4)
      and (pfj.id = $5)
      and ex.id = 3
      and var.variavel = $6
      and ex3.ano = $7;`, [
      uf,
      cad,
      mec,
      mod,
      pfj,
      variable,
      ano
    ]);

    let rows = mainQuery.rows;

    // Essas variáveis seguem uma lógica diferente de exibição:
    // Os valores são sempre mostrados de maneira absoluta (e não como porcentagem),
    // o primeiro valor é referente às UFs e o segundo aos setores.
    if ([15, 16].includes(variable)) {
      rows = rows.map(r => ({
        ...r,
        display_absolute: true,
        display_at: r.conc === 0 ? 1 : 2
      }));
    }

    res.json(rows);
  }
 
}

export default Eixo3Controller;

import { fail, valueOrDefault } from '../utils.js';
import { query } from '../database.js';

import views from '../json/Eixo4Views.js'

class Eixo4Controller {

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
  }

  async getBars(req, res) {
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var prc = valueOrDefault(req.query.prc, 0, Number);
    var cns = valueOrDefault(req.query.cns, 0, Number);
    var tpo = valueOrDefault(req.query.tpo, 1, Number);
    var variable = valueOrDefault(req.query.variable, 1, Number);

    var result;
    try {
      result = await query(`
        select
          ex4.valor,
          ex4.percentual,
          ex4.taxa,
          ex4.variavel_id,
          ano,
          uf.nome as uf,
          uf.id as uf_id,
          prc.nome as parceiro,
          prc.id as parceiro_id,
          cns.nome as consumo,
          cns.id as consumo_id,
          tpo.nome as tipo,
          tpo.id as tipo_id,
          cad.nome as cadeia,
          cad.id as cadeia_id,
          cad.cor as cor,
          cad.gradiente_inferior as cor_inferior,
          cad.gradiente_superior as cor_superior,
          ex.cor_primaria as cor_eixo,
          var.format as formato
        from eixo_4 ex4
          INNER JOIN eixo ex ON ex.id = ex4.eixo_id
          INNER JOIN uf uf ON uf.id = ex4.uf_id
          INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
          INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
          INNER JOIN consumo cns ON cns.id = ex4.consumo_id
          INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
          INNER JOIN variavel var ON var.variavel = ex4.variavel_id and var.eixo = ex4.eixo_id
      WHERE uf.id = $1
          and cad.id = $2
          and prc.id = $3
          and cns.id = $4
          and tpo.id = $5
          and ex4.eixo_id = 4
          and var.variavel = $6
        order by ano;
      `, [
        uf,
        cad,
        prc,
        cns,
        tpo,
        variable,
      ]);
    } catch (e) {
      fail(res, String(e));
      return;
    }

    res.json(result.rows);
  }

  async getTreemap(req, res) {
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const tpo = valueOrDefault(req.query.tpo, 0, Number);
    const cns = valueOrDefault(req.query.cns, 2015, Number);
    const prc = valueOrDefault(req.query.prc, 2015, Number);
    const variable = valueOrDefault(req.query.var, 0, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex4.ano,
        cad.id as grupo_id,
        cad.id as item_id,
        cad.nome as grupo_nome,
        cad.nome as item_nome,
        cad.cor as cor,
        var.format as formato
      FROM eixo_4 as ex4
        INNER JOIN uf uf ON uf.id = ex4.uf_id
        INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
        INNER JOIN consumo cns ON cns.id = ex4.consumo_id
        INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
        INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex4.eixo_id
        INNER JOIN variavel var ON var.variavel = ex4.variavel_id and var.eixo = ex.id
      WHERE cad.id != 0
        and uf.id = $1
        and ex4.ano = $2
        and tpo.id = $3
        and cns.id = $4
        and prc.id = $5
        and ex4.variavel_id = $6
      ORDER BY grupo_id, item_id ASC;
    `, [
      uf,
      ano,
      tpo,
      cns,
      prc,
      variable,
    ]);

    res.json(result.rows);
  }

  async getTreemapUF(req, res) {
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const tpo = valueOrDefault(req.query.tpo, 1, Number);
    const cns = valueOrDefault(req.query.cns, 0, Number);
    const prc = valueOrDefault(req.query.prc, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const variable = valueOrDefault(req.query.var, 0, Number);

    const result = await query(`
      SELECT
        valor,
        taxa,
        percentual,
        ex4.ano as ano,
        regiao.id as grupo_id,
        regiao.nome as grupo_nome,
        uf.nome as item_nome,
        uf.id as item_id,
        regiao.cor as cor,
        var.format as formato
      FROM eixo_4 as ex4
        INNER JOIN uf ON uf.id = ex4.uf_id
        INNER JOIN regiao ON regiao.id = uf.regiao_id
        INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
        INNER JOIN consumo cns ON cns.id = ex4.consumo_id
        INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
        INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex4.eixo_id
        INNER JOIN variavel var on var.variavel = ex4.variavel_id and var.eixo = ex.id
      WHERE regiao.id != 0
        and ex4.ano = $1
        and tpo.id = $2
        and cns.id = $3
        and prc.id = $4
        and cad.id = $6
        and ex4.variavel_id = $5
      order by grupo_id, item_id ASC;
    `, [
      ano,
      tpo,
      cns,
      prc,
      variable,
      cad,
    ]);

    res.json(result.rows);
  }

  async getMap(req, res) {
    var ano = valueOrDefault(req.query.ano, 2010, Number);
    var variable = valueOrDefault(req.query.var, 1, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var prc = valueOrDefault(req.query.prc, 0, Number);
    var cns = valueOrDefault(req.query.cns, 0, Number);
    var tpo = valueOrDefault(req.query.tpo, 1, Number);

    const sql = `
      SELECT
        ex4.valor,
        ex4.percentual,
        ex4.taxa,
        ex4.ano,
        prc.nome,
        cns.nome,
        tpo.nome,
        uf.id as uf_id,
        uf.nome as uf,
        cad.nome as cadeia,
        cad.id as cadeia_id,
        cad.cor as cor,
        ex.cor_primaria as cor_eixo,
        var.format as formato
      FROM eixo_4 as ex4
        INNER JOIN uf uf ON uf.id = ex4.uf_id
        INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
        INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
        INNER JOIN consumo cns ON cns.id = ex4.consumo_id
        INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex4.eixo_id
        INNER JOIN variavel var ON var.variavel = ex4.variavel_id and var.eixo = ex4.eixo_id
      WHERE ex4.ano = $1
        and prc.id = $2
        and cns.id = $3
        and tpo.id = $4
        and cad.id = $5
        and uf.id != 0
        and var.variavel = $6
        and ex4.eixo_id = 4;
      `;

    const params = [ano, prc, cns, tpo, cad, variable];

    const result = await query(sql, params);


    res.json(result.rows);
  }

  async getWorld(req, res) {
    var ano = valueOrDefault(req.query.ano, 2010, Number);
    var variable = valueOrDefault(req.query.var, 1, Number);
    var cad = valueOrDefault(req.query.cad, 0, Number);
    var uf = valueOrDefault(req.query.uf, 0, Number);
    var cns = valueOrDefault(req.query.cns, 0, Number);
    var tpo = valueOrDefault(req.query.tpo, 1, Number);

    const sql = `
    SELECT
      ex4.valor,
      ex4.percentual,
      ex4.taxa,
      ex4.ano,
      prc.nome as parceiro,
      prc.id as parceiro_id,
      cns.nome as consumo,
      tpo.nome as tipo,
      uf.id as uf_id,
      uf.nome as uf,
      cad.nome as cadeia,
      cad.id as cadeia_id,
      cad.cor as cor,
      cad.gradiente_inferior as cor_inferior,
      cad.gradiente_superior as cor_superior,
      ex.cor_primaria as cor_eixo,
      var.format as formato
    FROM eixo_4 as ex4
      INNER JOIN uf uf ON uf.id = ex4.uf_id
      INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
      INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
      INNER JOIN consumo cns ON cns.id = ex4.consumo_id
      INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
      INNER JOIN eixo ex ON ex.id = ex4.eixo_id
      INNER JOIN variavel var ON var.variavel = ex4.variavel_id and var.eixo = ex4.eixo_id
    WHERE ex4.ano = $1
      and prc.id != 0
      and cns.id = $2
      and tpo.id = $3
      and cad.id = $4
      and uf.id  = $5
      and var.variavel = $6
      and ex4.eixo_id = 4;
      `;

    const params = [ano, cns, tpo, cad, uf, variable];

    const result = await query(sql, params);


    res.json(result.rows);
  }

  async getDonut(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const ano = valueOrDefault(req.query.ano, 2015, Number);
    const prc = valueOrDefault(req.query.prc, 0, Number);
    const cns = valueOrDefault(req.query.cns, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);

    const sql = `
      SELECT
        ex4.valor,
        ex4.percentual,
        ex4.taxa,
        ano,
        tpo.id as item_id,
        tpo.nome as item_nome,
        CASE
          WHEN tpo.id = 1 THEN ex.cor_primaria
          WHEN tpo.id = 2 THEN ex.cor_secundaria
        end cor,
        var.format as formato
      FROM eixo_4 as ex4
        INNER JOIN uf uf ON uf.id = ex4.uf_id
        INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
        INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
        INNER JOIN consumo cns ON cns.id = ex4.consumo_id
        INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
        INNER JOIN eixo ex ON ex.id = ex4.eixo_id
        INNER JOIN variavel var ON var.variavel = ex4.variavel_id and var.eixo = ex4.eixo_id
      WHERE var.variavel = $1
        AND ex4.uf_id = $2
        and ex4.parceiro_id = $3
        and ex4.tipo_id in (1, 2)
        and ex4.consumo_id = $4
        and ex4.cadeia_id = $5
        and ex4.ano = $6
      order by tpo.id, ano asc;
    `;

    const params = [variable, uf, prc, cns, cad, ano];

    const result = await query(sql, params);

    res.json(result.rows);
  }

  async getConfig(req, res) {
    const varID = valueOrDefault(req.query.var, 1, Number);

    const [variable] = (await query(`select format as formato, titulo, descricao, fonte from variavel v where v.eixo = 4 and v.variavel = $1;`, [varID])).rows;

    const { cor_primaria: primaryColor } = (await query('SELECT cor_primaria FROM eixo WHERE id = 4')).rows[0];


    const sql_eixo = `select id, nome from eixo ex;`
    const sql_var = `select variavel as id, titulo as nome from variavel v where eixo = 4;`
    const sql_uf = `select distinct(uf_id) as id, uf.nome, uf.preposicao
                      from eixo_4 ex4
                      inner join uf on uf.id = ex4.uf_id
                      where variavel_id = ${varID}
                      order by uf_id asc;`

    const sql_ano = `select distinct(ano) as id, ano as nome from eixo_4 e1 where variavel_id = ${varID} order by ano ASC;`

    const sql_cad = `select distinct(cadeia_id) as id, c.nome as nome
                      from eixo_4 ex4
                      inner join cadeia c on c.id = ex4.cadeia_id
                      where variavel_id = ${varID}
                      order by cadeia_id asc;`

    const sql_tpo = `select distinct(tipo_id) as id, t.nome, t.display
                      from eixo_4 ex4
                      inner join tipo t on t.id = ex4.tipo_id
                      where variavel_id = ${varID}
                      order by tipo_id asc;`

    const sql_cns = `select distinct(consumo_id) as id, c.nome as nome
                      from eixo_4 ex4
                      inner join consumo c on c.id = ex4.consumo_id
                      where variavel_id = ${varID}
                      order by consumo_id asc;`

    const sql_prc = `select distinct(parceiro_id) as id, p.nome as nome, p.preposicao
                      from eixo_4 ex4
                      inner join parceiro p on p.id = ex4.parceiro_id
                      where variavel_id = ${varID}
                      order by parceiro_id asc;`

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
        id: 'prc',
        label: 'Parceiro',
        options: await query(sql_prc),
      },
      {
        id: 'tpo',
        label: 'Tipo',
        options: await query(sql_tpo),
      },
      {
        id: 'cns',
        label: 'Consumo',
        options: await query(sql_cns),
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
      }
    ]

    await Promise.all(breadcrumbs.map(b => b.options))

    breadcrumbs = breadcrumbs.map(b => { return { ...b, options: b.options.rows } })
    res.json({
      primaryColor,
      variable,
      breadcrumbs,
    });
  }

  async getInfo(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const prc = valueOrDefault(req.query.prc, 0, Number);
    const cns = valueOrDefault(req.query.cns, 0, Number);
    const tpo = valueOrDefault(req.query.tpo, 0, Number);

    const mainQuery = query(`SELECT
      ex.cor_primaria as cor,
      ex4.valor,
      ex4.ano,
      var.format as formato,
      var.fonte,
      uf.id as id_uf,
      uf.nome as nome_uf,
      uf.preposicao as preposicao_uf,
      cad.id as id_cad,
      cad.nome as nome_cad,
      prc.id as id_parceiro,
      prc.nome as nome_parceiro,
      cns.id as id_consumo,
      cns.nome as nome_consumo,
      tpo.id as id_tipo,
      tpo.nome as nome_tipo
    FROM eixo_4 ex4
      INNER JOIN eixo ex ON ex.id = ex4.eixo_id
      INNER JOIN variavel var on var.variavel = ex4.variavel_id and var.eixo = ex.id
      INNER JOIN uf uf ON uf.id = ex4.uf_id
      INNER JOIN cadeia cad ON cad.id = ex4.cadeia_id
      INNER JOIN parceiro prc ON prc.id = ex4.parceiro_id
      INNER JOIN consumo cns ON cns.id = ex4.consumo_id
      INNER JOIN tipo tpo ON tpo.id = ex4.tipo_id
    WHERE (uf.id = $1 or uf.id = 0)
      and (cad.id = $2 or cad.id = 0)
      and (tpo.id = $3 or tpo.id = 0)
      and (prc.id = $4 or prc.id = 0)
      and (cns.id = $5 or cns.id = 0)
      and ex.id = 4
      and var.variavel = $6
      and ex4.ano = $7;`, [
      uf,
      cad,
      tpo,
      prc,
      cns,
      variable,
      ano
    ]);

    const rows = (await mainQuery).rows

    res.json(rows);
  }
}

export default Eixo4Controller;
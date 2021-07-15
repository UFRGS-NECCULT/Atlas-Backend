import { query } from '../database.js';
import { valueOrDefault } from '../utils.js';

const degs = {
  1: ['prt.PorteNome', 'prt.idPorte'],
  2: ['ex.Sexo', 'ex.Sexo'],
  3: ['age.IdadeNome', 'age.idIdade'],
  4: ['esc.EscolaridadeNome', 'esc.idEscolaridade'],
  5: ['eti.EtiniaNome', 'eti.idEtinia'],
  6: ['ex.Formalidade', 'ex.Formalidade'],
  7: ['ex.Previdencia', 'ex.Previdencia'],
  8: ['ex.Sindical', 'ex.Sindical'],
}

/**
 * Retorna três valores:
 *  - O nome ou valor do campo de agrupamento (desagregação).
 *    Caso nenhum dos parâmetros resulte em uma desagregação, seu valor será null.
 *  - O nome ou valor do campo de ID da desagregação
 *  - O tipo do nome retornado. ?? quando foi retornado o nome de uma coluna,
 *    ? quando foi retornado um valor
 *
 * @param {number} deg A desagregação desejada (0 = nenhuma)
 * @param {number} cad A cadeia desejada (0 = todas)
 * @param {number} ocp A ocupação desejada (3 = todas)
 * @returns {[string, string, ('?'|'??')]}
 */
function getGrupo(deg, cad, ocp) {
  if (Object.keys(degs).includes(deg.toString())) {
    return [...degs[deg], '??'];
  }

  if (ocp === 3) {
    return ['ocp.OcupacaoNome', 'ocp.idOcupacao', '??'];
  }

  if (cad === 0) {
    return ['cad.CadeiaNome', 'cad.idCadeia', '??'];
  }

  // Caso nenhum dos critérios acima
  // sejam cumpridos, não existem grupos
  return [null, null, '?'];
}

class Eixo2Controller {
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

    const [groupNameField, groupIDField, groupType] = getGrupo(deg, cad, ocp);

    var sql = `
      select 
        ex2.valor,
        ex2.percentual,
        ex2.taxa,
        ex2.variavel_id,
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
          inner join subdesagregacao sdg ON sdg.id = ex2.subdesagregacao_id
          inner join (
            select d2.id as desagregacao_id from subdesagregacao s2
              inner join desagregacao d2 on s2.desagregacao_id = d2.id
              where s2.id = $1
            ) as filter_deg on filter_deg.desagregacao_id = sdg.desagregacao_id
      WHERE uf.id = $2
          and cad.id = $3
          and ex2.eixo_id = 2
          and ex2.variavel_id = $4
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

    const [groupNameField, groupIDField, groupType] = getGrupo(deg, cad, ocp);

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
        SUM(valor) as valor,
        SUM(taxa) as taxa,
        SUM(percentual) as percentual,
        ex2.ano as ano,
        cad.nome as cadeia,
        cad.id as cadeia_id,
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
      GROUP BY cad.id, cad.nome, cad.cor, ex2.ano,var.format
      order by cadeia_id ASC;
    `, [
      uf,
      ano,
      ocp,
      variable,
      deg,
    ])

    res.json(result.rows);
  }

  /**
   * Retorna os dados necessários para a montagem de um treemap
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getTreemapRegion(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const cad = valueOrDefault(req.query.cad, 0, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);
    const subdeg = valueOrDefault(req.query.subdeg, 0, Number);

    var sql = `SELECT
        SUM(Valor) as Valor,
        SUM(Percentual) as Percentual,
        SUM(Taxa) as Taxa,
        uf.UFRegiao as NomeGrupo
      FROM Eixo_2 as ex
        INNER JOIN UF AS uf ON uf.idUF = ex.idUF
        INNER JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
        INNER JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao
        INNER JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia AS eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Idade AS age ON age.idIdade = ex.idIdade
      WHERE ex.Numero = ? AND
        ocp.idOcupacao = ? AND
        prt.idPorte = ? AND
        esc.idEscolaridade = ? AND
        eti.idEtinia = ? AND
        age.idIdade = ? AND
        ex.Formalidade = ? AND
        ex.Previdencia = ? AND
        ex.Sindical = ?
    `;
    var params = [
      variable,
      ocp,
      deg === 1 ? subdeg : 0,
      deg === 3 ? subdeg : 0,
      deg === 4 ? subdeg : 0,
      deg === 5 ? subdeg : 0,
      deg === 6 ? subdeg : 0,
      deg === 7 ? subdeg : 0,
      deg === 8 ? subdeg : 0,
    ];

    if (deg === 2) {
      sql += ' AND ex.Sexo = ?';
      params.push(subdeg);
    } else {
      sql += ' AND ex.Sexo IS NULL';
    }

    if (ocp !== 0) {
      sql += ' AND cad.idCadeia = ?';
      params.push(cad);
    }

    if (ano > 0) {
      sql += ' AND ex.Ano = ?';
      params.push(ano);
    }

    sql += ' GROUP BY NomeGrupo';

    res.json(await query(sql, params));
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
        cad.nome as cadeia,
        cad.id as cadeia_id,
        cad.cor as cor
      FROM EIXO_1 as ex2
        INNER JOIN uf uf ON uf.id = ex2.uf_id 
        INNER JOIN atuacao atc ON atc.id = ex2.atuacao_id 
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

  async getBreadcrumb(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);



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

    await Promise.all(breadcrumbs.map(b => b.options))

    breadcrumbs = breadcrumbs.map(b => { return { ...b, options: b.options.rows } })
    res.json(breadcrumbs);
  }

}


export default Eixo2Controller;
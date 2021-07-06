import { query } from '../database.js';
import { valueOrDefault } from '../utils.js';

const degs = {
  1: 'prt.PorteNome',
  2: 'ex.Sexo',
  3: 'age.IdadeNome',
  4: 'esc.EscolaridadeNome',
  5: 'eti.EtiniaNome',
  6: 'ex.Formalidade',
  7: 'ex.Previdencia',
  8: 'ex.Sindical',
}

/**
 * Retorna dois valores:
 *  - O nome ou valor do campo de agrupamento (desagregação).
 *    Caso nenhum dos parâmetros resulte em uma desagregação, o grupo será NULL.
 *  - O tipo do nome retornado. ?? quando foi retornado o nome de uma coluna,
 *    ? quando foi retornado um valor
 *
 * @param {number} deg A desagregação desejada (0 = nenhuma)
 * @param {number} cad A cadeia desejada (0 = todas)
 * @param {number} ocp A ocupação desejada (3 = todas)
 * @returns {[string, ('?'|'??')]}
 */
function getGrupo(deg, cad, ocp) {
  if (Object.keys(degs).includes(deg.toString())) {
    return [degs[deg], '??'];
  }

  if (ocp === 3) {
    return ['ocp.OcupacaoNome', '??'];
  }

  if (cad === 0) {
    return ['cad.CadeiaNome', '??'];
  }

  // Caso nenhum dos critérios acima
  // sejam cumpridos, não existem grupos
  return [null, '?'];
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

    const [groupField, groupType] = getGrupo(deg, cad, ocp);

    var sql = `
      select 
        ex2.valor,
        ex2.percentual,
        ex2.taxa,
        ex2.variavel_id,
          ano,
          ocp.nome as ocupacao,
          uf.nome as uf, 
          cad.nome as cadeia,
          cad.cor as cor,
          ex.cor_primaria as cor_eixo,
          filter_subdeg.nome as desagregacao,
          filter_subdeg.id as desagregacao_id,
          ex2.subdesagregacao_id as sdg_id,
          agg_sdg.cor as sdg_cor,
          agg_sdg.nome as sdg_nome
      from eixo_2 ex2 
          INNER JOIN eixo ex ON ex.id = ex2.eixo_id 
          INNER JOIN uf uf ON uf.id = ex2.uf_id 
          INNER JOIN ocupacao ocp ON ocp.id = ex2.ocupacao_id 
          INNER JOIN cadeia cad ON cad.id = ex2.cadeia_id  
          inner join subdesagregacao sdg ON sdg.id = ex2.subdesagregacao_id
          inner join (
            select s2.*, d2.nome from subdesagregacao s2
            inner join desagregacao d2 on s2.desagregacao_id = d2.id
            where s2.id = $1
          ) as filter_subdeg on filter_subdeg.desagregacao_id = sdg.desagregacao_id
          inner join (
            select 
            s.id as sdg_id,
            d.nome as dg_nome,
            coalesce (prt.nome, esc.nome, etn.nome, snd.nome, idd.nome, prv.nome, frm.nome, sex.nome) as nome,
            coalesce (prt.cor, esc.cor, etn.cor, snd.cor, idd.cor, prv.cor, frm.cor, sex.cor) as cor
          from subdesagregacao s 
          inner join desagregacao d on d.id = s.desagregacao_id
            left  join porte prt on s.subdesagregacao_id = prt.id and s.desagregacao_id = 1
            left  join escolaridade esc on s.subdesagregacao_id = esc.id and s.desagregacao_id = 2
            left  join etinia etn on s.subdesagregacao_id = etn.id and s.desagregacao_id = 3
            left  join sindicato snd on s.subdesagregacao_id = snd.id and s.desagregacao_id = 4
            left  join idade idd on s.subdesagregacao_id = idd.id and s.desagregacao_id = 5
            left  join previdencia prv on s.subdesagregacao_id = prv.id and s.desagregacao_id = 6
            left  join formalidade frm on s.subdesagregacao_id = frm.id and s.desagregacao_id = 7
            left  join sexo sex on s.subdesagregacao_id = sex.id and s.desagregacao_id = 8
          ) as agg_sdg on sdg.id  = agg_sdg.sdg_id 
      WHERE uf.id = $2 
          and cad.id = $3
          and ex2.eixo_id = 2
          and ex2.variavel_id = $4;
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

    const [groupField, groupType] = getGrupo(deg, cad, ocp);

    var sql = `SELECT
        SUM(ex.Valor) as Valor,
        ex.Ano,
        ${groupType} as NomeGrupo
      FROM Eixo_2 as ex
        INNER JOIN Porte as prt ON prt.idPorte = ex.idPorte
        INNER JOIN Idade as age ON age.idIdade = ex.idIdade
        INNER JOIN Escolaridade as esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia as eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Ocupacao as ocp ON ocp.idOcupacao = ex.idOcupacao
      WHERE Numero = ? AND idUF = ?`;
    var params = [groupField, variable, uf];

    if (ocp === 0) {
      if (cad === 0) {
        sql += ' AND ex.idCadeia != 0';
      } else {
        sql += ' AND ex.idCadeia = ?';
        params.push(cad);
      }
    }

    if (ocp === 3) {
      sql += ' AND (ex.idOcupacao = 1 OR ex.idOcupacao = 2)';
    } else {
      sql += ' AND ex.idOcupacao = ?';
      params.push(ocp);
    }

    if (deg === 2) {
      sql += ' AND (ex.Sexo = 1 OR ex.Sexo = 0)';
    } else {
      sql += ' AND ex.Sexo IS NULL';
    }
    const operator = (id) => deg == id ? '>' : '=';
    sql += ` AND ex.idPorte ${operator(1)} 0
      AND ex.idIdade ${operator(3)} 0
      AND ex.idEscolaridade ${operator(4)} 0
      AND ex.idEtinia ${operator(5)} 0
      AND ex.Formalidade ${operator(6)} 0
      AND ex.Previdencia ${operator(7)} 0
      AND ex.Sindical ${operator(8)} 0`;

    sql += ' GROUP BY ex.Ano, NomeGrupo';
    sql += ' ORDER BY NomeGrupo, Ano';

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

    var sql = `SELECT
        SUM(Valor) as valor,
        uf.idUF as uf
      FROM Eixo_2 as ex
        INNER JOIN UF AS uf ON uf.idUF = ex.idUF
        INNER JOIN Cadeia AS cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Porte AS prt ON prt.idPorte = ex.idPorte
        INNER JOIN Ocupacao AS ocp ON ocp.idOcupacao = ex.idOcupacao
        INNER JOIN Escolaridade AS esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia AS eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Idade AS age ON age.idIdade = ex.idIdade
      WHERE ex.Numero = ? AND
        prt.idPorte = 0 AND
        esc.idEscolaridade = 0 AND
        eti.idEtinia = 0 AND
        age.idIdade = 0 AND
        ex.Sindical = 0 AND
        ex.Previdencia = 0 AND
        ex.Formalidade = 0 AND
        ex.Sexo IS NULL AND
        cad.idCadeia = ?`;
    var params = [variable, cad];

    if (ocp === 3) {
      sql += ' AND ocp.idOcupacao != 0';
    } else {
      sql += ' AND ocp.idOcupacao = ?';
      params.push(ocp);
    }

    if (ano > 0) {
      sql += ' AND ex.Ano = ?';
      params.push(ano);
    }

    sql += ' GROUP BY uf.idUF';

    res.json(await query(sql, params));
  }

  /**
   * Retorna os dados necessários para a montagem de um treemap
   * @param {import('express').Request} req
   * @param {import('express').Response} res
   */
  async getTreemapSCC(req, res) {
    const variable = valueOrDefault(req.query.var, 0, Number);
    const uf = valueOrDefault(req.query.uf, 0, Number);
    const ocp = valueOrDefault(req.query.ocp, 0, Number);
    const deg = valueOrDefault(req.query.deg, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);

    const [groupField, groupType] = getGrupo(deg, 0, ocp !== 0 ? 3 : 0);

    var sql = `SELECT
        SUM(Valor) as Valor,
        SUM(Taxa) as Taxa,
        SUM(Percentual) as Percentual,
        ${groupType} as NomeGrupo
      FROM Eixo_2 as ex
        INNER JOIN Porte as prt ON prt.idPorte = ex.idPorte
        INNER JOIN Idade as age ON age.idIdade = ex.idIdade
        INNER JOIN Escolaridade as esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia as eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Ocupacao as ocp ON ocp.idOcupacao = ex.idOcupacao
      WHERE ex.Numero = ? AND
        ex.idUF = ?`;
    var params = [groupField, variable, uf];

    if (ocp === 0) {
      sql += ' AND ex.idCadeia > 0 AND ex.idOcupacao = 0';
    } else {
      sql += ' AND (ex.idOcupacao = 1 OR ex.idOcupacao = 2)';
    }

    if (deg === 2) {
      sql += ' AND ex.SEXO IS NOT NULL';
    } else {
      sql += ' AND ex.Sexo IS NULL';
    }
    const operator = (id) => deg == id ? '>' : '=';
    sql += ` AND ex.idPorte ${operator(1)} 0
      AND ex.idIdade ${operator(3)} 0
      AND ex.idEscolaridade ${operator(4)} 0
      AND ex.idEtinia ${operator(5)} 0
      AND ex.Formalidade ${operator(6)} 0
      AND ex.Previdencia ${operator(7)} 0
      AND ex.Sindical ${operator(8)} 0`;

    if (ano > 0) {
      sql += ' AND ex.Ano = ?';
      params.push(ano);
    }

    sql += ' GROUP BY NomeGrupo';

    res.json(await query(sql, params));
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
}


export default Eixo2Controller;
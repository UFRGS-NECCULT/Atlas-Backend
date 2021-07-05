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

    var sql = `SELECT
        SUM(Valor) as Valor,
        Ano,
        ${groupType} as NomeGrupo,
        ${groupType} as IDGrupo
      FROM Eixo_2 as ex
        INNER JOIN Porte as prt ON prt.idPorte = ex.idPorte
        INNER JOIN Idade as age ON age.idIdade = ex.idIdade
        INNER JOIN Escolaridade as esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia as eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Ocupacao as ocp ON ocp.idOcupacao = ex.idOcupacao
      WHERE Numero = ? AND ex.idUF = ?`;
    var params = [groupNameField, groupIDField, variable, uf];

    if (ocp === 0) {
      if (variable > 11) {
        sql += ' AND ex.idCadeia = ?';
        params.push(uos);
      } else if (deg !== 0 && cad === 0) {
        sql += ' AND ex.idCadeia != 0';
      } else {
        if (uos === 1 && variable === 6 && deg === 0) {
          sql += ' AND ex.idCadeia != 0';
        } else {
          sql += ' AND ex.idCadeia = ?';
          params.push(cad);
        }
      }
      sql += ' AND ex.idOcupacao = 0';
    } else if (variable === 6 && ocp !== 0) {
      sql += ' AND (ex.idOcupacao = 1 OR ex.idOcupacao = 2)';
    } else if (ocp == 1) {
      sql += ' AND ex.idOcupacao = 1';
    } else if (ocp === 2) {
      sql += ' AND ex.idOcupacao = 2';
    } else if (ocp === 3) {
      // Os índices IHH e C4 da ocupação são definidos pelo uos
      if (variable > 11) {
        if (uos === 0) {
          sql += ' AND ex.idOcupacao = 1';
        } else {
          sql += ' AND ex.idOcupacao = 2';
        }
      } else {
        sql += ' AND (ex.idOcupacao = 1 OR ex.idOcupacao = 2)';
      }
    }

    if ([4, 5].includes(variable) || (variable === 6 && uos === 0)) {
      if (deg === 2 && subdeg >= 0) {
        sql += ' AND ex.Sexo = ?';
        params.push(subdeg);
      } else {
        sql += ' AND ex.Sexo IS NULL';
      }

      sql += ` AND ex.idPorte = ?
        AND ex.idIdade = ?
        AND ex.idEscolaridade = ?
        AND ex.idEtinia = ?
        AND ex.Formalidade = ?
        AND ex.Previdencia = ?
        AND ex.Sindical = ?`;
      params.push(
        deg === 1 ? subdeg : 0,
        deg === 3 ? subdeg : 0,
        deg === 4 ? subdeg : 0,
        deg === 5 ? subdeg : 0,
        deg === 6 ? subdeg : 0,
        deg === 7 ? subdeg : 0,
        deg === 8 ? subdeg : 0,
      );
    } else {
      if (deg === 2) {
        sql += ' AND (Sexo = 1 OR Sexo = 0)';
      } else {
        sql += ' AND Sexo IS NULL';
      }

      const operator = (id) => deg == id ? '>' : '=';
      sql += ` AND ex.idPorte ${operator(1)} 0
        AND ex.idIdade ${operator(3)} 0
        AND ex.idEscolaridade ${operator(4)} 0
        AND ex.idEtinia ${operator(5)} 0
        AND ex.Formalidade ${operator(6)} 0
        AND ex.Previdencia ${operator(7)} 0
        AND ex.Sindical ${operator(8)} 0`;
    }

    if (uos === 1 && variable === 6) {
      sql += ' AND Ano = ?';
      params.push(ano);
    }

    sql += ' GROUP BY Ano, NomeGrupo, IDGrupo';
    sql += ' ORDER BY Ano';

    res.json(await query(sql, params));
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

    var sql = `SELECT
        SUM(ex.Valor) as Valor,
        ex.Ano,
        ${groupType} as NomeGrupo,
        ${groupType} as IDGrupo
      FROM Eixo_2 as ex
        INNER JOIN Porte as prt ON prt.idPorte = ex.idPorte
        INNER JOIN Idade as age ON age.idIdade = ex.idIdade
        INNER JOIN Escolaridade as esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia as eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Ocupacao as ocp ON ocp.idOcupacao = ex.idOcupacao
      WHERE Numero = ? AND idUF = ?`;
    var params = [groupNameField, groupIDField, variable, uf];

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

    sql += ' GROUP BY ex.Ano, NomeGrupo, IDGrupo';
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

    const [groupNameField, groupIDField, groupType] = getGrupo(deg, 0, ocp !== 0 ? 3 : 0);

    var sql = `SELECT
        SUM(Valor) as Valor,
        SUM(Taxa) as Taxa,
        SUM(Percentual) as Percentual,
        ${groupType} as NomeGrupo,
        ${groupType} as IDGrupo
      FROM Eixo_2 as ex
        INNER JOIN Porte as prt ON prt.idPorte = ex.idPorte
        INNER JOIN Idade as age ON age.idIdade = ex.idIdade
        INNER JOIN Escolaridade as esc ON esc.idEscolaridade = ex.idEscolaridade
        INNER JOIN Etinia as eti ON eti.idEtinia = ex.idEtinia
        INNER JOIN Cadeia as cad ON cad.idCadeia = ex.idCadeia
        INNER JOIN Ocupacao as ocp ON ocp.idOcupacao = ex.idOcupacao
      WHERE ex.Numero = ? AND
        ex.idUF = ?`;
    var params = [groupNameField, groupIDField, variable, uf];

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

    sql += ' GROUP BY NomeGrupo, IDGrupo';

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
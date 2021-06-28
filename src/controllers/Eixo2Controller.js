import { query } from '../database.js';
import { valueOrDefault } from '../utils.js';

const desags = {
  1: 'prt.PorteNome',
  2: 'ex.Sexo',
  3: 'age.IdadeNome',
  4: 'esc.EscolaridadeNome',
  5: 'eti.EtiniaNome',
  6: 'ex.Formalidade',
  7: 'ex.Previdencia',
  8: 'ex.Sindical',
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
    const desag = valueOrDefault(req.query.desag, 0, Number);
    const subdeg = valueOrDefault(req.query.subdeg, 0, Number);
    const ano = valueOrDefault(req.query.ano, 0, Number);

    var sql = `SELECT
        SUM(Valor) as Valor,
        SUM(Percentual) as Percentual,
        Ano`;
    var params = [];

    if (desag !== 0) {
      if (!Object.keys(desags).includes(desag.toString())) {
        fail(res, 'Invalid parameters!', 400);
        return;
      }

      const desagField = desags[desag];
      sql += ', ?? as Desag';
      params.push(desagField);
    }

    sql += ` FROM Eixo_2 as ex
        LEFT JOIN Porte as prt ON prt.idPorte = ex.idPorte
        LEFT JOIN Idade as age ON age.idIdade = ex.idIdade
        LEFT JOIN Escolaridade as esc ON esc.idEscolaridade = ex.idEscolaridade
        LEFT JOIN Etinia as eti ON eti.idEtinia = eti.idEtinia
      WHERE Numero = ? AND ex.idUF = ?`;
    var group = ` GROUP BY
      ex.Ano,
      ex.idUF,
      ex.idPorte,
      ex.Sexo,
      ex.idIdade,
      ex.idEscolaridade,
      ex.idEtinia,
      ex.Formalidade,
      ex.Previdencia,
      ex.Sindical`;
    params.push(variable, uf);

    if (ocp === 0) {
      if (variable > 11) {
        sql += ' AND idCadeia = ?';
        params.push(uos);
      } else if (desag !== 0 && cad === 0) {
        sql += ' AND idCadeia != 0';
      } else {
        if (uos === 1 && variable === 6 && desag === 0) {
          sql += ' AND idCadeia != 0';
        } else {
          sql += ' AND idCadeia = ?';
          params.push(cad);
        }
      }
      sql += ' AND idOcupacao = 0';
    } else if (variable === 6 && ocp !== 0) {
      sql += ' AND (idOcupacao = 1 OR idOcupacao = 2)';
    } else if (ocp == 1) {
      sql += ' AND idOcupacao = 1';
    } else if (ocp === 2) {
      sql += ' AND idOcupacao = 2';
    } else if (ocp === 3) {
      // Os índices IHH e C4 da ocupação são definidos pelo uos
      if (variable > 11) {
        if (uos === 0) {
          sql += ' AND idOcupacao = 1';
        } else {
          sql += ' AND idOcupacao = 2';
        }
      } else {
        sql += ' AND (idOcupacao = 1 OR idOcupacao = 2)';
      }
    }

    if ([4, 5].includes(variable) || (variable === 6 && uos === 0)) {
      if (desag === 2 && subdeg >= 0) {
        sql += ' AND Sexo = ?';
        params.push(subdeg);
      } else {
        sql += ' AND Sexo IS NULL';
      }

      sql += ` AND ex.idPorte = ?
        AND ex.idIdade = ?
        AND ex.idEscolaridade = ?
        AND ex.idEtinia = ?
        AND ex.Formalidade = ?
        AND ex.Previdencia = ?
        AND ex.Sindical = ?`;
      params.push(
        desag === 1 ? subdeg : 0,
        desag === 3 ? subdeg : 0,
        desag === 4 ? subdeg : 0,
        desag === 5 ? subdeg : 0,
        desag === 6 ? subdeg : 0,
        desag === 7 ? subdeg : 0,
        desag === 8 ? subdeg : 0,
      );
    } else {
      if (desag === 2) {
        sql += ' AND (Sexo = 1 OR Sexo = 0)';
      } else {
        sql += ' AND Sexo IS NULL';
      }

      const operator = (id) => desag == id ? '>' : '=';
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

    sql += group;
    sql += ' ORDER BY Ano';

    res.json(await query(sql, params));
  }
}

export default Eixo2Controller;

import { fail, valueOrDefault } from '../utils.js';
import { query } from '../database.js';
import path from 'path';

const sheets = [
  //EIXO 1
  { id: 10101, eixo: 1, variable: 1, label: 'NUMERO TOTAL DE EMPRESAS', file: 'E01V01 - NUMERO TOTAL DE EMPRESAS' },
  { id: 10201, eixo: 1, variable: 2, label: 'PARTICIPACAO', file: 'E01V02 - PARTICIPACAO' },
  { id: 10301, eixo: 1, variable: 3, label: 'VARIACAO TOTAL', file: 'E01V03 - VARIACAO TOTAL' },
  { id: 10401, eixo: 1, variable: 4, label: 'RECEITA TOTAL BRUTA', file: 'E01V04 - RECEITA TOTAL BRUTA' },
  { id: 10501, eixo: 1, variable: 5, label: 'RECEITA OPERACIONAL LIQUIDA', file: 'E01V05 - RECEITA OPERACIONAL LIQUIDA' },
  { id: 10601, eixo: 1, variable: 6, label: 'CUSTO', file: 'E01V06 - CUSTO' },
  { id: 10701, eixo: 1, variable: 7, label: 'LUCRO', file: 'E01V07 - LUCRO' },
  { id: 10801, eixo: 1, variable: 8, label: 'VALOR ADICIONADO', file: 'E01V08 - VALOR ADICIONADO' },
  { id: 10901, eixo: 1, variable: 9, label: 'VALOR ADICIONADO PIB', file: 'E01V09 - VALOR ADICIONADO PIB' },
  { id: 11001, eixo: 1, variable: 10, label: 'IHH EMPRESAS', file: 'E01V10 - IHH EMPRESAS' },
  { id: 11101, eixo: 1, variable: 11, label: 'IHH VALOR ADICIONADO', file: 'E01V11 - IHH VALOR ADICIONADO' },
  { id: 11201, eixo: 1, variable: 12, label: 'C4 EMPRESAS', file: 'E01V12 - C4 EMPRESAS' },
  { id: 11301, eixo: 1, variable: 13, label: 'VALOR ADICIONADO', file: 'E01V13 - VALOR ADICIONADO' },

  //EIXO 2
  { id: 20101, eixo: 2, variable: 1, label: 'TOTAL DE OCUPADOS', file: 'E02V01 - TOTAL DE OCUPADOS' },
  { id: 20102, eixo: 2, variable: 2, label: 'PARTICIPACAO DA CULTURA', file: 'E02V02 - PARTICIPACAO DA CULTURA' },
  { id: 20104, eixo: 2, variable: 4, label: 'REMUNERACAO MENSAL MEDIA', file: 'E02V04 - REMUNERACAO MENSAL MEDIA' },
  { id: 20105, eixo: 2, variable: 5, label: 'REMUNERACAO POR HORA TRABALHADA', file: 'E02V05 - REMUNERACAO POR HORA TRABALHADA' },
  { id: 20106, eixo: 2, variable: 6, label: 'JORNADA MEDIA', file: 'E02V06 - JORNADA MEDIA' },
  { id: 20107, eixo: 2, variable: 7, label: 'MASSA SALARIAL', file: 'E02V07 - MASSA SALARIAL' },
  { id: 20109, eixo: 2, variable: 9, label: 'RAZAO MASSA SALARIAL', file: 'E02V09 - RAZAO MASSA SALARIAL' },
  { id: 20111, eixo: 2, variable: 11, label: 'RAZAO MASSA SALARIAL CUSTOS', file: 'E02V11 - RAZAO MASSA SALARIAL CUSTOS' },
  { id: 20112, eixo: 2, variable: 12, label: 'C4 do Total de Ocupados', file: 'E02V12 - C4 do Total de Ocupados' },
  { id: 20113, eixo: 2, variable: 13, label: 'C4 da Massa Salarial', file: 'E02V13 - C4 da Massa Salarial' },
  { id: 20114, eixo: 2, variable: 14, label: 'IHH do Total de Ocupados', file: 'E02V14 - IHH do Total de Ocupados' },
  { id: 20115, eixo: 2, variable: 15, label: 'xxxIHH do Total da Massa Salarialx', file: 'E02V15 - IHH do Total da Massa Salarial' },

  //EIXO 4
  { id: 40101, eixo: 4, variable: 1, label: 'Mundo', file: 'E04V01 - MUNDO' },
  { id: 40102, eixo: 4, variable: 1, label: 'África', file: 'E04V01 - AFRICA' },
  { id: 40103, eixo: 4, variable: 1, label: 'América do Norte', file: 'E04V01 - AMERICA NORTE' },
  { id: 40104, eixo: 4, variable: 1, label: 'América do Sul e Central', file: 'E04V01 - AMERICA SUL CENTRAL' },
  { id: 40105, eixo: 4, variable: 1, label: 'Ásia', file: 'E04V01 - ASIA' },
  { id: 40106, eixo: 4, variable: 1, label: 'Europa', file: 'E04V01 - EUROPA' },
  { id: 40107, eixo: 4, variable: 1, label: 'Oceania', file: 'E04V01 - OCEANIA' },

  { id: 40201, eixo: 4, variable: 2, label: 'Mundo', file: 'E04V02 - MUNDO' },
  { id: 40202, eixo: 4, variable: 2, label: 'África', file: 'E04V02 - AFRICA' },
  { id: 40203, eixo: 4, variable: 2, label: 'América do Norte', file: 'E04V02 - AMERICA NORTE' },
  { id: 40204, eixo: 4, variable: 2, label: 'América do Sul e Central', file: 'E04V02 - AMERICA SUL CENTRAL' },
  { id: 40205, eixo: 4, variable: 2, label: 'Ásia', file: 'E04V02 - ASIA' },
  { id: 40206, eixo: 4, variable: 2, label: 'Europa', file: 'E04V02 - EUROPA' },
  { id: 40207, eixo: 4, variable: 2, label: 'Oceania', file: 'E04V02 - OCEANIA' },

  { id: 40301, eixo: 4, variable: 3, label: 'Mundo', file: 'E04V03 - MUNDO' },
  { id: 40302, eixo: 4, variable: 3, label: 'África', file: 'E04V03 - AFRICA' },
  { id: 40303, eixo: 4, variable: 3, label: 'América do Norte', file: 'E04V03 - AMERICA NORTE' },
  { id: 40304, eixo: 4, variable: 3, label: 'América do Sul e Central', file: 'E04V03 - AMERICA SUL CENTRAL' },
  { id: 40305, eixo: 4, variable: 3, label: 'Ásia', file: 'E04V03 - ASIA' },
  { id: 40306, eixo: 4, variable: 3, label: 'Europa', file: 'E04V03 - EUROPA' },
  { id: 40307, eixo: 4, variable: 3, label: 'Oceania', file: 'E04V03 - OCEANIA' },

  { id: 40501, eixo: 4, variable: 5, label: 'C2 Parceiros', file: 'E04V05 - C2 PARCEIROS' },
  { id: 40601, eixo: 4, variable: 6, label: 'C4 SETORES', file: 'E04V06 - C4 SETORES' },
  { id: 40701, eixo: 4, variable: 7, label: 'C4 UFS', file: 'E04V07 - C4 UFS' },
  { id: 40801, eixo: 4, variable: 8, label: 'IHH PARCEIROS', file: 'E04V08 - IHH PARCEIROS' },
  { id: 40901, eixo: 4, variable: 9, label: 'IHH SETORES', file: 'E04V09 - IHH SETORES' },
  { id: 41001, eixo: 4, variable: 10, label: 'IHH UFs', file: 'E04V10 - IHH UFs' },

  { id: 41401, eixo: 4, variable: 14, label: 'Mundo', file: 'E04V14 - MUNDO' },
  { id: 41402, eixo: 4, variable: 14, label: 'África', file: 'E04V14 - AFRICA' },
  { id: 41403, eixo: 4, variable: 14, label: 'América do Norte', file: 'E04V14 - AMERICA NORTE' },
  { id: 41404, eixo: 4, variable: 14, label: 'América do Sul e Central', file: 'E04V14 - AMERICA SUL CENTRAL' },
  { id: 41405, eixo: 4, variable: 14, label: 'Ásia', file: 'E04V14 - ASIA' },
  { id: 41406, eixo: 4, variable: 14, label: 'Europa', file: 'E04V14 - EUROPA' },
  { id: 41407, eixo: 4, variable: 14, label: 'Oceania', file: 'E04V14 - OCEANIA' },
]

class CommonController {
  async getCsvFiles(req, res) {
    const variable = valueOrDefault(req.query.var, 1, Number);
    const ex = valueOrDefault(req.query.ex, 1, Number);

    try {
      const variableFiles = sheets.filter(file => file.variable === variable && file.eixo === ex);
      return res.json(variableFiles);
    } catch (e) {
      console.log(e)
      res.sendStatus(404);
    }

  }

  async getCsv(req, res) {
    const id = valueOrDefault(req.query.id, 1, Number);

    const sheet = sheets.find(sheet => sheet.id === id)

    if (!sheet) return res.sendStatus(404);

    try {
      const csvDir = path.resolve('src', 'data', 'sheets');

      const filename = sheet.file + '.xlsx';
      const filepath = path.join(csvDir, filename)

      return res.download(filepath, filename), (err) => console.log(err);
    } catch (e) {
      res.sendStatus(404);
    }

  }
}

export default CommonController;
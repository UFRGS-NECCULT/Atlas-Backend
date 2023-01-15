import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const insert = 'insert into eixo_2 (variavel_id, uf_id, cadeia_id, ocupacao_id, subdesagregacao_id, concentracao, ano, valor, percentual, taxa) values \n'

const sheets_dir = path.resolve('src', 'data', 'sheets');

const variaveis = [1, 2, 4, 5, 6, 7, 9, 11, 12, 13, 14, 15]
const variavel = 15;
const eixo_2_sheets = [
  'E02V01 - TOTAL DE OCUPADOS',
  'E02V02 - PARTICIPACAO DA CULTURA',
  'E02V03 - ',
  'E02V04 - REMUNERACAO MENSAL MEDIA',
  'E02V05 - REMUNERACAO POR HORA TRABALHADA',
  'E02V06 - JORNADA MEDIA',
  'E02V07 - MASSA SALARIAL',
  'E02V08 - ',
  'E02V09 - RAZAO MASSA SALARIAL',
  'E02V10 - ',
  'E02V11 - RAZAO MASSA SALARIAL CUSTOS',
  'E02V12 - C4 do Total de Ocupados',
  'E02V13 - C4 da Massa Salarial',
  'E02V14 - IHH do Total de Ocupados',
  'E02V15 - IHH do Total da Massa Salarial',
]

const eixo_2_results = [
  'E02V01',
  'E02V02',
  'E02V03',
  'E02V04',
  'E02V05',
  'E02V06',
  'E02V07',
  'E02V08',
  'E02V09',
  'E02V10',
  'E02V11',
  'E02V12',
  'E02V13',
  'E02V14',
  'E02V15'
]

const getSheetsByVar = (variavel) => {

  if (variavel < 9) {
    return [
      {
        value: 'SCC X Ano',
        taxa: 'SCC X Ano_VAR',
        subdeg_id: 0,
      },
      {
        value: 'SCC x Sexo = Feminino',
        taxa: 'SCC x Sexo = Feminino_VAR',
        subdeg_id: 82,
      },
      {
        value: 'SCC x Sexo = Masculino',
        taxa: 'SCC x Sexo = Masculino_VAR',
        subdeg_id: 81,
      },
      {
        value: 'SCC X IDADE = 10 A 17',
        taxa: 'SCC X IDADE = 10 A 17_VAR',
        subdeg_id: 51,
      },
      {
        value: 'SCC X IDADE = 18 A 29',
        taxa: 'SCC X IDADE = 18 A 29_VAR',
        subdeg_id: 52,
      },
      {
        value: 'SCC X IDADE = 30 A 49',
        taxa: 'SCC X IDADE = 30 A 49_VAR',
        subdeg_id: 53,
      },
      {
        value: 'SCC X IDADE = 50 A 64',
        taxa: 'SCC X IDADE = 50 A 64_VAR',
        subdeg_id: 54,
      },
      {
        value: 'SCC X IDADE = 65 OU MAIS',
        taxa: 'SCC X IDADE = 65 OU MAIS_VAR',
        subdeg_id: 55,
      },
      {
        value: 'SCC X IDADE = Ñ CLASS',
        taxa: 'SCC X IDADE = Ñ CLASS_VAR',
        subdeg_id: 56,
      },
      {
        value: 'SCC X ESCOLARIDADE = SEM INSTRU',
        taxa: 'SCC X ESCOLARIDADE = SEM INST_V',
        subdeg_id: 21,
      },
      {
        value: 'SCC X ESCOLARIDADE = FUND INCOM',
        taxa: 'SCC X ESCOLARIDADE = FUND I_VAR',
        subdeg_id: 22,
      },
      {
        value: 'SCC X ESCOLARIDADE = FUND COMP',
        taxa: 'SCC X ESCOLARIDADE = FUND C_VAR',
        subdeg_id: 23,
      },
      {
        value: 'SCC X ESCOLARIDADE = MÉDIO COMP',
        taxa: 'SCC X ESCOLARIDADE = MÉDIO C_V',
        subdeg_id: 24,
      },
      {
        value: 'SCC X ESCOLARIDADE = SUP INCOMP',
        taxa: 'SCC X ESCOLARIDADE = SUP IN_VAR',
        subdeg_id: 25,
      },
      {
        value: 'SCC X ESCOLARIDADE = SUP COMP',
        taxa: 'SCC X ESCOLARIDADE = SUP CO_VAR',
        subdeg_id: 26,
      },
      {
        value: 'SCC X ESCOLARIDADE = NÃO DET',
        taxa: 'SCC X ESCOLARIDADE = NÃO DET_V',
        subdeg_id: 27,
      },
      {
        value: 'SCC x Porte = Micro',
        taxa: 'SCC x Porte = Micro_VAR',
        subdeg_id: 11, // 1
      },
      {
        value: 'SCC x Porte = Pequena',
        taxa: 'SCC x Porte = Pequena_VAR',
        subdeg_id: 12, // 2
      },
      {
        value: 'SCC x Porte = Média',
        taxa: 'SCC x Porte = Média_VAR',
        subdeg_id: 13,
      },
      {
        value: 'SCC x Porte = Grande',
        taxa: 'SCC x Porte = Grande_VAR',
        subdeg_id: 14,
      }
    ]
  }

  if (variavel < 12) {
    return [
      {
        value: 'SCC x Ano',
        taxa: 'SCC x Ano_TX_VAR',
        subdeg_id: 0,
      }
    ]
  }

  if (variavel < 16) {
    return [
      {
        value: 'Total x Ano',
        taxa: 'Total x Ano_TX_VAR',
        subdeg_id: 0,
      }
    ]
  }

  return []
}

const getYearsByVar = (variavel) => {
  const group1 = [1, 2, 4, 5, 6, 7, 12, 13, 14, 15];
  const group2 = [9, 11];

  if (group1.includes(variavel))
    return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]

  if (group2.includes(variavel))
    return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]
}

const getTaxa = (worksheet, taxa_cell_ref) => {
  try {
    const taxa_cell = worksheet[taxa_cell_ref];
    return taxa_cell && taxa_cell.w !== '#DIV/0!' ? taxa_cell.v : 0
  } catch (e) {
    return 0;
  }
}

const states = ["11", "12", "13", "14", "15", "16", "17", "21", "22", "23", "24", "25", "26", "27", "28", "29", "31", "32", "33", "35", "41", "42", "43", "50", "51", "52", "53", "0"]
const cadeias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]

for (let variavel_index = 0; variavel_index < variaveis.length; variavel_index++) {
  const variavel = variaveis[variavel_index]

  const result = eixo_2_results[variavel - 1] + '.sql'
  const filename = eixo_2_sheets[variavel - 1] + '.xlsx'

  const filepath = path.join(sheets_dir, filename);
  const workbook = xlsx.readFile(filepath);

  let cadeias_index = 0;
  let state_index = 0;
  let year_index = 0;

  const years = getYearsByVar(variavel)
  const sheets = getSheetsByVar(variavel);

  const percent_col_diff = 14 - 1;
  const year_padding = 37 - 5;

  const data = [];


  if (variavel < 12) {

    const range = {
      s: { r: 4, c: 1 },
      e: { r: 31, c: 11 }
    }

    for (let S = 0; S < sheets.length; S++) {
      const { subdeg_id } = sheets[S];
      const sheet_name = sheets[S].value;
      const sheet_name_var = sheets[S].taxa;


      const worksheet_val = workbook.Sheets[sheet_name];
      const worksheet_tax = workbook.Sheets[sheet_name_var];

      for (let A = 0; A < years.length; A++) {
        year_index = A;

        for (let R = range.s.r; R <= range.e.r; R++) {
          for (let C = range.s.c; C <= range.e.c; C++) {
            const value_cell_address = { c: C, r: R + year_padding * year_index };
            const percent_cell_address = { c: C + percent_col_diff, r: R + year_padding * year_index };
            const taxa_cell_address = { c: C, r: R + year_padding * (year_index - 1) };

            const value_cell_ref = xlsx.utils.encode_cell(value_cell_address);
            const percent_cell_ref = xlsx.utils.encode_cell(percent_cell_address);
            const taxa_cell_ref = xlsx.utils.encode_cell(taxa_cell_address);

            const value_cell = worksheet_val[value_cell_ref];
            const percent_cell = worksheet_val[percent_cell_ref];

            const uf = states[state_index];
            const cadeia = cadeias[cadeias_index]
            const ocupacao = 0 //TODO

            const ano = years[year_index]
            const valor = value_cell && value_cell.w !== '#DIV/0!' ? value_cell.v : 0;
            const percentual = percent_cell && percent_cell.w !== '#DIV/0!' ? percent_cell.v : 0;
            const taxa = A > 0 ? getTaxa(worksheet_tax, taxa_cell_ref) : 0;

            const entry = `\t(${variavel}, ${uf}, ${cadeia}, ${ocupacao}, ${subdeg_id}, null, ${ano}, ${valor}, ${percentual}, ${taxa})`;
            data.push(entry)
            cadeias_index++
          }
          cadeias_index = 0;
          state_index++
        }
        cadeias_index = 0;
        state_index = 0;
      }
      cadeias_index = 0;
      state_index = 0;
      year_index = 0;
    }
  } else {
    const range = {
      s: { r: 30, c: 1 },
      e: { r: 30, c: 13 }
    }

    const cad_padding = 47 - 31;

    const sheet_name = sheets[0].value;
    const sheet_name_var = sheets[0].taxa;

    const worksheet = workbook.Sheets[sheet_name];
    const worksheet_taxa = workbook.Sheets[sheet_name_var];

    for (var A = 0; A < years.length; A++) {
      const R = range.s.r;
      const C = range.s.c + A;

      const value_uf_cell_address = { c: C, r: R };
      const value_cad_cell_address = { c: C, r: R + cad_padding };

      const value_uf_cell_ref = xlsx.utils.encode_cell(value_uf_cell_address);
      const value_cad_cell_ref = xlsx.utils.encode_cell(value_cad_cell_address);

      const value_uf_cell = worksheet[value_uf_cell_ref];
      const taxa_uf_cell = worksheet_taxa[value_uf_cell_ref];
      const value_cad_cell = worksheet[value_cad_cell_ref];
      const taxa_cad_cell = worksheet_taxa[value_cad_cell_ref];

      const value_uf = value_uf_cell ? value_uf_cell.v : 0;
      const taxa_uf = taxa_uf_cell ? taxa_uf_cell.v : 0;

      const value_cad = value_cad_cell ? value_cad_cell.v : 0;
      const taxa_cad = taxa_cad_cell ? taxa_cad_cell.v : 0;

      const ocupacao = 0 //TODO
      const uf = states[0];
      const ano = years[A]
      const percentual = 0
      const subdeg_id = 0
      const cadeia = 0

      let concentracao = 0
      const entry_uf = `\t(${variavel}, ${uf}, ${cadeia}, ${ocupacao}, ${subdeg_id}, ${concentracao}, ${ano}, ${value_uf}, ${percentual}, ${taxa_uf})`;
      data.push(entry_uf)

      concentracao = 1
      const entry_cad = `\t(${variavel}, ${uf}, ${cadeia}, ${ocupacao}, ${subdeg_id}, ${concentracao}, ${ano}, ${value_cad}, ${percentual}, ${taxa_cad})`;
      data.push(entry_cad)
    }

  }

  const resultpath = path.join(sheets_dir, result);
  fs.writeFileSync(resultpath, insert + data.join(',\n') + ';')
}
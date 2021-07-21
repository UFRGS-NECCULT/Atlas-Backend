import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const insert = 'insert into eixo_4 (variavel_id, uf_id, cadeia_id, parceiro_id, consumo_id, tipo_id, concentracao, ano, valor, percentual, taxa) values \n'

const sheets_dir = path.resolve('src', 'data', 'sheets');

const variaveis = [
  [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 0], [1, 6],
  [2, 1], [2, 2], [2, 3], [2, 4], [2, 5], [2, 0], [2, 6],
  [3, 1], [3, 2], [3, 3], [3, 4], [3, 5], [3, 0], [3, 6],
  [14, 1], [14, 2], [14, 3], [14, 4], [14, 5], [14, 0], [14, 6],
  [5, 0],
  [6, 0],
  [7, 0],
  [8, 0],
  [9, 0],
  [10, 0]
];

const eixo_4_sheets = [
  'E04V01 - AFRICA',
  'E04V01 - AMERICA NORTE',
  'E04V01 - AMERICA SUL CENTRAL',
  'E04V01 - ASIA',
  'E04V01 - EUROPA',
  'E04V01 - MUNDO',
  'E04V01 - OCEANIA',

  'E04V02 - AFRICA',
  'E04V02 - AMERICA NORTE',
  'E04V02 - AMERICA SUL CENTRAL',
  'E04V02 - ASIA',
  'E04V02 - EUROPA',
  'E04V02 - MUNDO',
  'E04V02 - OCEANIA',

  'E04V03 - AFRICA',
  'E04V03 - AMERICA NORTE',
  'E04V03 - AMERICA SUL CENTRAL',
  'E04V03 - ASIA',
  'E04V03 - EUROPA',
  'E04V03 - MUNDO',
  'E04V03 - OCEANIA',

  'E04V14 - AFRICA',
  'E04V14 - AMERICA NORTE',
  'E04V14 - AMERICA SUL CENTRAL',
  'E04V14 - ASIA',
  'E04V14 - EUROPA',
  'E04V14 - MUNDO',
  'E04V14 - OCEANIA',

  'E04V05 - C2 PARCEIROS',
  'E04V06 - C4 SETORES',
  'E04V07 - UFS',
  'E04V08 - IHH PARCEIROS',
  'E04V09 - IHH SETORES',
  'E04V10 - IHH UFs',


]

const eixo_4_results = [
  'E04V01 - AFRICA',
  'E04V01 - AMERICA NORTE',
  'E04V01 - AMERICA SUL CENTRAL',
  'E04V01 - ASIA',
  'E04V01 - EUROPA',
  'E04V01 - MUNDO',
  'E04V01 - OCEANIA',

  'E04V02 - AFRICA',
  'E04V02 - AMERICA NORTE',
  'E04V02 - AMERICA SUL CENTRAL',
  'E04V02 - ASIA',
  'E04V02 - EUROPA',
  'E04V02 - MUNDO',
  'E04V02 - OCEANIA',

  'E04V03 - AFRICA',
  'E04V03 - AMERICA NORTE',
  'E04V03 - AMERICA SUL CENTRAL',
  'E04V03 - ASIA',
  'E04V03 - EUROPA',
  'E04V03 - MUNDO',
  'E04V03 - OCEANIA',

  'E04V14 - AFRICA',
  'E04V14 - AMERICA NORTE',
  'E04V14 - AMERICA SUL CENTRAL',
  'E04V14 - ASIA',
  'E04V14 - EUROPA',
  'E04V14 - MUNDO',
  'E04V14 - OCEANIA',

  'E04V05 - C2 PARCEIROS',
  'E04V06 - C4 SETORES',
  'E04V07 - UFS',
  'E04V08 - IHH PARCEIROS',
  'E04V09 - IHH SETORES',
  'E04V10 - IHH UFs',
]

const isC4_C2_IHH = (variavel) => {
  const group = [5, 6, 7, 8, 9, 10, 12, 13]
  return group.includes(variavel);
}

const getSheetsByVar = (variavel) => {
  const group1 = [1, 14];
  const group2 = [2, 3, 6, 8, 5, 6, 7, 8, 9, 10, 12, 13];

  if (group1.includes(variavel)) {
    return [
      {
        value: 'Exportação',
        taxa: 'Exportação_VAR',
        tipo_id: 1,
      },
      {
        value: 'Importação',
        taxa: 'Importação_VAR',
        tipo_id: 2,
      },
      {
        value: 'Valor Transacionado',
        taxa: 'Valor Transacionado_VAR',
        tipo_id: 4,
      },
      {
        value: 'Saldo Comercial',
        taxa: 'Saldo Comercial_VAR',
        tipo_id: 3,
      },
    ]
  }

  else if (group2.includes(variavel)) {
    return [
      {
        value: 'Exportação',
        taxa: 'Exportação_VAR',
        tipo_id: 1,
      },
      {
        value: 'Importação',
        taxa: 'Importação_VAR',
        tipo_id: 2,
      },
      {
        value: 'Valor Transacionado',
        taxa: 'Valor Transacionado_VAR',
        tipo_id: 4,
      }
    ]
  }

  return []
}

const getYearsByVar = (variavel) => {
  const group1 = [1, 2, 14, 5, 6, 7, 8, 9, 10, 12, 13];
  const group2 = [3];

  if (group1.includes(variavel))
    return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", "2020"]

  if (group2.includes(variavel))
    return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]
}

const getConsumoByVar = (variavel) => {
  const group1 = [1];
  const group2 = [];

  if (group1.includes(variavel))
    return 0

  return 0
}

const getTaxa = (worksheet, taxa_cell_ref) => {
  try {
    const taxa_cell = worksheet[taxa_cell_ref];
    return taxa_cell && taxa_cell.w !== '#DIV/0!' ? taxa_cell.v : 0
  } catch (e) {
    return 0;
  }
}

const states = ["11", "12", "13", "14", "15", "16", "17", "21", "22", "23", "24", "25", "26", "27", "28", "29", "31", "32", "33", "35", "41", "42", "43", "50", "51", "52", "53", "99", "0"]
const cadeias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]

for (let variavel_index = 0; variavel_index < variaveis.length; variavel_index++) {

  const [variavel, parceiro] = variaveis[variavel_index]

  const result = eixo_4_results[variavel_index] + '.sql'
  const filename = eixo_4_sheets[variavel_index] + '.xlsx'

  const filepath = path.join(sheets_dir, filename);
  const workbook = xlsx.readFile(filepath);

  const years = getYearsByVar(variavel)
  const sheets = getSheetsByVar(variavel);

  const data = [];

  if (!isC4_C2_IHH(variavel)) {
    let cadeias_index = 0;
    let state_index = 0;
    let year_index = 0;

    const percent_col_diff = 14 - 1;
    const year_padding = 38 - 5;


    const range = {
      s: { r: 4, c: 1 },
      e: { r: 32, c: 11 }
    }

    for (let S = 0; S < sheets.length; S++) {
      const { tipo_id } = sheets[S];
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
            const consumo = 0 //TODO

            const ano = years[year_index]
            const valor = value_cell && value_cell.w !== '#DIV/0!' ? value_cell.v : 0;
            const percentual = percent_cell && percent_cell.w !== '#DIV/0!' ? percent_cell.v : 0;
            const taxa = A > 0 ? getTaxa(worksheet_tax, taxa_cell_ref) : 0;
            const concentracao = 'null';

            const entry = `\t(${variavel}, ${uf}, ${cadeia}, ${parceiro}, ${consumo}, ${tipo_id}, ${concentracao}, ${ano}, ${valor}, ${percentual}, ${taxa})`;
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
    const getVariableRows = (variable) => {
      if (variable === 5 || variable === 8) {
        return {
          valor: 9,
          taxa: 9
        }
      }
      else if (variable === 6 || variable === 9) {
        return {
          valor: 13,
          taxa: 12
        }
      }
      else if (variable === 7 || variable === 10) {
        return {
          valor: 30,
          taxa: 30
        }
      }
    }

    const rows = getVariableRows(variavel);

    for (let S = 0; S < sheets.length; S++) {
      const { tipo_id } = sheets[S];

      const sheet_name = sheets[S].value;
      const sheet_name_var = sheets[S].taxa;

      const worksheet_val = workbook.Sheets[sheet_name];
      const worksheet_tax = workbook.Sheets[sheet_name_var]

      for (let A = 0; A < years.length; A++) {

        const C = 1 + A;

        const value_cell_address = { c: C, r: rows.valor };
        const taxa_cell_address = { c: C, r: rows.taxa };

        const value_cell_ref = xlsx.utils.encode_cell(value_cell_address);
        const taxa_cell_ref = xlsx.utils.encode_cell(taxa_cell_address);

        const value_cell = worksheet_val[value_cell_ref];
        const taxa_cell = worksheet_tax[taxa_cell_ref];

        const uf_id = 0;
        const cadeia_id = 0;
        const parceiro_id = 0;
        const consumo_id = 0;

        const ano = years[A];
        const valor = value_cell ? value_cell.v : 0;
        const percentual = 0;
        const taxa = taxa_cell ? taxa_cell.v : 0;
        const concentracao = 0;
        const entry = `\t(${variavel}, ${uf_id}, ${cadeia_id}, ${parceiro_id}, ${consumo_id}, ${tipo_id}, ${concentracao}, ${ano}, ${valor}, ${percentual}, ${taxa})`;
        data.push(entry)
      }
    }
  }

  const resultpath = path.join(sheets_dir, result);
  fs.writeFileSync(resultpath, insert + data.join(',\n') + ';')

}
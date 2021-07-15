import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

/*  
  Constantes do eixo 1

  Atuação:
  - total
  - comércio
  - serviços e indústria

  Porte:
  - total
  - micro
  - pequena
  - média
  - grande

  Estrutura do insert:
  ...
  (variavel_id, uf_id, cadeia_id, atuacao, porte, ano, valor, percentual, taxa)
  ...
*/

const sheets_dir = path.resolve('src', 'data', 'sheets');
const insert = 'insert into eixo_1 (variavel_id, uf_id, cadeia_id, atuacao_id, subdesagregacao_id, ano, valor, percentual, taxa) values \n'

const eixo_1_sheets = [
  'E01V01 - NUMERO TOTAL DE EMPRESAS',
  'E01V02 - PARTICIPACAO',
  'E01V03 - VARIACAO TOTAL',
  'E01V04 - RECEITA TOTAL BRUTA',
  'E01V05 - RECEITA OPERACIONAL LIQUIDA',
  'E01V06 - CUSTO',
  'E01V07 - LUCRO',
  'E01V08 - VALOR ADICIONADO',
  'E01V09 - VALOR ADICIONADO PIB',
  'E01V10 - IHH EMPRESAS',
  'E01V11 - IHH VALOR ADICIONADO',
  'E01V12 - C4 EMPRESAS',
  'E01V13 - VALOR ADICIONADO'
]

const eixo_1_results = [
  'E01V01',
  'E01V02',
  'E01V03',
  'E01V04',
  'E01V05',
  'E01V06',
  'E01V07',
  'E01V08',
  'E01V09',
  'E01V10',
  'E01V11',
  'E01V12',
  'E01V13'
]

let range = {
  s: { r: 2, c: 1 },
  e: { r: 29, c: 13 }
}

const getYearsByVar = (variavel) => {
  const group1 = [1, 2, 3, 10, 12]; // 2007 ATÉ 2019
  const group2 = [4, 5, 6, 7, 8, 9, 11, 13]; // 2007 ATÉ 2018

  if (group1.includes(variavel))
    return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019"]

  if (group2.includes(variavel))
    return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018"]
  return [];
}

const getSheetsByVar = (variavel) => {
  const group1 = [1, 2, 3]; // TODOS PORTES
  const group2 = [4, 5, 6, 7, 8, 9]; // TODOS PORTES
  const group3 = [10, 11, 12, 13]; // TOTAL ANO

  if (group1.includes(variavel))
    return ['SCC x Ano', 'SCC x Porte = Micro', 'SCC x Porte = Pequena', 'SCC x Porte = Média', 'SCC x Porte = Grande']

  if (group2.includes(variavel))
    return ['SCC x Ano']

  if (group3.includes(variavel))
    return ['Total x Ano']

  return [];

}

const getDegByVar = (variavel) => {
  const group1 = [1, 2, 3]; // TODOS PORTES
  const group2 = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // SÓ TOTAL

  if (group1.includes(variavel))
    return [0, 11, 12, 13, 14]

  if (group2.includes(variavel))
    return [0]

  return [];
}

const getTXByVar = (sheet, variavel) => {
  const group1 = [1, 3]; // NÃO TEM PLANILHA DE TAXA
  const group2 = [2]; // SUFIXO É _VAR
  const group3 = [4, 5, 6, 7, 8, 9, 10, 11, 12, 13]; // SUFIXO É _TX_VAR

  if (group1.includes(variavel)) return null;
  if (group2.includes(variavel)) return sheet + '_VAR';
  if (group3.includes(variavel)) return sheet + '_TX_VAR';

  return [];
}

const getTaxa = (workbook, sheet_name, taxa_cell_ref) => {
  try {
    const worksheet = workbook.Sheets[sheet_name];
    const taxa_cell = worksheet[taxa_cell_ref];
    return taxa_cell && taxa_cell.w !== '#DIV/0!' ? taxa_cell.v : 0
  } catch (e) {
    return 0;
  }
}

const states = ["11", "12", "13", "14", "15", "16", "17", "21", "22", "23", "24", "25", "26", "27", "28", "29", "31", "32", "33", "35", "41", "42", "43", "50", "51", "52", "53", "0"]
const cadeias = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]

for (let variavel = 1; variavel <= 13; variavel++) {



  const years = getYearsByVar(variavel)
  const sheets = getSheetsByVar(variavel)
  const portes = getDegByVar(variavel)

  const result = eixo_1_results[variavel - 1] + '.sql'
  const filename = eixo_1_sheets[variavel - 1] + '.xlsx'
  const filepath = path.join(sheets_dir, filename);

  const workbook = xlsx.readFile(filepath);

  let cadeias_index = 0;
  let state_index = 0;
  let year_index = 0;

  const percent_col_diff = 14 - 1;
  const year_padding = 293 - 261;

  const data = [];

  if (variavel < 10) {
    range = {
      s: { r: 4, c: 1 },
      e: { r: 31, c: 11 }
    }

    for (let S = 0; S < sheets.length; S++) {
      const sheet_name = sheets[S];
      const sheet_name_var = getTXByVar(sheet_name, variavel);
      const worksheet = workbook.Sheets[sheet_name];

      for (let A = 0; A < years.length; ++A) {
        year_index = A;
        for (let R = range.s.r; R <= range.e.r; ++R) {
          for (let C = range.s.c; C <= range.e.c; ++C) {
            const value_cell_address = { c: C, r: R + year_padding * year_index };
            const percent_cell_address = { c: C + percent_col_diff, r: R + year_padding * year_index };
            const taxa_cell_address = { c: C, r: R + year_padding * year_index };

            const value_cell_ref = xlsx.utils.encode_cell(value_cell_address);
            const percent_cell_ref = xlsx.utils.encode_cell(percent_cell_address);
            const taxa_cell_ref = xlsx.utils.encode_cell(taxa_cell_address);

            const value_cell = worksheet[value_cell_ref];
            const percent_cell = worksheet[percent_cell_ref];

            const uf = states[state_index];
            const cadeia = cadeias[cadeias_index]
            const subdesag = portes[S]
            const atuacao_id = 0
            const ano = years[year_index]
            const valor = value_cell ? value_cell.v : 0;
            const percentual = percent_cell ? percent_cell.v : 0;
            const taxa = A > 0 ? getTaxa(workbook, sheet_name_var, taxa_cell_ref) : 0;
            // const taxa = 0;

            const entry = `\t(${variavel}, ${uf}, ${cadeia}, ${atuacao_id}, ${subdesag}, ${ano}, ${valor}, ${percentual}, ${taxa})`;
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
    range = {
      s: { r: 29, c: 1 },
      e: { r: 29, c: 12 }
    }

    const cad_padding = 46 - 30;

    const sheet_name = sheets[0];
    const sheet_name_var = sheet_name + '_TX_VAR';

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

      const atuacao = 0;
      const uf = 0;
      const porte = portes[0]
      const ano = years[A]
      const percentual = 0

      let cadeia = 0
      const entry_uf = `\t(${variavel}, ${uf}, ${cadeia}, ${atuacao}, ${porte}, ${ano}, ${value_uf}, ${percentual}, ${taxa_uf})`;
      data.push(entry_uf)

      cadeia = 1
      const entry_cad = `\t(${variavel}, ${uf}, ${cadeia}, ${atuacao}, ${porte}, ${ano}, ${value_cad}, ${percentual}, ${taxa_cad})`;
      data.push(entry_cad)

    }

  }


  const resultpath = path.join(sheets_dir, result);
  fs.writeFileSync(resultpath, insert + data.join(',\n') + ';')
}
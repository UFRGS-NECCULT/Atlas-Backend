import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const sheets_dir = path.resolve('src', 'data', 'sheets');
const insert = 'insert into eixo_3 (variavel_id, uf_id, cadeia_id, mecanismo_id, modalidade_id, pessoa_id, concentracao, ano, valor, percentual, taxa) values \n'

import { getTaxa} from './utils/index.js';

import { 
  variaveis, 
  states, 
  getYearsByVariableId, 
  getSheetsByVariableId, 
  getCadeiasByVariableId, 
  getYearPaddingByVariableId, 
  getPercentPaddingByVariableId
} from './utils/eixo/3/index.js';

const getWorkbookBySource = (source) => {
  const filename = source + '.xlsx'
  const filepath = path.join(sheets_dir, filename);
  return xlsx.readFile(filepath);
}


variaveis.forEach(({id, finalId, output, source, extracted, start_address}) => {
  console.log(source)
  console.log(id)

  if(extracted) {
    console.log(`Variável já extraída.`)
    return;
  }
  
  const workbook = getWorkbookBySource(source);

  let cadeias_index = 0;
  let state_index = 0;
  let year_index = 0;
  
  const cadeias = getCadeiasByVariableId(id)
  const years = getYearsByVariableId(id)
  const sheets = getSheetsByVariableId(id);
  const percent_col_diff = getPercentPaddingByVariableId(id);
  const year_padding = getYearPaddingByVariableId(id);

  const data = []

  
  
  sheets.forEach(({value_start_address, var_start_address, value: value_sheet, taxa: var_sheet, modalidade_id, mecanismo_id, pessoa_id, concentracao}) => {

    const worksheet = {
      value: workbook.Sheets[value_sheet],
      taxa: workbook.Sheets[var_sheet]
    }
    if(id === 15 || id === 16) {
      console.log(value_sheet)
      const isSetorXAno  = value_sheet.toString().includes('Setor');

        years.forEach((year, i) => {
          const addresses = isSetorXAno ? {
            value_cell: {
              c: value_start_address.col , 
              r: value_start_address.row + i
            },
            var_cell: {
              c: var_start_address.col, 
              r: var_start_address.row + i
            },
          } : {
            value_cell: {
              c: value_start_address.col + i, 
              r: value_start_address.row 
            },
            var_cell: {
              c: var_start_address.col + i, 
              r: var_start_address.row 
            },
          }

          const refs = {
            value_cell: xlsx.utils.encode_cell(addresses.value_cell),
            var_cell:  xlsx.utils.encode_cell(addresses.var_cell)
          }

          const value_cell = worksheet.value[refs.value_cell];
          const taxa_cell = id === 15 ? worksheet.value[refs.var_cell] : 0;

          const uf = 0;
          const cadeia = 0;
          const ano = year;
          const valor = value_cell && value_cell.w !== '#DIV/0!' ? value_cell.v : 0;
          const taxa = taxa_cell && taxa_cell.w !== '#DIV/0!' ? taxa_cell.v : 0;
          const percentual = 0;
          
          const entry = `\t(${finalId}, ${uf}, ${cadeia}, ${mecanismo_id}, ${modalidade_id},  ${pessoa_id}, ${concentracao ?? 'null'}, ${ano}, ${valor}, ${percentual}, ${taxa})`;
          data.push(entry)
        })
      return;
    }

    const value_range = {
      start: { 
        row: value_start_address.row, 
        col: value_start_address.col 
      },
      end: { 
        row: value_start_address.row + states.length - 1, 
        col: value_start_address.col + cadeias.length - 1 
      }
    }

    
    

    years.forEach((year, i) => {
      year_index = i;

      for(let ROW = value_range.start.row; ROW <= value_range.end.row; ROW++) {
        for(let COL = value_range.start.col; COL <= value_range.end.col; COL++) {

          const row_index = (value_range.end.row - value_range.start.row) - (value_range.end.row - ROW);
          const col_index = (value_range.end.col - value_range.start.col) - (value_range.end.col - COL);;

          const addresses = {
            value_cell: {
              c: COL, 
              r: ROW + year_padding * year_index 
            },
            percent_cell: {
              c: COL + percent_col_diff,
              r: ROW + year_padding * year_index 
            },
            var_cell: {
              c: var_start_address.col + col_index, 
              r: var_start_address.row + row_index + year_padding * (year_index - 1) 
            },
          }

          const refs = {
            value_cell: xlsx.utils.encode_cell(addresses.value_cell),
            percent_cell: xlsx.utils.encode_cell(addresses.percent_cell),
            var_cell:  xlsx.utils.encode_cell(addresses.var_cell)
          }

          const value_cell = worksheet.value[refs.value_cell];
          const percent_cell = worksheet.value[refs.percent_cell];

          const uf = states[state_index];
          const cadeia = cadeias[cadeias_index]

          const ano = year;
          const valor = value_cell && value_cell.w !== '#DIV/0!' ? value_cell.v : 0;
          const percentual = percent_cell && percent_cell.w !== '#DIV/0!' ? percent_cell.v : 0;
          

          const taxa = year_index > 0 ? getTaxa(worksheet.taxa, refs.var_cell) : 0;
          // console.log(refs.value_cell, valor)
          // console.log(refs.percent_cell, percentual)
          // console.log(refs.var_cell, taxa)

          const entry = `\t(${finalId}, ${uf}, ${cadeia}, ${mecanismo_id}, ${modalidade_id},  ${pessoa_id}, ${concentracao ?? 'null'}, ${ano}, ${valor}, ${percentual}, ${taxa})`;
          data.push(entry)
          
          cadeias_index++
        }
        cadeias_index = 0;
        state_index++
      }
      cadeias_index = 0;
      state_index = 0;

    })
    
    cadeias_index = 0;
    state_index = 0;
    year_index = 0;

  })

  console.log(`${data.length} linhas extraídas.`)
  const resultpath = path.join(sheets_dir, output + '.sql');
  fs.writeFileSync(resultpath, insert + data.join(',\n') + ';')
})

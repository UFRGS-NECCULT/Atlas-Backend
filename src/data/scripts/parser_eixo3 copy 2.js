import xlsx from 'xlsx';
import path from 'path';
import fs from 'fs';

const sheets_dir = path.resolve('src', 'data', 'sheets');
const insert = 'insert into eixo_3 (variavel_id, uf_id, cadeia_id, mecanismo_id, modalidade_id, pessoa_id, concentracao, ano, valor, percentual, taxa) values \n'

// const variaveis = [1, 181, 182 ,3, 4, 5, 6, 8, 9, 11, 12, 13, 14]
const variaveis = [181, 182]

const teste = [
  {
    id: 18,
    source: 'E03V18.1 - CONSUMO VIA VALECULTURA (RECEBEDORA)',
    result: 'E03V18.1'
  },
  {
    id: 18,
    source: 'E03V18.2 - CONSUMO VIA VALECULTURA (TRABALHADOR)',
    result: 'E03V18.2'
  }
]

const eixo_3_sheets = [
  'E03V18.1 - CONSUMO VIA VALECULTURA (RECEBEDORA)',
  'E03V18.2 - CONSUMO VIA VALECULTURA (TRABALHADOR)',
]

// const eixo_3_sheets = [
//     'E03V01 - FINANCIAMENTO PUBLICO TOTAL',
//     // 'E03V02 - VALE CULTURA',
//     'E03V03 - FINANCIAMENTO BNDS',
//     'E03V04 - INCENTIVOS PRIVADOS',
//     'E03V05 - INCENTIVOS PUBLICOS',
//     'E03V06 - RAZAO DESPESA MECENATO FNC',
//     // 'E03V07 - RECURSOS PRIVADOS CONTRAPARTIDA RENUNCIA',
//     'E03V08 - LIC POR VA',
//     'E03V09 - LIC POR MASSA SALARIAL',
//     'E03V10 - PARTICIPACAO DESPESA CONTAS PUBLICAS',
//     'E03V11 - TOTAL DE PROPOSTAS DE PROJETO',
//     'E03V12 - TOTAL PROJETOS APROVADOS',
//     'E03V13 - TEMPO MEDIO APROVACAO',
    
//     'E03V14 - RAZAO ENTRE SOLICITADO APROVADO',
//     // 'E03V15 - C4',
//     // 'E03V16 - IHH'
//   ]

  const getYearsByVar = (variavel) => {
    const group_2017 = [1, 3, 11, 12, 13, 14]; // 2007 ATÉ 2017
    const group_2016 = [4, 5, 6, 9]; // 2007 ATÉ 2016
    const group_2015 = [8]; // 2007 ATÉ 2015
    const group_2014_2017 = [181, 182]; // 2014 ATÉ 2017
  
    if (group_2017.includes(variavel))
      return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017"]
  
    if (group_2016.includes(variavel))
      return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015", "2016"]

    if (group_2015.includes(variavel))
      return ["2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"]

    if (group_2014_2017.includes(variavel))
      return ["2014", "2015", "2016", "2017"]
    return [];
  }

  const getSheetsByVar = (variavel) => {

    const SCC_X_ANO_TOTAL = {
        value: 'SCC X Ano = Total',
        taxa: 'SCC X Ano = Total_VAR',
        modalidade_id: 0,
        mecanismo_id: 0,
        pessoa_id: 0,
    };

    const SCC_X_ANO_MECENATO = {
        value: 'SCC X Ano = Mecenato',
        taxa: 'SCC X Ano = Mecenato_VAR',
        modalidade_id: 0,
        mecanismo_id: 2,
        pessoa_id: 0,
    };

    const SCC_X_ANO_FNC = {
        value: 'SCC X Ano = FNC',
        taxa: 'SCC X Ano = FNC_VAR',
        modalidade_id: 0,
        mecanismo_id: 1,
        pessoa_id: 0,
    };

    const SCC_X_ANO_FUNDO_CULTURAL = {
        value: 'SCC X Ano = Fundo Cultural',
        taxa: 'SCC X Ano = Fundo Cultural_VAR',
        modalidade_id: 0,
        mecanismo_id: 3,
        pessoa_id: 0,
    };

    const SCC_X_ANO_OUTROS = {
        value: 'SCC X Ano = Outros',
        taxa: 'SCC X Ano = Outros_VAR',
        modalidade_id: 0,
        mecanismo_id: 4,
        pessoa_id: 0,
    }

    const SCC_X_ANO_DIRETA = {
        value: 'SCC X Ano = Direta',
        taxa: 'SCC X Ano = Direta_VAR',
        modalidade_id: 0,
        mecanismo_id: 0,
        pessoa_id: 1,
    }

    const SCC_X_ANO_INDIRETA = {
        value: 'SCC X Ano = Indireta',
        taxa: 'SCC X Ano = Indireta_VAR',
        modalidade_id: 0,
        mecanismo_id: 0,
        pessoa_id: 2,
    }

    const SCC_X_ANO_FISICA = {
        value: 'SCC X Ano = Fisica',
        taxa: 'SCC X Ano = Fisica_VAR',
        modalidade_id: 0,
        mecanismo_id: 0,
        pessoa_id: 1,
    }

    const SCC_X_ANO_JURIDICA = {
        value: 'SCC X Ano = Juridica',
        taxa: 'SCC X Ano = Juridica_VAR',
        modalidade_id: 0,
        mecanismo_id: 0,
        pessoa_id: 2,
    }

    switch(variavel) {
        case 1: return [
            SCC_X_ANO_TOTAL,
            SCC_X_ANO_MECENATO,
            SCC_X_ANO_FNC
        ];
        case 181: return [
          {
              value: 'SCC X ANO = UF Recebedora',
              taxa: 'SCC X Ano = UF Recebedora_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 0
          }
        ];
        case 182: return [
          {
              value: 'SCC X ANO = UF Trabalhador',
              taxa: 'SCC X Ano = UF Trabalhador_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 1
          }
        ];
        case 191: return [
          {
              value: 'SCC X ANO = Recebedoras',
              taxa: 'SCC X Ano = Recebedoras_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 0
          }
        ];
        case 192: return [
          {
              value: 'SCC X ANO = Trabalhadores',
              taxa: 'SCC X Ano = Trabalhadores_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 1
          }
        ];
        case 3: return [
            SCC_X_ANO_TOTAL,
            SCC_X_ANO_FUNDO_CULTURAL,
            SCC_X_ANO_OUTROS,
            SCC_X_ANO_DIRETA,
            SCC_X_ANO_INDIRETA,
        ]
        case 4: return [
            SCC_X_ANO_TOTAL,
            SCC_X_ANO_FISICA,
            SCC_X_ANO_JURIDICA,
        ]
        case 5: return [
            SCC_X_ANO_TOTAL,
        ]
        case 6: return [
            {
                value: 'SCC X Ano = Mecenato_FNC',
                // taxa: 'SCC X Ano = Mecenato_FNC_VAR',
                modalidade_id: 0,
                mecanismo_id: 1,
                pessoa_id: 0,
            }
        ]
        case 8: return [
            SCC_X_ANO_TOTAL,
            SCC_X_ANO_MECENATO,
            SCC_X_ANO_FNC
        ]
        case 9: return [
            SCC_X_ANO_TOTAL,
            SCC_X_ANO_MECENATO,
            SCC_X_ANO_FNC
        ]
        case 11:
        case 12:
        case 13:
        case 14: return [
            SCC_X_ANO_MECENATO
        ]
        default: return []
    }

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

const getCadeias = (variavel) => {

  if(variavel === 181 || variavel === 182) {
    return [2,3,4, 5, 6, 8,9, 11, 0]
  }


  return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 0]
}

const getYearPadding = (variavel) => {
    const group_38_4 = [1]
    const group_39_5 = [3, 4, 5, 6, 8, 9, 11, 181, 182]

    if(group_38_4.includes(variavel)) {
        return 38-4
    }

    if(group_39_5.includes(variavel)) {
        return 39 - 5
    }

    return 38 - 4
}

const getPercentPadding = (variavel) => {
    const group_14_1 = [1, 4, 5];
    const group_13_1 = [3, 11]
    const group_12_1 = [181, 182]

    if(group_14_1.includes(variavel)) {
        return 14 - 1;
    }

    if(group_13_1.includes(variavel)) {
      return 13 - 1
    }

    if(group_12_1.includes(variavel)) {
        return 12 - 1
    }

    return 14 - 1
}

for (let variavel_index = 0; variavel_index < teste.length; variavel_index++) {
    const variavel = variaveis[variavel_index]
    const cadeias = getCadeias(variavel)

    console.log()

    const result = eixo_3_sheets[variavel_index].split(' - ')[0] + '.sql'
    const filename = eixo_3_sheets[variavel_index] + '.xlsx'
  
    const filepath = path.join(sheets_dir, filename);
    const workbook = xlsx.readFile(filepath);
  
    let cadeias_index = 0;
    let state_index = 0;
    let year_index = 0;
  
    const years = getYearsByVar(variavel)
    const sheets = getSheetsByVar(variavel);
    const percent_col_diff = getPercentPadding(variavel);
    const year_padding = getYearPadding(variavel);
  
    const data = [];

    if (variavel !== 15 && variavel !== 16) {

        const range = {
          s: { r: 4, c: 1 },
          e: { r: 31, c: 11 }
        }
    
        for (let S = 0; S < sheets.length; S++) {

          const { modalidade_id, mecanismo_id, pessoa_id } = sheets[S];
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
    
                const ano = years[year_index]
                const valor = value_cell && value_cell.w !== '#DIV/0!' ? value_cell.v : 0;
                const percentual = percent_cell && percent_cell.w !== '#DIV/0!' ? percent_cell.v : 0;
                const taxa = A > 0 ? getTaxa(worksheet_tax, taxa_cell_ref) : 0;
    
                const entry = `\t(${variavel}, ${uf}, ${cadeia}, ${mecanismo_id}, ${modalidade_id},  ${pessoa_id}, null, ${ano}, ${valor}, ${percentual}, ${taxa})`;
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
      }

  const resultpath = path.join(sheets_dir, result);
  fs.writeFileSync(resultpath, insert + data.join(',\n') + ';')

}
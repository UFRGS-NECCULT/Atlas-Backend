export const getSheetsByVariableId = (variavel) => {

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

    const makeSheet = (sheet, value_start_address = {row: 4, col: 1}, var_start_address = {row: 3, col: 1}) => {
        return {
            ...sheet,
            value_start_address,
            var_start_address
        }
    }

    switch(variavel) {
        case 1: return [
            makeSheet(SCC_X_ANO_TOTAL),
            makeSheet(SCC_X_ANO_MECENATO),
            makeSheet(SCC_X_ANO_FNC)
        ];
        case 181: return [
          makeSheet({
              value: 'SCC X Ano = UF Recebedora',
              taxa: 'SCC X Ano = UF Recebedora_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 0,
          })
        ];
        case 182: return [
          makeSheet({
            value: 'SCC X Ano = UF Trabalhador',
            taxa: 'SCC X Ano = UF Trabalhador_VAR',
            modalidade_id: 0,
            mecanismo_id: 0,
            pessoa_id: 0,
            concentracao: 1,
            })
        ];
        case 191: return [
          makeSheet({
              value: 'SCC X Ano = Recebedora',
              taxa: 'SCC X Ano = Recebedora_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 0,
          })
        ];
        case 192: return [
          makeSheet({
              value: 'SCC X Ano = Trabalhador',
              taxa: 'SCC X Ano = Trabalhador_VAR',
              modalidade_id: 0,
              mecanismo_id: 0,
              pessoa_id: 0,
              concentracao: 1,
          })
        ];
        case 3: return [
            makeSheet(SCC_X_ANO_TOTAL),
            makeSheet(SCC_X_ANO_FUNDO_CULTURAL),
            makeSheet(SCC_X_ANO_OUTROS),
            makeSheet(SCC_X_ANO_DIRETA),
            makeSheet(SCC_X_ANO_INDIRETA),
        ]
        case 4: return [
            makeSheet(SCC_X_ANO_TOTAL, { row: 4, col: 1,}, { row: 4, col: 1}),
            makeSheet(SCC_X_ANO_FISICA, { row: 4, col: 1,}, { row: 4, col: 1}),
            makeSheet(SCC_X_ANO_JURIDICA, { row: 4, col: 1,}, { row: 4, col: 1}),
        ]
        case 5: return [
            makeSheet(SCC_X_ANO_TOTAL, { row: 4, col: 1,}, { row: 4, col: 1}),
        ]
        case 7: return [
            makeSheet(SCC_X_ANO_MECENATO, { row: 4, col: 1,}, { row: 4, col: 1}),
        ]
        case 8: return [
            makeSheet(SCC_X_ANO_TOTAL),
            makeSheet(SCC_X_ANO_MECENATO),
            makeSheet(SCC_X_ANO_FNC)
        ]
        case 9: return [
            makeSheet(SCC_X_ANO_TOTAL),
            makeSheet(SCC_X_ANO_MECENATO),
            makeSheet(SCC_X_ANO_FNC)
        ]
        case 11:
        case 12:
        case 13:
        case 14: return [
            makeSheet(SCC_X_ANO_MECENATO),
        ]
        case 15: return [
            makeSheet({
                value: 'Estado X Ano = Mecenato_C4',
                modalidade_id: 0,
                mecanismo_id: 2,
                pessoa_id: 0,
                concentracao: 0,
            }, { row: 31, col: 1,}, { row: 32, col: 1}),
            makeSheet({
                value: 'Setor X Ano = Mecenato_C4',
                modalidade_id: 0,
                mecanismo_id: 2,
                pessoa_id: 0,
                concentracao: 1,
            }, { row: 4, col: 11,}, { row: 4, col: 12}),
            makeSheet({
                value: 'Estado X Ano = FNC_C4',
                modalidade_id: 0,
                mecanismo_id: 1,
                pessoa_id: 0,
                concentracao: 0,
            }, { row: 31, col: 1,}, { row: 32, col: 1}),
            makeSheet({
                value: 'Setor X Ano = FNC_C4',
                modalidade_id: 0,
                mecanismo_id: 1,
                pessoa_id: 0,
                concentracao: 1,
            }, { row: 4, col: 11,}, { row: 4, col: 13}),
        ]
        case 16: return [
            makeSheet({
                value: 'Estado X Ano = Mecenato_IHH',
                modalidade_id: 0,
                mecanismo_id: 2,
                pessoa_id: 0,
                concentracao: 0,
            }, { row: 31, col: 1,}, { row: 32, col: 1}),
            makeSheet({
                value: 'Setor X Ano = Mecenato_IHH',
                modalidade_id: 0,
                mecanismo_id: 2,
                pessoa_id: 0,
                concentracao: 1,
            }, { row: 4, col: 11,}, { row: 4, col: 12}),
            makeSheet({
                value: 'Estado X Ano = FNC_IHH',
                modalidade_id: 0,
                mecanismo_id: 1,
                pessoa_id: 0,
                concentracao: 0,
            }, { row: 31, col: 1,}, { row: 32, col: 1}),
            makeSheet({
                value: 'Setor X Ano = FNC_IHH',
                modalidade_id: 0,
                mecanismo_id: 1,
                pessoa_id: 0,
                concentracao: 1,
            }, { row: 4, col: 11,}, { row: 4, col: 13}),
        ]
        default: return []
    }

  }
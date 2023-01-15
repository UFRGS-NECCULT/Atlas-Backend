create table regiao (
	id integer NOT null primary KEY,
	nome varchar(12) UNIQUE,
	cor varchar(7)
);

INSERT INTO regiao (id, cor, nome) VALUES
	(0, '#ff0000', 'Todas'),
	(1, '#ff9800', 'Norte'),
	(2, '#ffc107', 'Nordeste'),
	(3, '#cddc39', 'Sudeste'),
	(4, '#8bc34a', 'Sul'),
	(5, '#ffeb3b', 'Centro-Oeste'),
	(10, '#ff0000', 'Outros');

create table uf (
	id integer NOT null primary KEY,
	nome varchar(32) UNIQUE,
	sigla varchar(2) UNIQUE,
	regiao_id integer not null references regiao(id) ON DELETE restrict,
	preposicao varchar(3) NOT null
);

INSERT INTO uf (id, sigla, preposicao, regiao_id, nome) VALUES
	( 0, 'TD', 'do', 0, 'Todos'),
	(11, 'RO', 'de', 1, 'Rondônia'),
	(12, 'AC', 'do', 1, 'Acre'),
	(13, 'AM', 'do', 1, 'Amazonas'),
	(14, 'RR', 'de', 1, 'Roraima'),
	(15, 'PA', 'do', 1, 'Pará'),
	(16, 'AP', 'do', 1, 'Amapá'),
	(17, 'TO', 'do', 1, 'Tocantins'),
	(21, 'MA', 'do', 2, 'Maranhão'),
	(22, 'PI', 'do', 2, 'Piauí'),
	(23, 'CE', 'do', 2, 'Ceará'),
	(24, 'RN', 'do', 2, 'Rio Grande Do Norte'),
	(25, 'PB', 'da', 2, 'Paraíba'),
	(26, 'PE', 'de', 2, 'Pernambuco'),
	(27, 'AL', 'de', 2, 'Alagoas'),
	(28, 'SE', 'de', 2, 'Sergipe'),
	(29, 'BA', 'da', 2, 'Bahia'),
	(31, 'MG', 'de', 3, 'Minas Gerais'),
	(32, 'ES', 'do', 3, 'Espírito Santo'),
	(33, 'RJ', 'do', 3, 'Rio De Janeiro'),
	(35, 'SP', 'de', 3, 'São Paulo'),
	(41, 'PR', 'do', 4, 'Paraná'),
	(42, 'SC', 'de', 4, 'Santa Catarina'),
	(43, 'RS', 'do', 4, 'Rio Grande Do Sul'),
	(50, 'MS', 'de', 5, 'Mato Grosso Do Sul'),
	(51, 'MT', 'de', 5, 'Mato Grosso'),
	(52, 'GO', 'de', 5, 'Goiás'),
	(53, 'DF', 'do', 5, 'Distrito Federal'),
	(99, 'OT', 'do', 10, 'Outros');

create table cadeia (
	id integer NOT null primary KEY,
	nome varchar(32) UNIQUE,
	abreviacao varchar(12) NOT null UNIQUE,
	cor varchar(7) NOT null,
	gradiente_inferior varchar(7) NOT null,
	gradiente_superior varchar(7) NOT null
);

insert into cadeia  (id, cor, gradiente_inferior, gradiente_superior, nome, abreviacao) values
	(0,  '#071342', '#D9D5DE', '#685D78', 'Todos', 'Todos'),
	(1,  '#87A8CA', '#E8EEF5', '#ADC4DC', 'Arquitetura e Design', 'Arq. e D.'),
	(2,  '#077DDD', '#EDF1F9', '#A0B5DB', 'Artes Cênicas e Espetáculos', 'Artes'),
	(3,  '#0F4B67', '#E5E5EA', '#497d96', 'Audiovisual', 'Audio'),
	(4,  '#8178AF', '#ECEBF5', '#A7A1CA', 'Cultura Digital', 'Cult. Dig.'),
	(5,  '#E6C59B', '#EEEBE6', '#EADAC3', 'Editorial', 'Edit.'),
	(6,  '#EC8A91', '#FCEDEE', '#F4BDC1', 'Educação e Criação em Artes', 'Edu. Art.'),
	(7,  '#AD5468', '#F4E8EA', '#D29EA4', 'Entretenimento', 'Entret.'),
	(8,  '#6A474D', '#E3DBDC', '#A18386', 'Música', 'Música'),
	(9,  '#E96B00', '#FBE6D4', '#F19D63', 'Patrimônio', 'Patrimônio'),
	(10, '#B2510F', '#F9F1EA', '#D39873', 'Publicidade', 'Publ.'),
	(11, '#B2510F', '#F9F1EA', '#D39873', 'Outros', 'Outros');

create table eixo (
	id integer NOT null unique,
	nome varchar(32) NOT null,
	cor_primaria varchar(7) NOT null,
	cor_secundaria varchar(7) NOT null
);

insert into eixo  (id, cor_primaria, cor_secundaria, nome) values
	(1, '#efc851', '#ffe866', 'Empreendimentos Culturais'),
	(2, '#97BE13', '#679a7f', 'Mercado de Trabalho'),
	(3, '#00916D', '#90d7bc', 'Fomento Público'),
	(4, '#003F33', '#195e3a', 'Comércio Internacional');

create type format as enum (
	'none',
	'si',
	'percent',
	'real',
	'kilogram'
);

create table variavel (
	eixo integer NOT null,
	variavel integer NOT null,
	format format NOT null,
	titulo varchar(100) UNIQUE,
	descricao text null,
	fonte varchar(150) null,
	unique (eixo, variavel)
);

insert into variavel (eixo, variavel, format, fonte, titulo, descricao) values
	(1, 1, 'none', 'RAIS', 'Número Total de Empresas', 'Esse indicador demonstra o total de empresas culturais. Uma elevação deste número pode indicar um aumento tanto em termos de oferta, quanto de demanda por bens e serviços culturais, assim como uma diminuição pode indicar um arrefecimento da demanda por bens e serviços culturais.'),
	(1, 2, 'percent', 'Elaboração do NECCULT com base na RAIS.', 'Participação das empresas culturais e criativas no total de empresas', 'Esse indicador representa a participação das empresas culturais no total de empresas de cada estado. Um aumento da participação indica uma mudança na composição dos bens e serviços ofertados em que os bens culturais possuem maior peso. Da mesma forma, é um indicativo de quantos bens e serviços culturais integram a economia do país.'),
	(1, 3, 'percent', 'Elaboração do NECCULT com base na RAIS.', 'Variação no Total de Empresas', 'Esse indicador demonstra a taxa de natalidade e mortalidade de empresas, isto é, o número de empresas que nascem e fecham num ano. Um aumento de taxa de natalidade pode indicar um aumento da demanda por bens e serviços culturais, ou um indicador de descentralização. Da mesma forma, um aumento da taxa de mortalidade indica que as empresas culturais estão com dificuldades estruturais e/ou de caráter institucional de manterem-se ativas.'),
	(1, 4, 'real', 'IBGE (PAS, PIA e PAC).', 'Receita Total Bruta', 'Esse indicador demonstra a receita total das empresas culturais, isto é, a entrada de fluxos monetários em decorrência das atividades produtivas. Um aumento na receita pode indicar uma elevação dos preços dos bens culturais, ou da quantidade vendida.'),
	(1, 5, 'real', 'IBGE (PAS, PIA e PAC).', 'Receita Operacional Liquida', 'Esse indicador demonstra a receita operacional líquida das empresas culturais, isto é, as receitas brutas provenientes da exploração das atividades principais e secundárias exercidas pela empresa, com deduções dos impostos e contribuições (ICMS, PIS/Pasep, IPI, ISS, Simples Nacional, Cofins etc.), das vendas canceladas, abatimentos e descontos incondicionais. Um aumento na receita pode indicar uma elevação dos preços dos bens culturais, ou da quantidade vendida.'),
	(1, 6, 'real', 'IBGE (PAS, PIA e PAC).', 'Custo', 'Esse indicador demonstra o custo total para o funcionamento das empresas culturais. Indica a participação dos custos na composição do total necessário para as firmas operarem. Indiretamente, retrata o quanto os custos totais das atividades culturais representam em relação aos custos totais do conjunto da indústria, do comércio e dosserviços. Um aumento no dispêndio pode indicar o aumento do preço dos insumos e fatores de produção. Uma diminuição pode indicar a redução dos preços dos insumos, ou da diminuição dos custos via inovação da base técnica e produtiva.'),
	(1, 7, 'real', 'IBGE (PAS, PIA e PAC).', 'Lucro', 'Esse indicador demonstra o ganho auferido ao longo das operações comerciais ou no exercício das atividades econômicas. Diante da subtração do total de receitas auferidas sobre o custo total das empresas, é possível, para cada estratificação proposta, delimitar as atividades culturais que geram maior retorno. Um aumento do lucro pode indicar um aumento da entrada e consecutiva geração de renda por parte das atividades culturias. O aumento da proporção de receitas em relação aos custos possibita aos setores culturais a obtenção de maiores ganhos reais.'),
	(1, 8, 'real', 'IBGE (PAS, PIA e PAC).', 'Valor Adicionado', 'O Valor Adicionado retrata a contribuição das Empresas Culturais na formação de riquezas no país. A análise permite medir o valor criado por estes agentes econômicos, sendo o valor adicional que adquirem os bens e serviços ao serem transformados durante o processo produtivo.'),
	(1, 9, 'percent', 'Elaboração do NECCULT com base no IBGE (PAS, PIA e PAC).', 'Valor Adicionado / Produto Interno Bruto (PIB)', 'Esse indicador demonstra a razão entre o Valor Adicionado e o PIB, elucidando e contabilizando a contribuição da cultura na geração de riqueza. Um aumento desta razão indica que a cultura está contribuindo mais para  a geração de renda e produto na economia.'),
	(1, 10, 'none', 'Elaboração própria a partir da RAIS.', 'Índice de Concentração de Herfindahl-Hirschman (IHH - Empresas)', 'Esse indicador demonstra o quão concentrada é a distribuição do Total de Empresas a partir do somatório dos quadrados das participações relativas de cada categoria observada. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(1, 11, 'none', 'Elaboração própria a partir da RAIS.', 'Índice de Concentração de Herfindahl-Hirschman (IHH - Valor Adicionado)', 'Esse indicador demonstra o quão concentrada é a distribuição do Valor Adicionado a partir do somatório dos quadrados das participações relativas de cada categoria observada. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(1, 12, 'none', 'Elaboração própria a partir da RAIS.', 'Razão de Concentração – C4 Empresas', 'Esse indicador demonstra o quão concentrada é a distribuição do Total de Empresas a partir do somatório das participações relativas das 4 maiores categorias observadas. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(1, 13, 'none', 'Elaboração própria a partir da RAIS.', 'Razão de Concentração – C4 Valor Adicionado', 'Esse indicador demonstra o quão concentrada é a distribuição do Valor Adicionado a partir do somatório das participações relativas das 4 maiores categorias observadas. Quanto mais próximo de um for o valor do índice mais concentrado é o item.');


insert into variavel (eixo, variavel, format, fonte, titulo, descricao) values
	(2, 1, 'none', 'RAIS e IBGE (PNAD Anual).', 'Total de Ocupados', 'Esse indicador demonstra o total de empresas culturais. Uma elevação deste número pode indicar um aumento tanto em termos de oferta, quanto de demanda por bens e serviços culturais, assim como uma diminuição pode indicar um arrefecimento da demanda por bens e serviços culturais.'),
	(2, 2, 'percent', 'Elaboração do NECCULT com base na RAIS e no IBGE (PNAD Anual).', 'Participação no Emprego Total', 'Esse indicador representa a participação das empresas culturais no total de empresas. Um aumento da participação indica uma mudança na composição dos bens e serviços ofertados em que os bens culturais possuem maior peso. Da mesma forma, é um indicativo de quantos bens e serviços culturais integram a economia do país.'),
	(2, 4, 'real', 'RAIS E IBGE (PNAD Anual).', 'Remuneração Média', 'Esse indicador demonstra a receita total das empresas culturais, isto é, a entrada de fluxos monetários em decorrência das atividades produtivas. Um aumento na receita pode indicar uma elevação dos preços dos bens culturais, ou da quantidade vendida.'),
	(2, 5, 'real', 'Elaboração do NECCULT com base na RAIS E no IBGE (PNAD Anual).', 'Remuneração por Hora Trabalhada', 'Esse indicador demonstra a receita operacional líquida das empresas culturais, isto é, as receitas brutas provenientes da exploração das atividades principais e secundárias exercidas pela empresa, com deduções dos impostos e contribuições (ICMS, PIS/Pasep, IPI, ISS, Simples Nacional, Cofins etc.), das vendas canceladas, abatimentos e descontos incondicionais. Um aumento na receita pode indicar uma elevação dos preços dos bens culturais, ou da quantidade vendida.'),
	(2, 6, 'none', 'RAIS E IBGE (PNAD Anual).', 'Jornada de Trabalho Média', 'Esse indicador demonstra o custo total para o funcionamento das empresas culturais. Indica a participação dos custos na composição do total necessário para as firmas operarem. Indiretamente, retrata o quanto os custos totais das atividades culturais representam em relação aos custos totais do conjunto da indústria, do comércio e dosserviços. Um aumento no dispêndio pode indicar o aumento do preço dos insumos e fatores de produção. Uma diminuição pode indicar a redução dos preços dos insumos, ou da diminuição dos custos via inovação da base técnica e produtiva.'),
	(2, 7, 'real', 'RAIS E IBGE (PNAD Anual).', 'Massa de Rendimentos do Trabalho', 'Esse indicador demonstra o ganho auferido ao longo das operações comerciais ou no exercício das atividades econômicas. Diante da subtração do total de receitas auferidas sobre o custo total das empresas, é possível, para cada estratificação proposta, delimitar as atividades culturais que geram maior retorno. Um aumento do lucro pode indicar um aumento da entrada e consecutiva geração de renda por parte das atividades culturias. O aumento da proporção de receitas em relação aos custos possibita aos setores culturais a obtenção de maiores ganhos reais.'),
	(2, 9, 'none', 'Elaboração do NECCULT com base na RAIS.', 'Razão entre a Massa de Rendimentos do Trabalho e o Valor Adicionado', 'Esse indicador demonstra a razão entre o Valor Adicionado e o PIB, elucidando e contabilizando a contribuição da cultura na geração de riqueza. Um aumento desta razão indica que a cultura está contribuindo mais para  a geração de renda e produto na economia.'),
	(2, 11, 'none', 'Elaboração do NECCULT com base na RAIS E no IBGE (PNAD Anual).', 'Razão entre os Salários Pagos e o Custo Total', 'Esse indicador demonstra o quão concentrada é a distribuição do Valor Adicionado a partir do somatório dos quadrados das participações relativas de cada categoria observada. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(2, 12, 'none', 'Elaboração do NECCULT com base na RAIS E no IBGE (PNAD Anual).', 'Razão de Concentração do emprego cultural e criativo (C4)', 'Esse indicador demonstra o quão concentrada é a distribuição do Total de Empresas a partir do somatório das participações relativas das 4 maiores categorias observadas. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(2, 13, 'none', 'ELABORAÇÃO DO NECCULT COM BASE NA RAIS E NO IBGE (PNAD ANUAL).', 'Razão de Concentração da Massa Rendimentos do Trabalho (C4)', 'Esse indicador demonstra o quão concentrada é a distribuição do Valor Adicionado a partir do somatório das participações relativas das 4 maiores categorias observadas. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(2, 14, 'none', 'ELABORAÇÃO DO NECCULT COM BASE NA RAIS E NO IBGE (PNAD ANUAL).', 'IHH (Índice Herfindahl-Hirschman de concentração) de Número de Trabalhadore(a)s', 'Esse indicador demonstra o quão concentrada é a distribuição do Valor Adicionado a partir do somatório das participações relativas das 4 maiores categorias observadas. Quanto mais próximo de um for o valor do índice mais concentrado é o item.'),
	(2, 15, 'none', 'ELABORAÇÃO DO NECCULT COM BASE NA RAIS E NO IBGE (PNAD ANUAL).', 'IHH (Índice Herfindahl-Hirschman de concentração) da Massa de Rendimentos do Trabalho', 'Esse indicador demonstra o quão concentrada é a distribuição do Valor Adicionado a partir do somatório das participações relativas das 4 maiores categorias observadas. Quanto mais próximo de um for o valor do índice mais concentrado é o item.');


insert into variavel (eixo, variavel, format, fonte, titulo, descricao) values
	(3, 1, 'none', 'SALICnet.', 'Financiamento público total', 'Retrata o valor bruto total destinado ao fomento da produção artística e cultura por meio de políticas e seus mecanismos nos estratos referidos.'),
	(3, 18, 'real', 'SEFIC-MINC', 'Consumo via Vale Cultura', 'Valor total se refere à soma de todos os registros, inclusive aqueles em que a UF da recebedora não estava identificada. Assim, a soma dos valores das UFs pode não se igualar ao valor total aqui indicado'),
	(3, 19, 'none', 'SEFIC-MINC', 'Agentes do Vale Cultura', 'Quantidade de trabalhadores beneficiados e quantidade de empresas habilitadas a receber o cartão Vale-Cultura como forma de pagamento por produtos e serviços culturais'),
	(3, 3, 'real', 'BNDES.', 'Financiamento pelo BNDES', 'Mostra o valor bruto total destinado ao fomento da produção artística e cultural por meio do Fundo Cultural do BNDES.'),
	(3, 4, 'real', 'SALICnet.', 'Valor total dos incentivos privados', 'Demonstra o valor bruto total na forma de incentivos privados para o fomento da produção artística e cultural por estrato proposto.'),
	(3, 5, 'real', 'SALICnet.', 'Valor total dos incentivos das empresas estatais', 'Demonstra o valor bruto total na forma de incentivos provenientes de empresas públicas para o fomento da produção artística e cultural por estrato proposto.'),
	(3, 7, 'percent', 'Elaborado pelo NECCULT com base no SALICnet.', 'Percentual de Recursos Privados no total financiado via Mecenato', 'Retrata o percentual dos recursos privados em cultura e despesas em fomento da cultura nos estratos referidos.'),
	(3, 8, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Participação do financiamento público total no valor adicionado pelas atividades culturais', 'Retrata a razão entre o total destinado na forma de fomento por meio de políticas e seus mecanismos e o valor adicionado pela cultura no PIB nacional.'),
	(3, 9, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Participação do financiamento público total na massa salarial das atividades culturais', 'Retrata a razão entre a despesa total em cultura e a arrecadação total nos estratos referidos.'),
	(3, 11, 'none', 'SALICnet.', 'Total das propostas de projetos de financiamento cultural', 'Retrata a soma de todas propostas para LIC nos estratos referidos.'),
	(3, 12, 'none', 'SALICNET', 'Total dos projetos de financiamento cultural efetivamente fomentados', 'Retrata todos os projetos propostos que foram fomentados pela LIC nos estratos referidos.'),
	(3, 13, 'none', 'SALICnet.', 'Tempo médio de aprovação dos projetos de financiamento cultural', 'Retrata o tempo médio entre a proposta de projeto e a efetiva aprovação do fomento.'),
	(3, 14, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Razão entre total solicitado pelos projetos e o valor efetivo aprovado', 'Retrata o percentual relativo que relaciona o valor solicitados pelos projetos e o total efetivo do fomento.'),
	(3, 15, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Índice Razão para Concentração dos Incentivos Fiscais (C4)', 'Retrata sobre o quão concentrado é os recursos apoiados nos estratos referidos.'),
	(3, 16, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Índice Herfindahl-Hirschman para Concentração dos Projetos Fomentados', 'Retrata sobre o quão concentrado é o gasto em cultura pelos estratos referidos.');


insert into variavel (eixo, variavel, format, fonte, titulo, descricao) values
	(4, 1, 'real', 'MDIC.', 'Comércio Externo', 'Demonstra o valor de absoluto dos setores culturais por estratificação proposta.'),
	(4, 2, 'percent', 'Elaboração do NECCULT com base no MDIC.', 'Participação no comércio exterior total', 'Demonstra a relação do comércio exterior nacional cultural com o comércio exterior brasileiro por estratificação proposta.'),
	(4, 3, 'percent', 'Elaboração do NECCULT com base no MDIC.', 'Relação com o valor adicionado pela cultura', 'Demonstra a relação do comércio exterior nacional cultural com o valor adicionado pela cultura por estratificação proposta.'),
	(4, 5, 'none', 'Elaboração do NECCULT com base no MDIC.', 'Razões de concentração (C2/C4) do comércio externo', 'Demonstra a relação do comércio exterior nacional cultural com o comércio global por estratificação proposta.'),
	(4, 6, 'none', 'VALIDAR.', 'VALIDAR - C4 - Setores', 'VALIDAR.'),
	(4, 7, 'none', 'VALIDAR.', 'VALIDAR - C4 - UFs', 'VALIDAR.'),
	(4, 8, 'none', 'Elaboração NECCULT, com base nos dados do MDIC.', 'IHH (Índice Herfindahl-Hirschman) de concentração do comércio externo', 'Demonstra a relação do comércio exterior nacional cultural com o produto interno bruto por estratificação proposta.'),
	(4, 9, 'none', 'VALIDAR.', 'VALIDAR - IHH - Setores', 'VALIDAR.'),
	(4, 10, 'none', 'VALIDAR.', 'VALIDAR - IHH - UFs', 'VALIDAR.'),
	(4, 11, 'none', 'Elaboração do NECCULT com base no MDIC.', 'Índice de quantum do comércio externo', 'Demonsta o quão concentrado é o comércio exterior nacional cultural por estratificação proposta.'),
	(4, 12, 'none', 'Elaboração do NECCULT com base no MDIC.', 'Índice de preços do comércio externo', 'A variável calcula o comércio cultural externo desagregado em termos de preços. Variável apresentada apenas para bens. Ano de 2007 = 100.'),
	(4, 13, 'kilogram', 'MDIC.', 'Quantidade física transacionada', 'Demonstra se há ou não vantagem comparativa nas exportações do comércio exterior nacional cultural por estratificação proposta.'),
	(4, 14, 'none', 'Elaboração do NECCULT com base no MDIC, FUNCEX e BIS.', 'Índice de rentabilidade das exportações', 'A variável mostra a relação entre o índice de preços das exportações, corrigido pela taxa de câmbio, e uma aproximação do índice de custos das exportações setoriais estimado pela FUNCEX. Variável apresentada apenas para bens, sendo 2009 o ano base (índice = 100).');

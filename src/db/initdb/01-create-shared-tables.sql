create table uf (
	id integer NOT null primary KEY,
	nome varchar(32) UNIQUE,
	sigla varchar(2) UNIQUE,
	regiao varchar(20),
	preposicao varchar(3) NOT null
);

INSERT INTO uf (id, sigla, preposicao, nome, regiao) VALUES
	( 0, 'TD', 'do', 'Todos', 'Todas'),
	(11, 'RO', 'de', 'Rondônia', 'Norte'),
	(12, 'AC', 'do', 'Acre', 'Norte'),
	(13, 'AM', 'do', 'Amazonas', 'Norte'),
	(14, 'RR', 'de', 'Roraima', 'Norte'),
	(15, 'PA', 'do', 'Pará', 'Norte'),
	(16, 'AP', 'do', 'Amapá', 'Norte'),
	(17, 'TO', 'do', 'Tocantins', 'Norte'),
	(21, 'MA', 'do', 'Maranhão', 'Nordeste'),
	(22, 'PI', 'do', 'Piauí', 'Nordeste'),
	(23, 'CE', 'do', 'Ceará', 'Nordeste'),
	(24, 'RN', 'do', 'Rio Grande Do Norte', 'Nordeste'),
	(25, 'PB', 'da', 'Paraíba', 'Nordeste'),
	(26, 'PE', 'de', 'Pernambuco', 'Nordeste'),
	(27, 'AL', 'de', 'Alagoas', 'Nordeste'),
	(28, 'SE', 'de', 'Sergipe', 'Nordeste'),
	(29, 'BA', 'da', 'Bahia', 'Nordeste'),
	(31, 'MG', 'de', 'Minas Gerais', 'Sudeste'),
	(32, 'ES', 'do', 'Espírito Santo', 'Sudeste'),
	(33, 'RJ', 'do', 'Rio De Janeiro', 'Sudeste'),
	(35, 'SP', 'de', 'São Paulo', 'Sudeste'),
	(41, 'PR', 'do', 'Paraná', 'Sul'),
	(42, 'SC', 'de', 'Santa Catarina', 'Sul'),
	(43, 'RS', 'do', 'Rio Grande Do Sul', 'Sul'),
	(50, 'MS', 'de', 'Mato Grosso Do Sul', 'Centro-Oeste'),
	(51, 'MT', 'de', 'Mato Grosso', 'Centro-Oeste'),
	(52, 'GO', 'de', 'Goiás', 'Centro-Oeste'),
	(53, 'DF', 'do', 'Distrito Federal', 'Centro-Oeste'),
	(99, 'OT', 'do', 'Outros', 'Outros');

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
	(3, 2, 'real', 'SEFIC-MINC', 'Consumo via Vale-Cultura', NULL),
	(3, 3, 'none', 'SEFIC-MINC', 'Agentes do Vale-Cultura', NULL),
	(3, 4, 'real', 'BNDES.', 'Financiamento pelo BNDES', 'Mostra o valor bruto total destinado ao fomento da produção artística e cultural por meio do Fundo Cultural do BNDES.'),
	(3, 5, 'real', 'SALICnet.', 'Valor total dos incentivos privados', 'Demonstra o valor bruto total na forma de incentivos privados para o fomento da produção artística e cultural por estrato proposto.'),
	(3, 6, 'real', 'SALICnet.', 'Valor total dos incentivos das empresas estatais', 'Demonstra o valor bruto total na forma de incentivos provenientes de empresas públicas para o fomento da produção artística e cultural por estrato proposto.'),
	(3, 7, 'percent', 'Elaborado pelo NECCULT com base no SALICnet.', 'Percentual de Recursos Privados no total financiado via Mecenato', 'Retrata o percentual dos recursos privados em cultura e despesas em fomento da cultura nos estratos referidos.'),
	(3, 8, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Participação do financiamento público total no valor adicionado pelas atividades culturais', 'Retrata a razão entre o total destinado na forma de fomento por meio de políticas e seus mecanismos e o valor adicionado pela cultura no PIB nacional.'),
	(3, 9, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Participação do financiamento público total na massa salarial das atividades culturais', 'Retrata a razão entre a despesa total em cultura e a arrecadação total nos estratos referidos.'),
	(3, 10, 'percent', 'Elaborado pelo NECCULT com base no Ministério do Planejamento (dados de orçamento) e SALICnet (financiamento por mecenato e FNC).', 'Participação da despesa com cultura nas contas públicas federais', 'Retrata a razão entre a despesa total em cultura e a massa salarial nos estratos referidos.'),
	(3, 11, 'none', 'SALICnet.', 'Total das propostas de projetos de financiamento cultural', 'Retrata a soma de todas propostas para LIC nos estratos referidos.'),
	(3, 12, 'none', 'SALICNET', 'Total dos projetos de financiamento cultural efetivamente fomentados', 'Retrata todos os projetos propostos que foram fomentados pela LIC nos estratos referidos.'),
	(3, 13, 'none', 'SALICnet.', 'Tempo médio de aprovação dos projetos de financiamento cultural', 'Retrata o tempo médio entre a proposta de projeto e a efetiva aprovação do fomento.'),
	(3, 14, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Razão entre total solicitado pelos projetos e o valor efetivo aprovado', 'Retrata o percentual relativo que relaciona o valor solicitados pelos projetos e o total efetivo do fomento.'),
	(3, 15, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Índice Razão para Concentração dos Incentivos Fiscais (C4)', 'Retrata sobre o quão concentrado é os recursos apoiados nos estratos referidos.'),
	(3, 16, 'none', 'Elaborado pelo NECCULT com base no SALICnet.', 'Índice Herfindahl-Hirschman para Concentração dos Projetos Fomentados', 'Retrata sobre o quão concentrado é o gasto em cultura pelos estratos referidos.'),
	(3, 17, 'real', NULL, 'Fomento Público Estadual à Cultura', NULL);


insert into variavel (eixo, variavel, format, fonte, titulo, descricao) values
	(4, 1, 'real', 'MDIC.', 'Comércio Externo', 'Demonstra o valor de absoluto dos setores culturais por estratificação proposta.'),
	(4, 2, 'percent', 'Elaboração do NECCULT com base no MDIC.', 'Participação no comércio exterior total', 'Demonstra a relação do comércio exterior nacional cultural com o comércio exterior brasileiro por estratificação proposta.'),
	(4, 3, 'percent', 'Elaboração do NECCULT com base no MDIC.', 'Relação com o valor adicionado pela cultura', 'Demonstra a relação do comércio exterior nacional cultural com o valor adicionado pela cultura por estratificação proposta.'),
	(4, 4, 'none', 'Elaboração do NECCULT com base no MDIC.', 'Razões de concentração (C2/C4) do comércio externo', 'Demonstra a relação do comércio exterior nacional cultural com o comércio global por estratificação proposta.'),
	(4, 5, 'none', 'Elaboração NECCULT, com base nos dados do MDIC.', 'IHH (Índice Herfindahl-Hirschman) de concentração do comércio externo', 'Demonstra a relação do comércio exterior nacional cultural com o produto interno bruto por estratificação proposta.'),
	(4, 6, 'none', 'Elaboração do NECCULT com base no MDIC.', 'Índice de quantum do comércio externo', 'Demonsta o quão concentrado é o comércio exterior nacional cultural por estratificação proposta.'),
	(4, 7, 'none', 'Elaboração do NECCULT com base no MDIC.', 'Índice de preços do comércio externo', 'A variável calcula o comércio cultural externo desagregado em termos de preços. Variável apresentada apenas para bens. Ano de 2007 = 100.'),
	(4, 8, 'kilogram', 'MDIC.', 'Quantidade física transacionada', 'Demonstra se há ou não vantagem comparativa nas exportações do comércio exterior nacional cultural por estratificação proposta.'),
	(4, 9, 'none', 'Elaboração do NECCULT com base no MDIC, FUNCEX e BIS.', 'Índice de rentabilidade das exportações', 'A variável mostra a relação entre o índice de preços das exportações, corrigido pela taxa de câmbio, e uma aproximação do índice de custos das exportações setoriais estimado pela FUNCEX. Variável apresentada apenas para bens, sendo 2009 o ano base (índice = 100).');

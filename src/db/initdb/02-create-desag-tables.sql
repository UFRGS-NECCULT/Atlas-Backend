create table desagregacao (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	seletor varchar(7)
);

create table subdesagregacao (
	id integer NOT null primary key,
	desagregacao_id integer not null references desagregacao(id) ON DELETE restrict,
	subdesagregacao_id integer not null,
	subdesagregacao_nome varchar(64) not null,
	subdesagregacao_cor varchar(7) null,
  display varchar(64) null, -- Como deve ser mostrada essa subdesagregação na box de descrição do valor

	unique (desagregacao_id, subdesagregacao_id)
);

insert into desagregacao (id, seletor, nome) values
  (0, 'tot', 'Total'),
  (1, 'prt', 'Porte'),
  (2, 'esc', 'Escolaridade'),
  (3, 'etn', 'Etinia'),
  (4, 'snd', 'Sindicato'),
  (5, 'idd', 'Idade'),
  (6, 'prv', 'Previdência'),
  (7, 'frm', 'Formalidade'),
  (8, 'sex', 'Sexo');

insert into subdesagregacao (id, desagregacao_id, subdesagregacao_id, subdesagregacao_cor, subdesagregacao_nome, display) values
  (0, 0, 0, null, 'Total', null),
  (10, 1, 0, '#071342', 'Total', null),
  (11, 1, 1, '#077DDD', 'Micro', 'de empresas de porte micro'),
  (12, 1, 2, '#0F4B67', 'Pequeno', 'de empresas de porte pequeno'),
  (13, 1, 3, '#E6C59B', 'Médio', 'de empresas de porte médio'),
  (14, 1, 4, '#8178AF', 'Grande', 'de empresas de porte grande'),
  (20, 2, 0, '#071342', 'Total', null),
  (21, 2, 1, '#071342', 'Sem Instrução', 'que não possuem instrução'),
  (22, 2, 2, '#077DDD', 'Fundamental Incompleto', 'que possuem escolaridade de nível fundamental incompleto'),
  (23, 2, 3, '#8178AF', 'Fundamental Completo', 'que possuem escolaridade de nível fundamental completo'),
  (24, 2, 4, '#EC8A91', 'Médio Completo', 'que possuem escolaridade de nível médio completo'),
  (25, 2, 5, '#E96B00', 'Superior Incompleto', 'que possuem escolaridade de nível superior incompleto'),
  (26, 2, 6, '#6dbfc9', 'Superior Completo', 'que possuem escolaridade de nível superior completo'),
  (27, 2, 7, '#ff0000', 'Não Determinado', 'que possuem escolaridade de nível não determinado'),
  (30, 3, 0, '#071342', 'Total', null),
  (31, 3, 1, '#0F4B67', 'Indígena', 'declarados indígenas'),
  (32, 3, 2, '#EC8A91', 'Branca', 'declarados brancos'),
  (33, 3, 3, '#8178AF', 'Preta', 'declarados pretos'),
  (34, 3, 4, '#E6C59B', 'Amarela', 'declarados amarelos'),
  (35, 3, 5, '#077DDD', 'Parda', 'declarados pardos'),
  (40, 4, 0, '#071342', 'Total', null),
  (41, 4, 1, '#071342', 'Membro', 'com sindicato'),
  (42, 4, 2, '#6dbfc9', 'Não Membro', 'sem sindicato'),
  (50, 5, 0, '#071342', 'Total', null),
  (51, 5, 1, '#6dbfc9', '10 a 17', 'com idade entre 10 a 17 anos'),
  (52, 5, 2, '#077DDD', '18 a 29', 'com idade entre 18 a 29 anos'),
  (53, 5, 3, '#8178AF', '30 a 49', 'com idade entre 30 a 49 anos'),
  (54, 5, 4, '#EC8A91', '50 a 64', 'com idade entre 50 a 64 anos'),
  (55, 5, 5, '#E96B00', '65 ou mais', 'com idade entre 65 ou mais anos'),
  (56, 5, 6, '#6A474D', 'Não Classificado', 'com idade não classificada'),
  (60, 6, 0, '#071342', 'Total', null),
  (61, 6, 1, '#071342', 'Contribuinte', 'com previdência'),
  (62, 6, 2, '#6dbfc9', 'Não Contribuinte', 'sem previdência'),
  (70, 7, 0, '#071342', 'Total', null),
  (71, 7, 1, '#071342', 'Formal', 'com formalidade'),
  (72, 7, 2, '#6dbfc9', 'Informal', 'sem formalidade'),
  (80, 8, 0, '#071342', 'Total', null),
  (81, 8, 1, '#071342', 'Masculino', 'do sexo masculino'),
  (82, 8, 2, '#E96B00', 'Feminino', 'do sexo feminino');

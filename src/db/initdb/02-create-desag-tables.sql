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

insert into subdesagregacao (id, desagregacao_id, subdesagregacao_id, subdesagregacao_cor, subdesagregacao_nome) values
  (0, 0, 0, null, 'Total'),
  (10, 1, 0, '#071342', 'Total'),
  (11, 1, 1, '#077DDD', 'Micro'),
  (12, 1, 2, '#0F4B67', 'Pequena'),
  (13, 1, 3, '#E6C59B', 'Média'),
  (14, 1, 4, '#8178AF', 'Grande'),
  (20, 2, 0, '#071342', 'Total'),
  (21, 2, 1, '#071342', 'Sem Instrução'),
  (22, 2, 2, '#077DDD', 'Fundamental Incompleto'),
  (23, 2, 3, '#8178AF', 'Fundamental Completo'),
  (24, 2, 4, '#EC8A91', 'Médio Completo'),
  (25, 2, 5, '#E96B00', 'Superior Incompleto'),
  (26, 2, 6, '#6dbfc9', 'Superior Completo'),
  (27, 2, 7, '#ff0000', 'Não Determinado'),
  (30, 3, 0, '#071342', 'Total'),
  (31, 3, 1, '#0F4B67', 'Indígena'),
  (32, 3, 2, '#EC8A91', 'Branca'),
  (33, 3, 3, '#8178AF', 'Preta'),
  (34, 3, 4, '#E6C59B', 'Amarela'),
  (35, 3, 5, '#077DDD', 'Parda'),
  (40, 4, 0, '#071342', 'Total'),
  (41, 4, 1, '#071342', 'Membro'),
  (42, 4, 2, '#6dbfc9', 'Não Membro'),
  (50, 5, 0, '#071342', 'Total'),
  (51, 5, 1, '#6dbfc9', '10 a 17'),
  (52, 5, 2, '#077DDD', '18 a 29'),
  (53, 5, 3, '#8178AF', '30 a 49'),
  (54, 5, 4, '#EC8A91', '50 a 64'),
  (55, 5, 5, '#E96B00', '65 ou mais'),
  (56, 5, 6, '#6A474D', 'Não Classificado'),
  (60, 6, 0, '#071342', 'Total'),
  (61, 6, 1, '#071342', 'Contribuinte'),
  (62, 6, 2, '#6dbfc9', 'Não Contribuinte'),
  (70, 7, 0, '#071342', 'Total'),
  (71, 7, 1, '#071342', 'Formal'),
  (72, 7, 2, '#6dbfc9', 'Informal'),
  (80, 8, 0, '#071342', 'Total'),
  (81, 8, 1, '#071342', 'Masculino'),
  (82, 8, 2, '#E96B00', 'Feminino');

create table desagregacao (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	seletor varchar(7)
);

create table subdesagregacao (
	id integer NOT null primary key,
	desagregacao_id integer not null references desagregacao(id) ON DELETE restrict,
	subdesagregacao_id integer not null,
  
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

insert into subdesagregacao (id, desagregacao_id, subdesagregacao_id) values
  (0, 0, 0),
  (10, 1, 0),
  (11, 1, 1),
  (12, 1, 2),
  (13, 1, 3),
  (14, 1, 4),
  (20, 2, 0),
  (21, 2, 1),
  (22, 2, 2),
  (23, 2, 3),
  (24, 2, 4),
  (25, 2, 5),
  (26, 2, 6),
  (27, 2, 7),
  (30, 3, 0),
  (31, 3, 1),
  (32, 3, 2),
  (33, 3, 3),
  (34, 3, 4),
  (35, 3, 5),
  (40, 4, 0),
  (41, 4, 1),
  (42, 4, 2),
  (50, 5, 0),
  (51, 5, 1),
  (52, 5, 2),
  (53, 5, 3),
  (54, 5, 4),
  (55, 5, 5),
  (56, 5, 6),
  (60, 6, 0),
  (61, 6, 1),
  (62, 6, 2),
  (70, 7, 0),
  (71, 7, 1),
  (72, 7, 2),
  (80, 8, 0),
  (81, 8, 1),
  (82, 8, 2);

create table porte (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table porte;

create table escolaridade (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table escolaridade;

create table sindicato (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table sindicato;

create table etinia (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table etinia;

create table idade (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table idade;

create table formalidade (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table formalidade;

create table previdencia (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table previdencia;

create table sexo (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
  subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	cor varchar(7)
);

--drop table sexo;

insert into porte (id, subdesagregacao_id, cor, nome) values
  (0, 10, '#071342', 'Total'),
  (1, 11, '#077DDD', 'Micro'),
  (2, 12, '#0F4B67', 'Pequena'),
  (3, 13, '#E6C59B', 'Média'),
  (4, 14, '#8178AF', 'Grande');

insert into escolaridade (id, subdesagregacao_id, cor, nome) values
  (0, 20, '#071342', 'Total'),
  (1, 21, '#071342', 'Sem Instrução'),
  (2, 22, '#077DDD', 'Fundamental Incompleto'),
  (3, 23, '#8178AF', 'Fundamental Completo'),
  (4, 24, '#EC8A91', 'Médio Completo'),
  (5, 25, '#E96B00', 'Superior Incompleto'),
  (6, 26, '#6dbfc9', 'Superior Completo'),
  (7, 27, '#ff0000', 'Não Determinado');

insert into sindicato (id, subdesagregacao_id, cor, nome) values
  (0, 40, '#071342', 'Total'),
  (1, 41, '#071342', 'Membro'),
  (2, 42, '#6dbfc9', 'Não Membro');

insert into etinia (id, subdesagregacao_id, cor, nome) values
  (0, 30, '#071342', 'Total'),
  (1, 31, '#0F4B67', 'Indígena'),
  (2, 32, '#EC8A91', 'Branca'),
  (3, 33, '#8178AF', 'Preta'),
  (4, 34, '#E6C59B', 'Amarela'),
  (5, 35, '#077DDD', 'Parda');

insert into idade (id, subdesagregacao_id, cor, nome) values
  (0, 50, '#071342', 'Total'),
  (1, 51, '#6dbfc9', '10 a 17'),
  (2, 52, '#077DDD', '18 a 29'),
  (3, 53, '#8178AF', '30 a 49'),
  (4, 54, '#EC8A91', '50 a 64'),
  (5, 55, '#E96B00', '65 ou mais'),
  (6, 56, '#6A474D', 'Não Classificado');

insert into formalidade (id, subdesagregacao_id, cor, nome) values
  (0, 70, '#071342', 'Total'),
  (1, 71, '#071342', 'Formal'),
  (2, 71, '#6dbfc9', 'Informal');

insert into previdencia (id, subdesagregacao_id, cor, nome) values
  (0, 60, '#071342', 'Total'),
  (1, 61,'#071342', 'Contribuinte'),
  (2, 62,'#6dbfc9', 'Não Contribuinte');

insert into sexo (id, subdesagregacao_id, cor, nome) values
  (0, 80, '#071342', 'Total'),
  (1, 81, '#071342', 'Masculino'),
  (2, 82, '#E96B00', 'Feminino');
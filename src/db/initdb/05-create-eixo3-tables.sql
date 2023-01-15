create table mecanismo (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	cor varchar(7)
);

insert into mecanismo  (id, nome, cor) values
	(0, 'Todos', '#071342'),
	(1, 'FNC', '#87A8CA'),
	(2, 'Mecenato', '#077DDD'),
	(3, 'Fundo Cultural', '#0F4B67'),
	(4, 'Outros', '#8178AF');

create table modalidade (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	cor varchar(7)
);

insert into modalidade  (id, nome, cor) values
	(0, 'Todos', '#071342'),
	(1, 'Direta', '#87A8CA'),
	(2, 'Indireta', '#8178AF');

create table pessoa (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	cor varchar(7)
);

insert into pessoa  (id, nome, cor) values
	(0, 'Todos', '#071342'),
	(1, 'Pessoa Física', '#87A8CA'),
	(2, 'Pessoa Jurídica', '#8178AF');

CREATE TABLE eixo_3 (
	id integer GENERATED ALWAYS AS IDENTITY,
	eixo_id integer not null default(3) references eixo(id) ON DELETE restrict,
	variavel_id integer not null,
	uf_id integer not null references uf(id) ON DELETE restrict,
	cadeia_id integer not null references cadeia(id) ON DELETE restrict,
	mecanismo_id integer not null references mecanismo(id) ON DELETE restrict,
	modalidade_id integer not null references modalidade(id) ON DELETE restrict,
	pessoa_id integer not null references pessoa(id) ON DELETE restrict,
	concentracao smallint null,
	ano smallint not null,
	valor double precision null,
	percentual double precision null,
	taxa double precision null,
	
	FOREIGN KEY (eixo_id, variavel_id) REFERENCES variavel (eixo, variavel),

	unique (variavel_id, uf_id, cadeia_id, mecanismo_id, modalidade_id, pessoa_id, concentracao, ano)
);


create table tipo (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	display varchar(64)
);

insert into tipo  (id, nome, display) values
	(0, 'Todos', null),
	(1, 'Exportação', 'Exportações'),
	(2, 'Importação', 'Importações'),
	(3, 'Saldo Comercial', null),
	(4, 'Valor Transacionado', null);


create table consumo (
	id integer NOT null primary key,
	nome varchar(64) unique not null
);

insert into consumo  (id, nome) values
	(0, 'Bens'),
	(1, 'Serviços');

create table parceiro (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	sigla varchar(2) unique not null,
	cor varchar(7) unique not null
);

insert into parceiro  (id, sigla, cor, nome) values
	(0, 'MD', '#2F484F','Mundo'),
	(1, 'AF', '#657F7B','África'),
	(2,	'NA', '#8D8E69','América do Norte'),
	(3, 'SA', '#656F70','América do Sul'),
	(4, 'AS', '#FAEECF','Ásia'),
	(5, 'EU', '#D8D1AE','Europa'),
	(6, 'OC', '#EFD1AE','Oceania');

CREATE TABLE eixo_4 (
	id integer GENERATED ALWAYS AS IDENTITY,
	eixo_id integer not null default(4) references eixo(id) ON DELETE restrict,
	variavel_id integer not null,
	uf_id integer not null references uf(id) ON DELETE restrict,
	cadeia_id integer not null references cadeia(id) ON DELETE restrict,
	parceiro_id integer null references parceiro(id) ON DELETE restrict,
	consumo_id integer null references consumo(id) ON DELETE restrict,
	tipo_id integer not null references tipo(id) ON DELETE restrict,
	concentracao smallint null,
	ano smallint not null,
	valor double precision null,
	percentual double precision null,
	taxa double precision null,

	FOREIGN KEY (eixo_id, variavel_id) REFERENCES variavel (eixo, variavel),

	unique (variavel_id, uf_id, cadeia_id, parceiro_id, consumo_id, tipo_id, concentracao, ano)
);


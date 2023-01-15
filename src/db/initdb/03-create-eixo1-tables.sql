create table atuacao (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	cor varchar(7)
);

insert into atuacao  (id, nome, cor) values
	(0, 'Todos', '#077DDD'),
	(1, 'Comércio', '#071342'),
	(2, 'Serviços e Indústria', '#6A474D');

CREATE TABLE eixo_1 (
	id integer GENERATED ALWAYS AS IDENTITY,
	eixo_id integer not null default(1) references eixo(id) ON DELETE restrict,
	variavel_id integer not null,
	uf_id integer not null references uf(id) ON DELETE restrict,
	cadeia_id integer not null references cadeia(id) ON DELETE restrict,
	atuacao_id integer not null references atuacao(id) ON DELETE restrict,
	subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	concentracao smallint null,
	ano smallint not null,
	valor double precision null,
	percentual double precision null,
	taxa double precision null,
	
	FOREIGN KEY (eixo_id, variavel_id) REFERENCES variavel (eixo, variavel),

	unique (variavel_id, uf_id, cadeia_id, atuacao_id, subdesagregacao_id, concentracao, ano)
);


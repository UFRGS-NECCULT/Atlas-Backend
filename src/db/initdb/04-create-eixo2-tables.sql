create table ocupacao (
	id integer NOT null primary key,
	nome varchar(64) unique not null,
	cor varchar(7) NOT null,
	gradiente_inferior varchar(7) NOT null,
	gradiente_superior varchar(7) NOT null
);

insert into ocupacao  (id, cor, gradiente_inferior, gradiente_superior, nome) values
	(0, '#071342', '#D9D5DE', '#685D78', 'Todos'),
	(1, '#87A8CA', '#E8EEF5', '#ADC4DC', 'Atividades Relacionadas'),
	(2, '#077DDD', '#EDF1F9', '#A0B5DB', 'Cultura');

CREATE TABLE eixo_2 (
	id integer GENERATED ALWAYS AS IDENTITY,
	eixo_id integer not null default(2) references eixo(id) ON DELETE restrict,
	variavel_id integer not null,
	uf_id integer not null references uf(id) ON DELETE restrict,
	cadeia_id integer not null references cadeia(id) ON DELETE restrict,
	ocupacao_id integer null references ocupacao(id) ON DELETE restrict,
	subdesagregacao_id integer not null references subdesagregacao(id) ON DELETE restrict,
	ano smallint not null,
	valor double precision null,
	percentual double precision null,
	taxa double precision null,
	
	FOREIGN KEY (eixo_id, variavel_id) REFERENCES variavel (eixo, variavel),

	unique (variavel_id, uf_id, cadeia_id, ocupacao_id, subdesagregacao_id, ano)
);


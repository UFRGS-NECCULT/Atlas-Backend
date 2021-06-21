# Primeira execução

* Caso não exista na máquina a network **atlas-network** criar com o comando `docker network create atlas-network`
* Fazer uma copia do arquivo `docker-compose.example.yml` para `docker-compose.yml`
* Fazer uma copia do arquivo `.env.example` para `.env`
* OPCIONAL Mudar as variáveis de ambiente em ambos arquivos
* Executar o comando `docker-compose up -d --build`

Após a execução o servidor está rodando na porta **8080** e o banco na porta **3306**.

Os dados serão gravados no diretório Volumes, e *não serão versionados*.

Lembre-se que em ambiente docker para o container do servidor poder conectar o endereço do host é **atlas_db** e não **localhost**.



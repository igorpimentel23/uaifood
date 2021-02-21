# Uaifood Backend

API em NodeJS para cadastro, alteração, atualização e consulta de restaurantes e itens dos restaurantes.

## Começando

Estas instruções te darão uma cópia do projeto pronta para rodar na sua máquina local para propósitos de testes.

### Pré-requisitos

Para a instalação do projeto, é necessário que o Docker e Docker Compose esteja instalado na máquina.

[Docker](https://docs.docker.com/get-docker/)
[Docker Compose](https://docs.docker.com/compose/install/)

### Instalando

Depois de clonar e baixar o projeto, excute o comando:

```
cp .env.example .env
```

Então, abra o terminal de comando na pasta do projeto, e execute:

```
docker-compose up --build -d
```

Após o término, para verificar se os containers foram construidos com sucesso, executar o comando:

```
docker ps
```

Os seguintes dados devem aparecer:

```
CONTAINER ID        IMAGE                    COMMAND                  CREATED             STATUS              PORTS                    NAMES
xxxxxxxxxxxx        uaifood_uaifood          "docker-entrypoint.s…"   4 minutes ago       Up 3 minutes        0.0.0.0:80->80/tcp       uaifood.web
yyyyyyyyyyyy        postgis/postgis          "docker-entrypoint.s…"   18 hours ago        Up 4 minutes        0.0.0.0:5432->5432/tcp   uaifood.postgres
zzzzzzzzzzzz        redis:6-alpine           "docker-entrypoint.s…"   18 hours ago        Up 4 minutes        0.0.0.0:6379->6379/tcp   uaifood.redis
```

Feito isso, para a instalação das migrations, executar:

```
./container
```

e em seguida:

```
yarn typeorm migration:run
```

Para verificar se o projeto está rodando perfeitamente, acesse no navegador:

```
http://localhost/api/v1/
```

A resposta deverá ser o seguinte JSON:

```
{"OK":"OK"}
```

### Rotas da aplicação

#### Parâmetros das rotas

- name (string) : Nome do item ou restaurante
- rating (integer de 1 a 5) : Avaliação do item ou do restaurante
- cost (number maior igual a 0) : Custo do item ou do restaurante
- less_than (number) : Parâmetro para comparação do custo do item ou do restaurante
- greater_than (number) : Parâmetro para comparação do custo do item ou do restaurante
- radius (number maior igual a 0) : Parâmetro para pesquisa de restaurantes ou itens dentro de um raio em km
- lat (number) : Latitude
- lng (number) : Longitude
- avatar (string) : Avatar do item ou do restaurante
- item_id (uuid) : Número unico de identificação do item
- street (string) (obrigatório) : Rua para definição de geolocalização do restaurante
- street_number (integer maior igual a 0) (obrigatório) : Numero da rua para definição de geolocalização do restaurante
- city (string) (obrigatório): Cidade para definição de geolocalização do restaurante
- state (string) (obrigatório) : Estado para definição de geolocalização do restaurante
- type (string) (obrigatório) : Tipo de cozinha do restaurante
- city_for_geo (string) : Cidade para pesquisa de restaurantes em um raio de 30 km

#### Itens

1. GET(api/v1/items/restaurants)

    Retorna todos os restaurantes que possuem itens com os requisitos pesquisados.

    Query:

    - name (string)
    - rating (integer de 1 a 5)
    - cost (number maior igual a 0)
    - less_than (number)
    - greater_than (number)
    - restaurant_id (uuid)
    - radius (number maior igual a 0)
    - lat (number)
    - lng (number)



2. GET(api/v1/items/all)

    Retorna todos os itens que possuem os requisitos pesquisados.

    Query:

    - name (string)
    - rating (integer de 1 a 5)
    - cost (number maior igual a 0)
    - less_than (number)
    - greater_than (number)
    - restaurant_id (uuid)
    - radius (number maior igual a 0)
    - lat (number)
    - lng (number)



3. POST(api/v1/items/)

    Cria um item.

    Body (JSON):

    - name (string) (obrigatório)
    - cost (number maior igual a 0) (obrigatório)
    - restaurant_id (uuid) (obrigatório)
    - avatar (string) (obrigatório)



4. GET(api/v1/items/:item_id)

    Retorna o item.

    Params:

    - item_id (uuid) (obrigatório)



5. POST(api/v1/items/)

    Cria um item.

    Body (JSON):

    - item_id (uuid) (obrigatório)
    - name (string) (obrigatório)
    - cost (number maior igual a 0) (obrigatório)
    - rating (integer de 1 a 5)
    - restaurant_id (uuid) (obrigatório)
    - avatar (string) (obrigatório)



6. DELETE(api/v1/items/:item_id)

    Retorna o item.

    Params:

    - item_id (uuid) (obrigatório)



7. GET(api/v1/items/:restaurant_id/me)

    Retorna os items de um restaurante.

    Params:

    - restaurante (uuid) (obrigatório)



#### Restaurantes

1. GET(api/v1/restaurants/types)

    Retorna todas as categorias dos restaurantes cadastrados.



2. POST(api/v1/restaurants/)

    Cria um restaurante.

    Body (JSON):

    - name (string) (obrigatório)
    - street (string) (obrigatório)
    - street_number (integer maior igual a 0) (obrigatório)
    - city (string) (obrigatório)
    - state (string) (obrigatório)
    - cost (number maior igual a 0) (obrigatório)
    - type (string) (obrigatório)



3. PUT(api/v1/restaurants/)

    Atualiza um restaurante.

    Body (JSON):

    - restaurant_id (uuid) (obrigatório)
    - name (string) (obrigatório)
    - street (string) (obrigatório)
    - street_number (integer maior igual a 0) (obrigatório)
    - city (string) (obrigatório)
    - state (string) (obrigatório)
    - cost (number maior igual a 0) (obrigatório)
    - rating (integer de 1 a 5) (obrigatório)
    - type (string) (obrigatório)



4. GET(api/v1/restaurants/all)

    Retorna todos os restaurantes que possuem os requisitos pesquisados.

    Query:

    - name (string)
    - street (string)
    - street_number (integer maior igual a 0)
    - city (string)
    - state (string)
    - cost (number maior igual a 0)
    - rating (integer de 1 a 5)
    - type (string)
    - radius (number maior igual a 0)
    - lat (number)
    - lng (number)
    - city_for_geo (string)



5. GET(api/v1/restaurants/:restaurant_id)

    Retorna um restaurante.

    Params:

    - restaurant_id (uuid)



6. DELETE(api/v1/restaurants/:restaurant_id)

    Deleta um restaurante.

    Params:

    - restaurant_id (uuid)



## Executando testes

Para executar os testes automatizados da aplicação, na pasta raiz da aplicação, executar:

```
yarn test
```

## Autores

* **Igor Pimentel** - *Trabalho inicial* - [igorpimentel23](https://github.com/igorpimentel23)


## Licença

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


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

#### Restaurantes

* GET api/v1/restaurants/types

    Retorna todas as categorias dos restaurantes cadastrados.

    Exemplo:

    ```
    api/v1/restaurants/types
    ```


* POST api/v1/restaurants/

    Cria um restaurante.

    Exemplo:

    ```
    api/v1/restaurants/
    ```
    
    ```
    {
      name: "Restaurante",
      street "Rua Exemplo",
      street_number: 10,
      city: "São Paulo",
      state: "São Paulo",
      rating: 5,
      cost: 80,
      avatar: "http://www.exemplo.com/avatar.jpg",,
    }
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    name	        | string	|  Nome do item (obrigatório)
    street        | string  |  Rua para definição de geolocalização do restaurante (obrigatório)
    street_number | string  |  Numero da rua para definição de geolocalização do restaurante (obrigatório)
    city          | string  |  Cidade para definição de geolocalização do restaurante (obrigatório)
    state         | string  |  Estado para definição de geolocalização do restaurante (obrigatório)
    rating	      | integer	|  Avaliação do item (de 1 a 5) (obrigatório)
    cost	        | number	|  Custo do item (maior igual a 0) (obrigatório)
    avatar        | string	|  Posição para pesquisa (obrigatório)
    ```



* PUT api/v1/restaurants/

    Atualiza um restaurante.

    Exemplo:

    ```
    api/v1/restaurants/
    ```
    
    ```
    {
      retaurant_id: "123nbjb-1b2jk3bjk-jb12312",
      name: "Restaurant",
      street "Rua Exemplo",
      street_number: 10,
      city: "São Paulo",
      state: "São Paulo",
      rating: 5,
      cost: 90,
      type: "Japonesa",
    }
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    retaurant_id	| uuid	  |  Identificação do restaurante (obrigatório)
    name	        | string	|  Nome do item (obrigatório)
    street        | string  |  Rua para definição de geolocalização do restaurante (obrigatório)
    street_number | string  |  Numero da rua para definição de geolocalização do restaurante (obrigatório)
    city          | string  |  Cidade para definição de geolocalização do restaurante (obrigatório)
    state         | string  |  Estado para definição de geolocalização do restaurante (obrigatório)
    rating	      | integer	|  Avaliação do item (de 1 a 5) (obrigatório)
    cost	        | number	|  Custo do item (maior igual a 0) (obrigatório)
    type          | string	|  Tipo de cozinha do restaurante (obrigatório)
    ```


* GET api/v1/restaurants/all

    Retorna todos os restaurantes que possuem os requisitos pesquisados.

    Exemplo:

    ```
    api/v1/restaurants/all?name=XXXXX?street=XXXXXXXXXX (...)
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    name	        | string	|  Nome do item
    street        | string  |  Rua para definição de geolocalização do restaurante
    street_number | string  |  Numero da rua para definição de geolocalização do restaurante
    city          | string  |  Cidade para definição de geolocalização do restaurante
    state         | string  |  Estado para definição de geolocalização do restaurante
    rating	      | integer	|  Avaliação do item (de 1 a 5)
    cost	        | number	|  Custo do item (maior igual a 0)
    type          | string	|  Tipo de cozinha do restaurante
    radius	      | number	|  Parâmetro para pesquisa de restaurantes ou itens dentro de um raio em km
    lat	          | number	|  Posição para pesquisa
    lng	          | number	|  Posição para pesquisa
    ```


* GET api/v1/restaurants/:restaurant_id

    Retorna um restaurante.

    Exemplo:
    
    ```
    api/v1/restaurants/123nbjb-1b2jk3bjk-jb12312
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    retaurant_id	| uuid	  |  Identificação do restaurante (obrigatório)
    ```


* DELETE(api/v1/restaurants/:restaurant_id)

    Deleta um restaurante.

    Exemplo:
    
    ```
    api/v1/restaurants/123nbjb-1b2jk3bjk-jb12312
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    retaurant_id	| uuid	  |  Identificação do restaurante (obrigatório)
    ```
    
#### Itens

* GET api/v1/items/restaurants

    Retorna todos os restaurantes que possuem itens com os requisitos pesquisados.

    Exemplo:
    
    ```
    api/v1/items/restaurants?name=XXXXX?street=XXXXXXXXX(...)
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ----------------------------------------------------------------------------------------------------
    name	        | string	|  Nome do item
    rating	      | integer	|  Avaliação do item (de 1 a 5)
    cost	        | number	|  Custo do item (maior igual a 0)
    less_than	    | number	|  Parâmetro para comparação do custo do item
    greater_than	| number	|  Parâmetro para comparação do custo do item
    retaurant_id	| uuid	  |  Identificação do restaurante ao qual o item pertence
    radius	      | number	|  Parâmetro para pesquisa de restaurantes ou itens dentro de um raio em km
    lat	          | number	|  Posição para pesquisa
    lng	          | number	|  Posição para pesquisa
    ```
  


* GET api/v1/items/all

    Retorna todos os itens que possuem os requisitos pesquisados.

    Exemplo:
    
    ```
    api/v1/items/all?name=XXXXX?street=XXXXXXXXX(...)
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    name	        | string	|  Nome do item
    rating	      | integer	|  Avaliação do item (de 1 a 5)
    cost	        | number	|  Custo do item (maior igual a 0)
    less_than	    | number	|  Parâmetro para comparação do custo do item
    greater_than	| number	|  Parâmetro para comparação do custo do item
    retaurant_id	| uuid	  |  Identificação do restaurante ao qual o item pertence
    radius	      | number	|  Parâmetro para pesquisa de restaurantes ou itens dentro de um raio em km
    lat	          | number	|  Posição para pesquisa
    lng	          | number	|  Posição para pesquisa
    ```


* POST api/v1/items/

    Cria um item.

    Exemplo:

    ```
    api/v1/items
    ```
    
    ```
    {
      name: "Restaurante",
      cost: 50,
      restaurant_id: "123nbjb-1b2jk3bjk-jb12312",
      avatar: "http://www.exemplo.com/avatar.jpg"
    }
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------
    name	        | string	|  Nome do item (obrigatório)
    cost	        | number	|  Custo do item (maior igual a 0) (obrigatório)
    retaurant_id	| uuid	  |  Identificação do restaurante ao qual o item pertence (obrigatório)
    avatar        | string	|  Posição para pesquisa (obrigatório)
    ```



* GET api/v1/items/:item_id

    Retorna o item.

    Exemplo:

    ```
    api/v1/items/123nbjb-1b2jk3bjk-jb12312
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    --------------------------------------------------------------------------------
    item_id       | uuid  	|  Número unico de identificação do item (obrigatório)
    ```


* POST api/v1/items/

    Cria um item.

    Exemplo:

    ```
    api/v1/items/
    ```
    
    ```
    {
      item_id: "123nbjb-1b2jk3bjk-jb12312",
      name: "Strogonoff",
      rating: 5,
      cost: 15,
      restaurant_id: "123nbjb-1b2jk3bjk-jb12312",
      avatar: "http://www.exemplo.com/avatar.jpg",
    }
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    item_id       | uuid  	|  Número unico de identificação do item (obrigatório)
    name	        | string	|  Nome do item (obrigatório)
    rating	      | integer	|  Avaliação do item (de 1 a 5) (obrigatório)
    cost	        | number	|  Custo do item (maior igual a 0) (obrigatório)
    retaurant_id	| uuid	  |  Identificação do restaurante ao qual o item pertence (obrigatório)
    avatar        | string	|  Posição para pesquisa (obrigatório)
    ```



* DELETE api/v1/items/:item_id

    Deleta o item.

    Exemplo:

    ```
    api/v1/items/123nbjb-1b2jk3bjk-jb12312
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    item_id       |  uuid	  |  Número unico de identificação do item (obrigatório)
    ```



* GET api/v1/items/:restaurant_id/me

    Retorna os items de um restaurante.

    Exemplo:

    ```
    api/v1/items/123nbjb-1b2jk3bjk-jb12312/me
    ```
    
    ```
    Parâmetro	    |  Tipo	  |  Descrição
    ---------------------------------------------------------------------------------------------------
    restaurant_id |  uuid  	|  Número unico de identificação do restaurante (obrigatório)
    ```

## Executando testes

Para executar os testes automatizados da aplicação, na pasta raiz da aplicação, executar:

```
yarn test
```

## Autores

* **Igor Pimentel** - *Trabalho inicial* - [igorpimentel23](https://github.com/igorpimentel23)


## Licença

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details


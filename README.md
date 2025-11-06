# Nome do Projeto:
    byecar-desafio-backend

# Descrição do Projeto:
    API REST em Node.js com Express para operações CRUD para Usuários, Clientes e Vendas. O projeto organiza a lógica em camadas (Controller -> Service -> Model) e usa o Sequelize para persistência no Postgres. As rotas principais estão agrupadas por módulos (user, client, sales) e protegidas por um middleware Basic Auth (autenticação via email e senha) nas operações que exigem autorização.

# Módulos principais:

    - user — POST/GET/PUT/DELETE(lógica de usuários)
    - client — POST/GET/PUT/DELETE(lógica de cliente)
    - sales — POST/GET/PUT/DELETE(lógica de vendas) (cada venda está vinculada ao cliente.)

# Requisitos:
    - Node.js (v24.11.0)
    - PostgreSQL (Visualização pelo Dbeaver)
    - Postman
    - npm

# Dependências principais:
    "express": "^5.1.0",
    "pg": "^8.16.3",
    "sequelize": "^6.37.7"

# Como rodar (passos):
    1° Clone o projeto para sua máquina.
    2° Entre na pasta do projeto e instale dependências:
        
        npm install

    3° Configure o Postgres (No projeto foi utilizado conexão direta em src/DataBase/DataBase.js). 

        const sequelize = new Sequelize('postgres', 'postgres', '<suaSenha>', {
        host: 'localhost',
        dialect: 'postgres',
        port: 5432,
        logging: false
        });

    4° Inicie o servidor:
        
        npm run dev

    Ao iniciar o sequelize.sync({ alter: true }) cria/atualiza as tabelas automaticamente. 
    Servidor por padrão no http://localhost:3000

# Estrutura do projeto:

	BYECAR-DESAFIO-BACKEND
	|-  |node_modules
	|	|src/
	|	|- DataBase/
	|	|- |- DataBase.js	#conexão direta com Postgres
	|	|- modules/
	|	|  |- Authentication/
	|	|  |  |- AnthenticationService.js	#AUtenticação Basic Auth
	|	|  |- Client/
	|	|  |  |- ClientController.js
	|	|  |  |- ClientModel.js
	|	|  |  |- ClientService.js
	|	|  |- Sales/
	|	|  |  |- SalesController.js
	|	|  |  |- SalesModel.js
	|	|  |  |- SalesService.js
	|	|  |- user/
	|	|  |  |- UserController.js
	|	|  |  |- UserModel.js
	|	|  |  |- UserService.js
	|	|- app.js
	|	|- server.js
	|- .gitignore
	|- package-lock.json
	|- package.json
	|- README.md

# Endpoints /api:

Observação: O POST "/api/users" é público para criar usuário.
- Users
	- POST /api/users — cria usuário (não precisa de Auth)

	- GET /api/users — lista todos usuários (precisa Basic Auth)

	- GET /api/users/:id — busca usuário por id (Basic Auth)

	- PUT /api/users/:id — atualiza usuário (Basic Auth)

	- DELETE /api/users/:id — exclusão lógica (Basic Auth) — define activeUser = false

- Clients
	- POST /api/client — criar cliente (Basic Auth)

	- GET /api/client — listar clientes (Basic Auth)

	- GET /api/client/:id — buscar por id (Basic Auth)

	- PUT /api/client/:id — atualizar (Basic Auth)

	- DELETE /api/client/:id — exclusão lógica (Basic Auth, activeClient = false)

- Sales
	- POST /api/sales — criar venda (Basic Auth)

	- GET /api/sales — listar vendas (Basic Auth)

	- GET /api/sales/:id — buscar por id (Basic Auth)

	- PUT /api/sales/:id — atualizar venda (Basic Auth)

	- DELETE /api/sales/:id — exclusão lógica (Basic Auth, activeSales = false)

# Autenticação Basic Auth (no Postman):
    Para autenticar as rotas no Postman:

	Vá em Authorization -> Type = Basic Auth
        Username: email cadastrado do User
        Password: senha cadastrada do user

# Exemplos de request:

Criar usuário (Sem Autenticação):

	POST http://localhost:3000/api/users \

		{
			"name": "Carlos Silva",
			"email": "carlosilva@gmail.com",
			"password": "123",
			"activeUser": true
		}

Criar Cliente (Com Autenticação):

	POST http://localhost:3000/api/client
	
		{
			"name": "Joyce Silva",
			"email": "joycesilva@gmail.com",
			"activeClient": true
		}

Criar Vendas (Com Autenticação):

	POST http://localhost:3000/api/sales
	
		{
			"nameProduct": "Tênis Adidas",
			"quantityItems": 2,
			"valueItem": 10.33,
			"clientId": 2
		}
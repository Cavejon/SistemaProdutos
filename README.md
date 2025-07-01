# 🛍️ Sistema de Feedback de Produtos

Este projeto é uma **plataforma de feedback de produtos**, desenvolvida como atividade final do Módulo 9 do curso UniSenai. A aplicação permite o cadastro de produtos, envio de feedbacks por usuários e moderação por administradores.

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express.js**
- **MySQL**
- **JWT (JSON Web Token)** para autenticação
- **Sequelize** (ORM)
- **Dotenv** para variáveis de ambiente
- **Postman** para testes manuais
- **Render** para deploy

## 📌 Funcionalidades Principais

- Cadastro de produtos com nome, descrição e categoria
- Envio de feedbacks (comentário + nota)
- Cálculo automático da média de avaliações por produto
- Login de usuários
- Moderação de feedbacks por administradores (excluir ou aprovar)

## 🗂️ Estrutura do Projeto

/controllers # Lógica dos controladores de produto, usuário e feedback
/models # Definição das tabelas via Sequelize
/routes # Rotas da API
/middleware # Middleware de autenticação JWT
/config # Configurações do Sequelize e banco de dados



## ⚙️ Instalação e Execução

```bash
# 1. Clone o repositório
git clone https://github.com/Cavejon/SistemaProdutos

# 2. Acesse a pasta
cd SistemaProdutos

# 3. Instale as dependências
npm install

# 4. Configure o banco de dados
- Crie um banco MySQL
- Altere o arquivo .env com as credenciais:

DB_NAME=nome_do_banco
DB_USER=usuario
DB_PASS=senha
DB_HOST=localhost
JWT_SECRET=sua_chave_secreta

# 5. Rode as migrations (se usar Sequelize CLI)
npx sequelize db:migrate

# 6. Inicie o servidor
npm start

🔐 Endpoints da API
🧑‍💻 Autenticação
POST /auth/register – Cria novo usuário

POST /auth/login – Login e geração de token JWT

📦 Produtos
GET /products – Lista todos os produtos

POST /products – Cria novo produto (admin)

GET /products/:id – Detalhes do produto + média das notas

💬 Feedbacks
POST /feedbacks – Envia feedback (usuário logado)

GET /feedbacks/product/:id – Lista feedbacks de um produto

DELETE /feedbacks/:id – Exclui feedback (admin)

🧪 Testes
Testes manuais via Postman (testes funcionais e de segurança)

Testes de desempenho usando autocannon para medir resposta dos endpoints mais acessados

🧠 Conclusão
Esse projeto consolidou conceitos como autenticação com JWT, ORM com Sequelize, boas práticas RESTful e organização de código em camadas. Foi um desafio trabalhar com feedbacks moderados e integração segura com banco de dados.

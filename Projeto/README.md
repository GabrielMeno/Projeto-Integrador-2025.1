# Sistema de Gestão - Auto Socorro LAZZARETTI

Sistema de gestão para empresas de guincho e reboque, com funcionalidades para controle de serviços, despesas, clientes e usuários.

## Estrutura do Projeto

O projeto está dividido em duas partes principais:

- **Backend**: API REST desenvolvida com Node.js e Express
- **Frontend**: Interface de usuário desenvolvida com React

## Requisitos

- Node.js (v16 ou superior)
- PostgreSQL (v12 ou superior)
- NPM (v8 ou superior)

## Configuração do Ambiente

### Banco de Dados

1. Crie um banco de dados PostgreSQL para o projeto
2. Configure as variáveis de ambiente conforme instruções abaixo

### Variáveis de Ambiente

Crie um arquivo `.env` na pasta raiz do backend com as seguintes variáveis:

```
DB_NAME=nome_do_seu_banco
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_HOST=localhost
DB_PORT=5432
JWT_SECRET=sua_chave_secreta_para_tokens
PORT=3001
```

## Instalação

Siga estas etapas para instalar e configurar o projeto:

### Backend

1. Navegue até a pasta do backend:
```
cd backend
```

2. Instale as dependências:
```
npm install
```


### Frontend

1. Navegue até a pasta do frontend:
```
cd frontend
```

2. Instale as dependências:
```
npm install
```

## Execução do Projeto

### Backend

1. Na pasta do backend, execute:
```
npm start
```
O servidor será iniciado na porta 3001 (ou na porta definida no arquivo .env)

### Frontend

1. Na pasta do frontend, execute:
```
npm start
```
O aplicativo React será iniciado na porta 3000 e abrirá automaticamente no navegador

## Principais Funcionalidades

- **Dashboard**: Visão geral dos indicadores financeiros e operacionais
- **Serviços**: Cadastro e gerenciamento de serviços de guincho e reboque
- **Despesas**: Controle de gastos por categoria
- **Clientes**: Cadastro e gerenciamento de clientes
- **Usuários**: Gerenciamento de usuários do sistema

## Bibliotecas e Tecnologias Utilizadas

### Backend
- **Express**: Framework web para Node.js
- **Sequelize**: ORM para bancos de dados relacionais
- **PostgreSQL**: Banco de dados relacional
- **JWT**: Autenticação baseada em tokens
- **bcryptjs**: Criptografia de senhas
- **cors**: Middleware para habilitar CORS
- **dotenv**: Carregamento de variáveis de ambiente

### Frontend
- **React**: Biblioteca para construção de interfaces
- **React Router**: Navegação entre páginas
- **CSS**: Estilização de componentes

## Acessando o Sistema

Após iniciar o backend e o frontend, acesse o sistema em:
```
http://localhost:3000
```

## Solução de Problemas

### Erro de Conexão com o Banco de Dados
- Verifique se o PostgreSQL está em execução
- Confira as credenciais no arquivo .env
- Confirme se o banco de dados foi criado

### Erro na Inicialização do Frontend
- Verifique se a porta 3000 está disponível
- Certifique-se de que todas as dependências foram instaladas

### Problemas de Autenticação
- Verifique se o backend está em execução
- Confirme se a variável JWT_SECRET está definida corretamente

## Scripts de Banco de Dados

Para criar as tabelas necessárias para o projeto, use o seguinte script SQL:

```sql
-- Criação das tabelas
CREATE TABLE usuario (
  codigo_usuario SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  login VARCHAR(50) NOT NULL UNIQUE,
  senha VARCHAR(255) NOT NULL,
  perfil VARCHAR(20)
);

CREATE TABLE cliente (
  codigo_cliente SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  cpf_cnpj VARCHAR(18) UNIQUE,
  telefone VARCHAR(20),
  email VARCHAR(100)
);

CREATE TABLE servico (
  codigo_servico SERIAL PRIMARY KEY,
  local VARCHAR(100),
  data_hora TIMESTAMP NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  forma_pagamento VARCHAR(50),
  status VARCHAR(50),
  observacoes TEXT,
  codigo_usuario INTEGER NOT NULL REFERENCES usuario(codigo_usuario),
  codigo_cliente INTEGER NOT NULL REFERENCES cliente(codigo_cliente)
);

CREATE TABLE despesa (
  codigo_despesa SERIAL PRIMARY KEY,
  tipo VARCHAR(50) NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  data TIMESTAMP NOT NULL,
  observacoes TEXT,
  descricao TEXT,
  codigo_usuario INTEGER NOT NULL REFERENCES usuario(codigo_usuario)
);

-- Inserção de dados iniciais
INSERT INTO usuario (nome, login, senha, perfil) VALUES 
('Administrador', 'admin', '$2a$10$k.58cTquTBMlEMCUxZ2HaOw0ZGI0bGLiVTa6x5WMJgX0tTe9zSTlq', 'admin');
-- Senha: admin123

INSERT INTO cliente (nome, cpf_cnpj, telefone, email) VALUES 
('Cliente Teste', '000.000.000-00', '(00) 00000-0000', 'cliente@teste.com');

```

Este script cria as tabelas necessárias e insere um usuário administrador padrão para acesso inicial ao sistema.

Para criar as tabelas usando a aplicação, você pode:

1. Configurar o arquivo `.env` conforme as instruções acima
2. Iniciar o backend com `npm start` - o Sequelize irá sincronizar os modelos com o banco de dados

### Credenciais iniciais
- **Login**: admin
- **Senha**: admin123

### Comandos para enviar ao GitHub



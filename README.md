# 📝 Sistema de Artigos — Backend (NestJS + TypeORM + Docker)

Este projeto é um sistema **headless** para gerenciamento de **usuários**, **artigos** e **permissões**, com autenticação JWT, níveis de acesso e migrations + seeds automáticos.

---

## 🚀 Tecnologias Utilizadas

- **NestJS**
- **TypeORM**
- **PostgreSQL**
- **Docker & Docker Compose**
- **JWT (Auth)**
- **bcrypt**
- **Swagger (OpenAPI)**

---

## 📌 Funcionalidades

### 🔐 Autenticação
- Login com JWT
- Token inclui o nível de permissão do usuário
- Guard de autorização baseado em roles

### 👤 Usuários
- Criar, listar, editar e excluir usuários
- Associação com permissão (Admin, Editor, Reader)
- Root admin criado automaticamente via seed

### 📰 Artigos
- Criar, listar, editar e excluir artigos
- Cada artigo possui autor vinculado

### 🛂 Permissões
- Criadas automaticamente via migration + seed
- **Admin** → CRUD de usuários e artigos  
- **Editor** → CRUD de artigos  
- **Reader** → leitura somente

---

## 📦 Como Rodar o Projeto

Pré-requisitos:
- Docker e Docker Compose instalados

### 👉 Subir tudo:
```bash
docker compose up --build

A aplicação ficará disponível em:

API → http://localhost:3000

Swagger → http://localhost:3000/docs

Durante a subida serão executados:

Migrations
Seeds (permissões + root user)

🔑 Credenciais Iniciais


Criadas automaticamente:

Tipo	Email	Senha
Admin (root)	root@example.com	123456

Permissões criadas:
- admin
- editor
- reader

📚 Documentação da API (Swagger)

Acesse: http://localhost:3000/docs


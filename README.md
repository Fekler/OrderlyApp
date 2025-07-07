# 🛍️ Orderly - Frontend

Frontend da aplicação **Orderly**, desenvolvido em **Angular 19+** com **Angular Material**. Este projeto oferece uma interface moderna, segura e responsiva para clientes, vendedores e administradores gerenciarem pedidos e produtos de forma eficiente.

Link da aplicação:

**🔗 https://orderly.fekler.tec.br/** 

---

## 🚀 Funcionalidades Principais

✅ **Autenticação e Controle de Acesso**
- Login via JWT
- Perfis com permissões distintas: `Admin`, `Seller` e `Client`

✅ **Gestão de Pedidos**
- Criação e listagem de pedidos
- Aprovação, cancelamento e visualização por papel
- Visualização detalhada de itens e valores

✅ **Gestão de Produtos e Estoque**
- Cadastro e edição de produtos
- Visualização e ajuste de estoque

✅ **Gestão de Usuários**
- Cadastro, edição e listagem de usuários (Admin)
- Controle de status ativo/inativo

✅ **Dashboard e Relatórios**
- Visão gerencial com dados de vendas e clientes ativos (em progresso)

✅ **Angular Material**
- Utilização ampla de componentes: `mat-form-field`, `mat-select`, `mat-table`, `mat-toolbar`, `mat-snackbar`, entre outros

✅ **Estrutura Modular**
- Rotas organizadas por feature (`orders`, `products`, `users`, `admin`)
- Implementação de lazy-loading no módulo de administração

---

## 🧱 Tecnologias

- Angular 19+
- Angular Material
- TypeScript
- RxJS
- SCSS
- JWT
- HTTP Interceptor 
- Angular Router + Guards
- Reactive Forms
- GitHub Actions
- GitHubContainerRegistry
- Docker
- Nginx
- Deploy via SSH

---

## 🌍 API Backend

A aplicação se comunica com a API hospedada em:

```
https://orderly-api.fekler.tec.br
```

Configurado via:

```ts
// src/environments/environment.ts
export const environment = {
  production: false,
  apiBaseUrl: 'https://sales-dev-api.fekler.tec.br'
};
```

---

## ⚙️ Como Rodar Localmente

```bash
# Clonar o repositório
Executar a aplicação

# Instalar dependências
npm install

# Rodar localmente
ng serve

# Acesse em:
http://localhost:64611
```

---

## 🔐 Estrutura de Rotas

```text
/login                         - Login do sistema
/dashboard                    - Painel geral
/products                     - Listagem de produtos
/products/create              - Cadastro de produto
/orders/create                - Criar novo pedido
/order-list                   - Visualização de pedidos
/users                        - Lista de usuários (Admin)
/users/create                 - Cadastro de usuário (Admin)
/reports                      - Visão gerencial
/admin/users                  - Módulo lazy-loaded para administração
```

---

## 📂 Estrutura do Projeto (resumida)

```
src/
├── app/
│   ├── login/
│   ├── dashboard/
│   ├── products/
│   ├── orders/
│   ├── stock/
│   ├── users/
│   ├── reports/
│   ├── admin/                  # Lazy-loaded module
│   ├── guards/                 # VendedorGuard, ClientGuard
│   ├── interceptors/           # AuthInterceptor
│   └── services/               # AuthService
├── assets/
└── environments/
```

---

## ⚠️ Observações


- A interface é responsiva e otimizada para desktop inicialmente.

---

## 📦 Build para Produção

```bash
ng build --configuration production
```

---

## 📈 Diferenciais Técnicos

- Estrutura modular, com separação clara por responsabilidades
- Utilização de Lazy Loading (`AdminModule`)
- Componentes reusáveis e estilizados com Angular Material
- Interface amigável e moderna com feedback visual via Snackbar

---

## BACKEND

Abaixo Segue o link do repositório e documentação do BackEnd(API) em .NET e C#


**🔗 [Link da API](https://github.com/Fekler/OrderlyAPI)** 

---

## 👤 Autor

Desenvolvido por [Fekler](https://github.com/fekler)

# 📅 Sistema de Agendamento de Sala de Reunião

Sistema web profissional de agendamento de sala de reunião com interface Kanban, painel de administração e modo painel TV.

## 🚀 Características

- **Interface Kanban moderna** com visualização por períodos (Manhã/Tarde)
- **Banco de dados persistente** com SQLite
- **Painel administrativo** com autenticação por email
- **Modo painel TV** para exibição em tempo real
- **Validações automáticas** de horários e conflitos
- **Atualização automática de status** (Agendada → Em andamento → Finalizada)
- **Exportação de dados** em CSV
- **Design responsivo** e moderno (azul e branco)

## 📋 Requisitos

- Node.js 14+
- NPM ou Yarn

## 🔧 Instalação

1. **Clone ou extraia o projeto**
```bash
cd sala-reuniao-agendamento
```

2. **Instale as dependências**
```bash
npm install
```

# 📅 Sistema de Agendamento de Sala de Reunião

Sistema web profissional de agendamento de sala de reunião com interface Kanban, painel de administração e modo painel TV.

## 🚀 Visão Geral da Migração

Este repositório foi migrado do SQLite para MongoDB e o backend foi isolado em uma pasta `backend/`.

- Backend principal: `backend/server.js` (usa MongoDB)
- Frontend estático: `public/` (permanece igual)

## 📋 Requisitos

- Node.js 16+ recomendado
- NPM
- MongoDB local ou remoto

## 🔧 Instalação e execução

1. Instale dependências:

```bash
npm install
```

2. (Opcional) Crie um arquivo `.env` na raiz do projeto com as configurações do MongoDB:

```
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DBNAME=sala_reuniao
PORT=3000
```

3. Inicialize o banco (cria índices e admin de exemplo):

```bash
npm run init-db
```

4. Inicie o servidor:

```bash
npm start
# ou para desenvolvimento com reload
npm run dev
```

O servidor ficará disponível em `http://localhost:3000` por padrão.

## 📊 Banco de Dados (MongoDB)

Coleções principais:

- `reservas` — documentos com campos: `nome, setor, data, hora_inicio, hora_fim, descricao, qtd_pessoas, status, criado_em, atualizado_em`.
- `administradores` — documentos com campos: `nome, email, criado_em`.

O script `npm run init-db` cria índices importantes (`administradores.email` único e índice em `reservas.data, hora_inicio`).

## 🗂 Estrutura do Projeto Atualizada

```
sala-reuniao-agendamento/
├── backend/
│   ├── server.js            # Servidor Express (usa MongoDB)
│   ├── src/
│   │   ├── db.js            # Conexão MongoDB
│   │   ├── services/        # Lógica de negócio (reservas, admin)
│   │   └── routes/          # Rotas da API
│   └── scripts/
│       └── init-db.js       # Inicializa índices e admin de exemplo
├── public/                  # Frontend estático (HTML/CSS/JS)
├── package.json             # Dependências e scripts
└── README.md
```

## 📡 Endpoints da API (mesma semântica)

- `GET /api/reservas` — listar reservas (com filtros `data`, `setor`, `nome`)
- `GET /api/reservas/:id` — obter reserva
- `POST /api/reservas` — criar reserva
- `PUT /api/reservas/:id` — atualizar reserva
- `DELETE /api/reservas/:id` — deletar reserva

- `GET /api/admin` — listar administradores
- `POST /api/admin` — criar administrador
- `DELETE /api/admin/:id` — deletar administrador
- `POST /api/admin/validar` — validar administrador por email

- `GET /api/painel-tv/info` — dados para o painel TV

## ✅ Observações importantes

- O frontend permanece servindo os mesmos endpoints; o backend novo atende `/api/*` a partir de `backend/server.js`.
- Se você tiver um MongoDB remoto, atualize `MONGODB_URI` em `.env` antes de rodar `npm run init-db`.
- Os arquivos e scripts legados do SQLite foram removidos deste diretório e substituídos pela implementação MongoDB em `backend/`.

## 🛠️ Troubleshooting rápido

- Se `npm start` falhar por falta de conexão com o MongoDB, verifique a variável `MONGODB_URI` e se o servidor Mongo está acessível.
- Para mudar a porta antes de executar:

```bash
PORT=3001 npm start
```

## Próximos passos que eu já executei aqui

- Migrei serviços e rotas para MongoDB em `backend/src/`.
- Atualizei `package.json` para apontar `start`, `dev` e `init-db` para o `backend/`.

Se quiser, posso:

1. Remover arquivos legados permanentemente (já removidos nesta atualização).
2. Atualizar o conteúdo do `public/` para apontar IDs de reserva como `_id` (se necessário).
3. Adicionar testes automatizados básicos

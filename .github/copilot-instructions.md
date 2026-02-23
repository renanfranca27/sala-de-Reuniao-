# Instruções do Projeto - Sistema de Agendamento de Sala

## Status Atual

Sistema web profissional de agendamento de sala de reunião completamente criado e pronto para uso.

## ✅ O que foi implementado

### Backend
- ✅ Servidor Express.js configurado
- ✅ Banco de dados SQLite com tabelas `reservas` e `administradores`
- ✅ API REST completa para gerenciamento de reservas
- ✅ API de autenticação de administradores
- ✅ API do painel TV com informações em tempo real
- ✅ Validações de horário (07:00-18:00, intervalos de 30min)
- ✅ Detecção automática de conflitos de horário
- ✅ Atualização automática de status das reservas

### Frontend Principal
- ✅ Interface Kanban com colunas (Manhã/Tarde)
- ✅ Filtros por data e busca
- ✅ Modal para criar novas reservas
- ✅ Cards com informações visuais
- ✅ Status visual das reservas (cores diferenciadas)
- ✅ Detalhes da reserva ao clicar no card
- ✅ Notificações de sucesso/erro

### Painel Administrativo
- ✅ Tela de login com email
- ✅ Validação de acesso por email cadastrado
- ✅ Tabela com todas as reservas
- ✅ Filtros por data e setor
- ✅ Edição de reservas (modal)
- ✅ Exclusão de reservas (com confirmação)
- ✅ Exportação em CSV
- ✅ Sessão persistente via localStorage

### Painel TV
- ✅ Status da sala (Livre/Ocupada)
- ✅ Reunião em andamento com detalhes
- ✅ Próxima reunião programada
- ✅ Relógio grande em tempo real
- ✅ Atualização automática a cada 30 segundos
- ✅ Design responsivo para telas grande

### Design
- ✅ Tema azul e branco profissional
- ✅ Interface minimalista
- ✅ Totalmente responsivo
- ✅ Animações suaves
- ✅ Acessibilidade

## 🚀 Como usar

### 1. Instalar dependências
```bash
npm install
```

### 2. Inicializar banco de dados
```bash
npm run init-db
```

### 3. Iniciar servidor
```bash
npm start
```

Ou com auto-reload durante desenvolvimento:
```bash
npm run dev
```

### 4. Acessar a aplicação

- **Principal**: http://localhost:3000
- **Admin**: http://localhost:3000/admin-reserva-sala
- **TV**: http://localhost:3000/painel-tv

## 🔐 Credenciais de Admin

- Email: `admin@example.com`
- Email: `gerente@example.com`

## 📝 Funcionalidades Principais

### Página Principal
- Visualização Kanban automática
- Criar nova reserva facilmente
- Filtrar por data e buscar por nome/setor
- Ver detalhes da reserva ao clicar

### Painel Admin
- Login seguro por email
- Editar qualquer reserva
- Deletar reservas
- Filtrar por data e setor
- Exportar dados em CSV
- Visualização em tabela clara

### Painel TV
- Mostra se sala está livre ou ocupada
- Exibe reunião em andamento
- Mostra próxima reunião
- Relógio grande e legível
- Atualiza em tempo real

## 🔄 Ciclo de Vida das Reservas

1. **Agendada** (Azul) - Quando criada
2. **Começando em breve** (Vermelho) - 30 min antes
3. **Em andamento** (Verde) - Durante a reunião
4. **Finalizada** (Cinza) - Após término

## 📊 Dados Persistentes

Todos os dados são armazenados em `database.db` (SQLite):
- Reservas com todas as informações
- Histórico de criação/atualização
- Lista de administradores

## 🎯 Próximos Passos Opcionais

Se desejar expandir:
- Adicionar autenticação mais robusta
- Integrar com calendário Google/Outlook
- Notificações por email
- Sistema de permissões granulares
- Histórico de alterações
- Backup automático do banco

## 📞 Suporte

Todos os arquivos estão bem documentados com comentários. Revise:
- `src/services/reservaService.js` - Lógica de negócio
- `src/routes/` - Endpoints da API
- `public/` - Interfaces do usuário

---

Sistema pronto para produção! 🎉

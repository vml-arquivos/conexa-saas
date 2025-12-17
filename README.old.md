# CONEXA - Sistema de Gestão Escolar Inteligente

**Sua Conexão Pedagógica Inteligente**

CONEXA é um SaaS de Gestão Escolar "All-in-One" que atende desde o Berçário até o Ensino Superior, com suporte a dados flexíveis de saúde (bebês) e dados acadêmicos (adultos).

## 🎯 Características

- **Gestão de Alunos**: Suporte para berçário até ensino superior
- **Dados Flexíveis**: Campos JSON para dados de saúde e acadêmicos
- **Controle de Estoque**: Gerenciamento de inventário por categoria
- **Alertas Inteligentes**: Risco de evasão, itens críticos de estoque
- **Interface Responsiva**: Desenvolvida com React, TypeScript e TailwindCSS

## 🏗️ Arquitetura

- **Frontend**: Vite + React 19 + TypeScript + TailwindCSS
- **Backend**: Express + TypeScript + Prisma ORM
- **Database**: PostgreSQL 15
- **Deployment**: Docker + Docker Compose

## 📋 Pré-requisitos

- Node.js 18+
- pnpm 10+
- Docker & Docker Compose (para produção)
- PostgreSQL 15 (para desenvolvimento local)

## 🚀 Início Rápido

### Desenvolvimento Local

1. **Instalar dependências**
   ```bash
   pnpm install
   ```

2. **Configurar banco de dados**
   ```bash
   # Criar arquivo .env com DATABASE_URL
   cp .env.example .env
   
   # Gerar Prisma Client
   pnpm exec prisma generate
   
   # Executar migrations (quando disponível)
   pnpm exec prisma migrate dev
   ```

3. **Iniciar servidor de desenvolvimento**
   ```bash
   pnpm dev
   ```

   O sistema estará disponível em:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/api

### Produção com Docker

1. **Build e iniciar containers**
   ```bash
   docker-compose up -d
   ```

2. **Verificar status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

3. **Acessar aplicação**
   - Frontend: http://localhost
   - Backend API: http://localhost/api
   - Health Check: http://localhost/api/health

## 📚 API Endpoints

### Schools
- `GET /api/schools` - Listar todas as escolas
- `GET /api/schools/:id` - Obter escola por ID
- `POST /api/schools` - Criar nova escola
- `PUT /api/schools/:id` - Atualizar escola
- `DELETE /api/schools/:id` - Deletar escola

### Students
- `GET /api/students` - Listar todos os alunos
- `GET /api/students/school/:schoolId` - Listar alunos por escola
- `GET /api/students/:id` - Obter aluno por ID
- `POST /api/students` - Criar novo aluno
- `PUT /api/students/:id` - Atualizar aluno
- `DELETE /api/students/:id` - Deletar aluno

### Inventory
- `GET /api/inventory` - Listar todo o estoque
- `GET /api/inventory/school/:schoolId` - Listar estoque por escola
- `GET /api/inventory/school/:schoolId/category/:category` - Listar por categoria
- `GET /api/inventory/:id` - Obter item por ID
- `POST /api/inventory` - Criar novo item
- `PUT /api/inventory/:id` - Atualizar item
- `DELETE /api/inventory/:id` - Deletar item

## 🔐 Credenciais de Teste

- **Email**: demo@auraclass.com
- **Senha**: password

## 📁 Estrutura do Projeto

```
conexa-project/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas da aplicação
│   │   ├── layouts/       # Layouts
│   │   ├── data/          # Mock data
│   │   └── App.tsx        # Router principal
│   └── index.html
├── server/                 # Backend Express
│   ├── routes/            # Rotas da API
│   └── index.ts           # Servidor principal
├── prisma/                 # Configuração do Prisma
│   └── schema.prisma      # Schema do banco de dados
├── docker-compose.yml      # Orquestração de containers
├── Dockerfile.backend      # Build do backend
├── Dockerfile.frontend     # Build do frontend
└── nginx.conf             # Configuração do Nginx
```

## 🔧 Variáveis de Ambiente

### Backend
- `DATABASE_URL` - URL de conexão PostgreSQL
- `NODE_ENV` - Ambiente (development/production)
- `PORT` - Porta do servidor (padrão: 3000)

### Frontend
- `VITE_API_URL` - URL da API (padrão: http://localhost:3000)

## 🐛 Troubleshooting

### Erro de conexão com banco de dados
```bash
# Verificar se PostgreSQL está rodando
docker-compose logs db

# Resetar banco de dados
docker-compose down -v
docker-compose up -d
```

### Porta já em uso
```bash
# Mudar porta no docker-compose.yml ou .env
# Ou liberar porta:
lsof -i :3000
kill -9 <PID>
```

## 📝 Scripts Disponíveis

- `pnpm dev` - Iniciar desenvolvimento
- `pnpm build` - Build para produção
- `pnpm start` - Iniciar servidor de produção
- `pnpm check` - Verificar tipos TypeScript
- `pnpm format` - Formatar código com Prettier

## 🤝 Contribuindo

1. Criar branch para feature (`git checkout -b feature/AmazingFeature`)
2. Commit mudanças (`git commit -m 'Add some AmazingFeature'`)
3. Push para branch (`git push origin feature/AmazingFeature`)
4. Abrir Pull Request

## 📄 Licença

MIT

## 👥 Suporte

Para suporte, abra uma issue no repositório ou entre em contato através do email de suporte.

---

**Desenvolvido com ❤️ para transformar a educação**

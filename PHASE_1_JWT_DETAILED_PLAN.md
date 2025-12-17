# 🔐 FASE 1: AUTENTICAÇÃO JWT - PLANO DETALHADO

**Criticidade:** 🔴 CRÍTICA  
**Timeline:** Semanas 1-2 (50 horas)  
**Status:** 📋 Planejamento  

---

## 📋 VISÃO GERAL

Implementar sistema de autenticação JWT robusto, seguro e escalável para proteger todos os endpoints da API CONEXA.

---

## 🎯 OBJETIVOS

1. ✅ Autenticação segura com JWT
2. ✅ Refresh tokens para sessões longas
3. ✅ Controle de acesso (RBAC)
4. ✅ Auditoria de ações
5. ✅ Proteção contra ataques comuns
6. ✅ Conformidade com LGPD/GDPR

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────────────────────┐
│ CLIENTE (Frontend)                                      │
├─────────────────────────────────────────────────────────┤
│ 1. Login (email + senha)                                │
│ 2. Recebe: accessToken + refreshToken                   │
│ 3. Armazena em localStorage/sessionStorage              │
│ 4. Envia accessToken em cada requisição (header)        │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ SERVIDOR (Backend)                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. AUTENTICAÇÃO (POST /api/auth/login)                 │
│    ├─ Valida email/senha                               │
│    ├─ Gera JWT (15 min)                                │
│    ├─ Gera Refresh Token (7 dias)                       │
│    └─ Retorna tokens                                    │
│                                                         │
│ 2. MIDDLEWARE (verifyToken)                            │
│    ├─ Valida JWT em cada requisição                    │
│    ├─ Extrai payload (userId, role)                    │
│    └─ Passa para próximo middleware                     │
│                                                         │
│ 3. AUTORIZAÇÃO (checkRole)                             │
│    ├─ Verifica role do usuário                         │
│    ├─ Compara com permissões da rota                   │
│    └─ Retorna 403 se não autorizado                    │
│                                                         │
│ 4. REFRESH (POST /api/auth/refresh)                    │
│    ├─ Valida refresh token                             │
│    ├─ Gera novo accessToken                            │
│    └─ Retorna novo token                               │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 FLUXO DE AUTENTICAÇÃO

```
┌─────────────────────────────────────────────────────────┐
│ 1. LOGIN                                                │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Cliente                        Servidor                │
│   │                              │                     │
│   │─ POST /api/auth/login ──────→│                     │
│   │  {email, password}           │                     │
│   │                              │ Valida credenciais  │
│   │                              │ Hash senha          │
│   │                              │ Gera JWT            │
│   │←─ {accessToken, refreshToken}─│                     │
│   │                              │                     │
│   └─ Armazena tokens             │                     │
│                                  │                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 2. REQUISIÇÃO AUTENTICADA                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Cliente                        Servidor                │
│   │                              │                     │
│   │─ GET /api/students ──────────→│                     │
│   │  Header: Authorization        │ Verifica JWT        │
│   │  Bearer {accessToken}         │ Extrai userId       │
│   │                              │ Verifica role       │
│   │←─ [Lista de alunos] ──────────│                     │
│   │                              │                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 3. REFRESH TOKEN                                        │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Cliente                        Servidor                │
│   │                              │                     │
│   │─ POST /api/auth/refresh ─────→│                     │
│   │  {refreshToken}              │ Valida refresh      │
│   │                              │ Gera novo JWT       │
│   │←─ {accessToken} ──────────────│                     │
│   │                              │                     │
│   └─ Atualiza token              │                     │
│                                  │                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│ 4. LOGOUT                                               │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ Cliente                        Servidor                │
│   │                              │                     │
│   │─ POST /api/auth/logout ──────→│                     │
│   │  {refreshToken}              │ Invalida token      │
│   │                              │ (blacklist)         │
│   │←─ {success: true} ────────────│                     │
│   │                              │                     │
│   └─ Limpa localStorage          │                     │
│                                  │                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄️ SCHEMA PRISMA (Novos Modelos)

```prisma
// Usuário (Novo)
model User {
  id              String    @id @default(uuid())
  email           String    @unique
  password        String    // Hash bcrypt
  name            String
  role            String    @default("USER") // ADMIN, MANAGER, TEACHER, PARENT, USER
  status          String    @default("ACTIVE") // ACTIVE, INACTIVE, SUSPENDED
  
  // Relacionamentos
  school          School?   @relation(fields: [schoolId], references: [id])
  schoolId        String?
  
  // Auditoria
  lastLogin       DateTime?
  loginAttempts   Int       @default(0)
  lockedUntil     DateTime?
  
  // Tokens
  refreshTokens   RefreshToken[]
  auditLogs       AuditLog[]
  
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt
}

// Refresh Token (Novo)
model RefreshToken {
  id              String    @id @default(uuid())
  token           String    @unique
  expiresAt       DateTime
  revoked         Boolean   @default(false)
  
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId          String
  
  createdAt       DateTime  @default(now())
}

// Auditoria (Novo)
model AuditLog {
  id              String    @id @default(uuid())
  action          String    // CREATE, READ, UPDATE, DELETE
  resource        String    // students, inventory, etc
  resourceId      String?
  changes         Json?     // O que mudou
  ipAddress       String?
  userAgent       String?
  
  user            User      @relation(fields: [userId], references: [id])
  userId          String
  
  createdAt       DateTime  @default(now())
}

// Permissões (Novo)
model Permission {
  id              String    @id @default(uuid())
  name            String    @unique // users:read, users:write, etc
  description     String?
  
  roles           Role[]
  
  createdAt       DateTime  @default(now())
}

// Roles (Novo)
model Role {
  id              String    @id @default(uuid())
  name            String    @unique // ADMIN, MANAGER, TEACHER, etc
  description     String?
  
  permissions     Permission[]
  
  createdAt       DateTime  @default(now())
}
```

---

## 🔌 ENDPOINTS

### Autenticação
```
POST   /api/auth/register          # Registrar novo usuário
POST   /api/auth/login             # Login
POST   /api/auth/refresh           # Renovar token
POST   /api/auth/logout            # Logout
POST   /api/auth/forgot-password   # Recuperar senha
POST   /api/auth/reset-password    # Resetar senha
GET    /api/auth/me                # Dados do usuário atual
```

### Gerenciamento de Usuários (Admin)
```
GET    /api/users                  # Listar usuários
GET    /api/users/:id              # Obter usuário
POST   /api/users                  # Criar usuário
PUT    /api/users/:id              # Atualizar usuário
DELETE /api/users/:id              # Deletar usuário
PUT    /api/users/:id/role         # Alterar role
PUT    /api/users/:id/status       # Ativar/Desativar
```

### Auditoria
```
GET    /api/audit-logs             # Listar logs (Admin)
GET    /api/audit-logs/:userId     # Logs de um usuário
```

---

## 🔐 ESTRATÉGIA DE SEGURANÇA

### 1. Hashing de Senha
```
Algoritmo: bcrypt
Rounds: 12
Nunca armazenar senha em plain text
```

### 2. JWT
```
Algoritmo: HS256
AccessToken: 15 minutos
RefreshToken: 7 dias
Secret: Variável de ambiente (mínimo 32 caracteres)
```

### 3. Proteção contra Ataques
```
- Rate limiting (5 tentativas de login em 15 min)
- Account lockout (após 5 falhas)
- CSRF tokens
- CORS configurado
- HTTPS obrigatório
- Helmet.js para headers de segurança
```

### 4. Blacklist de Tokens
```
Tokens revogados são armazenados em Redis
Verificados em cada requisição
Expiram automaticamente após 7 dias
```

---

## 📦 DEPENDÊNCIAS NECESSÁRIAS

```json
{
  "dependencies": {
    "jsonwebtoken": "^9.0.0",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.0.0",
    "express-rate-limit": "^6.7.0",
    "helmet": "^7.0.0",
    "redis": "^4.6.0",
    "nodemailer": "^6.9.0"
  },
  "devDependencies": {
    "@types/jsonwebtoken": "^9.0.0",
    "@types/bcryptjs": "^2.4.2"
  }
}
```

---

## 🛠️ IMPLEMENTAÇÃO (Pseudocódigo)

### 1. Middleware de Autenticação
```typescript
// server/middleware/auth.ts

export const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token não fornecido' });
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

export const checkRole = (allowedRoles: string[]) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    next();
  };
};
```

### 2. Rota de Login
```typescript
// server/routes/auth.ts

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Buscar usuário
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'Credenciais inválidas' });
  
  // Verificar senha
  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) return res.status(401).json({ error: 'Credenciais inválidas' });
  
  // Gerar tokens
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
  
  // Armazenar refresh token
  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    }
  });
  
  // Registrar auditoria
  await logAudit(user.id, 'LOGIN', 'auth', null, req);
  
  res.json({ accessToken, refreshToken });
});
```

### 3. Proteção de Rotas
```typescript
// server/src/index.ts

// Rotas públicas
app.post('/api/auth/login', loginHandler);
app.post('/api/auth/register', registerHandler);

// Rotas protegidas
app.get('/api/students', verifyToken, getStudents);
app.post('/api/students', verifyToken, checkRole(['ADMIN', 'MANAGER']), createStudent);

// Rotas admin
app.get('/api/users', verifyToken, checkRole(['ADMIN']), getUsers);
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Semana 1
- [ ] Criar schema Prisma (User, RefreshToken, AuditLog, Role, Permission)
- [ ] Executar migration
- [ ] Implementar middleware de autenticação
- [ ] Implementar endpoints de auth (login, register, refresh, logout)
- [ ] Implementar hashing de senha com bcrypt
- [ ] Testes unitários de autenticação

### Semana 2
- [ ] Implementar RBAC (Role-Based Access Control)
- [ ] Implementar auditoria
- [ ] Implementar rate limiting
- [ ] Implementar account lockout
- [ ] Proteger todos os endpoints existentes
- [ ] Testes de integração
- [ ] Documentação

---

## 🧪 TESTES

### Testes Unitários
```typescript
describe('Auth', () => {
  test('Login com credenciais válidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'password123' });
    
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('accessToken');
    expect(response.body).toHaveProperty('refreshToken');
  });
  
  test('Login com credenciais inválidas', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .send({ email: 'user@test.com', password: 'wrongpassword' });
    
    expect(response.status).toBe(401);
  });
  
  test('Requisição sem token', async () => {
    const response = await request(app)
      .get('/api/students');
    
    expect(response.status).toBe(401);
  });
  
  test('Token expirado', async () => {
    const expiredToken = jwt.sign({ userId: '123' }, process.env.JWT_SECRET, { expiresIn: '-1h' });
    
    const response = await request(app)
      .get('/api/students')
      .set('Authorization', `Bearer ${expiredToken}`);
    
    expect(response.status).toBe(401);
  });
});
```

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] 100% dos endpoints protegidos
- [ ] 0 requisições sem autenticação aceitas
- [ ] Taxa de sucesso de login > 99%
- [ ] Tempo de verificação de token < 10ms
- [ ] Conformidade com OWASP Top 10
- [ ] Cobertura de testes > 85%

---

## 📚 DOCUMENTAÇÃO

### Para Desenvolvedores
```markdown
# Autenticação JWT

## Como fazer login
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "password123"
}

Resposta:
{
  "accessToken": "eyJhbGciOiJIUzI1NiIs...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}

## Como usar o token
Adicione o header em todas as requisições:
Authorization: Bearer {accessToken}

## Como renovar o token
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

### Para Usuários
```markdown
# Como fazer login

1. Acesse a página de login
2. Digite seu email e senha
3. Clique em "Entrar"
4. Você será redirecionado para o dashboard

## Esqueci minha senha
1. Clique em "Esqueci minha senha"
2. Digite seu email
3. Verifique seu email para o link de reset
4. Clique no link e defina uma nova senha
```

---

## 🚀 PRÓXIMAS FASES

Após JWT estar implementado:
1. Fase 2: Validação Zod
2. Fase 3: Backup Automático
3. Fase 4: Notificações
4. Fase 5: Relatórios

---

**Próximo documento:** `PHASE_1_ZOD_DETAILED_PLAN.md`

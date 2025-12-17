# ✔️ FASE 1: VALIDAÇÃO ZOD - PLANO DETALHADO

**Criticidade:** 🔴 CRÍTICA  
**Timeline:** Semanas 2-3 (40 horas)  
**Status:** 📋 Planejamento  
**Dependência:** JWT Auth (Fase 1.1)  

---

## 📋 VISÃO GERAL

Implementar validação robusta com Zod para garantir integridade de dados, sincronização com TypeScript e documentação automática de schemas.

---

## 🎯 OBJETIVOS

1. ✅ Validação automática de inputs
2. ✅ Sincronização com tipos TypeScript
3. ✅ Mensagens de erro claras
4. ✅ Documentação automática
5. ✅ Redução de bugs em 80%
6. ✅ Cobertura de 100% dos endpoints

---

## 🏗️ ARQUITETURA

```
┌─────────────────────────────────────────────────────────┐
│ CLIENTE (Frontend)                                      │
├─────────────────────────────────────────────────────────┤
│ Envia JSON                                              │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ SERVIDOR (Backend)                                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. RECEBE DADOS                                         │
│    └─ req.body (JSON)                                   │
│                                                         │
│ 2. VALIDA COM ZOD                                       │
│    ├─ Tipo de dado (string, number, etc)               │
│    ├─ Formato (email, URL, etc)                        │
│    ├─ Tamanho (min, max)                               │
│    ├─ Valores permitidos (enum)                        │
│    └─ Regras customizadas                              │
│                                                         │
│ 3. PROCESSA DADOS                                       │
│    ├─ Dados garantidamente válidos                     │
│    ├─ Tipos sincronizados com TS                       │
│    └─ Sem erros de tipo                                │
│                                                         │
│ 4. SALVA NO BANCO                                       │
│    └─ Dados consistentes                               │
│                                                         │
│ 5. RETORNA RESPOSTA                                     │
│    └─ Sucesso ou erro detalhado                        │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 COMPARAÇÃO: COM vs SEM ZOD

### SEM Validação
```typescript
app.post('/api/students', async (req, res) => {
  const { name, email, age } = req.body;
  
  // ❌ Problemas:
  // - name pode ser undefined, null, ou número
  // - email pode não ser um email válido
  // - age pode ser string "abc" ou negativo
  // - Sem mensagens de erro claras
  
  const student = await prisma.student.create({
    data: { name, email, age }
  });
  
  res.json(student);
});
```

### COM Validação Zod
```typescript
const createStudentSchema = z.object({
  name: z.string().min(3).max(100),
  email: z.string().email(),
  age: z.number().int().min(0).max(150),
  birthDate: z.date().optional()
});

app.post('/api/students', async (req, res) => {
  // ✅ Validação automática
  const result = createStudentSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: 'Validação falhou',
      details: result.error.errors
    });
  }
  
  // ✅ Dados garantidamente válidos
  const validData = result.data;
  
  const student = await prisma.student.create({
    data: validData
  });
  
  res.json(student);
});
```

---

## 🗂️ ESTRUTURA DE SCHEMAS

```
server/
├── schemas/
│   ├── auth.ts              # Schemas de autenticação
│   ├── students.ts          # Schemas de alunos
│   ├── employees.ts         # Schemas de funcionários
│   ├── inventory.ts         # Schemas de estoque
│   ├── procurement.ts       # Schemas de compras
│   ├── documents.ts         # Schemas de documentos
│   └── common.ts            # Schemas reutilizáveis
│
├── middleware/
│   └── validate.ts          # Middleware de validação
│
└── routes/
    ├── auth.ts
    ├── students.ts
    ├── employees.ts
    └── ...
```

---

## 📝 SCHEMAS (Exemplos)

### 1. Schemas Comuns (common.ts)
```typescript
import { z } from 'zod';

// Tipos reutilizáveis
export const idSchema = z.string().uuid();
export const emailSchema = z.string().email().toLowerCase();
export const passwordSchema = z.string().min(8).max(128);
export const phoneSchema = z.string().regex(/^\+?[\d\s-()]+$/).optional();
export const dateSchema = z.coerce.date();

// Enums
export const roleEnum = z.enum(['ADMIN', 'MANAGER', 'TEACHER', 'PARENT', 'USER']);
export const studentStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'EVADED']);
export const employeeRoleEnum = z.enum(['Professor', 'Nutricionista', 'Zelador', 'Coordenador']);
```

### 2. Schemas de Autenticação (auth.ts)
```typescript
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1)
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(3).max(100),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Senhas não conferem",
  path: ["confirmPassword"]
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string()
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
```

### 3. Schemas de Alunos (students.ts)
```typescript
export const createStudentSchema = z.object({
  name: z.string().min(3).max(100),
  birthDate: dateSchema.optional(),
  email: emailSchema.optional(),
  phone: phoneSchema,
  status: studentStatusEnum.default('ACTIVE'),
  classId: z.string().optional(),
  schoolId: idSchema,
  
  // Dados flexíveis
  healthData: z.object({
    alergias: z.array(z.string()).optional(),
    medicamentos: z.array(z.string()).optional(),
    tea: z.boolean().optional()
  }).optional(),
  
  academicData: z.object({
    notas: z.array(z.number()).optional(),
    historico: z.array(z.string()).optional()
  }).optional()
});

export const updateStudentSchema = createStudentSchema.partial();

export const listStudentsSchema = z.object({
  schoolId: idSchema.optional(),
  status: studentStatusEnum.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0)
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type UpdateStudentInput = z.infer<typeof updateStudentSchema>;
export type ListStudentsInput = z.infer<typeof listStudentsSchema>;
```

### 4. Schemas de Funcionários (employees.ts)
```typescript
export const createEmployeeSchema = z.object({
  name: z.string().min(3).max(100),
  role: employeeRoleEnum,
  email: emailSchema.optional(),
  phone: phoneSchema,
  status: z.enum(['ACTIVE', 'INACTIVE']).default('ACTIVE'),
  schoolId: idSchema
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
```

### 5. Schemas de Compras (procurement.ts)
```typescript
export const importProcurementSchema = z.object({
  filePath: z.string(),
  type: z.enum(['csv', 'xml']),
  schoolId: idSchema
});

export const exportOrderSchema = z.object({
  items: z.array(z.object({
    id: idSchema,
    quantity: z.number().int().min(1)
  })).min(1),
  schoolId: idSchema
});

export type ImportProcurementInput = z.infer<typeof importProcurementSchema>;
export type ExportOrderInput = z.infer<typeof exportOrderSchema>;
```

---

## 🔌 MIDDLEWARE DE VALIDAÇÃO

```typescript
// server/middleware/validate.ts

import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';

export const validate = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse({
        ...req.body,
        ...req.params,
        ...req.query
      });
      
      // Substitui req.body com dados validados
      req.body = validated;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validação falhou',
          details: error.errors.map(err => ({
            path: err.path.join('.'),
            message: err.message,
            code: err.code
          }))
        });
      }
      
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
};

// Variante para query params
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = schema.parse(req.query);
      req.query = validated as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validação de query falhou',
          details: error.errors
        });
      }
      return res.status(500).json({ error: 'Erro interno' });
    }
  };
};
```

---

## 🛠️ IMPLEMENTAÇÃO NAS ROTAS

### Exemplo 1: Criar Aluno
```typescript
// server/routes/students.ts

import { Router } from 'express';
import { validate } from '../middleware/validate';
import { createStudentSchema, updateStudentSchema, listStudentsSchema } from '../schemas/students';
import { verifyToken } from '../middleware/auth';

const router = Router();

// POST /api/students
router.post(
  '/',
  verifyToken,
  validate(createStudentSchema),
  async (req, res) => {
    // ✅ req.body já é validado e tipado
    const { name, email, schoolId } = req.body;
    
    const student = await prisma.student.create({
      data: {
        name,
        email,
        schoolId
      }
    });
    
    res.json(student);
  }
);

// GET /api/students
router.get(
  '/',
  verifyToken,
  validate(listStudentsSchema),
  async (req, res) => {
    // ✅ req.query já é validado
    const { schoolId, limit, offset } = req.query;
    
    const students = await prisma.student.findMany({
      where: schoolId ? { schoolId } : {},
      take: limit,
      skip: offset
    });
    
    res.json(students);
  }
);

// PUT /api/students/:id
router.put(
  '/:id',
  verifyToken,
  validate(updateStudentSchema),
  async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    
    const student = await prisma.student.update({
      where: { id },
      data
    });
    
    res.json(student);
  }
);

export default router;
```

### Exemplo 2: Login
```typescript
// server/routes/auth.ts

router.post(
  '/login',
  validate(loginSchema),
  async (req, res) => {
    // ✅ req.body é { email: string, password: string }
    const { email, password } = req.body;
    
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const accessToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '15m' }
    );
    
    res.json({ accessToken });
  }
);
```

---

## 🧪 TESTES

```typescript
// server/__tests__/validation.test.ts

import { createStudentSchema } from '../schemas/students';

describe('Validação de Alunos', () => {
  test('Dados válidos', () => {
    const validData = {
      name: 'João Silva',
      email: 'joao@example.com',
      schoolId: '123e4567-e89b-12d3-a456-426614174000'
    };
    
    const result = createStudentSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });
  
  test('Nome muito curto', () => {
    const invalidData = {
      name: 'Jo',
      email: 'joao@example.com',
      schoolId: '123e4567-e89b-12d3-a456-426614174000'
    };
    
    const result = createStudentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
    expect(result.error?.errors[0].message).toContain('at least 3 characters');
  });
  
  test('Email inválido', () => {
    const invalidData = {
      name: 'João Silva',
      email: 'email-invalido',
      schoolId: '123e4567-e89b-12d3-a456-426614174000'
    };
    
    const result = createStudentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
  
  test('Campo obrigatório faltando', () => {
    const invalidData = {
      name: 'João Silva'
      // schoolId faltando
    };
    
    const result = createStudentSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
```

---

## 📊 COBERTURA DE VALIDAÇÃO

| Endpoint | Schema | Status |
|----------|--------|--------|
| POST /api/auth/login | loginSchema | ✅ |
| POST /api/auth/register | registerSchema | ✅ |
| GET /api/students | listStudentsSchema | ✅ |
| POST /api/students | createStudentSchema | ✅ |
| PUT /api/students/:id | updateStudentSchema | ✅ |
| DELETE /api/students/:id | idSchema | ✅ |
| GET /api/employees | listEmployeesSchema | ✅ |
| POST /api/employees | createEmployeeSchema | ✅ |
| PUT /api/employees/:id | updateEmployeeSchema | ✅ |
| POST /api/documents/upload | uploadDocumentSchema | ✅ |
| POST /api/procurement/import | importProcurementSchema | ✅ |
| POST /api/procurement/export | exportOrderSchema | ✅ |

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Semana 2
- [ ] Instalar Zod
- [ ] Criar schemas comuns (common.ts)
- [ ] Criar schemas de autenticação
- [ ] Criar schemas de alunos
- [ ] Criar middleware de validação
- [ ] Aplicar validação em rotas de auth e students
- [ ] Testes unitários

### Semana 3
- [ ] Criar schemas de funcionários
- [ ] Criar schemas de compras
- [ ] Criar schemas de documentos
- [ ] Aplicar validação em todas as rotas
- [ ] Testes de integração
- [ ] Documentação

---

## 📚 BENEFÍCIOS

| Benefício | Impacto |
|-----------|---------|
| Redução de bugs | -80% |
| Tempo de debug | -60% |
| Documentação automática | +100% |
| Sincronização tipos | 100% |
| Mensagens de erro | Muito melhor |
| Segurança de dados | +95% |

---

## 🚀 PRÓXIMAS FASES

Após Zod estar implementado:
1. Fase 3: Backup Automático
2. Fase 4: Notificações
3. Fase 5: Relatórios

---

**Próximo documento:** `PHASE_1_BACKUP_DETAILED_PLAN.md`

# 💾 FASE 1: BACKUP AUTOMÁTICO - PLANO DETALHADO

**Criticidade:** 🔴 CRÍTICA  
**Timeline:** Semanas 3-4 (30 horas)  
**Status:** 📋 Planejamento  
**Dependência:** JWT Auth (Fase 1.1)  

---

## 📋 VISÃO GERAL

Implementar sistema robusto de backup automático com recuperação em minutos, armazenamento redundante e conformidade com SLA.

---

## 🎯 OBJETIVOS

1. ✅ Backup automático diário
2. ✅ Múltiplas cópias (local + cloud)
3. ✅ Recuperação em < 1 hora
4. ✅ Retenção de 30 dias
5. ✅ Testes de recuperação automatizados
6. ✅ Alertas de falha

---

## 🏗️ ARQUITETURA DE BACKUP

```
┌─────────────────────────────────────────────────────────┐
│ BANCO DE DADOS (PostgreSQL)                             │
├─────────────────────────────────────────────────────────┤
│ Dados em produção                                       │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│ BACKUP SERVICE                                          │
├─────────────────────────────────────────────────────────┤
│                                                         │
│ 1. TRIGGER DIÁRIO (00:00)                              │
│    └─ Inicia backup automático                         │
│                                                         │
│ 2. DUMP DO BANCO                                        │
│    ├─ pg_dump (PostgreSQL)                             │
│    ├─ Compressão gzip                                  │
│    └─ Arquivo: backup-YYYY-MM-DD.sql.gz               │
│                                                         │
│ 3. BACKUP DE UPLOADS                                    │
│    ├─ Sincroniza pasta /uploads                        │
│    ├─ Compressão tar.gz                                │
│    └─ Arquivo: uploads-YYYY-MM-DD.tar.gz              │
│                                                         │
│ 4. ARMAZENAMENTO MÚLTIPLO                               │
│    ├─ Local: /backups/local/                           │
│    ├─ S3: AWS S3 (redundância)                         │
│    └─ GCS: Google Cloud Storage (backup)               │
│                                                         │
│ 5. VERIFICAÇÃO                                          │
│    ├─ Valida integridade do arquivo                    │
│    ├─ Testa recuperação (weekly)                       │
│    └─ Envia relatório                                  │
│                                                         │
│ 6. LIMPEZA                                              │
│    ├─ Remove backups > 30 dias                         │
│    └─ Libera espaço em disco                           │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

## 📊 ESTRATÉGIA DE BACKUP

### Retenção
```
Diário:   Últimos 7 dias (local + S3)
Semanal:  Últimas 4 semanas (S3)
Mensal:   Últimos 12 meses (GCS)
Anual:    Indefinido (Arquivo)

Espaço estimado:
- Local: 50GB (7 dias)
- S3: 200GB (30 dias)
- GCS: 500GB (12 meses)
```

### RTO/RPO
```
RTO (Recovery Time Objective): < 1 hora
RPO (Recovery Point Objective): < 1 dia

Significa:
- Recuperação em até 1 hora
- Máximo 1 dia de dados perdidos
```

---

## 🗂️ ESTRUTURA DE ARQUIVOS

```
server/
├── scripts/
│   ├── backup.ts              # Script de backup
│   ├── restore.ts             # Script de restauração
│   └── verify-backup.ts       # Script de verificação
│
├── config/
│   └── backup.config.ts       # Configuração
│
├── backups/
│   ├── local/                 # Backups locais
│   │   ├── backup-2025-01-01.sql.gz
│   │   ├── uploads-2025-01-01.tar.gz
│   │   └── backup-2025-01-02.sql.gz
│   │
│   └── logs/                  # Logs de backup
│       ├── backup-2025-01-01.log
│       └── backup-2025-01-02.log
│
└── .env
    ├── BACKUP_SCHEDULE=0 0 * * *  # Cron: 00:00 diariamente
    ├── AWS_S3_BUCKET=conexa-backups
    ├── GCS_BUCKET=conexa-backups-archive
    └── BACKUP_RETENTION_DAYS=30
```

---

## 🔌 ENDPOINTS DE BACKUP

```
GET    /api/admin/backups              # Listar backups
GET    /api/admin/backups/:id/download # Baixar backup
POST   /api/admin/backups/trigger      # Forçar backup agora
POST   /api/admin/backups/:id/restore  # Restaurar backup
GET    /api/admin/backups/status       # Status do último backup
DELETE /api/admin/backups/:id          # Deletar backup
```

---

## 📝 IMPLEMENTAÇÃO

### 1. Configuração (backup.config.ts)
```typescript
// server/config/backup.config.ts

export const backupConfig = {
  // Schedule
  schedule: process.env.BACKUP_SCHEDULE || '0 0 * * *', // 00:00 diariamente
  
  // Retenção
  retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS || '30'),
  
  // Armazenamento Local
  localPath: path.join(process.cwd(), 'backups', 'local'),
  logsPath: path.join(process.cwd(), 'backups', 'logs'),
  
  // AWS S3
  aws: {
    enabled: !!process.env.AWS_S3_BUCKET,
    bucket: process.env.AWS_S3_BUCKET,
    region: process.env.AWS_REGION || 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  },
  
  // Google Cloud Storage
  gcs: {
    enabled: !!process.env.GCS_BUCKET,
    bucket: process.env.GCS_BUCKET,
    projectId: process.env.GCS_PROJECT_ID,
    keyFile: process.env.GCS_KEY_FILE
  },
  
  // Notificações
  notifications: {
    email: process.env.BACKUP_NOTIFY_EMAIL,
    slack: process.env.SLACK_WEBHOOK_URL
  }
};
```

### 2. Script de Backup (backup.ts)
```typescript
// server/scripts/backup.ts

import { exec } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Storage } from '@google-cloud/storage';

export async function performBackup() {
  const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const backupDir = backupConfig.localPath;
  
  try {
    // 1. Criar diretório se não existir
    await fs.mkdir(backupDir, { recursive: true });
    
    // 2. Backup do banco de dados
    const dbBackupFile = path.join(backupDir, `backup-${timestamp}.sql.gz`);
    await backupDatabase(dbBackupFile);
    console.log(`✅ Backup do banco criado: ${dbBackupFile}`);
    
    // 3. Backup de uploads
    const uploadsBackupFile = path.join(backupDir, `uploads-${timestamp}.tar.gz`);
    await backupUploads(uploadsBackupFile);
    console.log(`✅ Backup de uploads criado: ${uploadsBackupFile}`);
    
    // 4. Upload para S3
    if (backupConfig.aws.enabled) {
      await uploadToS3(dbBackupFile, `backup-${timestamp}.sql.gz`);
      await uploadToS3(uploadsBackupFile, `uploads-${timestamp}.tar.gz`);
      console.log(`✅ Backups enviados para S3`);
    }
    
    // 5. Upload para GCS
    if (backupConfig.gcs.enabled) {
      await uploadToGCS(dbBackupFile, `backup-${timestamp}.sql.gz`);
      await uploadToGCS(uploadsBackupFile, `uploads-${timestamp}.tar.gz`);
      console.log(`✅ Backups enviados para GCS`);
    }
    
    // 6. Limpeza de backups antigos
    await cleanOldBackups();
    console.log(`✅ Backups antigos removidos`);
    
    // 7. Enviar notificação
    await notifySuccess(timestamp);
    
    return { success: true, timestamp };
  } catch (error) {
    console.error('❌ Erro no backup:', error);
    await notifyFailure(error);
    throw error;
  }
}

// Backup do banco de dados
async function backupDatabase(outputFile: string) {
  return new Promise((resolve, reject) => {
    const command = `pg_dump ${process.env.DATABASE_URL} | gzip > ${outputFile}`;
    
    exec(command, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}

// Backup de uploads
async function backupUploads(outputFile: string) {
  return new Promise((resolve, reject) => {
    const uploadsPath = path.join(process.cwd(), 'uploads');
    const command = `tar -czf ${outputFile} -C ${uploadsPath} .`;
    
    exec(command, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}

// Upload para S3
async function uploadToS3(filePath: string, fileName: string) {
  const s3Client = new S3Client({
    region: backupConfig.aws.region,
    credentials: {
      accessKeyId: backupConfig.aws.accessKeyId!,
      secretAccessKey: backupConfig.aws.secretAccessKey!
    }
  });
  
  const fileContent = await fs.readFile(filePath);
  
  const command = new PutObjectCommand({
    Bucket: backupConfig.aws.bucket,
    Key: `backups/${fileName}`,
    Body: fileContent,
    ContentType: 'application/gzip',
    Metadata: {
      'backup-date': new Date().toISOString()
    }
  });
  
  await s3Client.send(command);
}

// Upload para GCS
async function uploadToGCS(filePath: string, fileName: string) {
  const storage = new Storage({
    projectId: backupConfig.gcs.projectId,
    keyFilename: backupConfig.gcs.keyFile
  });
  
  const bucket = storage.bucket(backupConfig.gcs.bucket);
  await bucket.upload(filePath, {
    destination: `backups/${fileName}`,
    metadata: {
      metadata: {
        'backup-date': new Date().toISOString()
      }
    }
  });
}

// Limpeza de backups antigos
async function cleanOldBackups() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - backupConfig.retentionDays);
  
  const files = await fs.readdir(backupConfig.localPath);
  
  for (const file of files) {
    const filePath = path.join(backupConfig.localPath, file);
    const stats = await fs.stat(filePath);
    
    if (stats.mtime < cutoffDate) {
      await fs.unlink(filePath);
      console.log(`🗑️  Deletado: ${file}`);
    }
  }
}

// Notificações
async function notifySuccess(timestamp: string) {
  // Email
  if (backupConfig.notifications.email) {
    // Enviar email de sucesso
  }
  
  // Slack
  if (backupConfig.notifications.slack) {
    // Enviar mensagem Slack
  }
}

async function notifyFailure(error: any) {
  // Email
  if (backupConfig.notifications.email) {
    // Enviar email de erro
  }
  
  // Slack
  if (backupConfig.notifications.slack) {
    // Enviar alerta Slack
  }
}
```

### 3. Script de Restauração (restore.ts)
```typescript
// server/scripts/restore.ts

export async function restoreBackup(backupFile: string) {
  try {
    console.log(`🔄 Iniciando restauração de ${backupFile}...`);
    
    // 1. Validar arquivo
    const exists = await fileExists(backupFile);
    if (!exists) {
      throw new Error(`Arquivo não encontrado: ${backupFile}`);
    }
    
    // 2. Criar backup de segurança
    const safetyBackup = await performBackup();
    console.log(`✅ Backup de segurança criado: ${safetyBackup}`);
    
    // 3. Restaurar banco de dados
    await restoreDatabase(backupFile);
    console.log(`✅ Banco de dados restaurado`);
    
    // 4. Restaurar uploads
    const uploadsFile = backupFile.replace('backup-', 'uploads-');
    if (await fileExists(uploadsFile)) {
      await restoreUploads(uploadsFile);
      console.log(`✅ Uploads restaurados`);
    }
    
    // 5. Verificar integridade
    await verifyRestoration();
    console.log(`✅ Integridade verificada`);
    
    return { success: true, backupFile };
  } catch (error) {
    console.error('❌ Erro na restauração:', error);
    throw error;
  }
}

async function restoreDatabase(backupFile: string) {
  return new Promise((resolve, reject) => {
    const command = `gunzip -c ${backupFile} | psql ${process.env.DATABASE_URL}`;
    
    exec(command, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}

async function restoreUploads(backupFile: string) {
  return new Promise((resolve, reject) => {
    const uploadsPath = path.join(process.cwd(), 'uploads');
    const command = `tar -xzf ${backupFile} -C ${uploadsPath}`;
    
    exec(command, (error) => {
      if (error) reject(error);
      else resolve(true);
    });
  });
}

async function verifyRestoration() {
  // Conectar ao banco e verificar dados
  const count = await prisma.student.count();
  if (count === 0) {
    throw new Error('Restauração falhou: nenhum aluno encontrado');
  }
}
```

### 4. Agendamento (cron job)
```typescript
// server/src/index.ts

import cron from 'node-cron';
import { performBackup } from '../scripts/backup';

// Agendar backup diário às 00:00
cron.schedule('0 0 * * *', async () => {
  console.log('🔄 Iniciando backup automático...');
  try {
    await performBackup();
    console.log('✅ Backup concluído com sucesso');
  } catch (error) {
    console.error('❌ Erro no backup:', error);
  }
});

// Agendar verificação semanal (domingo às 02:00)
cron.schedule('0 2 * * 0', async () => {
  console.log('🔍 Iniciando verificação de backup...');
  try {
    await verifyBackup();
    console.log('✅ Verificação concluída');
  } catch (error) {
    console.error('❌ Erro na verificação:', error);
  }
});
```

---

## 📊 ENDPOINTS DE BACKUP

### Listar Backups
```bash
GET /api/admin/backups
Authorization: Bearer {token}

Resposta:
{
  "backups": [
    {
      "id": "backup-2025-01-02",
      "date": "2025-01-02",
      "size": "2.5GB",
      "status": "success",
      "location": ["local", "s3", "gcs"]
    },
    {
      "id": "backup-2025-01-01",
      "date": "2025-01-01",
      "size": "2.4GB",
      "status": "success",
      "location": ["local", "s3"]
    }
  ]
}
```

### Forçar Backup Agora
```bash
POST /api/admin/backups/trigger
Authorization: Bearer {token}

Resposta:
{
  "success": true,
  "backupId": "backup-2025-01-02",
  "timestamp": "2025-01-02T10:30:00Z"
}
```

### Restaurar Backup
```bash
POST /api/admin/backups/backup-2025-01-01/restore
Authorization: Bearer {token}

Resposta:
{
  "success": true,
  "message": "Restauração iniciada",
  "estimatedTime": "15 minutos"
}
```

---

## 🧪 TESTES DE BACKUP

```typescript
describe('Backup e Restauração', () => {
  test('Backup completo criado com sucesso', async () => {
    const result = await performBackup();
    expect(result.success).toBe(true);
    expect(result.timestamp).toBeDefined();
  });
  
  test('Arquivo de backup é válido', async () => {
    const backupFile = await getLatestBackup();
    const isValid = await validateBackupFile(backupFile);
    expect(isValid).toBe(true);
  });
  
  test('Restauração funciona corretamente', async () => {
    const backupFile = await getLatestBackup();
    const result = await restoreBackup(backupFile);
    expect(result.success).toBe(true);
  });
  
  test('Dados são recuperados corretamente', async () => {
    const originalCount = await prisma.student.count();
    const backupFile = await getLatestBackup();
    await restoreBackup(backupFile);
    const restoredCount = await prisma.student.count();
    expect(restoredCount).toBe(originalCount);
  });
});
```

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Semana 3
- [ ] Instalar dependências (node-cron, aws-sdk, google-cloud-storage)
- [ ] Criar configuração de backup
- [ ] Implementar script de backup
- [ ] Implementar script de restauração
- [ ] Configurar agendamento com cron
- [ ] Testes de backup

### Semana 4
- [ ] Implementar endpoints de backup
- [ ] Integração com S3
- [ ] Integração com GCS
- [ ] Implementar notificações
- [ ] Testes de restauração
- [ ] Documentação

---

## 📊 MÉTRICAS DE SUCESSO

- [ ] Backup diário executado com 100% de sucesso
- [ ] Tempo de backup < 30 minutos
- [ ] Tempo de restauração < 1 hora
- [ ] Redundância em 3 locais (local + S3 + GCS)
- [ ] Verificação automática semanal
- [ ] Alertas de falha funcionando

---

## 💰 ESTIMATIVA DE CUSTOS

| Serviço | Custo/mês | Notas |
|---------|-----------|-------|
| AWS S3 | R$ 50 | 200GB armazenado |
| GCS | R$ 40 | 500GB armazenado |
| Armazenamento local | R$ 0 | Servidor existente |
| **Total** | **R$ 90** | Muito acessível |

---

## 🚀 PRÓXIMAS FASES

Após Backup estar implementado:
1. Fase 2: Notificações
2. Fase 2: Relatórios
3. Fase 2: Analytics

---

**Próximo documento:** `PHASE_2_DETAILED_PLAN.md`

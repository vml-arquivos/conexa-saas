import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import agentRoutes from '../routes/agent.js';
import employeeRoutes from '../routes/employees.js';
import documentRoutes from '../routes/documents.js';
import procurementRoutes from '../routes/procurement.js';
import requisitionRoutes from '../routes/requisitions.js';

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Servir arquivos estáticos de uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Rota de Saude
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', system: 'CONEXA v1.0', timestamp: new Date() });
});

// Rotas do Agente de IA
app.use('/api/agent', agentRoutes);

// Rotas de Funcionários
app.use('/api/employees', employeeRoutes);

// Rotas de Documentos
app.use('/api/documents', documentRoutes);

// Rotas de Compras
app.use('/api/procurement', procurementRoutes);

// Rotas de Requisições
app.use('/api/requisitions', requisitionRoutes);

// Rota de Alunos
app.get('/api/students', async (req, res) => {
  try {
    const students = await prisma.student.findMany();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar alunos' });
  }
});

// Rota para atualizar aluno
app.put('/api/students/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.update({
      where: { id },
      data: req.body,
    });
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar aluno' });
  }
});

// Rota de Estoque
app.get('/api/inventory', async (req, res) => {
  try {
    const inventory = await prisma.inventoryItem.findMany();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar estoque' });
  }
});

// Rota para atualizar item de estoque
app.put('/api/inventory/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const item = await prisma.inventoryItem.update({
      where: { id },
      data: req.body,
    });
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar estoque' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 CONEXA Server rodando na porta ${PORT}`);
  console.log(`🤖 Agente de IA disponivel em /api/agent`);
  console.log(`📄 Documentos disponivel em /api/documents`);
  console.log(`👥 Funcionários disponivel em /api/employees`);
  console.log(`📦 Compras disponivel em /api/procurement`);
  console.log(`📝 Requisições disponivel em /api/requisitions`);
});

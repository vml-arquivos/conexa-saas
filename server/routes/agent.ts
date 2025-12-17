import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// Middleware para verificar X-AGENT-SECRET
const verifyAgentSecret = (req: Request, res: Response, next: Function) => {
  const secret = req.headers['x-agent-secret'];
  if (secret !== 'conexa_secret_key') {
    return res.status(401).json({ error: 'Unauthorized: Invalid agent secret' });
  }
  next();
};

router.use(verifyAgentSecret);

// POST /api/agent/command - Webhook para comandos da IA
router.post('/command', async (req: Request, res: Response) => {
  try {
    const { action, payload } = req.body;

    if (!action || !payload) {
      return res.status(400).json({ error: 'Missing action or payload' });
    }

    let result;

    switch (action) {
      case 'CREATE_STUDENT':
        result = await createStudent(payload);
        break;

      case 'ADD_INVENTORY':
        result = await addInventory(payload);
        break;

      case 'UPDATE_STUDENT_ATTENDANCE':
        result = await updateStudentAttendance(payload);
        break;

      case 'GET_SCHOOL_STATS':
        result = await getSchoolStats(payload);
        break;

      default:
        return res.status(400).json({ error: `Unknown action: ${action}` });
    }

    res.json({
      success: true,
      action,
      result,
      timestamp: new Date(),
    });
  } catch (error) {
    console.error('Agent command error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// Criar novo aluno
async function createStudent(payload: any) {
  const { name, classId, schoolId, healthData, academicData, attendance } = payload;

  if (!name || !schoolId) {
    throw new Error('Missing required fields: name, schoolId');
  }

  const student = await prisma.student.create({
    data: {
      name,
      classId: classId || null,
      schoolId,
      healthData: healthData || {},
      academicData: academicData || {},
      attendance: attendance || { faltasConsecutivas: 0, total: 0 },
    },
  });

  return student;
}

// Adicionar item ao estoque
async function addInventory(payload: any) {
  const { name, category, quantity, minThreshold, unit, schoolId } = payload;

  if (!name || !category || !schoolId) {
    throw new Error('Missing required fields: name, category, schoolId');
  }

  const item = await prisma.inventoryItem.create({
    data: {
      name,
      category,
      quantity: quantity || 0,
      minThreshold: minThreshold || 10,
      unit: unit || 'un',
      schoolId,
    },
  });

  return item;
}

// Atualizar presença do aluno
async function updateStudentAttendance(payload: any) {
  const { studentId, faltasConsecutivas, total } = payload;

  if (!studentId) {
    throw new Error('Missing required field: studentId');
  }

  const student = await prisma.student.findUnique({
    where: { id: studentId },
  });

  if (!student) {
    throw new Error('Student not found');
  }

  const updatedStudent = await prisma.student.update({
    where: { id: studentId },
    data: {
      attendance: {
        ...(student.attendance as any),
        faltasConsecutivas: faltasConsecutivas ?? (student.attendance as any)?.faltasConsecutivas ?? 0,
        total: total ?? (student.attendance as any)?.total ?? 0,
      },
    },
  });

  return updatedStudent;
}

// Obter estatísticas da escola
async function getSchoolStats(payload: any) {
  const { schoolId } = payload;

  if (!schoolId) {
    throw new Error('Missing required field: schoolId');
  }

  const school = await prisma.school.findUnique({
    where: { id: schoolId },
    include: {
      _count: {
        select: {
          students: true,
          inventory: true,
        },
      },
    },
  });

  if (!school) {
    throw new Error('School not found');
  }

  const studentsAtRisk = await prisma.student.findMany({
    where: {
      schoolId,
      attendance: {
        path: ['faltasConsecutivas'],
        gt: 30,
      },
    },
  });

  const criticalInventory = await prisma.inventoryItem.findMany({
    where: {
      schoolId,
    },
  }).then((items: any) => 
    items.filter((item: any) => item.quantity < item.minThreshold)
  );

  return {
    school: {
      id: school.id,
      name: school.name,
      planType: school.planType,
    },
    stats: {
      totalStudents: school._count.students,
      studentsAtRisk: studentsAtRisk.length,
      totalInventoryItems: school._count.inventory,
      criticalInventoryItems: criticalInventory.length,
    },
  };
}

export default router;

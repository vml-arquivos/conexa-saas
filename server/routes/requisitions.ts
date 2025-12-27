import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// POST /api/requisitions - Criar uma nova requisição
router.post('/', async (req, res) => {
  const { requesterId, schoolId, items, reason } = req.body;

  if (!requesterId || !schoolId || !items || items.length === 0) {
    return res.status(400).json({ error: 'Requester ID, School ID, and items are required.' });
  }

  try {
    const newRequisition = await prisma.materialRequisition.create({
      data: {
        requesterId,
        schoolId,
        reason,
        items: {
          create: items.map((item: { itemId: string, quantity: number }) => ({
            itemId: item.itemId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    res.status(201).json(newRequisition);
  } catch (error) {
    console.error('Error creating requisition:', error);
    res.status(500).json({ error: 'Failed to create requisition.' });
  }
});

// GET /api/requisitions - Listar requisições (com filtro opcional por schoolId)
router.get('/', async (req, res) => {
  const { schoolId } = req.query;

  try {
    const requisitions = await prisma.materialRequisition.findMany({
      where: schoolId ? { schoolId: String(schoolId) } : {},
      include: {
        requester: true,
        school: true,
        items: {
          include: {
            item: true,
          },
        },
      },
      orderBy: {
        requestDate: 'desc',
      },
    });

    res.json(requisitions);
  } catch (error) {
    console.error('Error listing requisitions:', error);
    res.status(500).json({ error: 'Failed to list requisitions.' });
  }
});

// PATCH /api/requisitions/:id/status - Atualizar status da requisição (Ponto Crítico)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status, approvedBy } = req.body;

  if (!status) {
    return res.status(400).json({ error: 'Status is required.' });
  }

  try {
    if (status === 'APPROVED') {
      // Ponto Crítico: Transação para verificar estoque, decrementar e atualizar status
      const updatedRequisition = await prisma.$transaction(async (tx) => {
        // 1. Buscar a requisição e seus itens
        const requisition = await tx.materialRequisition.findUnique({
          where: { id },
          include: {
            items: true,
          },
        });

        if (!requisition) {
          throw new Error('Requisition not found.');
        }

        // 2. Verificar e decrementar o estoque para cada item
        for (const reqItem of requisition.items) {
          const inventoryItem = await tx.inventoryItem.findUnique({
            where: { id: reqItem.itemId },
          });

          if (!inventoryItem) {
            throw new Error(`Inventory item ${reqItem.itemId} not found.`);
          }

          if (inventoryItem.quantity < reqItem.quantity) {
            // 3. Se não houver estoque, lançar erro
            throw new Error(`Insufficient stock for item ${inventoryItem.name}. Requested: ${reqItem.quantity}, Available: ${inventoryItem.quantity}`);
          }

          // 4. Decrementar a quantidade do estoque
          await tx.inventoryItem.update({
            where: { id: reqItem.itemId },
            data: {
              quantity: {
                decrement: reqItem.quantity,
              },
            },
          });
          
          // 5. Atualizar a quantidade aprovada no item da requisição
          await tx.requisitionItem.update({
            where: { id: reqItem.id },
            data: {
              approvedQty: reqItem.quantity,
            },
          });
        }

        // 6. Atualizar o status da requisição
        return tx.materialRequisition.update({
          where: { id },
          data: {
            status: 'APPROVED',
            approvedBy,
            approvedAt: new Date(),
          },
          include: {
            items: true,
          },
        });
      });

      res.json(updatedRequisition);

    } else {
      // Atualizar status para PENDING ou REJECTED
      const updatedRequisition = await prisma.materialRequisition.update({
        where: { id },
        data: {
          status,
          approvedBy: status === 'REJECTED' ? approvedBy : null,
          approvedAt: status === 'REJECTED' ? new Date() : null,
        },
        include: {
          items: true,
        },
      });

      res.json(updatedRequisition);
    }
  } catch (error) {
    console.error('Error updating requisition status:', error);
    // Retornar erro de estoque insuficiente ou outro erro de transação
    if (error instanceof Error && error.message.includes('Insufficient stock')) {
      return res.status(409).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to update requisition status.' });
  }
});

export default router;

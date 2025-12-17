import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import csv from 'csv-parser';
import ExcelJS from 'exceljs';
import fs from 'fs';
import path from 'path';
import { parseStringPromise } from 'xml2js';

const router = Router();
const prisma = new PrismaClient();

// POST /api/procurement/import - Importar preços de CSV ou XML
router.post('/import', async (req: Request, res: Response) => {
  try {
    const { filePath, type } = req.body; // filePath: caminho do arquivo, type: 'csv' ou 'xml'

    if (!filePath || !type) {
      return res.status(400).json({ error: 'Missing filePath or type' });
    }

    if (type === 'csv') {
      await importFromCSV(filePath);
    } else if (type === 'xml') {
      await importFromXML(filePath);
    } else {
      return res.status(400).json({ error: 'Invalid type. Use csv or xml' });
    }

    res.json({
      success: true,
      message: `Preços importados com sucesso de ${type.toUpperCase()}`,
    });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// POST /api/procurement/export-order - Gerar pedido em Excel
router.post('/export-order', async (req: Request, res: Response) => {
  try {
    const { items, schoolId } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'No items provided' });
    }

    // Buscar detalhes dos itens
    const inventoryItems = await prisma.inventoryItem.findMany({
      where: {
        id: { in: items.map((i: any) => i.id) },
      },
    });

    // Criar workbook Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Pedido de Compra');

    // Configurar colunas
    worksheet.columns = [
      { header: 'Código', key: 'sku', width: 15 },
      { header: 'Produto', key: 'name', width: 30 },
      { header: 'Quantidade', key: 'quantity', width: 12 },
      { header: 'Preço Unit.', key: 'price', width: 12 },
      { header: 'Total', key: 'total', width: 12 },
      { header: 'Fornecedor', key: 'supplier', width: 20 },
    ];

    // Adicionar dados
    let totalValue = 0;
    items.forEach((item: any) => {
      const inventoryItem = inventoryItems.find((i: any) => i.id === item.id);
      if (inventoryItem) {
        const price = Number(inventoryItem.lastPrice) || 0;
        const total = price * item.quantity;
        totalValue += total;

        worksheet.addRow({
          sku: inventoryItem.sku || '-',
          name: inventoryItem.name,
          quantity: item.quantity,
          price: price.toFixed(2),
          total: total.toFixed(2),
          supplier: inventoryItem.supplier || '-',
        });
      }
    });

    // Adicionar total
    worksheet.addRow({});
    worksheet.addRow({
      name: 'TOTAL',
      total: totalValue.toFixed(2),
    });

    // Estilizar cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: 'FFFFFFFF' } };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4472C4' },
    };

    // Gerar arquivo
    const fileName = `pedido-${Date.now()}.xlsx`;
    const filePath = path.join(process.cwd(), 'uploads', fileName);

    await workbook.xlsx.writeFile(filePath);

    // Enviar arquivo
    res.download(filePath, fileName, (err) => {
      if (err) console.error('Download error:', err);
      // Limpar arquivo após download
      fs.unlink(filePath, (err) => {
        if (err) console.error('File deletion error:', err);
      });
    });
  } catch (error) {
    console.error('Export error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
});

// GET /api/procurement/items - Listar itens para compra
router.get('/items', async (req: Request, res: Response) => {
  try {
    const { schoolId } = req.query;

    const items = await prisma.inventoryItem.findMany({
      where: schoolId ? { schoolId: schoolId as string } : {},
    });

    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar itens' });
  }
});

// Função auxiliar: Importar de CSV
async function importFromCSV(filePath: string) {
  return new Promise((resolve, reject) => {
    const results: any[] = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', async () => {
        try {
          for (const row of results) {
            const { sku, name, price, supplier } = row;

            if (!name) continue;

            // Buscar ou criar item
            const existingItem = await prisma.inventoryItem.findFirst({
              where: { name },
            });

            if (existingItem) {
              // Atualizar preço
              await prisma.inventoryItem.update({
                where: { id: existingItem.id },
                data: {
                  sku: sku || existingItem.sku,
                  lastPrice: price ? parseFloat(price) : existingItem.lastPrice,
                  supplier: supplier || existingItem.supplier,
                  lastUpdated: new Date(),
                },
              });
            } else {
              // Criar novo item
              await prisma.inventoryItem.create({
                data: {
                  name,
                  category: 'PEDAGOGICO',
                  quantity: 0,
                  sku,
                  lastPrice: price ? parseFloat(price) : 0,
                  supplier,
                  schoolId: 'default-school', // Será ajustado conforme necessário
                },
              });
            }
          }
          resolve(true);
        } catch (error) {
          reject(error);
        }
      })
      .on('error', reject);
  });
}

// Função auxiliar: Importar de XML
async function importFromXML(filePath: string) {
  try {
    const xmlData = fs.readFileSync(filePath, 'utf-8');
    const jsonData = await parseStringPromise(xmlData);

    // Estrutura esperada: { products: { product: [...] } }
    const products = jsonData.products?.product || [];

    for (const product of products) {
      const name = product.name?.[0];
      const sku = product.sku?.[0];
      const price = product.price?.[0];
      const supplier = product.supplier?.[0];

      if (!name) continue;

      const existingItem = await prisma.inventoryItem.findFirst({
        where: { name },
      });

      if (existingItem) {
        await prisma.inventoryItem.update({
          where: { id: existingItem.id },
          data: {
            sku: sku || existingItem.sku,
            lastPrice: price ? parseFloat(price) : existingItem.lastPrice,
            supplier: supplier || existingItem.supplier,
            lastUpdated: new Date(),
          },
        });
      } else {
        await prisma.inventoryItem.create({
          data: {
            name,
            category: 'PEDAGOGICO',
            quantity: 0,
            sku,
            lastPrice: price ? parseFloat(price) : 0,
            supplier,
            schoolId: 'default-school',
          },
        });
      }
    }
  } catch (error) {
    throw error;
  }
}

export default router;

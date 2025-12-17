import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // Verificar se ja existe dados
  const existingSchools = await prisma.school.findMany();
  if (existingSchools.length > 0) {
    console.log('✅ Banco de dados ja populado. Saindo...');
    return;
  }

  // Criar Escola Padrao
  const school = await prisma.school.create({
    data: {
      name: 'Escola Conexa Demonstracao',
      planType: 'PRO',
    },
  });
  console.log('✅ Escola criada:', school.name);

  // Criar Alunos de Exemplo
  const students = await Promise.all([
    prisma.student.create({
      data: {
        name: 'Alice Siqueira',
        classId: 'Berçário 1',
        schoolId: school.id,
        healthData: {
          alergias: ['Lactose'],
          medicamentos: [],
          tea: false,
        },
        attendance: {
          faltasConsecutivas: 2,
          total: 5,
        },
      },
    }),
    prisma.student.create({
      data: {
        name: 'Enzo Gabriel',
        classId: 'Maternal 2',
        schoolId: school.id,
        healthData: {
          alergias: [],
          medicamentos: [],
          tea: false,
        },
        attendance: {
          faltasConsecutivas: 32,
          total: 45,
        },
      },
    }),
    prisma.student.create({
      data: {
        name: 'Sofia Martins',
        classId: 'Maternal 1',
        schoolId: school.id,
        healthData: {
          alergias: ['Amendoim'],
          medicamentos: [],
          tea: false,
        },
        attendance: {
          faltasConsecutivas: 1,
          total: 3,
        },
      },
    }),
    prisma.student.create({
      data: {
        name: 'Lucas Oliveira',
        classId: 'Pre-Escolar 1',
        schoolId: school.id,
        healthData: {
          alergias: [],
          medicamentos: [],
          tea: false,
        },
        attendance: {
          faltasConsecutivas: 0,
          total: 2,
        },
      },
    }),
    prisma.student.create({
      data: {
        name: 'Maria Santos',
        classId: 'Berçário 1',
        schoolId: school.id,
        healthData: {
          alergias: [],
          medicamentos: ['Inalador para asma'],
          tea: false,
        },
        attendance: {
          faltasConsecutivas: 5,
          total: 8,
        },
      },
    }),
  ]);
  console.log(`✅ ${students.length} alunos criados`);

  // Criar Itens de Estoque
  const inventory = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        name: 'Fralda G',
        category: 'HIGIENE',
        quantity: 150,
        minThreshold: 50,
        unit: 'un',
        schoolId: school.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Papel A4',
        category: 'PEDAGOGICO',
        quantity: 5000,
        minThreshold: 1000,
        unit: 'folhas',
        schoolId: school.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Leite sem Lactose',
        category: 'ALIMENTACAO',
        quantity: 5,
        minThreshold: 10,
        unit: 'litros',
        schoolId: school.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Lenço Umedecido',
        category: 'HIGIENE',
        quantity: 200,
        minThreshold: 100,
        unit: 'pacotes',
        schoolId: school.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Caneta Colorida',
        category: 'PEDAGOGICO',
        quantity: 500,
        minThreshold: 200,
        unit: 'un',
        schoolId: school.id,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'Suco Natural',
        category: 'ALIMENTACAO',
        quantity: 30,
        minThreshold: 50,
        unit: 'litros',
        schoolId: school.id,
      },
    }),
  ]);
  console.log(`✅ ${inventory.length} itens de estoque criados`);

  console.log('🎉 Seed concluido com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

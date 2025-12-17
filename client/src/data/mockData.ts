export const TURMAS = [
  { id: 'b1', name: 'Berçário 1', type: 'Integral' },
  { id: 'm1', name: 'Maternal 1', type: 'Integral' },
  { id: 'm2', name: 'Maternal 2', type: 'Integral' },
  { id: 'p1', name: 'Pré-Escolar 1', type: 'Integral' },
];

export const ESTOQUE = [
  { id: 1, item: 'Fralda G', category: 'Higiene', qtd: 150, min: 50 },
  { id: 2, item: 'Papel A4', category: 'Pedagógico', qtd: 5000, min: 1000 },
  { id: 3, item: 'Leite s/ Lactose', category: 'Alimentação', qtd: 5, min: 10 }, // Crítico!
  { id: 4, item: 'Lenço Umedecido', category: 'Higiene', qtd: 200, min: 100 },
  { id: 5, item: 'Caneta Colorida', category: 'Pedagógico', qtd: 500, min: 200 },
  { id: 6, item: 'Suco Natural', category: 'Alimentação', qtd: 30, min: 50 }, // Crítico!
];

export const ALUNOS = [
  { 
    id: 1, 
    name: 'Alice Siqueira', 
    turma: 'Berçário 1', 
    foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice', 
    saude: ['Intolerante à Lactose'], 
    faltasConsecutivas: 2, 
    faltasTotal: 5 
  },
  { 
    id: 2, 
    name: 'Enzo Gabriel', 
    turma: 'Maternal 2', 
    foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Enzo', 
    saude: [], 
    faltasConsecutivas: 32, 
    faltasTotal: 45 
  }, // Risco de Evasão
  { 
    id: 3, 
    name: 'Sofia Martins', 
    turma: 'Maternal 1', 
    foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sofia', 
    saude: ['Alergia a Amendoim'], 
    faltasConsecutivas: 1, 
    faltasTotal: 3 
  },
  { 
    id: 4, 
    name: 'Lucas Oliveira', 
    turma: 'Pré-Escolar 1', 
    foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lucas', 
    saude: [], 
    faltasConsecutivas: 0, 
    faltasTotal: 2 
  },
  { 
    id: 5, 
    name: 'Maria Santos', 
    turma: 'Berçário 1', 
    foto: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', 
    saude: ['Asma'], 
    faltasConsecutivas: 5, 
    faltasTotal: 8 
  },
];

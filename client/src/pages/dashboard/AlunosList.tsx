import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Heart, Baby, Milk, Moon } from "lucide-react";
import { Link } from "wouter";

interface Student {
  id: string;
  name: string;
  age: string;
  classId: string;
  turno: string;
  healthData?: {
    alergias?: string[];
    restricoesAlimentares?: string[];
    medicamentos?: string[];
  };
  rotina?: {
    horarioSono?: string;
    alimentacao?: string;
    fralda?: boolean;
  };
  responsavel: {
    nome: string;
    telefone: string;
  };
}

// Dados de demonstração para berçário e maternal
const alunosMock: Student[] = [
  {
    id: "1",
    name: "Miguel Santos",
    age: "8 meses",
    classId: "Berçário I",
    turno: "Integral",
    healthData: {
      alergias: ["Lactose"],
      restricoesAlimentares: ["Leite de vaca"],
    },
    rotina: {
      horarioSono: "10:00 e 14:30",
      alimentacao: "Fórmula especial",
      fralda: true,
    },
    responsavel: {
      nome: "Maria Santos",
      telefone: "(11) 98765-4321",
    },
  },
  {
    id: "2",
    name: "Sofia Oliveira",
    age: "1 ano e 3 meses",
    classId: "Berçário II",
    turno: "Integral",
    healthData: {
      alergias: [],
      restricoesAlimentares: [],
    },
    rotina: {
      horarioSono: "13:00",
      alimentacao: "Papinha e frutas",
      fralda: true,
    },
    responsavel: {
      nome: "Ana Oliveira",
      telefone: "(11) 97654-3210",
    },
  },
  {
    id: "3",
    name: "Lucas Ferreira",
    age: "2 anos e 2 meses",
    classId: "Maternal I",
    turno: "Integral",
    healthData: {
      alergias: ["Amendoim"],
      medicamentos: ["Antialérgico"],
    },
    rotina: {
      horarioSono: "13:30",
      alimentacao: "Comida normal",
      fralda: true,
    },
    responsavel: {
      nome: "Carlos Ferreira",
      telefone: "(11) 96543-2109",
    },
  },
  {
    id: "4",
    name: "Valentina Costa",
    age: "3 anos e 6 meses",
    classId: "Maternal II",
    turno: "Integral",
    healthData: {
      alergias: [],
      restricoesAlimentares: [],
    },
    rotina: {
      horarioSono: "14:00",
      alimentacao: "Comida normal",
      fralda: false,
    },
    responsavel: {
      nome: "Juliana Costa",
      telefone: "(11) 95432-1098",
    },
  },
  {
    id: "5",
    name: "Arthur Silva",
    age: "10 meses",
    classId: "Berçário I",
    turno: "Integral",
    healthData: {
      alergias: [],
      restricoesAlimentares: [],
    },
    rotina: {
      horarioSono: "09:30 e 14:00",
      alimentacao: "Leite materno",
      fralda: true,
    },
    responsavel: {
      nome: "Fernanda Silva",
      telefone: "(11) 94321-0987",
    },
  },
  {
    id: "6",
    name: "Helena Rodrigues",
    age: "1 ano e 8 meses",
    classId: "Berçário II",
    turno: "Integral",
    healthData: {
      alergias: ["Ovo"],
      restricoesAlimentares: ["Ovo e derivados"],
    },
    rotina: {
      horarioSono: "13:00",
      alimentacao: "Papinha sem ovo",
      fralda: true,
    },
    responsavel: {
      nome: "Roberto Rodrigues",
      telefone: "(11) 93210-9876",
    },
  },
  {
    id: "7",
    name: "Davi Almeida",
    age: "2 anos e 9 meses",
    classId: "Maternal I",
    turno: "Integral",
    healthData: {
      alergias: [],
      restricoesAlimentares: [],
    },
    rotina: {
      horarioSono: "13:30",
      alimentacao: "Comida normal",
      fralda: true,
    },
    responsavel: {
      nome: "Paula Almeida",
      telefone: "(11) 92109-8765",
    },
  },
  {
    id: "8",
    name: "Alice Martins",
    age: "3 anos e 11 meses",
    classId: "Maternal II",
    turno: "Integral",
    healthData: {
      alergias: [],
      restricoesAlimentares: [],
    },
    rotina: {
      horarioSono: "14:00",
      alimentacao: "Comida normal",
      fralda: false,
    },
    responsavel: {
      nome: "Marcos Martins",
      telefone: "(11) 91098-7654",
    },
  },
];

export default function AlunosList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [alunos] = useState<Student[]>(alunosMock);

  const filteredAlunos = alunos.filter(aluno =>
    aluno.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.classId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    aluno.age.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Alunos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie os alunos do berçário e maternal (0 a 4 anos)
          </p>
        </div>
        <Link href="/dashboard/alunos/novo">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Novo Aluno
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Alunos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{alunos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Berçário (0-2 anos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alunos.filter(a => a.classId.includes("Berçário")).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maternal (2-4 anos)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {alunos.filter(a => a.classId.includes("Maternal")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome, turma ou idade..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredAlunos.map((aluno) => {
          const temAlergias = (aluno.healthData?.alergias?.length || 0) > 0;
          const temRestricoes = (aluno.healthData?.restricoesAlimentares?.length || 0) > 0;
          const temProblemasSaude = temAlergias || temRestricoes || 
                                     (aluno.healthData?.medicamentos?.length || 0) > 0;

          return (
            <Card
              key={aluno.id}
              className={`transition-all ${
                temProblemasSaude
                  ? "border-yellow-500/50 bg-yellow-50/30 dark:bg-yellow-950/20"
                  : ""
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <Baby className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{aluno.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {aluno.age} • {aluno.classId}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {aluno.turno}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                {/* Informações de Rotina */}
                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                    <Moon className="h-3 w-3 text-blue-500" />
                    Rotina
                  </p>
                  <div className="text-xs space-y-1">
                    <p><span className="font-medium">Sono:</span> {aluno.rotina?.horarioSono}</p>
                    <p><span className="font-medium">Alimentação:</span> {aluno.rotina?.alimentacao}</p>
                    <p><span className="font-medium">Fralda:</span> {aluno.rotina?.fralda ? "Sim" : "Não"}</p>
                  </div>
                </div>

                {/* Informações de Saúde */}
                {temProblemasSaude && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                      <Heart className="h-3 w-3 text-orange-500" />
                      Informações de Saúde
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {aluno.healthData?.alergias?.map((alergia, idx) => (
                        <Badge
                          key={`alergia-${idx}`}
                          variant="secondary"
                          className="bg-red-100/80 text-red-900 dark:bg-red-900/30 dark:text-red-200 text-xs"
                        >
                          Alergia: {alergia}
                        </Badge>
                      ))}
                      {aluno.healthData?.restricoesAlimentares?.map((restricao, idx) => (
                        <Badge
                          key={`restricao-${idx}`}
                          variant="secondary"
                          className="bg-yellow-100/80 text-yellow-900 dark:bg-yellow-900/30 dark:text-yellow-200 text-xs"
                        >
                          <Milk className="h-3 w-3 mr-1" />
                          {restricao}
                        </Badge>
                      ))}
                      {aluno.healthData?.medicamentos?.map((med, idx) => (
                        <Badge
                          key={`med-${idx}`}
                          variant="secondary"
                          className="bg-orange-100/80 text-orange-900 dark:bg-orange-900/30 dark:text-orange-200 text-xs"
                        >
                          Medicamento: {med}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Responsável */}
                <div className="pt-2 border-t">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Responsável:</span> {aluno.responsavel.nome}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Telefone:</span> {aluno.responsavel.telefone}
                  </p>
                </div>

                <Link href={`/dashboard/alunos/${aluno.id}`}>
                  <Button variant="outline" size="sm" className="w-full">
                    Ver Detalhes
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredAlunos.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Nenhum aluno encontrado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

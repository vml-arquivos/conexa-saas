import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, Baby, User, Edit, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";

interface Turma {
  id: string;
  nome: string;
  faixaEtaria: string;
  turno: "Integral";
  professor: string;
  totalAlunos: number;
  sala: string;
  horario: string;
  capacidadeMaxima: number;
}

export default function Turmas() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [turmaAtual, setTurmaAtual] = useState<Partial<Turma>>({});
  const [turmaParaExcluir, setTurmaParaExcluir] = useState<string | null>(null);

  const [turmas, setTurmas] = useState<Turma[]>([
    {
      id: "1",
      nome: "Berçário I - Turma A",
      faixaEtaria: "0-1 ano",
      turno: "Integral",
      professor: "Maria Santos",
      totalAlunos: 8,
      sala: "Sala Bebês 1",
      horario: "07:00 - 18:00",
      capacidadeMaxima: 10
    },
    {
      id: "2",
      nome: "Berçário I - Turma B",
      faixaEtaria: "0-1 ano",
      turno: "Integral",
      professor: "Ana Paula Costa",
      totalAlunos: 7,
      sala: "Sala Bebês 2",
      horario: "07:00 - 18:00",
      capacidadeMaxima: 10
    },
    {
      id: "3",
      nome: "Berçário II - Turma A",
      faixaEtaria: "1-2 anos",
      turno: "Integral",
      professor: "Juliana Oliveira",
      totalAlunos: 10,
      sala: "Sala Descobertas",
      horario: "07:00 - 18:00",
      capacidadeMaxima: 12
    },
    {
      id: "4",
      nome: "Maternal I - Turma A",
      faixaEtaria: "2-3 anos",
      turno: "Integral",
      professor: "Carla Mendes",
      totalAlunos: 12,
      sala: "Sala Exploradores",
      horario: "07:00 - 18:00",
      capacidadeMaxima: 15
    },
    {
      id: "5",
      nome: "Maternal II - Turma A",
      faixaEtaria: "3-4 anos",
      turno: "Integral",
      professor: "Roberto Silva",
      totalAlunos: 15,
      sala: "Sala Aventureiros",
      horario: "07:00 - 18:00",
      capacidadeMaxima: 18
    }
  ]);

  const handleCriarTurma = () => {
    if (turmaAtual.nome && turmaAtual.faixaEtaria && turmaAtual.professor && turmaAtual.sala && turmaAtual.capacidadeMaxima) {
      const novaTurma: Turma = {
        id: Date.now().toString(),
        nome: turmaAtual.nome,
        faixaEtaria: turmaAtual.faixaEtaria,
        turno: "Integral",
        professor: turmaAtual.professor,
        totalAlunos: turmaAtual.totalAlunos || 0,
        sala: turmaAtual.sala,
        horario: turmaAtual.horario || "07:00 - 18:00",
        capacidadeMaxima: turmaAtual.capacidadeMaxima
      };
      setTurmas([...turmas, novaTurma]);
      setTurmaAtual({});
      setDialogOpen(false);
      toast.success("Turma criada com sucesso!");
    } else {
      toast.error("Preencha todos os campos obrigatórios!");
    }
  };

  const handleEditarTurma = () => {
    if (turmaAtual.id && turmaAtual.nome && turmaAtual.faixaEtaria && turmaAtual.professor) {
      setTurmas(turmas.map(t => 
        t.id === turmaAtual.id ? turmaAtual as Turma : t
      ));
      setTurmaAtual({});
      setDialogOpen(false);
      setModoEdicao(false);
      toast.success("Turma atualizada com sucesso!");
    }
  };

  const handleExcluirTurma = (id: string) => {
    setTurmas(turmas.filter(t => t.id !== id));
    setTurmaParaExcluir(null);
    toast.success("Turma excluída com sucesso!");
  };

  const abrirDialogNova = () => {
    setTurmaAtual({});
    setModoEdicao(false);
    setDialogOpen(true);
  };

  const abrirDialogEditar = (turma: Turma) => {
    setTurmaAtual(turma);
    setModoEdicao(true);
    setDialogOpen(true);
  };

  const getCorFaixaEtaria = (faixa: string) => {
    if (faixa.includes("0-1")) return "bg-blue-100 text-blue-800";
    if (faixa.includes("1-2")) return "bg-green-100 text-green-800";
    if (faixa.includes("2-3")) return "bg-yellow-100 text-yellow-800";
    if (faixa.includes("3-4")) return "bg-orange-100 text-orange-800";
    return "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Turmas</h1>
          <p className="text-muted-foreground mt-2">Gerencie as turmas de berçário e maternal</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogNova} className="gap-2">
              <Plus className="h-4 w-4" />
              Nova Turma
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{modoEdicao ? "Editar Turma" : "Nova Turma"}</DialogTitle>
              <DialogDescription>
                {modoEdicao ? "Atualize as informações da turma" : "Preencha os dados para criar uma nova turma"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="nome">Nome da Turma *</Label>
                <Input
                  id="nome"
                  value={turmaAtual.nome || ""}
                  onChange={(e) => setTurmaAtual({ ...turmaAtual, nome: e.target.value })}
                  placeholder="Ex: Berçário I - Turma A"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="faixaEtaria">Faixa Etária *</Label>
                  <Select value={turmaAtual.faixaEtaria} onValueChange={(value) => setTurmaAtual({ ...turmaAtual, faixaEtaria: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1 ano">0-1 ano (Berçário I)</SelectItem>
                      <SelectItem value="1-2 anos">1-2 anos (Berçário II)</SelectItem>
                      <SelectItem value="2-3 anos">2-3 anos (Maternal I)</SelectItem>
                      <SelectItem value="3-4 anos">3-4 anos (Maternal II)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sala">Sala *</Label>
                  <Input
                    id="sala"
                    value={turmaAtual.sala || ""}
                    onChange={(e) => setTurmaAtual({ ...turmaAtual, sala: e.target.value })}
                    placeholder="Ex: Sala Bebês 1"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="professor">Professor(a) Responsável *</Label>
                <Input
                  id="professor"
                  value={turmaAtual.professor || ""}
                  onChange={(e) => setTurmaAtual({ ...turmaAtual, professor: e.target.value })}
                  placeholder="Ex: Maria Santos"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="totalAlunos">Alunos Atuais</Label>
                  <Input
                    id="totalAlunos"
                    type="number"
                    value={turmaAtual.totalAlunos || 0}
                    onChange={(e) => setTurmaAtual({ ...turmaAtual, totalAlunos: parseInt(e.target.value) || 0 })}
                    min="0"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="capacidadeMaxima">Capacidade Máx. *</Label>
                  <Input
                    id="capacidadeMaxima"
                    type="number"
                    value={turmaAtual.capacidadeMaxima || ""}
                    onChange={(e) => setTurmaAtual({ ...turmaAtual, capacidadeMaxima: parseInt(e.target.value) })}
                    min="1"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="horario">Horário</Label>
                  <Input
                    id="horario"
                    value={turmaAtual.horario || "07:00 - 18:00"}
                    onChange={(e) => setTurmaAtual({ ...turmaAtual, horario: e.target.value })}
                    placeholder="07:00 - 18:00"
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={modoEdicao ? handleEditarTurma : handleCriarTurma}>
                {modoEdicao ? "Atualizar" : "Criar"} Turma
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {turmas.map((turma) => (
          <Card key={turma.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">{turma.nome}</CardTitle>
                  <div className="flex flex-wrap gap-2">
                    <Badge className={getCorFaixaEtaria(turma.faixaEtaria)}>
                      <Baby className="h-3 w-3 mr-1" />
                      {turma.faixaEtaria}
                    </Badge>
                    <Badge variant="outline">
                      {turma.turno}
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => abrirDialogEditar(turma)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setTurmaParaExcluir(turma.id)}
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Professor(a):</span>
                <span className="text-muted-foreground">{turma.professor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Alunos:</span>
                <span className="text-muted-foreground">
                  {turma.totalAlunos} / {turma.capacidadeMaxima}
                </span>
                <Badge variant={turma.totalAlunos >= turma.capacidadeMaxima ? "destructive" : "secondary"} className="ml-auto">
                  {turma.totalAlunos >= turma.capacidadeMaxima ? "Lotada" : `${turma.capacidadeMaxima - turma.totalAlunos} vagas`}
                </Badge>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">Horário:</span>
                <span className="text-muted-foreground">{turma.horario}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Sala:</span>
                <span className="text-muted-foreground">{turma.sala}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {turmas.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">Nenhuma turma cadastrada</p>
            <p className="text-sm text-muted-foreground">Clique em "Nova Turma" para começar</p>
          </CardContent>
        </Card>
      )}

      <AlertDialog open={!!turmaParaExcluir} onOpenChange={() => setTurmaParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir esta turma? Todos os dados associados serão perdidos. Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => turmaParaExcluir && handleExcluirTurma(turmaParaExcluir)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

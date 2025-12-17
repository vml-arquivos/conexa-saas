import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, FileText, Calendar, Edit, Trash2, Baby } from "lucide-react";
import { toast } from "sonner";

interface Planejamento {
  id: string;
  titulo: string;
  turma: string;
  faixaEtaria: string;
  dataInicio: string;
  dataFim: string;
  objetivos: string;
  atividades: string;
  materiais: string;
  status: "ativo" | "concluido" | "rascunho";
}

export default function PlanejamentosList() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [planejamentoAtual, setPlanejamentoAtual] = useState<Partial<Planejamento>>({});
  const [planejamentoParaExcluir, setPlanejamentoParaExcluir] = useState<string | null>(null);

  const [planejamentos, setPlanejamentos] = useState<Planejamento[]>([
    {
      id: "1",
      titulo: "Exploração Sensorial - Texturas e Cores",
      turma: "Berçário I - Turma A",
      faixaEtaria: "0-1 ano",
      dataInicio: "2025-12-16",
      dataFim: "2025-12-20",
      objetivos: "Estimular os sentidos do tato e visão através de diferentes texturas e cores",
      atividades: "Caixas sensoriais com tecidos, esponjas, papel crepom colorido. Pintura com tinta comestível.",
      materiais: "Tecidos variados, esponjas, papel crepom, tinta comestível, bandejas",
      status: "ativo"
    },
    {
      id: "2",
      titulo: "Desenvolvimento Motor - Engatinhar e Rolar",
      turma: "Berçário II - Turma A",
      faixaEtaria: "1-2 anos",
      dataInicio: "2025-12-16",
      dataFim: "2025-12-20",
      objetivos: "Fortalecer a musculatura e coordenação motora através de circuitos e brincadeiras",
      atividades: "Circuito com almofadas, túnel de tecido, rampas suaves. Brincadeiras de pegar e soltar objetos.",
      materiais: "Almofadas, túnel de tecido, rampas, bolas de diferentes tamanhos, blocos macios",
      status: "ativo"
    },
    {
      id: "3",
      titulo: "Linguagem e Comunicação - Histórias e Cantigas",
      turma: "Maternal I - Turma A",
      faixaEtaria: "2-3 anos",
      dataInicio: "2025-12-16",
      dataFim: "2025-12-20",
      objetivos: "Desenvolver a linguagem oral através de histórias, músicas e rimas",
      atividades: "Roda de histórias com fantoches, cantigas de roda, imitação de sons de animais",
      materiais: "Livros infantis, fantoches, instrumentos musicais simples, cartazes com figuras",
      status: "ativo"
    },
    {
      id: "4",
      titulo: "Socialização e Autonomia - Hora do Lanche",
      turma: "Maternal II - Turma A",
      faixaEtaria: "3-4 anos",
      dataInicio: "2025-12-16",
      dataFim: "2025-12-20",
      objetivos: "Estimular a autonomia e socialização durante as refeições",
      atividades: "Práticas de higiene das mãos, servir-se sozinho, comer com talheres, compartilhar alimentos",
      materiais: "Pratos, copos, talheres infantis, toalhas, sabonete líquido",
      status: "ativo"
    },
    {
      id: "5",
      titulo: "Arte e Criatividade - Pintura Livre",
      turma: "Maternal II - Turma A",
      faixaEtaria: "3-4 anos",
      dataInicio: "2025-12-09",
      dataFim: "2025-12-13",
      objetivos: "Estimular a criatividade e expressão artística",
      atividades: "Pintura com pincéis, dedos e carimbos. Colagem com materiais diversos.",
      materiais: "Tintas atóxicas, pincéis, papel kraft, cola, revistas, tesouras sem ponta",
      status: "concluido"
    }
  ]);

  const handleCriarPlanejamento = () => {
    if (planejamentoAtual.titulo && planejamentoAtual.turma && planejamentoAtual.faixaEtaria && planejamentoAtual.dataInicio) {
      const novo: Planejamento = {
        id: Date.now().toString(),
        titulo: planejamentoAtual.titulo,
        turma: planejamentoAtual.turma,
        faixaEtaria: planejamentoAtual.faixaEtaria,
        dataInicio: planejamentoAtual.dataInicio,
        dataFim: planejamentoAtual.dataFim || planejamentoAtual.dataInicio,
        objetivos: planejamentoAtual.objetivos || "",
        atividades: planejamentoAtual.atividades || "",
        materiais: planejamentoAtual.materiais || "",
        status: planejamentoAtual.status as Planejamento["status"] || "rascunho"
      };
      setPlanejamentos([...planejamentos, novo]);
      setPlanejamentoAtual({});
      setDialogOpen(false);
      toast.success("Planejamento criado com sucesso!");
    } else {
      toast.error("Preencha os campos obrigatórios!");
    }
  };

  const handleEditarPlanejamento = () => {
    if (planejamentoAtual.id) {
      setPlanejamentos(planejamentos.map(p => 
        p.id === planejamentoAtual.id ? planejamentoAtual as Planejamento : p
      ));
      setPlanejamentoAtual({});
      setDialogOpen(false);
      setModoEdicao(false);
      toast.success("Planejamento atualizado com sucesso!");
    }
  };

  const handleExcluirPlanejamento = (id: string) => {
    setPlanejamentos(planejamentos.filter(p => p.id !== id));
    setPlanejamentoParaExcluir(null);
    toast.success("Planejamento excluído com sucesso!");
  };

  const abrirDialogNovo = () => {
    setPlanejamentoAtual({});
    setModoEdicao(false);
    setDialogOpen(true);
  };

  const abrirDialogEditar = (planejamento: Planejamento) => {
    setPlanejamentoAtual(planejamento);
    setModoEdicao(true);
    setDialogOpen(true);
  };

  const getStatusBadge = (status: Planejamento["status"]) => {
    const badges = {
      ativo: { label: "Ativo", variant: "default" as const },
      concluido: { label: "Concluído", variant: "secondary" as const },
      rascunho: { label: "Rascunho", variant: "outline" as const }
    };
    return badges[status];
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Planejamentos</h1>
          <p className="text-muted-foreground mt-2">Gerencie os planejamentos pedagógicos de berçário e maternal</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Planejamento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{modoEdicao ? "Editar Planejamento" : "Novo Planejamento"}</DialogTitle>
              <DialogDescription>
                {modoEdicao ? "Atualize as informações do planejamento" : "Crie um novo planejamento pedagógico"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título do Planejamento *</Label>
                <Input
                  id="titulo"
                  value={planejamentoAtual.titulo || ""}
                  onChange={(e) => setPlanejamentoAtual({ ...planejamentoAtual, titulo: e.target.value })}
                  placeholder="Ex: Exploração Sensorial - Texturas e Cores"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="turma">Turma *</Label>
                  <Select value={planejamentoAtual.turma} onValueChange={(value) => setPlanejamentoAtual({ ...planejamentoAtual, turma: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a turma" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Berçário I - Turma A">Berçário I - Turma A</SelectItem>
                      <SelectItem value="Berçário I - Turma B">Berçário I - Turma B</SelectItem>
                      <SelectItem value="Berçário II - Turma A">Berçário II - Turma A</SelectItem>
                      <SelectItem value="Maternal I - Turma A">Maternal I - Turma A</SelectItem>
                      <SelectItem value="Maternal II - Turma A">Maternal II - Turma A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="faixaEtaria">Faixa Etária *</Label>
                  <Select value={planejamentoAtual.faixaEtaria} onValueChange={(value) => setPlanejamentoAtual({ ...planejamentoAtual, faixaEtaria: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0-1 ano">0-1 ano</SelectItem>
                      <SelectItem value="1-2 anos">1-2 anos</SelectItem>
                      <SelectItem value="2-3 anos">2-3 anos</SelectItem>
                      <SelectItem value="3-4 anos">3-4 anos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="dataInicio">Data Início *</Label>
                  <Input
                    id="dataInicio"
                    type="date"
                    value={planejamentoAtual.dataInicio || ""}
                    onChange={(e) => setPlanejamentoAtual({ ...planejamentoAtual, dataInicio: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="dataFim">Data Fim</Label>
                  <Input
                    id="dataFim"
                    type="date"
                    value={planejamentoAtual.dataFim || ""}
                    onChange={(e) => setPlanejamentoAtual({ ...planejamentoAtual, dataFim: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="objetivos">Objetivos</Label>
                <Textarea
                  id="objetivos"
                  value={planejamentoAtual.objetivos || ""}
                  onChange={(e) => setPlanejamentoAtual({ ...planejamentoAtual, objetivos: e.target.value })}
                  placeholder="Descreva os objetivos pedagógicos..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="atividades">Atividades</Label>
                <Textarea
                  id="atividades"
                  value={planejamentoAtual.atividades || ""}
                  onChange={(e) => setPlanejamentoAtual({ ...planejamentoAtual, atividades: e.target.value })}
                  placeholder="Descreva as atividades planejadas..."
                  rows={3}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="materiais">Materiais Necessários</Label>
                <Textarea
                  id="materiais"
                  value={planejamentoAtual.materiais || ""}
                  onChange={(e) => setPlanejamentoAtual({ ...planejamentoAtual, materiais: e.target.value })}
                  placeholder="Liste os materiais necessários..."
                  rows={2}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={planejamentoAtual.status} onValueChange={(value) => setPlanejamentoAtual({ ...planejamentoAtual, status: value as Planejamento["status"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rascunho">Rascunho</SelectItem>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="concluido">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={modoEdicao ? handleEditarPlanejamento : handleCriarPlanejamento}>
                {modoEdicao ? "Atualizar" : "Criar"} Planejamento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {planejamentos.map((plan) => {
          const badge = getStatusBadge(plan.status);
          return (
            <Card key={plan.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <CardTitle className="text-xl">{plan.titulo}</CardTitle>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Baby className="h-4 w-4" />
                        {plan.turma} ({plan.faixaEtaria})
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(plan.dataInicio).toLocaleDateString('pt-BR')} 
                        {plan.dataFim && ` - ${new Date(plan.dataFim).toLocaleDateString('pt-BR')}`}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirDialogEditar(plan)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setPlanejamentoParaExcluir(plan.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {plan.objetivos && (
                  <div>
                    <p className="text-sm font-medium mb-1">Objetivos:</p>
                    <p className="text-sm text-muted-foreground">{plan.objetivos}</p>
                  </div>
                )}
                {plan.atividades && (
                  <div>
                    <p className="text-sm font-medium mb-1">Atividades:</p>
                    <p className="text-sm text-muted-foreground">{plan.atividades}</p>
                  </div>
                )}
                {plan.materiais && (
                  <div>
                    <p className="text-sm font-medium mb-1">Materiais:</p>
                    <p className="text-sm text-muted-foreground">{plan.materiais}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}

        {planejamentos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhum planejamento cadastrado</p>
              <p className="text-sm text-muted-foreground">Clique em "Novo Planejamento" para começar</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!planejamentoParaExcluir} onOpenChange={() => setPlanejamentoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este planejamento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => planejamentoParaExcluir && handleExcluirPlanejamento(planejamentoParaExcluir)}
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

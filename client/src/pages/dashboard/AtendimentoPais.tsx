import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { MessageSquare, Calendar, Phone, Mail, Clock, Plus, Search } from "lucide-react";
import { toast } from "sonner";

interface Atendimento {
  id: string;
  responsavel: string;
  aluno: string;
  turma: string;
  data: string;
  hora: string;
  tipo: "presencial" | "online" | "telefone";
  status: "agendado" | "realizado" | "cancelado";
  assunto: string;
  observacoes?: string;
}

export default function AtendimentoPais() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [novoAtendimento, setNovoAtendimento] = useState<Partial<Atendimento>>({});

  const [atendimentos, setAtendimentos] = useState<Atendimento[]>([
    {
      id: "1",
      responsavel: "Maria Silva",
      aluno: "Ana Silva",
      turma: "5º Ano A",
      data: "2025-12-18",
      hora: "14:00",
      tipo: "presencial",
      status: "agendado",
      assunto: "Desempenho acadêmico",
      observacoes: "Mãe solicitou reunião para discutir notas de matemática"
    },
    {
      id: "2",
      responsavel: "João Santos",
      aluno: "Bruno Santos",
      turma: "4º Ano B",
      data: "2025-12-17",
      hora: "15:30",
      tipo: "online",
      status: "realizado",
      assunto: "Comportamento em sala",
      observacoes: "Reunião realizada via Google Meet. Pais comprometidos a acompanhar mais de perto."
    },
    {
      id: "3",
      responsavel: "Carla Costa",
      aluno: "Carlos Eduardo",
      turma: "5º Ano A",
      data: "2025-12-19",
      hora: "16:00",
      tipo: "telefone",
      status: "agendado",
      assunto: "Faltas consecutivas",
      observacoes: "Verificar motivo das ausências recentes"
    }
  ]);

  const handleCriarAtendimento = () => {
    if (!novoAtendimento.responsavel || !novoAtendimento.aluno || !novoAtendimento.data || 
        !novoAtendimento.hora || !novoAtendimento.tipo || !novoAtendimento.assunto) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const atendimento: Atendimento = {
      id: Date.now().toString(),
      responsavel: novoAtendimento.responsavel!,
      aluno: novoAtendimento.aluno!,
      turma: novoAtendimento.turma || "",
      data: novoAtendimento.data!,
      hora: novoAtendimento.hora!,
      tipo: novoAtendimento.tipo as Atendimento["tipo"],
      status: "agendado",
      assunto: novoAtendimento.assunto!,
      observacoes: novoAtendimento.observacoes
    };

    setAtendimentos([atendimento, ...atendimentos]);
    setNovoAtendimento({});
    setDialogOpen(false);
    toast.success("Atendimento agendado com sucesso!");
  };

  const getTipoIcon = (tipo: Atendimento["tipo"]) => {
    const icons = {
      presencial: <Calendar className="h-4 w-4" />,
      online: <MessageSquare className="h-4 w-4" />,
      telefone: <Phone className="h-4 w-4" />
    };
    return icons[tipo];
  };

  const getStatusBadge = (status: Atendimento["status"]) => {
    const badges = {
      agendado: { label: "Agendado", variant: "default" as const },
      realizado: { label: "Realizado", variant: "secondary" as const },
      cancelado: { label: "Cancelado", variant: "destructive" as const }
    };
    return badges[status];
  };

  const atendimentosFiltrados = atendimentos.filter(atendimento =>
    atendimento.responsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atendimento.aluno.toLowerCase().includes(searchTerm.toLowerCase()) ||
    atendimento.assunto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const atendimentosOrdenados = [...atendimentosFiltrados].sort((a, b) => 
    new Date(b.data + ' ' + b.hora).getTime() - new Date(a.data + ' ' + a.hora).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Atendimento aos Pais</h1>
          <p className="text-muted-foreground mt-2">Gerencie reuniões e comunicação com responsáveis</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Agendar Atendimento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Agendar Novo Atendimento</DialogTitle>
              <DialogDescription>
                Agende uma reunião ou contato com os responsáveis
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="responsavel">Responsável</Label>
                  <Input
                    id="responsavel"
                    value={novoAtendimento.responsavel || ""}
                    onChange={(e) => setNovoAtendimento({ ...novoAtendimento, responsavel: e.target.value })}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="aluno">Aluno</Label>
                  <Input
                    id="aluno"
                    value={novoAtendimento.aluno || ""}
                    onChange={(e) => setNovoAtendimento({ ...novoAtendimento, aluno: e.target.value })}
                    placeholder="Nome do aluno"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="turma">Turma</Label>
                <Input
                  id="turma"
                  value={novoAtendimento.turma || ""}
                  onChange={(e) => setNovoAtendimento({ ...novoAtendimento, turma: e.target.value })}
                  placeholder="Ex: 5º Ano A"
                />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="data">Data</Label>
                  <Input
                    id="data"
                    type="date"
                    value={novoAtendimento.data || ""}
                    onChange={(e) => setNovoAtendimento({ ...novoAtendimento, data: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hora">Hora</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={novoAtendimento.hora || ""}
                    onChange={(e) => setNovoAtendimento({ ...novoAtendimento, hora: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Tipo</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={novoAtendimento.tipo === "presencial" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setNovoAtendimento({ ...novoAtendimento, tipo: "presencial" })}
                      className="flex-1"
                    >
                      Presencial
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant={novoAtendimento.tipo === "online" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNovoAtendimento({ ...novoAtendimento, tipo: "online" })}
                  className="flex-1"
                >
                  <MessageSquare className="h-4 w-4 mr-1" />
                  Online
                </Button>
                <Button
                  type="button"
                  variant={novoAtendimento.tipo === "telefone" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setNovoAtendimento({ ...novoAtendimento, tipo: "telefone" })}
                  className="flex-1"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Telefone
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="assunto">Assunto</Label>
                <Input
                  id="assunto"
                  value={novoAtendimento.assunto || ""}
                  onChange={(e) => setNovoAtendimento({ ...novoAtendimento, assunto: e.target.value })}
                  placeholder="Motivo do atendimento"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="observacoes">Observações</Label>
                <Textarea
                  id="observacoes"
                  value={novoAtendimento.observacoes || ""}
                  onChange={(e) => setNovoAtendimento({ ...novoAtendimento, observacoes: e.target.value })}
                  placeholder="Detalhes adicionais..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button onClick={handleCriarAtendimento}>Agendar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por responsável, aluno ou assunto..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4">
        {atendimentosOrdenados.map((atendimento) => {
          const dataFormatada = new Date(atendimento.data).toLocaleDateString('pt-BR');
          const badge = getStatusBadge(atendimento.status);
          const tipoIcon = getTipoIcon(atendimento.tipo);

          return (
            <Card key={atendimento.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{atendimento.responsavel}</CardTitle>
                    <CardDescription className="flex items-center gap-3">
                      <span>Aluno: {atendimento.aluno}</span>
                      {atendimento.turma && <span>• {atendimento.turma}</span>}
                    </CardDescription>
                  </div>
                  <Badge variant={badge.variant}>{badge.label}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {dataFormatada}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {atendimento.hora}
                    </span>
                    <span className="flex items-center gap-1">
                      {tipoIcon}
                      {atendimento.tipo.charAt(0).toUpperCase() + atendimento.tipo.slice(1)}
                    </span>
                  </div>
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium mb-1">Assunto: {atendimento.assunto}</p>
                    {atendimento.observacoes && (
                      <p className="text-sm text-muted-foreground">{atendimento.observacoes}</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Plus, Users, MapPin, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from "sonner";

interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  tipo: "reuniao" | "evento" | "aula" | "avaliacao";
  turma?: string;
  local?: string;
  descricao?: string;
}

export default function AgendaDigital() {
  const [eventos, setEventos] = useState<Evento[]>([
    {
      id: "1",
      titulo: "Reunião Pedagógica",
      data: "2025-12-18",
      hora: "14:00",
      tipo: "reuniao",
      local: "Sala de Reuniões",
      descricao: "Planejamento do próximo bimestre"
    },
    {
      id: "2",
      titulo: "Atividade Sensorial - Berçário I",
      data: "2025-12-20",
      hora: "10:00",
      tipo: "aula",
      turma: "Berçário I - Turma A",
      descricao: "Exploração de texturas e cores"
    },
    {
      id: "3",
      titulo: "Festa de Natal",
      data: "2025-12-22",
      hora: "15:00",
      tipo: "evento",
      local: "Pátio Principal",
      descricao: "Confraternização de fim de ano"
    }
  ]);

  const [eventoAtual, setEventoAtual] = useState<Partial<Evento>>({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [eventoParaExcluir, setEventoParaExcluir] = useState<string | null>(null);

  const handleCriarEvento = () => {
    if (eventoAtual.titulo && eventoAtual.data && eventoAtual.hora && eventoAtual.tipo) {
      const evento: Evento = {
        id: Date.now().toString(),
        titulo: eventoAtual.titulo,
        data: eventoAtual.data,
        hora: eventoAtual.hora,
        tipo: eventoAtual.tipo as Evento["tipo"],
        turma: eventoAtual.turma,
        local: eventoAtual.local,
        descricao: eventoAtual.descricao
      };
      setEventos([...eventos, evento]);
      setEventoAtual({});
      setDialogOpen(false);
      toast.success("Evento criado com sucesso!");
    }
  };

  const handleEditarEvento = () => {
    if (eventoAtual.id && eventoAtual.titulo && eventoAtual.data && eventoAtual.hora && eventoAtual.tipo) {
      setEventos(eventos.map(e => 
        e.id === eventoAtual.id ? eventoAtual as Evento : e
      ));
      setEventoAtual({});
      setDialogOpen(false);
      setModoEdicao(false);
      toast.success("Evento atualizado com sucesso!");
    }
  };

  const handleExcluirEvento = (id: string) => {
    setEventos(eventos.filter(e => e.id !== id));
    setEventoParaExcluir(null);
    toast.success("Evento excluído com sucesso!");
  };

  const abrirDialogNovo = () => {
    setEventoAtual({});
    setModoEdicao(false);
    setDialogOpen(true);
  };

  const abrirDialogEditar = (evento: Evento) => {
    setEventoAtual(evento);
    setModoEdicao(true);
    setDialogOpen(true);
  };

  const getTipoBadge = (tipo: Evento["tipo"]) => {
    const badges = {
      reuniao: { label: "Reunião", variant: "default" as const },
      evento: { label: "Evento", variant: "secondary" as const },
      aula: { label: "Aula", variant: "outline" as const },
      avaliacao: { label: "Avaliação", variant: "destructive" as const }
    };
    return badges[tipo];
  };

  const eventosOrdenados = [...eventos].sort((a, b) => 
    new Date(a.data + ' ' + a.hora).getTime() - new Date(b.data + ' ' + b.hora).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Agenda Digital</h1>
          <p className="text-muted-foreground mt-2">Gerencie eventos, reuniões e atividades escolares</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={abrirDialogNovo} className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{modoEdicao ? "Editar Evento" : "Novo Evento"}</DialogTitle>
              <DialogDescription>
                {modoEdicao ? "Atualize as informações do evento" : "Preencha os dados para criar um novo evento"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="titulo">Título do Evento *</Label>
                <Input
                  id="titulo"
                  value={eventoAtual.titulo || ""}
                  onChange={(e) => setEventoAtual({ ...eventoAtual, titulo: e.target.value })}
                  placeholder="Ex: Reunião Pedagógica"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="data">Data *</Label>
                  <Input
                    id="data"
                    type="date"
                    value={eventoAtual.data || ""}
                    onChange={(e) => setEventoAtual({ ...eventoAtual, data: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="hora">Hora *</Label>
                  <Input
                    id="hora"
                    type="time"
                    value={eventoAtual.hora || ""}
                    onChange={(e) => setEventoAtual({ ...eventoAtual, hora: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tipo">Tipo de Evento *</Label>
                <Select value={eventoAtual.tipo} onValueChange={(value) => setEventoAtual({ ...eventoAtual, tipo: value as Evento["tipo"] })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="reuniao">Reunião</SelectItem>
                    <SelectItem value="evento">Evento</SelectItem>
                    <SelectItem value="aula">Aula</SelectItem>
                    <SelectItem value="avaliacao">Avaliação</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="turma">Turma</Label>
                  <Input
                    id="turma"
                    value={eventoAtual.turma || ""}
                    onChange={(e) => setEventoAtual({ ...eventoAtual, turma: e.target.value })}
                    placeholder="Ex: Berçário I - Turma A"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="local">Local</Label>
                  <Input
                    id="local"
                    value={eventoAtual.local || ""}
                    onChange={(e) => setEventoAtual({ ...eventoAtual, local: e.target.value })}
                    placeholder="Ex: Sala de Reuniões"
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={eventoAtual.descricao || ""}
                  onChange={(e) => setEventoAtual({ ...eventoAtual, descricao: e.target.value })}
                  placeholder="Descreva os detalhes do evento..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={modoEdicao ? handleEditarEvento : handleCriarEvento}>
                {modoEdicao ? "Atualizar" : "Criar"} Evento
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {eventosOrdenados.map((evento) => {
          const badge = getTipoBadge(evento.tipo);
          return (
            <Card key={evento.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{evento.titulo}</CardTitle>
                      <Badge variant={badge.variant}>{badge.label}</Badge>
                    </div>
                    <CardDescription className="flex flex-wrap items-center gap-4 mt-2">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(evento.data).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {evento.hora}
                      </span>
                      {evento.turma && (
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {evento.turma}
                        </span>
                      )}
                      {evento.local && (
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {evento.local}
                        </span>
                      )}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => abrirDialogEditar(evento)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setEventoParaExcluir(evento.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              {evento.descricao && (
                <CardContent>
                  <p className="text-sm text-muted-foreground">{evento.descricao}</p>
                </CardContent>
              )}
            </Card>
          );
        })}

        {eventos.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Nenhum evento cadastrado</p>
              <p className="text-sm text-muted-foreground">Clique em "Novo Evento" para começar</p>
            </CardContent>
          </Card>
        )}
      </div>

      <AlertDialog open={!!eventoParaExcluir} onOpenChange={() => setEventoParaExcluir(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => eventoParaExcluir && handleExcluirEvento(eventoParaExcluir)}
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

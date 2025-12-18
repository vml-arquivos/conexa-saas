import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, FileText, Download, Trash2, Upload, FolderOpen, BookOpen, ClipboardList, GraduationCap } from "lucide-react";
import { toast } from "sonner";

interface Documento {
  id: string;
  nome: string;
  tipo: "curriculo" | "planejamento" | "atividade" | "documento";
  turma: string;
  dataUpload: string;
  tamanho: string;
}

export default function BibliotecaSala() {
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("bercario1a");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tipoDocumento, setTipoDocumento] = useState<string>("");
  const [nomeDocumento, setNomeDocumento] = useState<string>("");

  const turmas = [
    { id: "bercario1a", nome: "Berçário I - Turma A", faixa: "0-1 ano" },
    { id: "bercario1b", nome: "Berçário I - Turma B", faixa: "0-1 ano" },
    { id: "bercario2a", nome: "Berçário II - Turma A", faixa: "1-2 anos" },
    { id: "maternal1a", nome: "Maternal I - Turma A", faixa: "2-3 anos" },
    { id: "maternal2a", nome: "Maternal II - Turma A", faixa: "3-4 anos" }
  ];

  const [documentos, setDocumentos] = useState<Documento[]>([
    {
      id: "1",
      nome: "Currículo em Movimento - Educação Infantil 0-3 anos",
      tipo: "curriculo",
      turma: "bercario1a",
      dataUpload: "2025-12-10",
      tamanho: "2.5 MB"
    },
    {
      id: "2",
      nome: "Planejamento Semanal - Exploração Sensorial",
      tipo: "planejamento",
      turma: "bercario1a",
      dataUpload: "2025-12-15",
      tamanho: "850 KB"
    },
    {
      id: "3",
      nome: "Atividade - Caixa Sensorial de Texturas",
      tipo: "atividade",
      turma: "bercario1a",
      dataUpload: "2025-12-16",
      tamanho: "1.2 MB"
    },
    {
      id: "4",
      nome: "Relatório de Desenvolvimento - Dezembro 2025",
      tipo: "documento",
      turma: "bercario1a",
      dataUpload: "2025-12-17",
      tamanho: "3.1 MB"
    }
  ]);

  const documentosFiltrados = documentos.filter(doc => doc.turma === turmaSelecionada);

  const turmaAtual = turmas.find(t => t.id === turmaSelecionada);

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "curriculo": return <GraduationCap className="h-4 w-4" />;
      case "planejamento": return <ClipboardList className="h-4 w-4" />;
      case "atividade": return <BookOpen className="h-4 w-4" />;
      case "documento": return <FileText className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    switch (tipo) {
      case "curriculo": return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
      case "planejamento": return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
      case "atividade": return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      case "documento": return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200";
      default: return "";
    }
  };

  const getTipoLabel = (tipo: string) => {
    switch (tipo) {
      case "curriculo": return "Currículo";
      case "planejamento": return "Planejamento";
      case "atividade": return "Atividade";
      case "documento": return "Documento";
      default: return tipo;
    }
  };

  const handleAdicionarDocumento = () => {
    if (!nomeDocumento || !tipoDocumento) {
      toast.error("Preencha todos os campos");
      return;
    }

    const novoDoc: Documento = {
      id: Date.now().toString(),
      nome: nomeDocumento,
      tipo: tipoDocumento as any,
      turma: turmaSelecionada,
      dataUpload: new Date().toISOString().split('T')[0],
      tamanho: "1.5 MB"
    };

    setDocumentos([...documentos, novoDoc]);
    setDialogOpen(false);
    setNomeDocumento("");
    setTipoDocumento("");
    toast.success("Documento adicionado com sucesso!");
  };

  const handleRemoverDocumento = (id: string) => {
    setDocumentos(documentos.filter(doc => doc.id !== id));
    toast.success("Documento removido");
  };

  const contarPorTipo = (tipo: string) => {
    return documentosFiltrados.filter(doc => doc.tipo === tipo).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Biblioteca da Sala</h1>
          <p className="text-muted-foreground">
            Organize currículos, planejamentos e documentos por turma
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Adicionar Arquivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Documento</DialogTitle>
              <DialogDescription>
                Adicione currículos, planejamentos ou documentos para {turmaAtual?.nome}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Tipo de Documento</Label>
                <Select value={tipoDocumento} onValueChange={setTipoDocumento}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="curriculo">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        Currículo em Movimento
                      </div>
                    </SelectItem>
                    <SelectItem value="planejamento">
                      <div className="flex items-center gap-2">
                        <ClipboardList className="h-4 w-4" />
                        Planejamento
                      </div>
                    </SelectItem>
                    <SelectItem value="atividade">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        Atividade
                      </div>
                    </SelectItem>
                    <SelectItem value="documento">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Documento Geral
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nome do Documento</Label>
                <Input
                  placeholder="Ex: Currículo em Movimento - Berçário"
                  value={nomeDocumento}
                  onChange={(e) => setNomeDocumento(e.target.value)}
                />
              </div>

              <div className="border-2 border-dashed rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-2">
                  Arraste o arquivo ou clique para selecionar
                </p>
                <Button variant="outline" size="sm">
                  Selecionar Arquivo
                </Button>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancelar
              </Button>
              <Button onClick={handleAdicionarDocumento}>
                Adicionar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Seleção de Turma */}
      <Card>
        <CardHeader>
          <CardTitle>Selecione a Turma</CardTitle>
          <CardDescription>
            Visualize e gerencie os documentos de cada turma
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {turmas.map((turma) => (
                <SelectItem key={turma.id} value={turma.id}>
                  {turma.nome} - {turma.faixa}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-purple-600" />
              Currículos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarPorTipo("curriculo")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <ClipboardList className="h-4 w-4 text-blue-600" />
              Planejamentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarPorTipo("planejamento")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-green-600" />
              Atividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarPorTipo("atividade")}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              Documentos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{contarPorTipo("documento")}</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle>Documentos de {turmaAtual?.nome}</CardTitle>
          <CardDescription>
            {documentosFiltrados.length} {documentosFiltrados.length === 1 ? "documento" : "documentos"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documentosFiltrados.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">Biblioteca vazia</h3>
              <p className="text-muted-foreground mb-4">
                Adicione currículos, planejamentos e documentos para esta turma
              </p>
              <Button onClick={() => setDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Adicionar Arquivo
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {documentosFiltrados.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      {getTipoIcon(doc.tipo)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{doc.nome}</h4>
                        <Badge className={getTipoBadgeColor(doc.tipo)}>
                          {getTipoLabel(doc.tipo)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {doc.tamanho} • Adicionado em {new Date(doc.dataUpload).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon">
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoverDocumento(doc.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

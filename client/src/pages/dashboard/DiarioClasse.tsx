import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Calendar, Users, CheckCircle2, XCircle, Save } from "lucide-react";
import { toast } from "sonner";

interface Aluno {
  id: string;
  nome: string;
  presente: boolean;
}

interface RegistroAula {
  id: string;
  data: string;
  turma: string;
  disciplina: string;
  conteudo: string;
  observacoes?: string;
  frequencia: Aluno[];
}

export default function DiarioClasse() {
  const [turmasSelecionada, setTurmaSelecionada] = useState<string>("");
  const [disciplinaSelecionada, setDisciplinaSelecionada] = useState<string>("");
  const [dataAula, setDataAula] = useState<string>(new Date().toISOString().split('T')[0]);
  const [conteudoAula, setConteudoAula] = useState<string>("");
  const [observacoes, setObservacoes] = useState<string>("");
  
  const [alunos, setAlunos] = useState<Aluno[]>([
    { id: "1", nome: "Ana Silva", presente: true },
    { id: "2", nome: "Bruno Santos", presente: true },
    { id: "3", nome: "Carlos Eduardo", presente: false },
    { id: "4", nome: "Diana Costa", presente: true },
    { id: "5", nome: "Eduardo Lima", presente: true },
    { id: "6", nome: "Fernanda Oliveira", presente: true },
    { id: "7", nome: "Gabriel Souza", presente: false },
    { id: "8", nome: "Helena Martins", presente: true }
  ]);

  const [registros, setRegistros] = useState<RegistroAula[]>([
    {
      id: "1",
      data: "2025-12-16",
      turma: "5º Ano A",
      disciplina: "Matemática",
      conteudo: "Frações e números decimais - Exercícios práticos",
      observacoes: "Turma participativa, boa compreensão do conteúdo",
      frequencia: [
        { id: "1", nome: "Ana Silva", presente: true },
        { id: "2", nome: "Bruno Santos", presente: true },
        { id: "3", nome: "Carlos Eduardo", presente: false }
      ]
    }
  ]);

  const turmas = ["5º Ano A", "5º Ano B", "4º Ano A", "4º Ano B", "3º Ano A"];
  const disciplinas = ["Matemática", "Português", "História", "Geografia", "Ciências", "Artes", "Educação Física"];

  const togglePresenca = (alunoId: string) => {
    setAlunos(alunos.map(aluno => 
      aluno.id === alunoId ? { ...aluno, presente: !aluno.presente } : aluno
    ));
  };

  const marcarTodosPresentes = () => {
    setAlunos(alunos.map(aluno => ({ ...aluno, presente: true })));
  };

  const marcarTodosFaltantes = () => {
    setAlunos(alunos.map(aluno => ({ ...aluno, presente: false })));
  };

  const handleSalvarRegistro = () => {
    if (!turmasSelecionada || !disciplinaSelecionada || !dataAula || !conteudoAula) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    const novoRegistro: RegistroAula = {
      id: Date.now().toString(),
      data: dataAula,
      turma: turmasSelecionada,
      disciplina: disciplinaSelecionada,
      conteudo: conteudoAula,
      observacoes: observacoes,
      frequencia: [...alunos]
    };

    setRegistros([novoRegistro, ...registros]);
    toast.success("Registro de aula salvo com sucesso!");
    
    // Limpar formulário
    setConteudoAula("");
    setObservacoes("");
  };

  const presentes = alunos.filter(a => a.presente).length;
  const ausentes = alunos.length - presentes;
  const percentualPresenca = alunos.length > 0 ? ((presentes / alunos.length) * 100).toFixed(0) : 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Diário de Classe</h1>
          <p className="text-muted-foreground mt-2">Registre aulas e controle a frequência dos alunos</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Novo Registro de Aula
            </CardTitle>
            <CardDescription>Preencha os dados da aula ministrada</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="data">Data da Aula</Label>
                <Input
                  id="data"
                  type="date"
                  value={dataAula}
                  onChange={(e) => setDataAula(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma">Turma</Label>
                <Select value={turmasSelecionada} onValueChange={setTurmaSelecionada}>
                  <SelectTrigger id="turma">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map((turma) => (
                      <SelectItem key={turma} value={turma}>{turma}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="disciplina">Disciplina</Label>
                <Select value={disciplinaSelecionada} onValueChange={setDisciplinaSelecionada}>
                  <SelectTrigger id="disciplina">
                    <SelectValue placeholder="Selecione" />
                  </SelectTrigger>
                  <SelectContent>
                    {disciplinas.map((disciplina) => (
                      <SelectItem key={disciplina} value={disciplina}>{disciplina}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="conteudo">Conteúdo Ministrado</Label>
              <Textarea
                id="conteudo"
                value={conteudoAula}
                onChange={(e) => setConteudoAula(e.target.value)}
                placeholder="Descreva o conteúdo abordado na aula..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações (opcional)</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações sobre a aula, comportamento da turma, etc..."
                rows={2}
              />
            </div>

            <Button onClick={handleSalvarRegistro} className="w-full gap-2">
              <Save className="h-4 w-4" />
              Salvar Registro
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Frequência
            </CardTitle>
            <CardDescription>
              {presentes} presentes • {ausentes} ausentes ({percentualPresenca}%)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={marcarTodosPresentes} variant="outline" size="sm" className="flex-1 gap-1">
                <CheckCircle2 className="h-3 w-3" />
                Todos
              </Button>
              <Button onClick={marcarTodosFaltantes} variant="outline" size="sm" className="flex-1 gap-1">
                <XCircle className="h-3 w-3" />
                Nenhum
              </Button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {alunos.map((aluno) => (
                <div key={aluno.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-secondary/50 transition-colors">
                  <Label htmlFor={`aluno-${aluno.id}`} className="flex-1 cursor-pointer">
                    {aluno.nome}
                  </Label>
                  <Checkbox
                    id={`aluno-${aluno.id}`}
                    checked={aluno.presente}
                    onCheckedChange={() => togglePresenca(aluno.id)}
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Registros Anteriores
          </CardTitle>
          <CardDescription>Histórico de aulas registradas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {registros.map((registro) => {
              const dataFormatada = new Date(registro.data).toLocaleDateString('pt-BR');
              const presentes = registro.frequencia.filter(a => a.presente).length;
              const total = registro.frequencia.length;
              const percentual = total > 0 ? ((presentes / total) * 100).toFixed(0) : 0;

              return (
                <div key={registro.id} className="p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{registro.turma}</Badge>
                        <Badge variant="secondary">{registro.disciplina}</Badge>
                        <span className="text-sm text-muted-foreground">{dataFormatada}</span>
                      </div>
                      <p className="text-sm font-medium">{registro.conteudo}</p>
                      {registro.observacoes && (
                        <p className="text-sm text-muted-foreground mt-1">{registro.observacoes}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{percentual}%</p>
                      <p className="text-xs text-muted-foreground">{presentes}/{total}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

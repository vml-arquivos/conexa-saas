import { useState } from "react";
import { useParams, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Edit, FileText, Heart, Clock, Baby, User, Phone, Mail, MapPin, Calendar, Download } from "lucide-react";

export default function AlunoDetalhes() {
  const params = useParams();
  const alunoId = params.id;

  // Dados de exemplo - em produção viriam de uma API
  const aluno = {
    id: alunoId,
    nome: "Miguel Santos",
    dataNascimento: "2023-03-15",
    idade: "1 ano e 8 meses",
    sexo: "Masculino",
    turma: "Berçário I - Turma A",
    foto: "https://api.dicebear.com/7.x/avataaars/svg?seed=Miguel",
    status: "Ativo",
    
    // Responsável
    responsavel: {
      nome: "Maria Santos",
      cpf: "123.456.789-00",
      telefone: "(61) 98765-4321",
      email: "maria.santos@email.com",
      endereco: "Quadra 307, Conjunto 11, Lote 05 - Recanto das Emas - DF",
      cep: "72610-311"
    },
    
    // Saúde
    saude: {
      alergias: "Leite de vaca",
      restricoesAlimentares: "Lactose",
      medicamentos: "Leite sem lactose",
      observacoes: "Alergia diagnosticada aos 6 meses. Usar leite especial."
    },
    
    // Rotina
    rotina: {
      horarioSono: "9h às 10h30 e 14h às 15h30",
      alimentacao: "Mamadeira a cada 3 horas, papinha no almoço",
      usaFralda: "Sim",
      observacoes: "Prefere dormir com naninha azul"
    },
    
    // Documentos
    documentos: [
      { id: 1, nome: "Certidão de Nascimento", tipo: "PDF", data: "15/01/2024", tamanho: "245 KB" },
      { id: 2, nome: "Carteira de Vacinação", tipo: "PDF", data: "10/02/2024", tamanho: "1.2 MB" },
      { id: 3, nome: "Foto 3x4", tipo: "JPG", data: "05/03/2024", tamanho: "156 KB" },
      { id: 4, nome: "Comprovante de Residência", tipo: "PDF", data: "20/01/2024", tamanho: "389 KB" }
    ],
    
    // Histórico
    historico: [
      { id: 1, data: "10/12/2025", tipo: "Atividade", descricao: "Participou da atividade de pintura com tinta guache" },
      { id: 2, data: "05/12/2025", tipo: "Saúde", descricao: "Administrado medicamento para alergia" },
      { id: 3, data: "01/12/2025", tipo: "Desenvolvimento", descricao: "Começou a dar os primeiros passos sozinho" },
      { id: 4, data: "25/11/2025", tipo: "Comunicação", descricao: "Reunião com responsável - desenvolvimento satisfatório" }
    ]
  };

  const calcularIdade = (dataNasc: string) => {
    const hoje = new Date();
    const nascimento = new Date(dataNasc);
    const meses = (hoje.getFullYear() - nascimento.getFullYear()) * 12 + (hoje.getMonth() - nascimento.getMonth());
    const anos = Math.floor(meses / 12);
    const mesesRestantes = meses % 12;
    
    if (anos === 0) {
      return `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
    } else if (mesesRestantes === 0) {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
    } else {
      return `${anos} ${anos === 1 ? 'ano' : 'anos'} e ${mesesRestantes} ${mesesRestantes === 1 ? 'mês' : 'meses'}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/alunos">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">Detalhes do Aluno</h1>
            <p className="text-muted-foreground">Visualize todas as informações do aluno</p>
          </div>
        </div>
        <Link href={`/dashboard/alunos/${alunoId}/editar`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Editar Aluno
          </Button>
        </Link>
      </div>

      {/* Informações Principais */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-start gap-6">
            <img
              src={aluno.foto}
              alt={aluno.nome}
              className="w-32 h-32 rounded-full border-4 border-primary/20"
            />
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-2xl font-bold">{aluno.nome}</h2>
                  <Badge variant={aluno.status === "Ativo" ? "default" : "secondary"}>
                    {aluno.status}
                  </Badge>
                </div>
                <p className="text-muted-foreground">{aluno.turma}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Data de Nascimento</p>
                    <p className="font-medium">{new Date(aluno.dataNascimento).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Baby className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Idade</p>
                    <p className="font-medium">{calcularIdade(aluno.dataNascimento)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Sexo</p>
                    <p className="font-medium">{aluno.sexo}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs com Informações Detalhadas */}
      <Tabs defaultValue="responsavel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="responsavel">Responsável</TabsTrigger>
          <TabsTrigger value="saude">Saúde</TabsTrigger>
          <TabsTrigger value="rotina">Rotina</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="historico">Histórico</TabsTrigger>
        </TabsList>

        {/* Responsável */}
        <TabsContent value="responsavel">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Responsável</CardTitle>
              <CardDescription>Dados de contato e endereço</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Nome Completo</p>
                    <p className="font-medium">{aluno.responsavel.nome}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">CPF</p>
                    <p className="font-medium">{aluno.responsavel.cpf}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">Telefone</p>
                    <p className="font-medium">{aluno.responsavel.telefone}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm text-muted-foreground">E-mail</p>
                    <p className="font-medium">{aluno.responsavel.email}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Endereço</p>
                  <p className="font-medium">{aluno.responsavel.endereco}</p>
                  <p className="text-sm text-muted-foreground mt-1">CEP: {aluno.responsavel.cep}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Saúde */}
        <TabsContent value="saude">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5" />
                Informações de Saúde
              </CardTitle>
              <CardDescription>Alergias, restrições e medicamentos</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Alergias</p>
                <Badge variant="destructive">{aluno.saude.alergias}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Restrições Alimentares</p>
                <p className="font-medium">{aluno.saude.restricoesAlimentares}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Medicamentos</p>
                <p className="font-medium">{aluno.saude.medicamentos}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Observações</p>
                <p className="font-medium">{aluno.saude.observacoes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Rotina */}
        <TabsContent value="rotina">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Rotina Diária
              </CardTitle>
              <CardDescription>Horários e hábitos do aluno</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Horário de Sono</p>
                <p className="font-medium">{aluno.rotina.horarioSono}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Alimentação</p>
                <p className="font-medium">{aluno.rotina.alimentacao}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Usa Fralda</p>
                <Badge variant={aluno.rotina.usaFralda === "Sim" ? "default" : "secondary"}>
                  {aluno.rotina.usaFralda}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Observações</p>
                <p className="font-medium">{aluno.rotina.observacoes}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Documentos */}
        <TabsContent value="documentos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Documentos
              </CardTitle>
              <CardDescription>Arquivos e documentos do aluno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {aluno.documentos.map((doc) => (
                  <div
                    key={doc.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded bg-primary/10 flex items-center justify-center">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{doc.nome}</p>
                        <p className="text-sm text-muted-foreground">
                          {doc.tipo} • {doc.tamanho} • {doc.data}
                        </p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Histórico */}
        <TabsContent value="historico">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Atividades</CardTitle>
              <CardDescription>Registro de eventos e marcos importantes</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aluno.historico.map((evento) => (
                  <div key={evento.id} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-primary" />
                      {evento.id !== aluno.historico.length && (
                        <div className="w-0.5 h-full bg-border mt-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">{evento.tipo}</Badge>
                        <span className="text-sm text-muted-foreground">{evento.data}</span>
                      </div>
                      <p className="text-sm">{evento.descricao}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

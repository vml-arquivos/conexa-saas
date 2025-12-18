import { useState } from "react";
import { useParams, useLocation, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { toast } from "sonner";

export default function AlunoEditar() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const alunoId = params.id;

  // Dados iniciais do aluno (em produção viriam de uma API)
  const [formData, setFormData] = useState({
    // Dados Pessoais
    nome: "Miguel Santos",
    dataNascimento: "2023-03-15",
    sexo: "Masculino",
    turma: "bercario-1-a",
    
    // Responsável
    nomeResponsavel: "Maria Santos",
    cpfResponsavel: "123.456.789-00",
    telefoneResponsavel: "(61) 98765-4321",
    emailResponsavel: "maria.santos@email.com",
    enderecoResponsavel: "Quadra 307, Conjunto 11, Lote 05 - Recanto das Emas - DF",
    cepResponsavel: "72610-311",
    
    // Saúde
    alergias: "Leite de vaca",
    restricoesAlimentares: "Lactose",
    medicamentos: "Leite sem lactose",
    observacoesSaude: "Alergia diagnosticada aos 6 meses. Usar leite especial.",
    
    // Rotina
    horarioSono: "9h às 10h30 e 14h às 15h30",
    alimentacao: "Mamadeira a cada 3 horas, papinha no almoço",
    usaFralda: "sim",
    observacoesRotina: "Prefere dormir com naninha azul"
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Aqui você enviaria os dados para a API
    console.log("Dados atualizados:", formData);
    
    toast.success("Aluno atualizado com sucesso!");
    setLocation(`/dashboard/alunos/${alunoId}`);
  };

  const handleCancel = () => {
    setLocation(`/dashboard/alunos/${alunoId}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href={`/dashboard/alunos/${alunoId}`}>
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Aluno</h1>
          <p className="text-muted-foreground">Atualize as informações do aluno</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Dados Pessoais */}
        <Card>
          <CardHeader>
            <CardTitle>Dados Pessoais</CardTitle>
            <CardDescription>Informações básicas do aluno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleChange("nome", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  value={formData.dataNascimento}
                  onChange={(e) => handleChange("dataNascimento", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <Select value={formData.sexo} onValueChange={(value) => handleChange("sexo", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Masculino">Masculino</SelectItem>
                    <SelectItem value="Feminino">Feminino</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma">Turma *</Label>
                <Select value={formData.turma} onValueChange={(value) => handleChange("turma", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bercario-1-a">Berçário I - Turma A</SelectItem>
                    <SelectItem value="bercario-1-b">Berçário I - Turma B</SelectItem>
                    <SelectItem value="bercario-2-a">Berçário II - Turma A</SelectItem>
                    <SelectItem value="maternal-1-a">Maternal I - Turma A</SelectItem>
                    <SelectItem value="maternal-2-a">Maternal II - Turma A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dados do Responsável */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Responsável</CardTitle>
            <CardDescription>Informações de contato e endereço</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nomeResponsavel">Nome do Responsável *</Label>
                <Input
                  id="nomeResponsavel"
                  value={formData.nomeResponsavel}
                  onChange={(e) => handleChange("nomeResponsavel", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpfResponsavel">CPF *</Label>
                <Input
                  id="cpfResponsavel"
                  value={formData.cpfResponsavel}
                  onChange={(e) => handleChange("cpfResponsavel", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefoneResponsavel">Telefone *</Label>
                <Input
                  id="telefoneResponsavel"
                  value={formData.telefoneResponsavel}
                  onChange={(e) => handleChange("telefoneResponsavel", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailResponsavel">E-mail *</Label>
                <Input
                  id="emailResponsavel"
                  type="email"
                  value={formData.emailResponsavel}
                  onChange={(e) => handleChange("emailResponsavel", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="enderecoResponsavel">Endereço Completo *</Label>
                <Input
                  id="enderecoResponsavel"
                  value={formData.enderecoResponsavel}
                  onChange={(e) => handleChange("enderecoResponsavel", e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cepResponsavel">CEP *</Label>
                <Input
                  id="cepResponsavel"
                  value={formData.cepResponsavel}
                  onChange={(e) => handleChange("cepResponsavel", e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Informações de Saúde */}
        <Card>
          <CardHeader>
            <CardTitle>Informações de Saúde</CardTitle>
            <CardDescription>Alergias, restrições e medicamentos</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="alergias">Alergias</Label>
                <Input
                  id="alergias"
                  value={formData.alergias}
                  onChange={(e) => handleChange("alergias", e.target.value)}
                  placeholder="Ex: Leite, Ovo, Amendoim"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="restricoesAlimentares">Restrições Alimentares</Label>
                <Input
                  id="restricoesAlimentares"
                  value={formData.restricoesAlimentares}
                  onChange={(e) => handleChange("restricoesAlimentares", e.target.value)}
                  placeholder="Ex: Lactose, Glúten"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medicamentos">Medicamentos</Label>
                <Input
                  id="medicamentos"
                  value={formData.medicamentos}
                  onChange={(e) => handleChange("medicamentos", e.target.value)}
                  placeholder="Medicamentos de uso contínuo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoesSaude">Observações de Saúde</Label>
              <Textarea
                id="observacoesSaude"
                value={formData.observacoesSaude}
                onChange={(e) => handleChange("observacoesSaude", e.target.value)}
                placeholder="Informações adicionais sobre a saúde do aluno"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rotina do Aluno */}
        <Card>
          <CardHeader>
            <CardTitle>Rotina do Aluno</CardTitle>
            <CardDescription>Horários e hábitos diários</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="horarioSono">Horário de Sono</Label>
                <Input
                  id="horarioSono"
                  value={formData.horarioSono}
                  onChange={(e) => handleChange("horarioSono", e.target.value)}
                  placeholder="Ex: 9h às 10h30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="usaFralda">Usa Fralda *</Label>
                <Select value={formData.usaFralda} onValueChange={(value) => handleChange("usaFralda", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sim">Sim</SelectItem>
                    <SelectItem value="nao">Não</SelectItem>
                    <SelectItem value="processo">Em processo de desfralde</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="alimentacao">Alimentação</Label>
              <Textarea
                id="alimentacao"
                value={formData.alimentacao}
                onChange={(e) => handleChange("alimentacao", e.target.value)}
                placeholder="Descreva a rotina alimentar do aluno"
                rows={2}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="observacoesRotina">Observações da Rotina</Label>
              <Textarea
                id="observacoesRotina"
                value={formData.observacoesRotina}
                onChange={(e) => handleChange("observacoesRotina", e.target.value)}
                placeholder="Informações adicionais sobre a rotina"
                rows={2}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Faça upload de documentos do aluno</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed rounded-lg p-8 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-sm text-muted-foreground mb-2">
                Arraste arquivos aqui ou clique para selecionar
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, JPG, PNG até 5MB
              </p>
              <Input
                type="file"
                className="hidden"
                id="file-upload"
                multiple
                accept=".pdf,.jpg,.jpeg,.png"
              />
              <label htmlFor="file-upload">
                <Button variant="outline" className="mt-4" type="button" asChild>
                  <span>Selecionar Arquivos</span>
                </Button>
              </label>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Salvar Alterações
          </Button>
        </div>
      </form>
    </div>
  );
}

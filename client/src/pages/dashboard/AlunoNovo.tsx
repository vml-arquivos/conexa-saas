import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Save, Upload } from "lucide-react";
import { Link } from "wouter";
import { toast } from "sonner";

export default function AlunoNovo() {

  const [formData, setFormData] = useState({
    // Dados Pessoais
    nomeCompleto: "",
    dataNascimento: "",
    sexo: "",
    turma: "",
    
    // Responsável
    nomeResponsavel: "",
    cpfResponsavel: "",
    telefoneResponsavel: "",
    emailResponsavel: "",
    enderecoResponsavel: "",
    
    // Saúde
    alergias: "",
    restricoesAlimentares: "",
    medicamentos: "",
    observacoesSaude: "",
    
    // Rotina
    horarioSono: "",
    tipoAlimentacao: "",
    usaFralda: "sim",
    observacoesRotina: "",
    
    // Documentos
    certidaoNascimento: null as File | null,
    carteiraVacinacao: null as File | null,
    fotoAluno: null as File | null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "Aluno cadastrado com sucesso!",
      description: `${formData.nomeCompleto} foi adicionado ao sistema.`,
    });
    
    // Aqui você faria a chamada para a API
    console.log("Dados do formulário:", formData);
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/alunos">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Novo Aluno</h1>
          <p className="text-muted-foreground mt-2">
            Cadastre um novo aluno do berçário ou maternal
          </p>
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
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomeCompleto">Nome Completo *</Label>
                <Input
                  id="nomeCompleto"
                  required
                  value={formData.nomeCompleto}
                  onChange={(e) => setFormData({...formData, nomeCompleto: e.target.value})}
                  placeholder="Nome completo do aluno"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                <Input
                  id="dataNascimento"
                  type="date"
                  required
                  value={formData.dataNascimento}
                  onChange={(e) => setFormData({...formData, dataNascimento: e.target.value})}
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="sexo">Sexo *</Label>
                <select
                  id="sexo"
                  required
                  value={formData.sexo}
                  onChange={(e) => setFormData({...formData, sexo: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="masculino">Masculino</option>
                  <option value="feminino">Feminino</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="turma">Turma *</Label>
                <select
                  id="turma"
                  required
                  value={formData.turma}
                  onChange={(e) => setFormData({...formData, turma: e.target.value})}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">Selecione...</option>
                  <option value="bercario1">Berçário I (0-1 ano)</option>
                  <option value="bercario2">Berçário II (1-2 anos)</option>
                  <option value="maternal1">Maternal I (2-3 anos)</option>
                  <option value="maternal2">Maternal II (3-4 anos)</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Responsável */}
        <Card>
          <CardHeader>
            <CardTitle>Dados do Responsável</CardTitle>
            <CardDescription>Informações do responsável legal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="nomeResponsavel">Nome Completo *</Label>
                <Input
                  id="nomeResponsavel"
                  required
                  value={formData.nomeResponsavel}
                  onChange={(e) => setFormData({...formData, nomeResponsavel: e.target.value})}
                  placeholder="Nome do responsável"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cpfResponsavel">CPF *</Label>
                <Input
                  id="cpfResponsavel"
                  required
                  value={formData.cpfResponsavel}
                  onChange={(e) => setFormData({...formData, cpfResponsavel: e.target.value})}
                  placeholder="000.000.000-00"
                />
              </div>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="telefoneResponsavel">Telefone *</Label>
                <Input
                  id="telefoneResponsavel"
                  required
                  value={formData.telefoneResponsavel}
                  onChange={(e) => setFormData({...formData, telefoneResponsavel: e.target.value})}
                  placeholder="(11) 98765-4321"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emailResponsavel">E-mail</Label>
                <Input
                  id="emailResponsavel"
                  type="email"
                  value={formData.emailResponsavel}
                  onChange={(e) => setFormData({...formData, emailResponsavel: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="enderecoResponsavel">Endereço Completo *</Label>
              <Input
                id="enderecoResponsavel"
                required
                value={formData.enderecoResponsavel}
                onChange={(e) => setFormData({...formData, enderecoResponsavel: e.target.value})}
                placeholder="Rua, número, bairro, cidade - UF, CEP"
              />
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
            <div className="space-y-2">
              <Label htmlFor="alergias">Alergias</Label>
              <Input
                id="alergias"
                value={formData.alergias}
                onChange={(e) => setFormData({...formData, alergias: e.target.value})}
                placeholder="Ex: Lactose, Amendoim, Ovo"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="restricoesAlimentares">Restrições Alimentares</Label>
              <Input
                id="restricoesAlimentares"
                value={formData.restricoesAlimentares}
                onChange={(e) => setFormData({...formData, restricoesAlimentares: e.target.value})}
                placeholder="Ex: Leite de vaca, Glúten"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="medicamentos">Medicamentos de Uso Contínuo</Label>
              <Input
                id="medicamentos"
                value={formData.medicamentos}
                onChange={(e) => setFormData({...formData, medicamentos: e.target.value})}
                placeholder="Ex: Antialérgico, Vitamina D"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoesSaude">Observações de Saúde</Label>
              <Textarea
                id="observacoesSaude"
                value={formData.observacoesSaude}
                onChange={(e) => setFormData({...formData, observacoesSaude: e.target.value})}
                placeholder="Outras informações relevantes sobre a saúde do aluno"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Rotina */}
        <Card>
          <CardHeader>
            <CardTitle>Rotina do Aluno</CardTitle>
            <CardDescription>Informações sobre sono, alimentação e higiene</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="horarioSono">Horário de Sono</Label>
                <Input
                  id="horarioSono"
                  value={formData.horarioSono}
                  onChange={(e) => setFormData({...formData, horarioSono: e.target.value})}
                  placeholder="Ex: 10:00 e 14:30"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipoAlimentacao">Tipo de Alimentação</Label>
                <Input
                  id="tipoAlimentacao"
                  value={formData.tipoAlimentacao}
                  onChange={(e) => setFormData({...formData, tipoAlimentacao: e.target.value})}
                  placeholder="Ex: Leite materno, Papinha, Comida normal"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="usaFralda">Usa Fralda?</Label>
              <select
                id="usaFralda"
                value={formData.usaFralda}
                onChange={(e) => setFormData({...formData, usaFralda: e.target.value})}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="sim">Sim</option>
                <option value="nao">Não</option>
                <option value="processo">Em processo de desfralde</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="observacoesRotina">Observações sobre a Rotina</Label>
              <Textarea
                id="observacoesRotina"
                value={formData.observacoesRotina}
                onChange={(e) => setFormData({...formData, observacoesRotina: e.target.value})}
                placeholder="Informações adicionais sobre hábitos e rotina"
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upload de Documentos */}
        <Card>
          <CardHeader>
            <CardTitle>Documentos</CardTitle>
            <CardDescription>Faça upload dos documentos necessários</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="certidaoNascimento">Certidão de Nascimento</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="certidaoNascimento"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('certidaoNascimento', e.target.files?.[0] || null)}
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="carteiraVacinacao">Carteira de Vacinação</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="carteiraVacinacao"
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('carteiraVacinacao', e.target.files?.[0] || null)}
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fotoAluno">Foto do Aluno</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="fotoAluno"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={(e) => handleFileChange('fotoAluno', e.target.files?.[0] || null)}
                />
                <Upload className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-4 justify-end">
          <Link href="/dashboard/alunos">
            <Button type="button" variant="outline">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Aluno
          </Button>
        </div>
      </form>
    </div>
  );
}

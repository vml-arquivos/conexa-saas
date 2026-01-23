import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, FileText, Download, Eye, Baby, Heart, Brain, Palette } from "lucide-react";

interface Template {
  id: string;
  titulo: string;
  faixaEtaria: string;
  categoria: string;
  descricao: string;
  campos: string[];
  cor: string;
  icone: any;
}

export const templatesEducacaoInfantil: Template[] = [
  {
    id: "1",
    titulo: "Planejamento Semanal - Berçário I",
    faixaEtaria: "0-1 ano",
    categoria: "Rotina e Cuidados",
    descricao: "Template completo para planejamento semanal com foco em rotina, alimentação, sono e estimulação sensorial",
    campos: [
      "Rotina diária (horários de alimentação, sono, higiene)",
      "Atividades de estimulação sensorial",
      "Músicas e cantigas",
      "Observações individuais",
      "Comunicação com pais/responsáveis"
    ],
    cor: "bg-blue-50 border-blue-200",
    icone: Baby
  },
  {
    id: "2",
    titulo: "Planejamento Semanal - Berçário II",
    faixaEtaria: "1-2 anos",
    categoria: "Desenvolvimento Motor",
    descricao: "Template focado em desenvolvimento motor grosso e fino, exploração e descoberta",
    campos: [
      "Rotina diária adaptada",
      "Atividades motoras (engatinhar, andar, subir)",
      "Exploração de texturas e materiais",
      "Brincadeiras e interações sociais",
      "Desenvolvimento da linguagem",
      "Registro fotográfico"
    ],
    cor: "bg-green-50 border-green-200",
    icone: Heart
  },
  {
    id: "3",
    titulo: "Planejamento Semanal - Maternal I",
    faixaEtaria: "2-3 anos",
    categoria: "Desenvolvimento Cognitivo",
    descricao: "Template para atividades lúdicas, socialização e desenvolvimento cognitivo",
    campos: [
      "Tema da semana",
      "Objetivos de aprendizagem",
      "Atividades lúdicas e brincadeiras",
      "Artes e expressão criativa",
      "Contação de histórias",
      "Música e movimento",
      "Desenvolvimento da autonomia",
      "Avaliação e observações"
    ],
    cor: "bg-purple-50 border-purple-200",
    icone: Brain
  },
  {
    id: "4",
    titulo: "Planejamento Semanal - Maternal II",
    faixaEtaria: "3-4 anos",
    categoria: "Preparação Pré-Escolar",
    descricao: "Template com atividades de preparação para a pré-escola, alfabetização inicial e socialização avançada",
    campos: [
      "Tema da semana",
      "Objetivos de aprendizagem (BNCC)",
      "Atividades de alfabetização inicial",
      "Matemática lúdica (cores, formas, números)",
      "Artes e criatividade",
      "Contação de histórias e dramatização",
      "Música, dança e movimento",
      "Jogos e brincadeiras cooperativas",
      "Desenvolvimento socioemocional",
      "Avaliação e portfólio"
    ],
    cor: "bg-pink-50 border-pink-200",
    icone: Palette
  },
  {
    id: "5",
    titulo: "Planejamento Mensal - Berçário",
    faixaEtaria: "0-2 anos",
    categoria: "Rotina e Desenvolvimento",
    descricao: "Template mensal para acompanhamento de desenvolvimento e rotina de bebês",
    campos: [
      "Objetivos mensais de desenvolvimento",
      "Rotina base do mês",
      "Atividades semanais planejadas",
      "Marcos de desenvolvimento esperados",
      "Acompanhamento nutricional",
      "Comunicação com famílias",
      "Registro de evolução individual"
    ],
    cor: "bg-indigo-50 border-indigo-200",
    icone: Baby
  },
  {
    id: "6",
    titulo: "Planejamento Mensal - Maternal",
    faixaEtaria: "2-4 anos",
    categoria: "Projetos Pedagógicos",
    descricao: "Template mensal para projetos pedagógicos temáticos com crianças do maternal",
    campos: [
      "Tema do mês",
      "Justificativa pedagógica",
      "Objetivos gerais e específicos (BNCC)",
      "Campos de experiência trabalhados",
      "Planejamento semanal detalhado",
      "Atividades por área de conhecimento",
      "Recursos necessários",
      "Avaliação do projeto",
      "Culminância e apresentação"
    ],
    cor: "bg-orange-50 border-orange-200",
    icone: Brain
  },
  {
    id: "7",
    titulo: "Relatório Individual - Desenvolvimento",
    faixaEtaria: "0-4 anos",
    categoria: "Avaliação",
    descricao: "Template para relatório individual de desenvolvimento da criança",
    campos: [
      "Dados da criança",
      "Período avaliado",
      "Desenvolvimento motor",
      "Desenvolvimento cognitivo",
      "Desenvolvimento socioemocional",
      "Desenvolvimento da linguagem",
      "Autonomia e cuidados pessoais",
      "Interação social",
      "Observações gerais",
      "Recomendações para família"
    ],
    cor: "bg-teal-50 border-teal-200",
    icone: FileText
  },
  {
    id: "8",
    titulo: "Plano de Adaptação",
    faixaEtaria: "0-4 anos",
    categoria: "Acolhimento",
    descricao: "Template para planejamento do período de adaptação de novos alunos",
    campos: [
      "Dados da criança e família",
      "Rotina familiar",
      "Hábitos e preferências",
      "Cronograma de adaptação",
      "Atividades de acolhimento",
      "Estratégias de vínculo",
      "Comunicação diária com família",
      "Observações e ajustes",
      "Avaliação do processo"
    ],
    cor: "bg-yellow-50 border-yellow-200",
    icone: Heart
  }
];

export default function TemplatesCEFR() {
  const [searchTerm, setSearchTerm] = useState("");
  const [templates] = useState<Template[]>(templatesEducacaoInfantil);

  const filteredTemplates = templates.filter(template =>
    template.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.faixaEtaria.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Templates Pedagógicos</h1>
          <p className="text-muted-foreground mt-2">
            Modelos de planejamento para educação infantil (0-4 anos)
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total de Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{templates.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Berçário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.faixaEtaria.includes("0-") || t.faixaEtaria.includes("1-")).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Maternal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.faixaEtaria.includes("2-") || t.faixaEtaria.includes("3-")).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Geral
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templates.filter(t => t.faixaEtaria.includes("0-4")).length}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar templates por título, faixa etária ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {filteredTemplates.map((template) => {
          const Icon = template.icone;
          
          return (
            <Card key={template.id} className={`transition-all hover:shadow-md ${template.cor}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{template.titulo}</CardTitle>
                      <CardDescription className="text-xs mt-1">
                        {template.faixaEtaria} • {template.categoria}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {template.faixaEtaria}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {template.descricao}
                </p>

                <div className="space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground">
                    Campos do Template:
                  </p>
                  <ul className="space-y-1">
                    {template.campos.slice(0, 4).map((campo, idx) => (
                      <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>
                        <span>{campo}</span>
                      </li>
                    ))}
                    {template.campos.length > 4 && (
                      <li className="text-xs text-muted-foreground italic">
                        + {template.campos.length - 4} campos adicionais
                      </li>
                    )}
                  </ul>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1 gap-2">
                    <Eye className="h-3 w-3" />
                    Visualizar
                  </Button>
                  <Button size="sm" className="flex-1 gap-2">
                    <Download className="h-3 w-3" />
                    Usar Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground">
              Nenhum template encontrado
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Code, Eye, Download, Database, Settings, FileCode, Folder, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function VisualizacaoProjeto() {
  const [tabAtiva, setTabAtiva] = useState("preview");

  const handleDownloadProjeto = () => {
    toast.success("Preparando download do projeto...");
    // Simular download
    setTimeout(() => {
      toast.success("Download iniciado!");
    }, 1000);
  };

  const codigoExemplo = {
    "App.tsx": `import { Route, Switch } from "wouter";
import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/dashboard/Dashboard";
import AgendaDigital from "./pages/dashboard/AgendaDigital";
import AlunosList from "./pages/dashboard/AlunosList";
// ... outros imports

export default function App() {
  return (
    <Switch>
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/dashboard/agenda" component={AgendaDigital} />
      <Route path="/dashboard/alunos" component={AlunosList} />
      {/* ... outras rotas */}
    </Switch>
  );
}`,
    "AgendaDigital.tsx": `import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";

interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  tipo: "reuniao" | "evento" | "aula";
}

export default function AgendaDigital() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  
  const handleCriarEvento = (novoEvento: Evento) => {
    setEventos([...eventos, novoEvento]);
  };
  
  return (
    <div>
      {/* Interface da Agenda */}
    </div>
  );
}`,
    "Turmas.tsx": `import { useState } from "react";

interface Turma {
  id: string;
  nome: string;
  faixaEtaria: string;
  professor: string;
  totalAlunos: number;
}

export default function Turmas() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  
  return (
    <div>
      {/* Interface de Turmas */}
    </div>
  );
}`
  };

  const estruturaProjeto = [
    { nome: "client/", tipo: "pasta", descricao: "Frontend React + Vite" },
    { nome: "├── src/", tipo: "pasta", descricao: "Código-fonte" },
    { nome: "│   ├── components/", tipo: "pasta", descricao: "Componentes reutilizáveis" },
    { nome: "│   ├── pages/", tipo: "pasta", descricao: "Páginas do sistema" },
    { nome: "│   │   └── dashboard/", tipo: "pasta", descricao: "13 páginas do dashboard" },
    { nome: "│   ├── layouts/", tipo: "pasta", descricao: "Layouts (DashboardLayout)" },
    { nome: "│   └── App.tsx", tipo: "arquivo", descricao: "Componente principal" },
    { nome: "server/", tipo: "pasta", descricao: "Backend Express" },
    { nome: "├── src/", tipo: "pasta", descricao: "Código do servidor" },
    { nome: "│   └── index.ts", tipo: "arquivo", descricao: "Servidor Express" },
    { nome: "package.json", tipo: "arquivo", descricao: "Dependências do projeto" },
    { nome: "vite.config.ts", tipo: "arquivo", descricao: "Configuração do Vite" },
    { nome: "tailwind.config.ts", tipo: "arquivo", descricao: "Configuração do TailwindCSS" }
  ];

  const tecnologias = [
    { nome: "React", versao: "19.2.1", tipo: "Frontend Framework" },
    { nome: "Vite", versao: "7.1.9", tipo: "Build Tool" },
    { nome: "TypeScript", versao: "5.6.3", tipo: "Linguagem" },
    { nome: "TailwindCSS", versao: "4.1.14", tipo: "CSS Framework" },
    { nome: "Radix UI", versao: "Latest", tipo: "Componentes UI" },
    { nome: "Wouter", versao: "Latest", tipo: "Roteamento" },
    { nome: "Sonner", versao: "Latest", tipo: "Notificações" },
    { nome: "Express", versao: "4.21.2", tipo: "Backend Server" }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Visualização do Projeto</h1>
          <p className="text-muted-foreground mt-2">Explore o código, estrutura e faça download do projeto completo</p>
        </div>
        <Button onClick={handleDownloadProjeto} className="gap-2">
          <Download className="h-4 w-4" />
          Baixar Projeto Completo
        </Button>
      </div>

      <Tabs value={tabAtiva} onValueChange={setTabAtiva} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="preview" className="gap-2">
            <Eye className="h-4 w-4" />
            Preview ao Vivo
          </TabsTrigger>
          <TabsTrigger value="codigo" className="gap-2">
            <Code className="h-4 w-4" />
            Código-Fonte
          </TabsTrigger>
          <TabsTrigger value="estrutura" className="gap-2">
            <Folder className="h-4 w-4" />
            Estrutura
          </TabsTrigger>
          <TabsTrigger value="tecnologias" className="gap-2">
            <Settings className="h-4 w-4" />
            Tecnologias
          </TabsTrigger>
          <TabsTrigger value="banco" className="gap-2">
            <Database className="h-4 w-4" />
            Banco de Dados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Sistema em Execução
              </CardTitle>
              <CardDescription>Visualize o sistema funcionando em tempo real</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-secondary/30 p-4 rounded-lg border-2 border-dashed border-border">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">URL do Sistema:</span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <ExternalLink className="h-3 w-3" />
                    Abrir em Nova Aba
                  </Button>
                </div>
                <div className="bg-background p-3 rounded border border-border font-mono text-sm">
                  https://3000-iq2w9w5gorniuem5igv6g-f3a46385.manus.computer
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">13</div>
                      <div className="text-sm text-muted-foreground mt-1">Páginas Implementadas</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">8</div>
                      <div className="text-sm text-muted-foreground mt-1">Alunos Cadastrados</div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary">5</div>
                      <div className="text-sm text-muted-foreground mt-1">Turmas Ativas</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold">Funcionalidades Principais:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">✓</Badge>
                    <span className="text-sm">Gestão completa de alunos de 0-4 anos (Berçário e Maternal)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">✓</Badge>
                    <span className="text-sm">Agenda Digital com eventos e atividades</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">✓</Badge>
                    <span className="text-sm">Planejamentos pedagógicos adaptados para educação infantil</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">✓</Badge>
                    <span className="text-sm">Diário de classe com registro de rotina e desenvolvimento</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">✓</Badge>
                    <span className="text-sm">Comunicação com pais e responsáveis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Badge variant="secondary">✓</Badge>
                    <span className="text-sm">Sistema de pedidos de materiais com upload de XML</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="codigo" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileCode className="h-5 w-5" />
                Código-Fonte Principal
              </CardTitle>
              <CardDescription>Explore os principais arquivos do projeto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(codigoExemplo).map(([arquivo, codigo]) => (
                <div key={arquivo} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{arquivo}</h3>
                    <Button variant="outline" size="sm" className="gap-2">
                      <Code className="h-3 w-3" />
                      Ver Completo
                    </Button>
                  </div>
                  <pre className="bg-secondary/50 p-4 rounded-lg border border-border overflow-x-auto">
                    <code className="text-xs font-mono">{codigo}</code>
                  </pre>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="estrutura" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Folder className="h-5 w-5" />
                Estrutura do Projeto
              </CardTitle>
              <CardDescription>Organização de pastas e arquivos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-secondary/30 p-4 rounded-lg border border-border font-mono text-sm space-y-1">
                {estruturaProjeto.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 hover:bg-secondary/50 p-1 rounded">
                    <span className={item.tipo === "pasta" ? "text-blue-500" : "text-green-500"}>
                      {item.tipo === "pasta" ? "📁" : "📄"}
                    </span>
                    <span className="flex-1">{item.nome}</span>
                    <span className="text-xs text-muted-foreground">{item.descricao}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tecnologias" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Stack Tecnológica
              </CardTitle>
              <CardDescription>Tecnologias e bibliotecas utilizadas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                {tecnologias.map((tech, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg border border-border hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Code className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="font-semibold">{tech.nome}</div>
                        <div className="text-xs text-muted-foreground">{tech.tipo}</div>
                      </div>
                    </div>
                    <Badge variant="outline">{tech.versao}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="banco" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Estrutura do Banco de Dados
              </CardTitle>
              <CardDescription>Schema e tabelas do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-4 rounded-lg">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> Este é um sistema de demonstração. Os dados são armazenados em memória (useState) e não persistem após recarregar a página.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold">Estruturas de Dados (Interfaces TypeScript):</h3>
                
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Alunos</h4>
                  <pre className="bg-secondary/50 p-3 rounded-lg border border-border text-xs font-mono overflow-x-auto">
{`interface Aluno {
  id: string;
  nome: string;
  dataNascimento: string;
  idade: string;
  turma: string;
  responsavel: string;
  telefone: string;
  alergias?: string;
  medicamentos?: string;
  usaFralda: boolean;
}`}</pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Turmas</h4>
                  <pre className="bg-secondary/50 p-3 rounded-lg border border-border text-xs font-mono overflow-x-auto">
{`interface Turma {
  id: string;
  nome: string;
  faixaEtaria: string;
  professor: string;
  totalAlunos: number;
  capacidadeMaxima: number;
  sala: string;
  horario: string;
}`}</pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Eventos (Agenda)</h4>
                  <pre className="bg-secondary/50 p-3 rounded-lg border border-border text-xs font-mono overflow-x-auto">
{`interface Evento {
  id: string;
  titulo: string;
  data: string;
  hora: string;
  tipo: "reuniao" | "evento" | "aula";
  turma?: string;
  local?: string;
  descricao?: string;
}`}</pre>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Planejamentos</h4>
                  <pre className="bg-secondary/50 p-3 rounded-lg border border-border text-xs font-mono overflow-x-auto">
{`interface Planejamento {
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
}`}</pre>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-lg">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  <strong>Para Produção:</strong> Recomenda-se integrar com banco de dados real (PostgreSQL, MySQL ou MongoDB) usando Prisma ORM ou similar.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

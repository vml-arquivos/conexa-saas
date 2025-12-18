import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Login from "./pages/auth/Login";
import Overview from "./pages/dashboard/Overview";
import DashboardLayout from "./layouts/DashboardLayout";
import PlanejamentosList from "./pages/dashboard/PlanejamentosList";
import NovoPlanejamento from "./pages/dashboard/NovoPlanejamento";
import AutomacaoView from "./pages/dashboard/AutomacaoView";
import TarefasList from "./pages/dashboard/TarefasList";
import NovaTarefa from "./pages/dashboard/NovaTarefa";
import CorrecaoTarefa from "./pages/dashboard/CorrecaoTarefa";
import AlunosList from "./pages/dashboard/AlunosList";
import AlunoNovo from "./pages/dashboard/AlunoNovo";
import AlunoDetalhes from "./pages/dashboard/AlunoDetalhes";
import AlunoEditar from "./pages/dashboard/AlunoEditar";
import EstoqueCompleto from "./pages/dashboard/EstoqueCompleto";
import AgendaDigital from "./pages/dashboard/AgendaDigital";
import DiarioClasse from "./pages/dashboard/DiarioClasse";
import AtendimentoPais from "./pages/dashboard/AtendimentoPais";
import PedidosMateriais from "./pages/dashboard/PedidosMateriais";
import BibliotecaSala from "./pages/dashboard/BibliotecaSala";
import TemplatesCEFR from "./pages/dashboard/TemplatesCEFR";
import Turmas from "./pages/dashboard/Turmas";
import Configuracoes from "./pages/dashboard/Configuracoes";
import VisualizacaoProjeto from "./pages/dashboard/VisualizacaoProjeto";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      
      {/* Dashboard Routes */}
      <Route path="/dashboard">
        <DashboardLayout>
          <Overview />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/planejamentos">
        <DashboardLayout>
          <PlanejamentosList />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/planejamentos/novo">
        <DashboardLayout>
          <NovoPlanejamento />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/automacao">
        <DashboardLayout>
          <AutomacaoView />
        </DashboardLayout>
      </Route>
      
      {/* Alunos Routes */}
      <Route path="/dashboard/alunos">
        <DashboardLayout>
          <AlunosList />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/alunos/novo">
        <DashboardLayout>
          <AlunoNovo />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/alunos/:id">
        {(params) => (
          <DashboardLayout>
            <AlunoDetalhes />
          </DashboardLayout>
        )}
      </Route>
      <Route path="/dashboard/alunos/:id/editar">
        {(params) => (
          <DashboardLayout>
            <AlunoEditar />
          </DashboardLayout>
        )}
      </Route>

      {/* Estoque Routes */}
      <Route path="/dashboard/estoque">
        <DashboardLayout>
          <EstoqueCompleto />
        </DashboardLayout>
      </Route>
      
      {/* Novas Páginas Routes */}
      <Route path="/dashboard/agenda">
        <DashboardLayout>
          <AgendaDigital />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/diario">
        <DashboardLayout>
          <DiarioClasse />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/atendimento-pais">
        <DashboardLayout>
          <AtendimentoPais />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/pedidos">
        <DashboardLayout>
          <PedidosMateriais />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/biblioteca">
        <DashboardLayout>
          <BibliotecaSala />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/templates">
        <DashboardLayout>
          <TemplatesCEFR />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/turmas">
        <DashboardLayout>
          <Turmas />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/configuracoes">
        <DashboardLayout>
          <Configuracoes />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/visualizacao">
        <DashboardLayout>
          <VisualizacaoProjeto />
        </DashboardLayout>
      </Route>
      
      {/* Tarefas Routes */}
      <Route path="/dashboard/tarefas">
        <DashboardLayout>
          <TarefasList />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/tarefas/nova">
        <DashboardLayout>
          <NovaTarefa />
        </DashboardLayout>
      </Route>
      <Route path="/dashboard/tarefas/:id/correcao">
        <DashboardLayout>
          <CorrecaoTarefa />
        </DashboardLayout>
      </Route>
      
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        // switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

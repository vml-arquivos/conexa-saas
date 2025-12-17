import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Bell,
  Search,
  Zap,
  Calendar,
  ClipboardList,
  MessageSquare,
  ShoppingCart,
  Library,
  FileText,
  GraduationCap,
  Code
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
    { icon: Calendar, label: "Agenda Digital", href: "/dashboard/agenda" },
    { icon: ClipboardList, label: "Diário de Classe", href: "/dashboard/diario" },
    { icon: MessageSquare, label: "Atendimento Pais", href: "/dashboard/atendimento-pais" },
    { icon: ShoppingCart, label: "Pedidos Materiais", href: "/dashboard/pedidos" },
    { icon: Library, label: "Biblioteca Sena", href: "/dashboard/biblioteca" },
    { icon: FileText, label: "Templates CEFR", href: "/dashboard/templates" },
    { icon: BookOpen, label: "Planejamentos", href: "/dashboard/planejamentos" },
    { icon: Users, label: "Alunos", href: "/dashboard/alunos" },
    { icon: CheckSquare, label: "Tarefas", href: "/dashboard/tarefas" },
    { icon: GraduationCap, label: "Turmas", href: "/dashboard/turmas" },
    { icon: Zap, label: "Automação (Demo)", href: "/dashboard/automacao" },
    { icon: Code, label: "Visualização do Projeto", href: "/dashboard/visualizacao" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
  ];

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside 
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:relative lg:translate-x-0
        `}
      >
        <div className="h-20 flex items-center px-6 border-b border-border">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
            <span className="text-primary-foreground font-bold font-display text-xl">A</span>
          </div>
          <span className="font-display font-bold text-xl tracking-tight text-foreground">CEPI Arara Canindé</span>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100vh-160px)]">
          {menuItems.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.href} href={item.href}>
                <a className={`
                  flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm
                  ${isActive 
                    ? "bg-primary/10 text-primary font-medium shadow-sm" 
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }
                `}>
                  <item.icon className={`w-4 h-4 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  {item.label}
                </a>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-card">
          <Link href="/">
            <a className="flex items-center gap-3 px-4 py-3 text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
              <LogOut className="w-5 h-5" />
              Sair
            </a>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              className="lg:hidden"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <div className="hidden md:flex items-center gap-2 text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-md border border-border/50">
              <Search className="w-4 h-4" />
              <input 
                type="text" 
                placeholder="Buscar..." 
                className="bg-transparent border-none outline-none text-sm w-48 placeholder:text-muted-foreground/70"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full" />
            </Button>
            <div className="flex items-center gap-3 pl-4 border-l border-border">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-foreground">Ana Silva</p>
                <p className="text-xs text-muted-foreground">Coordenadora</p>
              </div>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>AS</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-auto bg-secondary/30">
          <div className="max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

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
  ListChecks, // Novo ícone para Requisições
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { icon: LayoutDashboard, label: "Visão Geral", href: "/dashboard" },
    { icon: Calendar, label: "Agenda Digital", href: "/dashboard/agenda" },
    { icon: ClipboardList, label: "Diário de Classe", href: "/dashboard/diario" },
    { icon: MessageSquare, label: "Atendimento Pais", href: "/dashboard/atendimento-pais" },
    { icon: ShoppingCart, label: "Pedidos Materiais", href: "/dashboard/pedidos" },
    { icon: ClipboardList, label: "Requisições", href: "/dashboard/requisicoes" },
    { icon: Library, label: "Biblioteca da Sala", href: "/dashboard/biblioteca" },
    { icon: FileText, label: "Templates CEFR", href: "/dashboard/templates" },
    { icon: BookOpen, label: "Planejamentos", href: "/dashboard/planejamentos" },
    { icon: Users, label: "Alunos", href: "/dashboard/alunos" },
    { icon: CheckSquare, label: "Tarefas", href: "/dashboard/tarefas" },
    { icon: GraduationCap, label: "Turmas", href: "/dashboard/turmas" },
    { icon: Zap, label: "Automação (Demo)", href: "/dashboard/automacao" },
    { icon: Settings, label: "Configurações", href: "/dashboard/configuracoes" },
  ];

  const handleMenuItemClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Overlay para mobile - só aparece quando menu está aberto */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar - Escondida em mobile, visível em desktop */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen
        w-64 bg-card border-r border-border
        flex flex-col
        transition-transform duration-300 ease-in-out
        z-50
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header do Sidebar */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <Link href="/dashboard">
            <a className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
                A
              </div>
              <span className="font-bold text-lg">CEPI Arara Canindé</span>
            </a>
          </Link>
          {/* Botão X para fechar menu em mobile */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              
              return (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      onClick={handleMenuItemClick}
                      className={`
                        flex items-center gap-3 px-3 py-2 rounded-lg
                        transition-colors
                        ${isActive 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted text-muted-foreground hover:text-foreground'
                        }
                      `}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer do Sidebar */}
        <div className="p-4 border-t border-border">
          <Link href="/">
            <a 
              onClick={handleMenuItemClick}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Sair</span>
            </a>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-card border-b border-border">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4">
              {/* Botão Hambúrguer - só aparece em mobile */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <Menu className="h-6 w-6" />
              </Button>

              {/* Search */}
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 py-2 bg-muted rounded-lg border-0 focus:outline-none focus:ring-2 focus:ring-primary w-64"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Notifications */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full"></span>
              </Button>

              {/* User Profile */}
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium">Ana Silva</p>
                  <p className="text-xs text-muted-foreground">Coordenadora</p>
                </div>
                <Avatar>
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ana" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

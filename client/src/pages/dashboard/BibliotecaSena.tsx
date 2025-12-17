import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { BookOpen, Search, Plus, User, Calendar, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Livro {
  id: string;
  titulo: string;
  autor: string;
  isbn?: string;
  categoria: string;
  quantidade: number;
  disponiveis: number;
  localizacao: string;
}

interface Emprestimo {
  id: string;
  livroId: string;
  livroTitulo: string;
  aluno: string;
  turma: string;
  dataEmprestimo: string;
  dataDevolucao: string;
  status: "ativo" | "atrasado" | "devolvido";
}

export default function BibliotecaSena() {
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogNovoLivro, setDialogNovoLivro] = useState(false);
  const [dialogEmprestimo, setDialogEmprestimo] = useState(false);
  const [livroSelecionado, setLivroSelecionado] = useState<Livro | null>(null);

  const [livros, setLivros] = useState<Livro[]>([
    {
      id: "1",
      titulo: "O Pequeno Príncipe",
      autor: "Antoine de Saint-Exupéry",
      isbn: "978-8535909203",
      categoria: "Infantil",
      quantidade: 15,
      disponiveis: 12,
      localizacao: "Estante A - Prateleira 2"
    },
    {
      id: "2",
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      isbn: "978-8535911664",
      categoria: "Literatura Brasileira",
      quantidade: 10,
      disponiveis: 8,
      localizacao: "Estante B - Prateleira 1"
    },
    {
      id: "3",
      titulo: "Harry Potter e a Pedra Filosofal",
      autor: "J.K. Rowling",
      isbn: "978-8532530787",
      categoria: "Fantasia",
      quantidade: 20,
      disponiveis: 15,
      localizacao: "Estante C - Prateleira 3"
    },
    {
      id: "4",
      titulo: "1984",
      autor: "George Orwell",
      isbn: "978-8535914849",
      categoria: "Ficção Científica",
      quantidade: 8,
      disponiveis: 5,
      localizacao: "Estante D - Prateleira 2"
    }
  ]);

  const [emprestimos, setEmprestimos] = useState<Emprestimo[]>([
    {
      id: "1",
      livroId: "1",
      livroTitulo: "O Pequeno Príncipe",
      aluno: "Ana Silva",
      turma: "5º Ano A",
      dataEmprestimo: "2025-12-10",
      dataDevolucao: "2025-12-24",
      status: "ativo"
    },
    {
      id: "2",
      livroId: "3",
      livroTitulo: "Harry Potter e a Pedra Filosofal",
      aluno: "Bruno Santos",
      turma: "4º Ano B",
      dataEmprestimo: "2025-12-05",
      dataDevolucao: "2025-12-19",
      status: "ativo"
    }
  ]);

  const [novoEmprestimo, setNovoEmprestimo] = useState({
    aluno: "",
    turma: "",
    dataDevolucao: ""
  });

  const handleRegistrarEmprestimo = () => {
    if (!livroSelecionado || !novoEmprestimo.aluno || !novoEmprestimo.turma || !novoEmprestimo.dataDevolucao) {
      toast.error("Preencha todos os campos");
      return;
    }

    if (livroSelecionado.disponiveis <= 0) {
      toast.error("Não há exemplares disponíveis deste livro");
      return;
    }

    const emprestimo: Emprestimo = {
      id: Date.now().toString(),
      livroId: livroSelecionado.id,
      livroTitulo: livroSelecionado.titulo,
      aluno: novoEmprestimo.aluno,
      turma: novoEmprestimo.turma,
      dataEmprestimo: new Date().toISOString().split('T')[0],
      dataDevolucao: novoEmprestimo.dataDevolucao,
      status: "ativo"
    };

    setEmprestimos([emprestimo, ...emprestimos]);
    
    // Atualizar disponibilidade do livro
    setLivros(livros.map(livro => 
      livro.id === livroSelecionado.id 
        ? { ...livro, disponiveis: livro.disponiveis - 1 }
        : livro
    ));

    setDialogEmprestimo(false);
    setLivroSelecionado(null);
    setNovoEmprestimo({ aluno: "", turma: "", dataDevolucao: "" });
    toast.success("Empréstimo registrado com sucesso!");
  };

  const handleDevolverLivro = (emprestimoId: string) => {
    const emprestimo = emprestimos.find(e => e.id === emprestimoId);
    if (!emprestimo) return;

    setEmprestimos(emprestimos.map(e => 
      e.id === emprestimoId ? { ...e, status: "devolvido" as const } : e
    ));

    setLivros(livros.map(livro => 
      livro.id === emprestimo.livroId 
        ? { ...livro, disponiveis: livro.disponiveis + 1 }
        : livro
    ));

    toast.success("Devolução registrada com sucesso!");
  };

  const livrosFiltrados = livros.filter(livro =>
    livro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    livro.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const emprestimosAtivos = emprestimos.filter(e => e.status === "ativo");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Biblioteca Sena</h1>
          <p className="text-muted-foreground mt-2">Gerencie o acervo e controle de empréstimos</p>
        </div>
        <Dialog open={dialogNovoLivro} onOpenChange={setDialogNovoLivro}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Novo Livro
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Adicionar Livro ao Acervo</DialogTitle>
              <DialogDescription>Cadastre um novo livro na biblioteca</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Título</Label>
                <Input placeholder="Título do livro" />
              </div>
              <div className="grid gap-2">
                <Label>Autor</Label>
                <Input placeholder="Nome do autor" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>ISBN</Label>
                  <Input placeholder="978-XXXXXXXXXX" />
                </div>
                <div className="grid gap-2">
                  <Label>Categoria</Label>
                  <Input placeholder="Ex: Infantil" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Quantidade</Label>
                  <Input type="number" min="1" defaultValue="1" />
                </div>
                <div className="grid gap-2">
                  <Label>Localização</Label>
                  <Input placeholder="Ex: Estante A" />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogNovoLivro(false)}>Cancelar</Button>
              <Button onClick={() => { setDialogNovoLivro(false); toast.success("Livro adicionado!"); }}>Adicionar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Total de Livros</CardDescription>
            <CardTitle className="text-3xl">{livros.reduce((acc, l) => acc + l.quantidade, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Disponíveis</CardDescription>
            <CardTitle className="text-3xl text-green-600">{livros.reduce((acc, l) => acc + l.disponiveis, 0)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Emprestados</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{emprestimosAtivos.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Títulos Únicos</CardDescription>
            <CardTitle className="text-3xl">{livros.length}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, autor ou categoria..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Acervo
            </CardTitle>
            <CardDescription>{livrosFiltrados.length} livros encontrados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {livrosFiltrados.map((livro) => (
                <div key={livro.id} className="p-4 border rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium">{livro.titulo}</h4>
                      <p className="text-sm text-muted-foreground">{livro.autor}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{livro.categoria}</Badge>
                        <span className="text-xs text-muted-foreground">{livro.localizacao}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={livro.disponiveis > 0 ? "default" : "destructive"}>
                        {livro.disponiveis}/{livro.quantidade}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full mt-2"
                    disabled={livro.disponiveis === 0}
                    onClick={() => {
                      setLivroSelecionado(livro);
                      setDialogEmprestimo(true);
                    }}
                  >
                    Emprestar
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Empréstimos Ativos
            </CardTitle>
            <CardDescription>{emprestimosAtivos.length} livros emprestados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-[500px] overflow-y-auto">
              {emprestimosAtivos.map((emprestimo) => {
                const dataFormatada = new Date(emprestimo.dataDevolucao).toLocaleDateString('pt-BR');
                return (
                  <div key={emprestimo.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">{emprestimo.livroTitulo}</h4>
                        <p className="text-sm text-muted-foreground">{emprestimo.aluno} • {emprestimo.turma}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          Devolução: {dataFormatada}
                        </div>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full mt-2 gap-1"
                      onClick={() => handleDevolverLivro(emprestimo.id)}
                    >
                      <ArrowLeft className="h-3 w-3" />
                      Registrar Devolução
                    </Button>
                  </div>
                );
              })}
              {emprestimosAtivos.length === 0 && (
                <p className="text-center text-muted-foreground py-8">Nenhum empréstimo ativo</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={dialogEmprestimo} onOpenChange={setDialogEmprestimo}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar Empréstimo</DialogTitle>
            <DialogDescription>
              {livroSelecionado?.titulo} - {livroSelecionado?.autor}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Aluno</Label>
              <Input
                value={novoEmprestimo.aluno}
                onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, aluno: e.target.value })}
                placeholder="Nome do aluno"
              />
            </div>
            <div className="grid gap-2">
              <Label>Turma</Label>
              <Input
                value={novoEmprestimo.turma}
                onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, turma: e.target.value })}
                placeholder="Ex: 5º Ano A"
              />
            </div>
            <div className="grid gap-2">
              <Label>Data de Devolução</Label>
              <Input
                type="date"
                value={novoEmprestimo.dataDevolucao}
                onChange={(e) => setNovoEmprestimo({ ...novoEmprestimo, dataDevolucao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogEmprestimo(false)}>Cancelar</Button>
            <Button onClick={handleRegistrarEmprestimo}>Registrar Empréstimo</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

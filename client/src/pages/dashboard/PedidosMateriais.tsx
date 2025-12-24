import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Upload, FileText, Download, Plus, Trash2, ShoppingCart, Palette, 
  UtensilsCrossed, Sparkles, Droplets, School, Eye, Check, Clock,
  Package, Edit, Save, X
} from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

// ==================== INTERFACES ====================

interface ItemFornecedor {
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  categoria: "pedagogico" | "alimentacao" | "higiene" | "limpeza";
  fornecedorId: string;
}

interface Fornecedor {
  id: string;
  nome: string;
  categoria: "pedagogico" | "alimentacao" | "higiene" | "limpeza";
  contato?: string;
  email?: string;
  telefone?: string;
  catalogo: ItemFornecedor[];
}

interface ItemPedido {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  quantidade: number;
  subtotal: number;
  categoria: string;
  fornecedorId: string;
  fornecedorNome: string;
}

interface Pedido {
  id: string;
  numero: string;
  turmaId: string;
  turmaNome: string;
  status: "em_andamento" | "concluido" | "enviado";
  dataCriacao: string;
  dataConclusao?: string;
  itens: ItemPedido[];
  valorTotal: number;
  responsavel: string;
}

interface Turma {
  id: string;
  nome: string;
}

// ==================== COMPONENTE PRINCIPAL ====================

export default function PedidosMateriais() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const catalogoInputRef = useRef<HTMLInputElement>(null);
  
  // Estados principais
  const [abaAtiva, setAbaAtiva] = useState<"novo_pedido" | "pedidos" | "fornecedores">("novo_pedido");
  
  // Estados para novo pedido
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("bercario-1a");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("pedagogico");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [itemSelecionado, setItemSelecionado] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [itensPedidoAtual, setItensPedidoAtual] = useState<ItemPedido[]>(() => {
    const saved = localStorage.getItem('pedidoAtual');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Estados para pedidos salvos
  const [pedidos, setPedidos] = useState<Pedido[]>(() => {
    const saved = localStorage.getItem('pedidos');
    return saved ? JSON.parse(saved) : [];
  });
  
  // Estados para fornecedores
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>(() => {
    const saved = localStorage.getItem('fornecedores');
    if (saved) return JSON.parse(saved);
    return [
    // Fornecedores exemplo (serão substituídos por cadastros reais)
    {
      id: "forn-1",
      nome: "Fornecedor A - Material Pedagógico",
      categoria: "pedagogico",
      contato: "João Silva",
      email: "contato@fornecedora.com",
      telefone: "(61) 3333-1111",
      catalogo: [
        { codigo: "P001", descricao: "Tinta Guache 250ml - Sortida", unidade: "Unidade", preco: 8.50, categoria: "pedagogico", fornecedorId: "forn-1" },
        { codigo: "P002", descricao: "Papel Sulfite A4 - Resma 500 folhas", unidade: "Resma", preco: 25.90, categoria: "pedagogico", fornecedorId: "forn-1" },
        { codigo: "P003", descricao: "Canetão Hidrográfico - Caixa 12 cores", unidade: "Caixa", preco: 18.00, categoria: "pedagogico", fornecedorId: "forn-1" },
        { codigo: "P007", descricao: "EVA - Placa 40x60cm", unidade: "Unidade", preco: 2.80, categoria: "pedagogico", fornecedorId: "forn-1" },
        { codigo: "P008", descricao: "Cola Branca 90g", unidade: "Unidade", preco: 4.20, categoria: "pedagogico", fornecedorId: "forn-1" },
      ]
    },
    {
      id: "forn-2",
      nome: "Fornecedor B - Alimentos",
      categoria: "alimentacao",
      contato: "Maria Santos",
      email: "vendas@fornecedorb.com",
      telefone: "(61) 3333-2222",
      catalogo: [
        { codigo: "A001", descricao: "Leite Integral - Caixa 12 litros", unidade: "Caixa", preco: 48.00, categoria: "alimentacao", fornecedorId: "forn-2" },
        { codigo: "A003", descricao: "Arroz Branco Tipo 1 - Saco 5kg", unidade: "Saco", preco: 28.90, categoria: "alimentacao", fornecedorId: "forn-2" },
        { codigo: "A004", descricao: "Feijão Carioca - Saco 5kg", unidade: "Saco", preco: 32.00, categoria: "alimentacao", fornecedorId: "forn-2" },
        { codigo: "A009", descricao: "Banana Prata - Kg", unidade: "Kg", preco: 6.50, categoria: "alimentacao", fornecedorId: "forn-2" },
      ]
    },
    {
      id: "forn-3",
      nome: "Fornecedor C - Produtos de Higiene",
      categoria: "higiene",
      contato: "Pedro Costa",
      email: "atendimento@fornecedorc.com",
      telefone: "(61) 3333-3333",
      catalogo: [
        { codigo: "H001", descricao: "Sabonete Líquido - Galão 5L", unidade: "Galão", preco: 45.00, categoria: "higiene", fornecedorId: "forn-3" },
        { codigo: "H003", descricao: "Papel Higiênico - Fardo 64 rolos", unidade: "Fardo", preco: 85.00, categoria: "higiene", fornecedorId: "forn-3" },
        { codigo: "H005", descricao: "Lenço Umedecido - Pacote 100 unidades", unidade: "Pacote", preco: 12.50, categoria: "higiene", fornecedorId: "forn-3" },
      ]
    }
  ];
  });
  
  const [pedidoVisualizando, setPedidoVisualizando] = useState<Pedido | null>(null);
  
  // Estados para cadastro de fornecedor
  const [novoFornecedor, setNovoFornecedor] = useState({
    nome: "",
    categoria: "pedagogico" as "pedagogico" | "alimentacao" | "higiene" | "limpeza",
    contato: "",
    email: "",
    telefone: ""
  });
  const [dialogFornecedorAberto, setDialogFornecedorAberto] = useState(false);
  
  // Persistir dados no localStorage
  useEffect(() => {
    localStorage.setItem('pedidoAtual', JSON.stringify(itensPedidoAtual));
  }, [itensPedidoAtual]);
  
  useEffect(() => {
    localStorage.setItem('pedidos', JSON.stringify(pedidos));
  }, [pedidos]);
  
  useEffect(() => {
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
  }, [fornecedores]);

  const turmas: Turma[] = [
    { id: "bercario-1a", nome: "Berçário I - Turma A" },
    { id: "bercario-1b", nome: "Berçário I - Turma B" },
    { id: "bercario-2a", nome: "Berçário II - Turma A" },
    { id: "maternal-1a", nome: "Maternal I - Turma A" },
    { id: "maternal-2a", nome: "Maternal II - Turma A" }
  ];

  // ==================== FUNÇÕES DE FORNECEDORES ====================

  const handleCadastrarFornecedor = () => {
    if (!novoFornecedor.nome) {
      toast.error("Preencha o nome do fornecedor");
      return;
    }

    const fornecedor: Fornecedor = {
      id: `forn-${Date.now()}`,
      ...novoFornecedor,
      catalogo: []
    };

    setFornecedores([...fornecedores, fornecedor]);
    setNovoFornecedor({
      nome: "",
      categoria: "pedagogico",
      contato: "",
      email: "",
      telefone: ""
    });
    setDialogFornecedorAberto(false);
    toast.success(`Fornecedor "${fornecedor.nome}" cadastrado com sucesso!`);
  };

  const handleUploadCatalogo = (fornecedorId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet) as any[];

        // Mapear dados da planilha para itens do catálogo
        const itensCatalogo: ItemFornecedor[] = jsonData.map((row, index) => ({
          codigo: row.Código || row.Codigo || row.codigo || `ITEM-${index + 1}`,
          descricao: row.Descrição || row.Descricao || row.descricao || row.Produto || row.produto || "",
          unidade: row.Unidade || row.unidade || "Unidade",
          preco: parseFloat(row.Preço || row.Preco || row.preco || row["Valor Unitário"] || row.valor || 0),
          categoria: fornecedores.find(f => f.id === fornecedorId)?.categoria || "pedagogico",
          fornecedorId
        }));

        // Atualizar fornecedor com novo catálogo
        setFornecedores(fornecedores.map(f => 
          f.id === fornecedorId ? { ...f, catalogo: itensCatalogo } : f
        ));

        toast.success(`Catálogo importado: ${itensCatalogo.length} itens carregados`);
      } catch (error) {
        toast.error("Erro ao importar catálogo. Verifique o formato da planilha.");
        console.error(error);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleRemoverFornecedor = (fornecedorId: string) => {
    const fornecedor = fornecedores.find(f => f.id === fornecedorId);
    if (confirm(`Deseja realmente remover o fornecedor "${fornecedor?.nome}"?`)) {
      setFornecedores(fornecedores.filter(f => f.id !== fornecedorId));
      toast.success("Fornecedor removido");
    }
  };

  // ==================== FUNÇÕES DE PEDIDOS ====================

  const handleAdicionarItem = () => {
    if (!fornecedorSelecionado || !itemSelecionado) {
      toast.error("Selecione um fornecedor e um item");
      return;
    }

    const fornecedor = fornecedores.find(f => f.id === fornecedorSelecionado);
    const item = fornecedor?.catalogo.find(i => i.codigo === itemSelecionado);

    if (!item) {
      toast.error("Item não encontrado");
      return;
    }

    const novoItem: ItemPedido = {
      id: `item-${Date.now()}`,
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      preco: item.preco,
      quantidade: quantidade,
      subtotal: item.preco * quantidade,
      categoria: item.categoria,
      fornecedorId: fornecedor!.id,
      fornecedorNome: fornecedor!.nome
    };

    setItensPedidoAtual([...itensPedidoAtual, novoItem]);
    setItemSelecionado("");
    setQuantidade(1);
    toast.success("Item adicionado ao pedido");
  };

  const handleRemoverItem = (id: string) => {
    setItensPedidoAtual(itensPedidoAtual.filter(item => item.id !== id));
    toast.success("Item removido do pedido");
  };

  const handleConcluirPedido = () => {
    if (itensPedidoAtual.length === 0) {
      toast.error("Adicione itens ao pedido antes de concluir");
      return;
    }

    const turma = turmas.find(t => t.id === turmaSelecionada);
    const numeroPedido = `PED-${Date.now().toString().slice(-6)}`;
    const valorTotal = itensPedidoAtual.reduce((acc, item) => acc + item.subtotal, 0);

    const novoPedido: Pedido = {
      id: `pedido-${Date.now()}`,
      numero: numeroPedido,
      turmaId: turmaSelecionada,
      turmaNome: turma?.nome || "",
      status: "concluido",
      dataCriacao: new Date().toISOString(),
      dataConclusao: new Date().toISOString(),
      itens: [...itensPedidoAtual],
      valorTotal,
      responsavel: "Ana Silva - Coordenadora Pedagógica"
    };

    setPedidos([novoPedido, ...pedidos]);
    setItensPedidoAtual([]);
    setAbaAtiva("pedidos");
    toast.success(`Pedido ${numeroPedido} concluído com sucesso!`);
  };

  const handleGerarPlanilhaPedido = (pedido: Pedido) => {
    const dataAtual = new Date(pedido.dataCriacao).toLocaleDateString('pt-BR');
    const horaAtual = new Date(pedido.dataCriacao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Agrupar itens por categoria e fornecedor
    const itensPorCategoriaFornecedor: Record<string, Record<string, ItemPedido[]>> = {};
    
    pedido.itens.forEach(item => {
      const categoria = item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1);
      const fornecedor = item.fornecedorNome;
      
      if (!itensPorCategoriaFornecedor[categoria]) {
        itensPorCategoriaFornecedor[categoria] = {};
      }
      if (!itensPorCategoriaFornecedor[categoria][fornecedor]) {
        itensPorCategoriaFornecedor[categoria][fornecedor] = [];
      }
      itensPorCategoriaFornecedor[categoria][fornecedor].push(item);
    });

    // Preparar dados para a planilha com cabeçalho profissional
    const dados: any[] = [];
    
    // CABEÇALHO DA INSTITUIÇÃO
    dados.push({ A: "CEPI ARARA CANINDÉ - CENTRO DE EDUCAÇÃO DA PRIMEIRA INFÂNCIA" });
    dados.push({ A: "PEDIDO DE MATERIAIS" });
    dados.push({});
    
    // INFORMAÇÕES DO PEDIDO
    dados.push({ A: "INFORMAÇÕES DO PEDIDO" });
    dados.push({ A: "Número do Pedido:", B: pedido.numero });
    dados.push({ A: "Turma:", B: pedido.turmaNome });
    dados.push({ A: "Data de Emissão:", B: dataAtual });
    dados.push({ A: "Hora:", B: horaAtual });
    dados.push({ A: "Status:", B: pedido.status === "concluido" ? "Concluído" : pedido.status === "enviado" ? "Enviado" : "Em Andamento" });
    dados.push({ A: "Responsável:", B: pedido.responsavel });
    dados.push({});
    
    let itemGlobal = 1;
    let totalGeral = 0;

    // ITENS POR CATEGORIA E FORNECEDOR
    Object.entries(itensPorCategoriaFornecedor).forEach(([categoria, fornecedores]) => {
      // Cabeçalho da Categoria
      dados.push({ A: `CATEGORIA: ${categoria.toUpperCase()}` });
      dados.push({});
      
      Object.entries(fornecedores).forEach(([fornecedor, itens]) => {
        // Cabeçalho do Fornecedor
        dados.push({ A: `Fornecedor: ${fornecedor}` });
        dados.push({});
        
        // Cabeçalho da Tabela
        dados.push({
          A: "Item",
          B: "Código",
          C: "Descrição do Produto",
          D: "Unidade",
          E: "Quantidade",
          F: "Valor Unitário (R$)",
          G: "Valor Total (R$)"
        });
        
        // Itens do fornecedor
        let subtotalFornecedor = 0;
        itens.forEach((item) => {
          dados.push({
            A: itemGlobal++,
            B: item.codigo,
            C: item.descricao,
            D: item.unidade,
            E: item.quantidade,
            F: item.preco.toFixed(2),
            G: item.subtotal.toFixed(2)
          });
          subtotalFornecedor += item.subtotal;
          totalGeral += item.subtotal;
        });
        
        // Subtotal do Fornecedor
        dados.push({
          A: "",
          B: "",
          C: "",
          D: "",
          E: "",
          F: "Subtotal Fornecedor:",
          G: subtotalFornecedor.toFixed(2)
        });
        dados.push({});
      });
      
      dados.push({});
    });

    // RESUMO FINANCEIRO
    dados.push({ A: "RESUMO FINANCEIRO" });
    dados.push({});
    dados.push({ A: "Descrição", B: "Valor (R$)" });
    
    Object.entries(itensPorCategoriaFornecedor).forEach(([categoria, fornecedores]) => {
      const totalCategoria = Object.values(fornecedores)
        .flat()
        .reduce((acc, item) => acc + item.subtotal, 0);
      dados.push({ A: `Total ${categoria}:`, B: totalCategoria.toFixed(2) });
    });
    
    dados.push({});
    dados.push({ A: "VALOR TOTAL DO PEDIDO:", B: totalGeral.toFixed(2) });
    dados.push({});
    
    // OBSERVAÇÕES
    dados.push({ A: "OBSERVAÇÕES" });
    dados.push({ A: "• Prazo de entrega: Conforme acordado com o fornecedor" });
    dados.push({ A: "• Forma de pagamento: A combinar" });
    dados.push({ A: "• Local de entrega: CEPI Arara Canindé" });
    dados.push({ A: "• Contato: (61) 3333-4444 | cepi.araracaninde@educacao.df.gov.br" });
    dados.push({});
    dados.push({ A: "_".repeat(50) });
    dados.push({ A: "Assinatura do Responsável" });

    // Criar worksheet
    const ws = XLSX.utils.json_to_sheet(dados, { skipHeader: true });

    // Configurar larguras das colunas
    ws['!cols'] = [
      { wch: 8 },   // A - Item
      { wch: 12 },  // B - Código
      { wch: 50 },  // C - Descrição
      { wch: 12 },  // D - Unidade
      { wch: 12 },  // E - Quantidade
      { wch: 20 },  // F - Valor Unit.
      { wch: 20 }   // G - Valor Total
    ];

    // Aplicar estilos (merge cells para títulos)
    const merges = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 6 } }, // Título principal
      { s: { r: 1, c: 0 }, e: { r: 1, c: 6 } }  // Subtítulo
    ];
    ws['!merges'] = merges;

    XLSX.utils.book_append_sheet(wb, ws, "Pedido de Materiais");

    // Gerar arquivo
    const nomeArquivo = `${pedido.numero}_${pedido.turmaNome.replace(/\s/g, '_')}_${dataAtual.replace(/\//g, '-')}.xlsx`;
    
    XLSX.writeFile(wb, nomeArquivo);
    
    toast.success(`Planilha gerada: ${nomeArquivo}`);
  };

  // Obter fornecedores da categoria ativa
  const fornecedoresDaCategoria = fornecedores.filter(f => f.categoria === categoriaAtiva);
  
  // Obter itens do fornecedor selecionado
  const itensFornecedor = fornecedorSelecionado 
    ? fornecedores.find(f => f.id === fornecedorSelecionado)?.catalogo || []
    : [];

  const totalPedidoAtual = itensPedidoAtual.reduce((acc, item) => acc + item.subtotal, 0);

  // ==================== RENDER ====================

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Pedidos de Materiais</h1>
          <p className="text-muted-foreground">Sistema completo de pedidos e fornecedores</p>
        </div>
      </div>

      {/* Tabs Principais */}
      <Tabs value={abaAtiva} onValueChange={(v) => setAbaAtiva(v as any)} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="novo_pedido" className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Novo Pedido
          </TabsTrigger>
          <TabsTrigger value="pedidos" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            Pedidos ({pedidos.length})
          </TabsTrigger>
          <TabsTrigger value="fornecedores" className="flex items-center gap-2">
            <ShoppingCart className="h-4 w-4" />
            Fornecedores ({fornecedores.length})
          </TabsTrigger>
        </TabsList>

        {/* ABA: NOVO PEDIDO */}
        <TabsContent value="novo_pedido" className="space-y-6">
          {/* Seletor de Turma */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="h-5 w-5" />
                Selecione a Turma
              </CardTitle>
              <CardDescription>Escolha a turma para criar o pedido</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Label htmlFor="turma" className="min-w-[100px]">Turma:</Label>
                <Select value={turmaSelecionada} onValueChange={setTurmaSelecionada}>
                  <SelectTrigger className="w-full max-w-md">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {turmas.map(turma => (
                      <SelectItem key={turma.id} value={turma.id}>
                        {turma.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Badge variant="outline" className="ml-auto">
                  {itensPedidoAtual.length} {itensPedidoAtual.length === 1 ? 'item' : 'itens'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Tabs de Categorias */}
          <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="pedagogico" className="flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Pedagógico
              </TabsTrigger>
              <TabsTrigger value="alimentacao" className="flex items-center gap-2">
                <UtensilsCrossed className="h-4 w-4" />
                Alimentação
              </TabsTrigger>
              <TabsTrigger value="higiene" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Higiene Pessoal
              </TabsTrigger>
              <TabsTrigger value="limpeza" className="flex items-center gap-2">
                <Droplets className="h-4 w-4" />
                Limpeza
              </TabsTrigger>
            </TabsList>

            <TabsContent value={categoriaAtiva} className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Adicionar Itens</CardTitle>
                  <CardDescription>
                    Selecione o fornecedor e os itens para adicionar ao pedido
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="fornecedor">Fornecedor</Label>
                      <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o fornecedor" />
                        </SelectTrigger>
                        <SelectContent>
                          {fornecedoresDaCategoria.map(fornecedor => (
                            <SelectItem key={fornecedor.id} value={fornecedor.id}>
                              {fornecedor.nome}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="item">Item</Label>
                      <Select 
                        value={itemSelecionado} 
                        onValueChange={setItemSelecionado}
                        disabled={!fornecedorSelecionado}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o item" />
                        </SelectTrigger>
                        <SelectContent>
                          {itensFornecedor.map(item => (
                            <SelectItem key={item.codigo} value={item.codigo}>
                              {item.descricao} - R$ {item.preco.toFixed(2)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="quantidade">Quantidade</Label>
                      <div className="flex gap-2">
                        <Input
                          id="quantidade"
                          type="number"
                          min="1"
                          value={quantidade}
                          onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                          className="w-32"
                        />
                        <Button onClick={handleAdicionarItem} className="flex-1">
                          <Plus className="mr-2 h-4 w-4" />
                          Adicionar ao Pedido
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Itens do Pedido Atual */}
          {itensPedidoAtual.length > 0 && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Itens do Pedido Atual</CardTitle>
                    <CardDescription>
                      {itensPedidoAtual.length} {itensPedidoAtual.length === 1 ? 'item adicionado' : 'itens adicionados'}
                    </CardDescription>
                  </div>
                  <Button onClick={handleConcluirPedido} size="lg">
                    <Check className="mr-2 h-4 w-4" />
                    Concluir Pedido
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item</TableHead>
                      <TableHead>Código</TableHead>
                      <TableHead>Produto</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Fornecedor</TableHead>
                      <TableHead>Qtd</TableHead>
                      <TableHead>Unidade</TableHead>
                      <TableHead>Preço Unit.</TableHead>
                      <TableHead>Subtotal</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itensPedidoAtual.map((item, index) => (
                      <TableRow key={item.id}>
                        <TableCell>{index + 1}</TableCell>
                        <TableCell className="font-mono">{item.codigo}</TableCell>
                        <TableCell>{item.descricao}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {item.fornecedorNome}
                        </TableCell>
                        <TableCell>{item.quantidade}</TableCell>
                        <TableCell>{item.unidade}</TableCell>
                        <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                        <TableCell className="font-bold">R$ {item.subtotal.toFixed(2)}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoverItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={8} className="text-right font-bold">
                        TOTAL:
                      </TableCell>
                      <TableCell className="font-bold text-lg">
                        R$ {totalPedidoAtual.toFixed(2)}
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* ABA: PEDIDOS */}
        <TabsContent value="pedidos" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pedidos</CardTitle>
              <CardDescription>
                Visualize e gerencie todos os pedidos realizados
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pedidos.length === 0 ? (
                <div className="text-center py-12">
                  <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Nenhum pedido realizado</h3>
                  <p className="text-muted-foreground">
                    Crie seu primeiro pedido na aba "Novo Pedido"
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Número</TableHead>
                      <TableHead>Turma</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Itens</TableHead>
                      <TableHead>Valor Total</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-mono font-bold">{pedido.numero}</TableCell>
                        <TableCell>{pedido.turmaNome}</TableCell>
                        <TableCell>
                          {new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant={
                              pedido.status === "concluido" ? "default" : 
                              pedido.status === "enviado" ? "secondary" : 
                              "outline"
                            }
                          >
                            {pedido.status === "concluido" && <Check className="mr-1 h-3 w-3" />}
                            {pedido.status === "em_andamento" && <Clock className="mr-1 h-3 w-3" />}
                            {pedido.status === "concluido" ? "Concluído" : 
                             pedido.status === "enviado" ? "Enviado" : 
                             "Em Andamento"}
                          </Badge>
                        </TableCell>
                        <TableCell>{pedido.itens.length} itens</TableCell>
                        <TableCell className="font-bold">
                          R$ {pedido.valorTotal.toFixed(2)}
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => setPedidoVisualizando(pedido)}
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle>Pedido {pedido.numero}</DialogTitle>
                                  <DialogDescription>
                                    {pedido.turmaNome} - {new Date(pedido.dataCriacao).toLocaleDateString('pt-BR')}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <span className="font-semibold">Status:</span>{" "}
                                      <Badge variant="outline">{pedido.status}</Badge>
                                    </div>
                                    <div>
                                      <span className="font-semibold">Responsável:</span>{" "}
                                      {pedido.responsavel}
                                    </div>
                                  </div>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Item</TableHead>
                                        <TableHead>Código</TableHead>
                                        <TableHead>Produto</TableHead>
                                        <TableHead>Qtd</TableHead>
                                        <TableHead>Preço Unit.</TableHead>
                                        <TableHead>Subtotal</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {pedido.itens.map((item, index) => (
                                        <TableRow key={item.id}>
                                          <TableCell>{index + 1}</TableCell>
                                          <TableCell className="font-mono">{item.codigo}</TableCell>
                                          <TableCell>{item.descricao}</TableCell>
                                          <TableCell>{item.quantidade}</TableCell>
                                          <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                                          <TableCell className="font-bold">
                                            R$ {item.subtotal.toFixed(2)}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                      <TableRow>
                                        <TableCell colSpan={5} className="text-right font-bold">
                                          TOTAL:
                                        </TableCell>
                                        <TableCell className="font-bold text-lg">
                                          R$ {pedido.valorTotal.toFixed(2)}
                                        </TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => handleGerarPlanilhaPedido(pedido)}
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ABA: FORNECEDORES */}
        <TabsContent value="fornecedores" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Fornecedores Cadastrados</CardTitle>
                  <CardDescription>
                    Gerencie fornecedores e seus catálogos de produtos
                  </CardDescription>
                </div>
                <Dialog open={dialogFornecedorAberto} onOpenChange={setDialogFornecedorAberto}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Novo Fornecedor
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Cadastrar Fornecedor</DialogTitle>
                      <DialogDescription>
                        Preencha os dados do fornecedor
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="grid gap-2">
                        <Label htmlFor="nome-fornecedor">Nome do Fornecedor *</Label>
                        <Input
                          id="nome-fornecedor"
                          value={novoFornecedor.nome}
                          onChange={(e) => setNovoFornecedor({...novoFornecedor, nome: e.target.value})}
                          placeholder="Ex: Fornecedor ABC Ltda"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="categoria-fornecedor">Categoria *</Label>
                        <Select 
                          value={novoFornecedor.categoria} 
                          onValueChange={(v: any) => setNovoFornecedor({...novoFornecedor, categoria: v})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pedagogico">Pedagógico</SelectItem>
                            <SelectItem value="alimentacao">Alimentação</SelectItem>
                            <SelectItem value="higiene">Higiene Pessoal</SelectItem>
                            <SelectItem value="limpeza">Limpeza</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="contato-fornecedor">Contato</Label>
                        <Input
                          id="contato-fornecedor"
                          value={novoFornecedor.contato}
                          onChange={(e) => setNovoFornecedor({...novoFornecedor, contato: e.target.value})}
                          placeholder="Nome do responsável"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="email-fornecedor">E-mail</Label>
                        <Input
                          id="email-fornecedor"
                          type="email"
                          value={novoFornecedor.email}
                          onChange={(e) => setNovoFornecedor({...novoFornecedor, email: e.target.value})}
                          placeholder="contato@fornecedor.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="telefone-fornecedor">Telefone</Label>
                        <Input
                          id="telefone-fornecedor"
                          value={novoFornecedor.telefone}
                          onChange={(e) => setNovoFornecedor({...novoFornecedor, telefone: e.target.value})}
                          placeholder="(61) 3333-4444"
                        />
                      </div>
                      <Button onClick={handleCadastrarFornecedor} className="w-full">
                        <Save className="mr-2 h-4 w-4" />
                        Cadastrar Fornecedor
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {fornecedores.map((fornecedor) => (
                  <Card key={fornecedor.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-lg">{fornecedor.nome}</CardTitle>
                          <CardDescription>
                            <Badge variant="outline" className="mt-1">
                              {fornecedor.categoria.charAt(0).toUpperCase() + fornecedor.categoria.slice(1)}
                            </Badge>
                          </CardDescription>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoverFornecedor(fornecedor.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        {fornecedor.contato && (
                          <div>
                            <span className="font-semibold">Contato:</span> {fornecedor.contato}
                          </div>
                        )}
                        {fornecedor.email && (
                          <div>
                            <span className="font-semibold">E-mail:</span> {fornecedor.email}
                          </div>
                        )}
                        {fornecedor.telefone && (
                          <div>
                            <span className="font-semibold">Telefone:</span> {fornecedor.telefone}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm">
                          <span className="font-semibold">Catálogo:</span>{" "}
                          {fornecedor.catalogo.length} {fornecedor.catalogo.length === 1 ? 'item' : 'itens'}
                        </div>
                        <div className="flex gap-2">
                          <input
                            ref={catalogoInputRef}
                            type="file"
                            accept=".xlsx,.xls"
                            onChange={(e) => handleUploadCatalogo(fornecedor.id, e)}
                            className="hidden"
                            id={`upload-${fornecedor.id}`}
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => document.getElementById(`upload-${fornecedor.id}`)?.click()}
                          >
                            <Upload className="mr-2 h-4 w-4" />
                            Importar Catálogo Excel
                          </Button>
                        </div>
                      </div>
                      {fornecedor.catalogo.length > 0 && (
                        <div className="border rounded-lg p-4 max-h-60 overflow-y-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Código</TableHead>
                                <TableHead>Produto</TableHead>
                                <TableHead>Unidade</TableHead>
                                <TableHead>Preço</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {fornecedor.catalogo.map((item) => (
                                <TableRow key={item.codigo}>
                                  <TableCell className="font-mono">{item.codigo}</TableCell>
                                  <TableCell>{item.descricao}</TableCell>
                                  <TableCell>{item.unidade}</TableCell>
                                  <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

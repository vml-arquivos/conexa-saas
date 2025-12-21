import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Download, Plus, Trash2, ShoppingCart, Palette, UtensilsCrossed, Sparkles, Droplets, School } from "lucide-react";
import { toast } from "sonner";
import * as XLSX from "xlsx";

interface ItemFornecedor {
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  categoria: "pedagogico" | "alimentacao" | "higiene" | "limpeza";
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
}

interface Turma {
  id: string;
  nome: string;
}

export default function PedidosMateriais() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [turmaSelecionada, setTurmaSelecionada] = useState<string>("bercario-1a");
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("pedagogico");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [itensFornecedor, setItensFornecedor] = useState<ItemFornecedor[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  
  // Pedidos separados por turma
  const [pedidosPorTurma, setPedidosPorTurma] = useState<Record<string, ItemPedido[]>>({
    "bercario-1a": [],
    "bercario-1b": [],
    "bercario-2a": [],
    "maternal-1a": [],
    "maternal-2a": []
  });

  const turmas: Turma[] = [
    { id: "bercario-1a", nome: "Berçário I - Turma A" },
    { id: "bercario-1b", nome: "Berçário I - Turma B" },
    { id: "bercario-2a", nome: "Berçário II - Turma A" },
    { id: "maternal-1a", nome: "Maternal I - Turma A" },
    { id: "maternal-2a", nome: "Maternal II - Turma A" }
  ];

  const itensPedidoAtual = pedidosPorTurma[turmaSelecionada] || [];

  // Dados de exemplo organizados por categoria
  const fornecedoresPorCategoria: Record<string, Record<string, ItemFornecedor[]>> = {
    pedagogico: {
      "Fornecedor A - Material Pedagógico": [
        { codigo: "P001", descricao: "Tinta Guache 250ml - Sortida", unidade: "Unidade", preco: 8.50, categoria: "pedagogico" },
        { codigo: "P002", descricao: "Papel Sulfite A4 - Resma 500 folhas", unidade: "Resma", preco: 25.90, categoria: "pedagogico" },
        { codigo: "P003", descricao: "Canetão Hidrográfico - Caixa 12 cores", unidade: "Caixa", preco: 18.00, categoria: "pedagogico" },
        { codigo: "P004", descricao: "Canetinha Colorida - Caixa 24 cores", unidade: "Caixa", preco: 12.50, categoria: "pedagogico" },
        { codigo: "P005", descricao: "Pincel Escolar nº 10", unidade: "Unidade", preco: 3.20, categoria: "pedagogico" },
        { codigo: "P006", descricao: "TNT - Rolo 50m x 1,40m", unidade: "Rolo", preco: 45.00, categoria: "pedagogico" },
        { codigo: "P007", descricao: "EVA - Placa 40x60cm", unidade: "Unidade", preco: 2.80, categoria: "pedagogico" },
        { codigo: "P008", descricao: "Cola Branca 90g", unidade: "Unidade", preco: 4.20, categoria: "pedagogico" },
        { codigo: "P009", descricao: "Cola Colorida - Kit 6 cores", unidade: "Kit", preco: 15.00, categoria: "pedagogico" },
        { codigo: "P010", descricao: "Papel Cartão - Pacote 50 folhas", unidade: "Pacote", preco: 22.00, categoria: "pedagogico" },
        { codigo: "P011", descricao: "Papel Crepom - Pacote 10 unidades", unidade: "Pacote", preco: 8.90, categoria: "pedagogico" },
        { codigo: "P012", descricao: "Papel Color Set - Pacote 48 folhas", unidade: "Pacote", preco: 16.50, categoria: "pedagogico" }
      ]
    },
    alimentacao: {
      "Fornecedor B - Alimentos": [
        { codigo: "A001", descricao: "Leite Integral - Caixa 12 litros", unidade: "Caixa", preco: 48.00, categoria: "alimentacao" },
        { codigo: "A002", descricao: "Pão Francês - Kg", unidade: "Kg", preco: 12.50, categoria: "alimentacao" },
        { codigo: "A003", descricao: "Arroz Branco Tipo 1 - Saco 5kg", unidade: "Saco", preco: 28.90, categoria: "alimentacao" },
        { codigo: "A004", descricao: "Feijão Carioca - Saco 5kg", unidade: "Saco", preco: 32.00, categoria: "alimentacao" },
        { codigo: "A005", descricao: "Macarrão Parafuso - Pacote 500g", unidade: "Pacote", preco: 4.50, categoria: "alimentacao" },
        { codigo: "A006", descricao: "Óleo de Soja - Garrafa 900ml", unidade: "Garrafa", preco: 7.80, categoria: "alimentacao" },
        { codigo: "A007", descricao: "Frango Congelado - Kg", unidade: "Kg", preco: 18.90, categoria: "alimentacao" },
        { codigo: "A008", descricao: "Carne Bovina Moída - Kg", unidade: "Kg", preco: 32.00, categoria: "alimentacao" },
        { codigo: "A009", descricao: "Banana Prata - Kg", unidade: "Kg", preco: 6.50, categoria: "alimentacao" },
        { codigo: "A010", descricao: "Maçã - Kg", unidade: "Kg", preco: 8.90, categoria: "alimentacao" },
        { codigo: "A011", descricao: "Suco Natural - Litro", unidade: "Litro", preco: 12.00, categoria: "alimentacao" },
        { codigo: "A012", descricao: "Iogurte Natural - Bandeja 6 unidades", unidade: "Bandeja", preco: 15.50, categoria: "alimentacao" }
      ]
    },
    higiene: {
      "Fornecedor C - Higiene Pessoal": [
        { codigo: "H001", descricao: "Fralda Descartável G - Pacote 8 unidades", unidade: "Pacote", preco: 35.00, categoria: "higiene" },
        { codigo: "H002", descricao: "Lenço Umedecido - Pacote 100 unidades", unidade: "Pacote", preco: 12.90, categoria: "higiene" },
        { codigo: "H003", descricao: "Sabonete Líquido Infantil - 1 litro", unidade: "Litro", preco: 18.50, categoria: "higiene" },
        { codigo: "H004", descricao: "Shampoo Infantil - 500ml", unidade: "Frasco", preco: 15.00, categoria: "higiene" },
        { codigo: "H005", descricao: "Condicionador Infantil - 500ml", unidade: "Frasco", preco: 15.00, categoria: "higiene" },
        { codigo: "H006", descricao: "Creme para Assadura - 100g", unidade: "Tubo", preco: 22.00, categoria: "higiene" },
        { codigo: "H007", descricao: "Papel Higiênico - Fardo 16 rolos", unidade: "Fardo", preco: 28.00, categoria: "higiene" },
        { codigo: "H008", descricao: "Toalha de Papel - Pacote 2 rolos", unidade: "Pacote", preco: 8.50, categoria: "higiene" },
        { codigo: "H009", descricao: "Escova de Dente Infantil", unidade: "Unidade", preco: 4.50, categoria: "higiene" },
        { codigo: "H010", descricao: "Creme Dental Infantil - 100g", unidade: "Tubo", preco: 6.90, categoria: "higiene" }
      ]
    },
    limpeza: {
      "Fornecedor D - Limpeza": [
        { codigo: "L001", descricao: "Desinfetante - 5 litros", unidade: "Galão", preco: 25.00, categoria: "limpeza" },
        { codigo: "L002", descricao: "Água Sanitária - 5 litros", unidade: "Galão", preco: 18.00, categoria: "limpeza" },
        { codigo: "L003", descricao: "Detergente Neutro - 500ml", unidade: "Frasco", preco: 3.50, categoria: "limpeza" },
        { codigo: "L004", descricao: "Sabão em Pó - 1kg", unidade: "Pacote", preco: 12.90, categoria: "limpeza" },
        { codigo: "L005", descricao: "Amaciante de Roupas - 2 litros", unidade: "Frasco", preco: 15.00, categoria: "limpeza" },
        { codigo: "L006", descricao: "Álcool 70% - 1 litro", unidade: "Litro", preco: 12.00, categoria: "limpeza" },
        { codigo: "L007", descricao: "Pano de Chão - Pacote 5 unidades", unidade: "Pacote", preco: 22.00, categoria: "limpeza" },
        { codigo: "L008", descricao: "Vassoura de Pelo", unidade: "Unidade", preco: 18.50, categoria: "limpeza" },
        { codigo: "L009", descricao: "Rodo 40cm", unidade: "Unidade", preco: 15.00, categoria: "limpeza" },
        { codigo: "L010", descricao: "Balde 20 litros", unidade: "Unidade", preco: 12.00, categoria: "limpeza" },
        { codigo: "L011", descricao: "Luva de Borracha - Par", unidade: "Par", preco: 8.50, categoria: "limpeza" },
        { codigo: "L012", descricao: "Saco de Lixo 100L - Pacote 10 unidades", unidade: "Pacote", preco: 18.00, categoria: "limpeza" }
      ]
    }
  };

  const handleUploadXML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    toast.success("XML carregado com sucesso!");
    // Aqui seria implementado o parse do XML
  };

  const handleAdicionarItem = () => {
    if (!itemSelecionado || quantidade <= 0) {
      toast.error("Selecione um item e quantidade válida");
      return;
    }

    const fornecedores = fornecedoresPorCategoria[categoriaAtiva];
    const todosItens = Object.values(fornecedores).flat();
    const item = todosItens.find(i => i.codigo === itemSelecionado);

    if (!item) return;

    const novoItem: ItemPedido = {
      id: `${turmaSelecionada}-${item.codigo}-${Date.now()}`,
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      preco: item.preco,
      quantidade: quantidade,
      subtotal: item.preco * quantidade,
      categoria: categoriaAtiva
    };

    setPedidosPorTurma(prev => ({
      ...prev,
      [turmaSelecionada]: [...(prev[turmaSelecionada] || []), novoItem]
    }));

    setItemSelecionado("");
    setQuantidade(1);
    toast.success("Item adicionado ao pedido!");
  };

  const handleRemoverItem = (id: string) => {
    setPedidosPorTurma(prev => ({
      ...prev,
      [turmaSelecionada]: prev[turmaSelecionada].filter(item => item.id !== id)
    }));
    toast.success("Item removido do pedido");
  };

  const handleGerarPlanilha = () => {
    if (itensPedidoAtual.length === 0) {
      toast.error("Adicione itens ao pedido antes de gerar a planilha");
      return;
    }

    const turmaNome = turmas.find(t => t.id === turmaSelecionada)?.nome || "Turma";
    const dataAtual = new Date().toLocaleDateString('pt-BR');
    const horaAtual = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    // Criar workbook
    const wb = XLSX.utils.book_new();
    
    // Agrupar itens por categoria e fornecedor
    const itensPorCategoriaFornecedor: Record<string, Record<string, ItemPedido[]>> = {};
    
    itensPedidoAtual.forEach(item => {
      const categoria = item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1);
      const fornecedor = obterFornecedorPorCategoria(item.categoria);
      
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
    dados.push({ A: "Turma:", B: turmaNome });
    dados.push({ A: "Data de Emissão:", B: dataAtual });
    dados.push({ A: "Hora:", B: horaAtual });
    dados.push({ A: "Responsável:", B: "Ana Silva - Coordenadora Pedagógica" });
    dados.push({});
    
    let itemGlobal = 1;
    let totalGeral = 0;

    // ITENS POR CATEGORIA E FORNECEDOR
    Object.entries(itensPorCategoriaFornecedor).forEach(([categoria, fornecedores], catIndex) => {
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
    const nomeArquivo = `Pedido_${turmaNome.replace(/\s/g, '_')}_${dataAtual.replace(/\//g, '-')}.xlsx`;
    
    XLSX.writeFile(wb, nomeArquivo);
    
    toast.success(`Planilha profissional gerada: ${nomeArquivo}`);
  };

  const obterFornecedorPorCategoria = (categoria: string): string => {
    const fornecedores = fornecedoresPorCategoria[categoria];
    if (fornecedores) {
      return Object.keys(fornecedores)[0] || "Fornecedor não especificado";
    }
    return "Fornecedor não especificado";
  };

  const totalPedido = itensPedidoAtual.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos de Materiais</h1>
          <p className="text-muted-foreground">Gerencie pedidos por turma</p>
        </div>
        <Button onClick={handleGerarPlanilha} disabled={itensPedidoAtual.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Gerar Planilha Excel
        </Button>
      </div>

      {/* Seletor de Turma */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <School className="h-5 w-5" />
            Selecione a Turma
          </CardTitle>
          <CardDescription>Cada turma tem seu próprio pedido de materiais</CardDescription>
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

        {Object.entries(fornecedoresPorCategoria).map(([categoria, fornecedores]) => (
          <TabsContent key={categoria} value={categoria} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>
                  {categoria === "pedagogico" && "📚 Materiais Pedagógicos"}
                  {categoria === "alimentacao" && "🍽️ Alimentos"}
                  {categoria === "higiene" && "🧼 Higiene Pessoal"}
                  {categoria === "limpeza" && "🧹 Limpeza"}
                </CardTitle>
                <CardDescription>
                  {categoria === "pedagogico" && "Tinta, papel, canetão, canetinha, pincel, TNT, EVA, cola, etc"}
                  {categoria === "alimentacao" && "Café da manhã, almoço, lanche da tarde, jantar"}
                  {categoria === "higiene" && "Fraldas, lenços, sabonete, shampoo, produtos de higiene"}
                  {categoria === "limpeza" && "Desinfetante, água sanitária, produtos de limpeza"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Fornecedor</Label>
                    <Select value={fornecedorSelecionado} onValueChange={setFornecedorSelecionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o fornecedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.keys(fornecedores).map(fornecedor => (
                          <SelectItem key={fornecedor} value={fornecedor}>
                            {fornecedor}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Select value={itemSelecionado} onValueChange={setItemSelecionado}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o item" />
                      </SelectTrigger>
                      <SelectContent>
                        {fornecedorSelecionado && fornecedores[fornecedorSelecionado]?.map(item => (
                          <SelectItem key={item.codigo} value={item.codigo}>
                            {item.descricao} - R$ {item.preco.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <div className="flex gap-2">
                      <Input
                        type="number"
                        min="1"
                        value={quantidade}
                        onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                      />
                      <Button onClick={handleAdicionarItem}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Tabela de Itens do Pedido */}
      {itensPedidoAtual.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido - {turmas.find(t => t.id === turmaSelecionada)?.nome}</CardTitle>
            <CardDescription>
              {itensPedidoAtual.length} {itensPedidoAtual.length === 1 ? 'item adicionado' : 'itens adicionados'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Categoria</TableHead>
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
                    <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {item.categoria.charAt(0).toUpperCase() + item.categoria.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.quantidade}</TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell>R$ {item.preco.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold">R$ {item.subtotal.toFixed(2)}</TableCell>
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
                <TableRow className="bg-muted/50 font-semibold">
                  <TableCell colSpan={7} className="text-right">TOTAL:</TableCell>
                  <TableCell className="text-lg">R$ {totalPedido.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {itensPedidoAtual.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground text-center">
              Nenhum item adicionado ao pedido da turma {turmas.find(t => t.id === turmaSelecionada)?.nome}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Selecione uma categoria acima e adicione itens ao pedido
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

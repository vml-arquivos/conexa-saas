import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Upload, FileText, Download, Plus, Trash2, ShoppingCart, Palette, UtensilsCrossed, Sparkles, Droplets } from "lucide-react";
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

export default function PedidosMateriais() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [categoriaAtiva, setCategoriaAtiva] = useState<string>("pedagogico");
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [itensFornecedor, setItensFornecedor] = useState<ItemFornecedor[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([]);

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
        { codigo: "L010", descricao: "Balde 20 litros", unidade: "Unidade", preco: 25.00, categoria: "limpeza" },
        { codigo: "L011", descricao: "Saco de Lixo 100 litros - Pacote 10 unidades", unidade: "Pacote", preco: 18.00, categoria: "limpeza" },
        { codigo: "L012", descricao: "Luva de Borracha - Par", unidade: "Par", preco: 8.50, categoria: "limpeza" }
      ]
    }
  };

  const handleUploadXML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Simulação de parse de XML
      toast.success(`Arquivo ${file.name} carregado com sucesso!`);
      // Aqui você implementaria o parse real do XML
    }
  };

  const handleAdicionarItem = () => {
    if (!itemSelecionado || quantidade <= 0) {
      toast.error("Selecione um item e quantidade válida");
      return;
    }

    const item = itensFornecedor.find(i => i.codigo === itemSelecionado);
    if (!item) return;

    const novoItem: ItemPedido = {
      id: Math.random().toString(36).substr(2, 9),
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      preco: item.preco,
      quantidade: quantidade,
      subtotal: item.preco * quantidade,
      categoria: item.categoria
    };

    setItensPedido([...itensPedido, novoItem]);
    setItemSelecionado("");
    setQuantidade(1);
    toast.success("Item adicionado ao pedido");
  };

  const handleRemoverItem = (id: string) => {
    setItensPedido(itensPedido.filter(item => item.id !== id));
    toast.success("Item removido do pedido");
  };

  const handleGerarPlanilha = () => {
    if (itensPedido.length === 0) {
      toast.error("Adicione itens ao pedido primeiro");
      return;
    }

    try {
      // Agrupar itens por categoria
      const itensPorCategoria: Record<string, ItemPedido[]> = {
        pedagogico: [],
        alimentacao: [],
        higiene: [],
        limpeza: []
      };

      itensPedido.forEach(item => {
        if (itensPorCategoria[item.categoria]) {
          itensPorCategoria[item.categoria].push(item);
        }
      });

      // Criar workbook
      const wb = XLSX.utils.book_new();

      // Adicionar planilha para cada categoria que tem itens
      Object.entries(itensPorCategoria).forEach(([categoria, itens]) => {
        if (itens.length === 0) return;

        const nomeCategoria = 
          categoria === "pedagogico" ? "Pedagógico" :
          categoria === "alimentacao" ? "Alimentação" :
          categoria === "higiene" ? "Higiene Pessoal" : "Limpeza";

        // Cabeçalho
        const dados = [
          ["CEPI ARARA CANINDÉ - PEDIDO DE MATERIAIS"],
          [nomeCategoria],
          [],
          ["Item", "Código", "Produto", "Categoria", "Quantidade", "Unidade", "Preço Unit.", "Subtotal"],
        ];

        // Adicionar itens
        itens.forEach((item, index) => {
          dados.push([
            index + 1,
            item.codigo,
            item.descricao,
            nomeCategoria,
            item.quantidade,
            item.unidade,
            `R$ ${item.preco.toFixed(2)}`,
            `R$ ${item.subtotal.toFixed(2)}`
          ]);
        });

        // Total da categoria
        const totalCategoria = itens.reduce((sum, item) => sum + item.subtotal, 0);
        dados.push([]);
        dados.push(["TOTAL", "", "", "", "", "", "", `R$ ${totalCategoria.toFixed(2)}`]);

        // Criar worksheet
        const ws = XLSX.utils.aoa_to_sheet(dados);

        // Definir larguras das colunas
        ws['!cols'] = [
          { wch: 6 },  // Item
          { wch: 10 }, // Código
          { wch: 40 }, // Produto
          { wch: 15 }, // Categoria
          { wch: 12 }, // Quantidade
          { wch: 10 }, // Unidade
          { wch: 12 }, // Preço Unit.
          { wch: 12 }  // Subtotal
        ];

        // Adicionar ao workbook
        XLSX.utils.book_append_sheet(wb, ws, nomeCategoria);
      });

      // Adicionar planilha resumo com todos os itens
      const dadosResumo = [
        ["CEPI ARARA CANINDÉ - PEDIDO DE MATERIAIS - RESUMO GERAL"],
        [],
        ["Item", "Código", "Produto", "Categoria", "Quantidade", "Unidade", "Preço Unit.", "Subtotal"],
      ];

      itensPedido.forEach((item, index) => {
        const nomeCategoria = 
          item.categoria === "pedagogico" ? "Pedagógico" :
          item.categoria === "alimentacao" ? "Alimentação" :
          item.categoria === "higiene" ? "Higiene Pessoal" : "Limpeza";

        dadosResumo.push([
          index + 1,
          item.codigo,
          item.descricao,
          nomeCategoria,
          item.quantidade,
          item.unidade,
          `R$ ${item.preco.toFixed(2)}`,
          `R$ ${item.subtotal.toFixed(2)}`
        ]);
      });

      const totalGeral = calcularTotal();
      dadosResumo.push([]);
      dadosResumo.push(["TOTAL GERAL", "", "", "", "", "", "", `R$ ${totalGeral.toFixed(2)}`]);

      const wsResumo = XLSX.utils.aoa_to_sheet(dadosResumo);
      wsResumo['!cols'] = [
        { wch: 6 },  // Item
        { wch: 10 }, // Código
        { wch: 40 }, // Produto
        { wch: 15 }, // Categoria
        { wch: 12 }, // Quantidade
        { wch: 10 }, // Unidade
        { wch: 12 }, // Preço Unit.
        { wch: 12 }  // Subtotal
      ];

      XLSX.utils.book_append_sheet(wb, wsResumo, "Resumo Geral");

      // Gerar arquivo
      const dataAtual = new Date().toLocaleDateString('pt-BR').replace(/\//g, '-');
      const nomeArquivo = `Pedido_Materiais_CEPI_${dataAtual}.xlsx`;
      XLSX.writeFile(wb, nomeArquivo);

      toast.success("Planilha Excel gerada com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar planilha:", error);
      toast.error("Erro ao gerar planilha Excel");
    }
  };

  const calcularTotal = () => {
    return itensPedido.reduce((total, item) => total + item.subtotal, 0);
  };

  const handleSelecionarFornecedor = (fornecedor: string) => {
    setFornecedorSelecionado(fornecedor);
    setItensFornecedor(fornecedoresPorCategoria[categoriaAtiva][fornecedor] || []);
    setItemSelecionado("");
  };

  const getCategoriaIcon = (categoria: string) => {
    switch (categoria) {
      case "pedagogico": return <Palette className="h-5 w-5" />;
      case "alimentacao": return <UtensilsCrossed className="h-5 w-5" />;
      case "higiene": return <Sparkles className="h-5 w-5" />;
      case "limpeza": return <Droplets className="h-5 w-5" />;
      default: return <ShoppingCart className="h-5 w-5" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pedidos de Materiais</h1>
          <p className="text-muted-foreground">Gerencie pedidos por categoria</p>
        </div>
        <Button onClick={handleGerarPlanilha} disabled={itensPedido.length === 0}>
          <Download className="mr-2 h-4 w-4" />
          Gerar Planilha Excel
        </Button>
      </div>

      <Tabs value={categoriaAtiva} onValueChange={setCategoriaAtiva} className="space-y-4">
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

        {["pedagogico", "alimentacao", "higiene", "limpeza"].map((categoria) => (
          <TabsContent key={categoria} value={categoria} className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getCategoriaIcon(categoria)}
                  {categoria === "pedagogico" && "Materiais Pedagógicos"}
                  {categoria === "alimentacao" && "Alimentação"}
                  {categoria === "higiene" && "Higiene Pessoal"}
                  {categoria === "limpeza" && "Limpeza da Escola"}
                </CardTitle>
                <CardDescription>
                  {categoria === "pedagogico" && "Tinta, papel, canetão, canetinha, pincel, TNT, EVA, cola, etc"}
                  {categoria === "alimentacao" && "Café da manhã, almoço, lanche da tarde, jantar"}
                  {categoria === "higiene" && "Fraldas, lenços, sabonete, shampoo, produtos de higiene"}
                  {categoria === "limpeza" && "Produtos e materiais de limpeza da escola"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Upload de XML */}
                <div className="border-2 border-dashed rounded-lg p-6 text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-sm text-muted-foreground mb-4">
                    Faça upload do XML com a tabela de preços do fornecedor
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xml"
                    onChange={handleUploadXML}
                    className="hidden"
                  />
                  <Button onClick={() => fileInputRef.current?.click()} variant="outline">
                    <FileText className="mr-2 h-4 w-4" />
                    Selecionar Arquivo XML
                  </Button>
                </div>

                {/* Seleção de Fornecedor */}
                <div className="space-y-2">
                  <Label>Fornecedor</Label>
                  <Select value={fornecedorSelecionado} onValueChange={handleSelecionarFornecedor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o fornecedor" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.keys(fornecedoresPorCategoria[categoria]).map((fornecedor) => (
                        <SelectItem key={fornecedor} value={fornecedor}>
                          {fornecedor}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Seleção de Item */}
                {fornecedorSelecionado && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2 space-y-2">
                      <Label>Item</Label>
                      <Select value={itemSelecionado} onValueChange={setItemSelecionado}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o item" />
                        </SelectTrigger>
                        <SelectContent>
                          {itensFornecedor.map((item) => (
                            <SelectItem key={item.codigo} value={item.codigo}>
                              {item.descricao} - R$ {item.preco.toFixed(2)} / {item.unidade}
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Lista de Itens do Pedido */}
      {itensPedido.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
            <CardDescription>
              {itensPedido.length} {itensPedido.length === 1 ? "item adicionado" : "itens adicionados"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensPedido.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono">{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        {getCategoriaIcon(item.categoria)}
                        {item.categoria === "pedagogico" && "Pedagógico"}
                        {item.categoria === "alimentacao" && "Alimentação"}
                        {item.categoria === "higiene" && "Higiene"}
                        {item.categoria === "limpeza" && "Limpeza"}
                      </Badge>
                    </TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell className="text-right">R$ {item.preco.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantidade}</TableCell>
                    <TableCell className="text-right font-semibold">R$ {item.subtotal.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoverItem(item.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell colSpan={6} className="text-right font-semibold">Total:</TableCell>
                  <TableCell className="text-right font-bold text-lg">
                    R$ {calcularTotal().toFixed(2)}
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

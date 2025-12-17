import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Upload, FileText, Download, Plus, Trash2, ShoppingCart } from "lucide-react";
import { toast } from "sonner";

interface ItemFornecedor {
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
}

interface ItemPedido {
  id: string;
  codigo: string;
  descricao: string;
  unidade: string;
  preco: number;
  quantidade: number;
  subtotal: number;
}

export default function PedidosMateriais() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fornecedorSelecionado, setFornecedorSelecionado] = useState<string>("");
  const [itensFornecedor, setItensFornecedor] = useState<ItemFornecedor[]>([]);
  const [itemSelecionado, setItemSelecionado] = useState<string>("");
  const [quantidade, setQuantidade] = useState<number>(1);
  const [itensPedido, setItensPedido] = useState<ItemPedido[]>([]);

  // Simulação de dados de fornecedores (normalmente viriam do XML)
  const fornecedoresExemplo: Record<string, ItemFornecedor[]> = {
    "Fornecedor A - Papelaria": [
      { codigo: "001", descricao: "Papel A4 - Resma 500 folhas", unidade: "Resma", preco: 25.90 },
      { codigo: "002", descricao: "Caneta Esferográfica Azul", unidade: "Caixa c/ 50", preco: 35.00 },
      { codigo: "003", descricao: "Lápis Preto nº 2", unidade: "Caixa c/ 144", preco: 48.00 },
      { codigo: "004", descricao: "Borracha Branca", unidade: "Caixa c/ 40", preco: 18.50 },
      { codigo: "005", descricao: "Apontador com Depósito", unidade: "Caixa c/ 24", preco: 22.00 }
    ],
    "Fornecedor B - Material Escolar": [
      { codigo: "101", descricao: "Caderno Brochura 96 folhas", unidade: "Unidade", preco: 8.90 },
      { codigo: "102", descricao: "Pasta Plástica com Elástico", unidade: "Unidade", preco: 3.50 },
      { codigo: "103", descricao: "Cola Branca 90g", unidade: "Unidade", preco: 4.20 },
      { codigo: "104", descricao: "Tesoura sem Ponta", unidade: "Unidade", preco: 7.80 },
      { codigo: "105", descricao: "Régua 30cm", unidade: "Unidade", preco: 2.50 }
    ],
    "Fornecedor C - Limpeza": [
      { codigo: "201", descricao: "Álcool Gel 70% - 500ml", unidade: "Unidade", preco: 12.90 },
      { codigo: "202", descricao: "Papel Toalha - Rolo", unidade: "Pacote c/ 6", preco: 28.00 },
      { codigo: "203", descricao: "Sabonete Líquido - 5L", unidade: "Galão", preco: 45.00 },
      { codigo: "204", descricao: "Desinfetante - 5L", unidade: "Galão", preco: 38.50 },
      { codigo: "205", descricao: "Saco de Lixo 100L", unidade: "Pacote c/ 100", preco: 55.00 }
    ]
  };

  const handleUploadXML = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xml')) {
      toast.error("Por favor, selecione um arquivo XML válido");
      return;
    }

    // Simulação de parse do XML
    // Em produção, aqui seria feito o parse real do arquivo XML
    toast.success(`Arquivo ${file.name} carregado com sucesso!`);
    
    // Simular carregamento de dados do XML
    const fornecedorNome = "Fornecedor Importado - " + file.name.replace('.xml', '');
    const itensImportados: ItemFornecedor[] = [
      { codigo: "XML001", descricao: "Item Importado do XML 1", unidade: "Unidade", preco: 15.00 },
      { codigo: "XML002", descricao: "Item Importado do XML 2", unidade: "Caixa", preco: 45.00 },
      { codigo: "XML003", descricao: "Item Importado do XML 3", unidade: "Pacote", preco: 32.50 }
    ];

    setFornecedorSelecionado(fornecedorNome);
    setItensFornecedor(itensImportados);
    toast.info(`${itensImportados.length} itens importados do XML`);
  };

  const handleSelecionarFornecedor = (fornecedor: string) => {
    setFornecedorSelecionado(fornecedor);
    setItensFornecedor(fornecedoresExemplo[fornecedor] || []);
    setItemSelecionado("");
  };

  const handleAdicionarItem = () => {
    if (!itemSelecionado || quantidade <= 0) {
      toast.error("Selecione um item e informe a quantidade");
      return;
    }

    const item = itensFornecedor.find(i => i.codigo === itemSelecionado);
    if (!item) return;

    const itemPedido: ItemPedido = {
      id: Date.now().toString(),
      codigo: item.codigo,
      descricao: item.descricao,
      unidade: item.unidade,
      preco: item.preco,
      quantidade: quantidade,
      subtotal: item.preco * quantidade
    };

    setItensPedido([...itensPedido, itemPedido]);
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
      toast.error("Adicione itens ao pedido antes de gerar a planilha");
      return;
    }

    // Em produção, aqui seria gerado um arquivo Excel real
    // Usando bibliotecas como xlsx ou exceljs
    
    let csvContent = "Código,Descrição,Unidade,Preço Unit.,Quantidade,Subtotal\n";
    itensPedido.forEach(item => {
      csvContent += `${item.codigo},${item.descricao},${item.unidade},R$ ${item.preco.toFixed(2)},${item.quantidade},R$ ${item.subtotal.toFixed(2)}\n`;
    });
    csvContent += `\n,,,Total:,,R$ ${valorTotal.toFixed(2)}`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `pedido_${fornecedorSelecionado.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("Planilha gerada e baixada com sucesso!");
  };

  const valorTotal = itensPedido.reduce((acc, item) => acc + item.subtotal, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Pedidos de Materiais</h1>
          <p className="text-muted-foreground mt-2">Gerencie pedidos e importação de catálogos de fornecedores</p>
        </div>
        <Button onClick={handleGerarPlanilha} className="gap-2" disabled={itensPedido.length === 0}>
          <Download className="h-4 w-4" />
          Gerar Planilha
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingCart className="h-5 w-5" />
              Novo Pedido
            </CardTitle>
            <CardDescription>Selecione o fornecedor e adicione os itens</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Importar Catálogo XML</Label>
              <div className="flex gap-2">
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept=".xml"
                  onChange={handleUploadXML}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="gap-2 flex-1"
                >
                  <Upload className="h-4 w-4" />
                  Carregar XML do Fornecedor
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Importe o arquivo XML com a tabela de preços do fornecedor
              </p>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Ou selecione um fornecedor</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Select value={fornecedorSelecionado} onValueChange={handleSelecionarFornecedor}>
                <SelectTrigger id="fornecedor">
                  <SelectValue placeholder="Selecione um fornecedor" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(fornecedoresExemplo).map((fornecedor) => (
                    <SelectItem key={fornecedor} value={fornecedor}>{fornecedor}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {itensFornecedor.length > 0 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="item">Item</Label>
                  <Select value={itemSelecionado} onValueChange={setItemSelecionado}>
                    <SelectTrigger id="item">
                      <SelectValue placeholder="Selecione um item" />
                    </SelectTrigger>
                    <SelectContent>
                      {itensFornecedor.map((item) => (
                        <SelectItem key={item.codigo} value={item.codigo}>
                          {item.codigo} - {item.descricao} - R$ {item.preco.toFixed(2)}/{item.unidade}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="quantidade">Quantidade</Label>
                    <Input
                      id="quantidade"
                      type="number"
                      min="1"
                      value={quantidade}
                      onChange={(e) => setQuantidade(parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div className="flex items-end">
                    <Button onClick={handleAdicionarItem} className="w-full gap-2">
                      <Plus className="h-4 w-4" />
                      Adicionar
                    </Button>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Resumo do Pedido
            </CardTitle>
            <CardDescription>
              {itensPedido.length} {itensPedido.length === 1 ? 'item' : 'itens'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Fornecedor:</span>
                <span className="font-medium">{fornecedorSelecionado || '-'}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Itens:</span>
                <span className="font-medium">{itensPedido.length}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-2 border-t">
                <span>Total:</span>
                <span className="text-primary">R$ {valorTotal.toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {itensPedido.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Itens do Pedido</CardTitle>
            <CardDescription>Revise os itens antes de gerar a planilha</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right">Preço Unit.</TableHead>
                  <TableHead className="text-right">Qtd.</TableHead>
                  <TableHead className="text-right">Subtotal</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {itensPedido.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-mono text-sm">{item.codigo}</TableCell>
                    <TableCell>{item.descricao}</TableCell>
                    <TableCell>{item.unidade}</TableCell>
                    <TableCell className="text-right">R$ {item.preco.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.quantidade}</TableCell>
                    <TableCell className="text-right font-medium">R$ {item.subtotal.toFixed(2)}</TableCell>
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
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

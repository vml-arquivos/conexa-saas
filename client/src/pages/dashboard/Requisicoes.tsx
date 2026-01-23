import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Check, X, Loader2, Package, ListChecks, ArrowDownToLine } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';

// Mock de dados para simular o estado inicial
const MOCK_INVENTORY = [
  { id: 'inv1', name: 'Papel Sulfite A4', category: 'Pedagógico', quantity: 150, unit: 'resma', lastPrice: 25.90 },
  { id: 'inv2', name: 'Caneta Azul', category: 'Escritório', quantity: 50, unit: 'un', lastPrice: 1.50 },
  { id: 'inv3', name: 'Leite Integral', category: 'Alimentação', quantity: 30, unit: 'caixa', lastPrice: 48.00 },
  { id: 'inv4', name: 'Sabonete Líquido', category: 'Higiene', quantity: 10, unit: 'galão', lastPrice: 45.00 },
];

const MOCK_REQUISITIONS = [
  {
    id: 'req1',
    requestDate: new Date('2025-12-20'),
    status: 'PENDING',
    requester: { name: 'Prof. Ana' },
    school: { name: 'Berçário I - Turma A' },
    items: [
      { id: 'ri1', quantity: 5, item: MOCK_INVENTORY[0] },
      { id: 'ri2', quantity: 10, item: MOCK_INVENTORY[1] },
    ],
    reason: 'Reposição de material didático para o próximo trimestre.',
  },
  {
    id: 'req2',
    requestDate: new Date('2025-12-15'),
    status: 'APPROVED',
    requester: { name: 'Coord. João' },
    school: { name: 'Maternal II - Turma B' },
    items: [
      { id: 'ri3', quantity: 2, item: MOCK_INVENTORY[2], approvedQty: 2 },
    ],
    reason: 'Urgente para o lanche da tarde.',
  },
];

// Componente de Nova Requisição
const NovaRequisicao = ({ inventory, onRequisitionCreated }: { inventory: typeof MOCK_INVENTORY, onRequisitionCreated: () => void }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [reason, setReason] = useState('');
  const [items, setItems] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    const item = inventory.find(i => i.id === selectedItem);
    if (!item || quantity <= 0) {
      toast({ title: 'Erro', description: 'Selecione um item e uma quantidade válida.', variant: 'destructive' });
      return;
    }

    const existingItem = items.find(i => i.itemId === selectedItem);
    if (existingItem) {
      setItems(items.map(i => i.itemId === selectedItem ? { ...i, quantity: i.quantity + quantity } : i));
    } else {
      setItems([...items, { itemId: selectedItem, quantity, item }]);
    }

    setSelectedItem('');
    setQuantity(1);
  };

  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter(i => i.itemId !== itemId));
  };

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast({ title: 'Erro', description: 'Adicione pelo menos um item à requisição.', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulação de chamada de API POST /api/requisitions
      // Na implementação real, usaria a rota criada no backend
      const payload = {
        requesterId: 'mock-requester-id', // ID do usuário logado
        schoolId: 'mock-school-id', // ID da escola do usuário logado
        reason,
        items: items.map(i => ({ itemId: i.itemId, quantity: i.quantity })),
      };

      console.log('Payload de Requisição:', payload);
      
      // Simulação de sucesso
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      toast({ title: 'Sucesso', description: 'Requisição de materiais enviada com sucesso!', variant: 'default' });
      setItems([]);
      setReason('');
      onRequisitionCreated();

    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao enviar a requisição.', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Nova Requisição de Materiais</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="item">Item do Estoque</Label>
            <Select value={selectedItem} onValueChange={setSelectedItem}>
              <SelectTrigger id="item">
                <SelectValue placeholder="Selecione um item" />
              </SelectTrigger>
              <SelectContent>
                {inventory.map(item => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.name} ({item.quantity} {item.unit} em estoque)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade Necessária</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          <div className="flex items-end">
            <Button onClick={handleAddItem} className="w-full" disabled={!selectedItem || quantity <= 0}>
              <Plus className="w-4 h-4 mr-2" /> Adicionar
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="reason">Motivo da Requisição (Opcional)</Label>
          <Textarea
            id="reason"
            placeholder="Ex: Reposição de estoque, projeto pedagógico específico, etc."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </div>

        {items.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Itens a Requisitar ({totalItems} no total)</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-right">Quantidade</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((reqItem) => (
                  <TableRow key={reqItem.itemId}>
                    <TableCell className="font-medium">{reqItem.item.name}</TableCell>
                    <TableCell>{reqItem.item.category}</TableCell>
                    <TableCell className="text-right">{reqItem.quantity} {reqItem.item.unit}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => handleRemoveItem(reqItem.itemId)}>
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <Button onClick={handleSubmit} className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Check className="w-4 h-4 mr-2" />
              )}
              {isSubmitting ? 'Enviando...' : 'Enviar Requisição'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Componente de Lista de Requisições
const ListaRequisicoes = ({ requisitions, isApprovalView = false, onStatusChange }: { requisitions: typeof MOCK_REQUISITIONS, isApprovalView?: boolean, onStatusChange: (id: string, status: 'APPROVED' | 'REJECTED') => void }) => {
  const { toast } = useToast();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge variant="secondary" className="bg-yellow-500 text-white">Pendente</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-500 text-white">Aprovada</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejeitada</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleApprove = async (id: string) => {
    setLoadingId(id);
    try {
      // Simulação de chamada de API PATCH /api/requisitions/:id/status
      // Na implementação real, usaria a rota criada no backend
      console.log(`Aprovando requisição ${id}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      onStatusChange(id, 'APPROVED');
      toast({ title: 'Sucesso', description: `Requisição ${id} aprovada e estoque atualizado!`, variant: 'default' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao aprovar a requisição.', variant: 'destructive' });
    } finally {
      setLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setLoadingId(id);
    try {
      // Simulação de chamada de API PATCH /api/requisitions/:id/status
      console.log(`Rejeitando requisição ${id}`);
      await new Promise(resolve => setTimeout(resolve, 1500)); 
      
      onStatusChange(id, 'REJECTED');
      toast({ title: 'Sucesso', description: `Requisição ${id} rejeitada.`, variant: 'default' });
    } catch (error) {
      toast({ title: 'Erro', description: 'Falha ao rejeitar a requisição.', variant: 'destructive' });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          {isApprovalView ? <ListChecks className="w-5 h-5" /> : <Package className="w-5 h-5" />}
          <span>{isApprovalView ? 'Requisições Pendentes de Aprovação' : 'Minhas Requisições'}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Número</TableHead>
              <TableHead>Escola/Turma</TableHead>
              <TableHead>Solicitante</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Itens</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requisitions.map((req) => (
              <TableRow key={req.id}>
                <TableCell className="font-medium">{req.id}</TableCell>
                <TableCell>{req.school.name}</TableCell>
                <TableCell>{req.requester.name}</TableCell>
                <TableCell>{req.requestDate.toLocaleDateString('pt-BR')}</TableCell>
                <TableCell>{req.items.length} itens</TableCell>
                <TableCell>{getStatusBadge(req.status)}</TableCell>
                <TableCell className="text-right flex justify-end space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        Detalhes
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Detalhes da Requisição {req.id}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <p><strong>Solicitante:</strong> {req.requester.name}</p>
                        <p><strong>Escola:</strong> {req.school.name}</p>
                        <p><strong>Motivo:</strong> {req.reason || 'Não informado'}</p>
                        <p><strong>Status:</strong> {getStatusBadge(req.status)}</p>
                        <h4 className="font-semibold mt-4">Itens Solicitados:</h4>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Item</TableHead>
                              <TableHead>Categoria</TableHead>
                              <TableHead className="text-right">Qtd. Solicitada</TableHead>
                              <TableHead className="text-right">Qtd. Aprovada</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {req.items.map((item) => (
                              <TableRow key={item.id}>
                                <TableCell>{item.item.name}</TableCell>
                                <TableCell>{item.item.category}</TableCell>
                                <TableCell className="text-right">{item.quantity} {item.item.unit}</TableCell>
                                <TableCell className="text-right">{item.approvedQty ?? '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </DialogContent>
                  </Dialog>

                  {isApprovalView && req.status === 'PENDING' && (
                    <>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(req.id)}
                        disabled={loadingId === req.id}
                      >
                        {loadingId === req.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(req.id)}
                        disabled={loadingId === req.id}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    <ArrowDownToLine className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

// Componente Principal
const Requisicoes = () => {
  const [requisitions, setRequisitions] = useState(MOCK_REQUISITIONS);
  const [inventory, setInventory] = useState(MOCK_INVENTORY);
  const [activeTab, setActiveTab] = useState('nova');

  // Simulação de atualização de dados após uma ação
  const handleRequisitionCreated = () => {
    // Simular que a nova requisição foi adicionada à lista
    const newReq = {
      id: `req${requisitions.length + 1}`,
      requestDate: new Date(),
      status: 'PENDING',
      requester: { name: 'Prof. Novo' },
      school: { name: 'Berçário I - Turma A' },
      items: [{ id: 'riX', quantity: 1, item: inventory[0] }],
      reason: 'Teste de nova requisição.',
    };
    setRequisitions([newReq, ...requisitions]);
    setActiveTab('aprovacao'); // Mudar para a aba de aprovação para ver a nova
  };

  const handleStatusChange = (id: string, status: 'APPROVED' | 'REJECTED') => {
    setRequisitions(prev => prev.map(req => req.id === id ? { ...req, status } : req));
    
    // Simular decremento de estoque
    if (status === 'APPROVED') {
      const req = requisitions.find(r => r.id === id);
      if (req) {
        setInventory(prevInv => prevInv.map(invItem => {
          const reqItem = req.items.find(item => item.item.id === invItem.id);
          if (reqItem) {
            return { ...invItem, quantity: invItem.quantity - reqItem.quantity };
          }
          return invItem;
        }));
      }
    }
  };

  const pendingRequisitions = useMemo(() => requisitions.filter(req => req.status === 'PENDING'), [requisitions]);
  const myRequisitions = useMemo(() => requisitions.filter(req => req.requester.name === 'Prof. Ana' || req.requester.name === 'Prof. Novo'), [requisitions]); // Mock para "Minhas Requisições"

  return (
    <div className="space-y-6 p-6">
      <h1 className="text-3xl font-bold flex items-center space-x-3">
        <ListChecks className="w-8 h-8" />
        <span>Gestão de Requisições de Materiais</span>
      </h1>
      <p className="text-gray-500">Fluxo de solicitação e aprovação de materiais de consumo e pedagógicos.</p>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="nova">
            <Plus className="w-4 h-4 mr-2" /> Nova Requisição
          </TabsTrigger>
          <TabsTrigger value="minhas">
            <Package className="w-4 h-4 mr-2" /> Minhas Requisições
          </TabsTrigger>
          <TabsTrigger value="aprovacao">
            <ListChecks className="w-4 h-4 mr-2" /> Aprovação ({pendingRequisitions.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="nova" className="mt-4">
          <NovaRequisicao inventory={inventory} onRequisitionCreated={handleRequisitionCreated} />
        </TabsContent>

        <TabsContent value="minhas" className="mt-4">
          <ListaRequisicoes requisitions={myRequisitions} onStatusChange={handleStatusChange} />
        </TabsContent>

        <TabsContent value="aprovacao" className="mt-4">
          <ListaRequisicoes requisitions={pendingRequisitions} isApprovalView={true} onStatusChange={handleStatusChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Requisicoes;

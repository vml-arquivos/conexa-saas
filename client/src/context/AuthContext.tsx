import React, { createContext, useContext, useState, ReactNode } from 'react';

// Definição dos tipos
type UserRole = 'Professor' | 'Coordenador' | 'Diretor';

interface AuthUser {
  id: string;
  name: string;
  role: UserRole;
  turmaId: string | null; // ID da turma para professores, null para coordenadores/diretores (que veem tudo)
}

interface AuthContextType {
  user: AuthUser | null;
  login: (role: UserRole, turmaId?: string) => void;
  logout: () => void;
  isProfessor: boolean;
  isCoordenador: boolean;
  isDiretor: boolean;
}

// Mock de usuários para simulação
const MOCK_USERS = {
  professor: { id: 'prof1', name: 'Prof. Maria Santos', role: 'Professor' as UserRole, turmaId: '1' }, // Turma 1: Berçário I - Turma A
  coordenador: { id: 'coord1', name: 'Coord. João', role: 'Coordenador' as UserRole, turmaId: null },
  diretor: { id: 'dir1', name: 'Diretora Ana', role: 'Diretor' as UserRole, turmaId: null },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(MOCK_USERS.professor); // Começa logado como Professor para teste

  const login = (role: UserRole, turmaId: string | null = null) => {
    let newUser: AuthUser;
    if (role === 'Professor' && turmaId) {
      newUser = { ...MOCK_USERS.professor, name: `Prof. Teste - Turma ${turmaId}`, turmaId };
    } else if (role === 'Coordenador') {
      newUser = MOCK_USERS.coordenador;
    } else if (role === 'Diretor') {
      newUser = MOCK_USERS.diretor;
    } else {
      // Fallback para professor da turma 1
      newUser = MOCK_USERS.professor;
    }
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const isProfessor = user?.role === 'Professor';
  const isCoordenador = user?.role === 'Coordenador';
  const isDiretor = user?.role === 'Diretor';

  return (
    <AuthContext.Provider value={{ user, login, logout, isProfessor, isCoordenador, isDiretor }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Componente de simulação de login para facilitar a troca de perfis
export const MockLoginSelector = () => {
  const { login, user } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Professor');
  const [selectedTurma, setSelectedTurma] = useState(user?.turmaId || '1');

  const handleLogin = () => {
    login(selectedRole as UserRole, selectedRole === 'Professor' ? selectedTurma : null);
  };

  // Mock de Turmas para o seletor
  const MOCK_TURMAS_SELECT = [
    { id: '1', nome: 'Berçário I - Turma A' },
    { id: '2', nome: 'Berçário I - Turma B' },
    { id: '3', nome: 'Berçário II - Turma A' },
    { id: '4', nome: 'Maternal I - Turma A' },
    { id: '5', nome: 'Maternal II - Turma A' },
  ];

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white space-y-3">
      <h3 className="text-lg font-semibold">Simulação de Login</h3>
      <div className="flex items-center space-x-4">
        <div className="space-y-2">
          <Label htmlFor="role-select">Perfil</Label>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger id="role-select" className="w-[180px]">
              <SelectValue placeholder="Selecione o Perfil" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Professor">Professor</SelectItem>
              <SelectItem value="Coordenador">Coordenador</SelectItem>
              <SelectItem value="Diretor">Diretor</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {selectedRole === 'Professor' && (
          <div className="space-y-2">
            <Label htmlFor="turma-select">Turma</Label>
            <Select value={selectedTurma} onValueChange={setSelectedTurma}>
              <SelectTrigger id="turma-select" className="w-[180px]">
                <SelectValue placeholder="Selecione a Turma" />
              </SelectTrigger>
              <SelectContent>
                {MOCK_TURMAS_SELECT.map(turma => (
                  <SelectItem key={turma.id} value={turma.id}>
                    {turma.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Button onClick={handleLogin} className="self-end">
          Logar como {selectedRole}
        </Button>
      </div>
      {user && (
        <p className="text-sm text-muted-foreground">
          Logado como: <strong>{user.name}</strong> ({user.role}) {user.turmaId && `| Turma ID: ${user.turmaId}`}
        </p>
      )}
    </div>
  );
};

# 🏫 CEPI Arara Canindé - Sistema de Gestão Escolar

Sistema completo de gestão escolar desenvolvido especificamente para o **CEPI Arara Canindé**, focado em educação infantil (berçário e maternal - 0 a 4 anos).

![Status](https://img.shields.io/badge/status-production-success)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## 📋 Sobre o Projeto

Sistema de gestão escolar moderno e intuitivo, desenvolvido para facilitar o gerenciamento de creches e centros de educação infantil. Oferece funcionalidades completas para gestão de alunos, turmas, planejamentos pedagógicos, agenda digital e muito mais.

### 🎯 Instituição

**Nome:** CEPI Arara Canindé  
**Mantenedora:** Associação Beneficente Coração de Cristo - ABCC  
**Endereço:** Quadra 307, Conjunto 11, Lote 01 - Recanto das Emas - DF  
**Telefones:** (61) 3575-4125 / 3575-4119  
**WhatsApp:** 3686-2843  
**E-mail:** cepiararacaninde.abcc@gmail.com  
**Modalidade:** Educação Infantil (0-4 anos)  
**Período:** Integral (07:00 - 18:00)

---

## ✨ Funcionalidades

### 📊 Dashboard e Visão Geral
- Métricas em tempo real
- Indicadores de desempenho
- Atividades recentes
- Insights inteligentes

### 👶 Gestão de Alunos
- Cadastro completo de alunos (0-4 anos)
- Informações de saúde (alergias, medicamentos)
- Dados de rotina (sono, alimentação, fralda)
- Upload de documentos (certidão, vacinação, fotos)
- Controle total: Criar, Editar, Excluir

### 🏫 Gestão de Turmas
- Organização por faixa etária (Berçário I, II, Maternal I, II)
- Controle de capacidade e vagas
- Atribuição de professores
- Gerenciamento de salas e horários
- Controle total: Criar, Editar, Excluir

### 📅 Agenda Digital
- Calendário de eventos e atividades
- Agendamento de reuniões
- Notificações automáticas
- Controle total: Criar, Editar, Excluir eventos

### 📖 Planejamentos Pedagógicos
- Templates específicos para educação infantil
- Planejamentos adaptados por faixa etária
- Gestão de objetivos, atividades e materiais
- Controle total: Criar, Editar, Excluir

### 💻 Visualização do Projeto
- Preview do sistema ao vivo
- Visualização de código-fonte
- Estrutura do projeto
- Stack tecnológica
- Download do projeto completo

---

## 🚀 Tecnologias

### Frontend
- **React** 19.2.1
- **Vite** 7.1.9
- **TypeScript** 5.6.3
- **TailwindCSS** 4.1.14
- **Radix UI** - Componentes acessíveis
- **Wouter** - Roteamento
- **Framer Motion** - Animações
- **Sonner** - Notificações

### Backend
- **Express** 4.21.2
- **Node.js**

---

## 📦 Instalação

### Pré-requisitos
- Node.js 18+ 
- pnpm 8+

### Passos

1. **Clone o repositório**
```bash
git clone https://github.com/vml-arquivos/conexa-saas.git
cd conexa-saas
```

2. **Instale as dependências**
```bash
pnpm install
```

3. **Execute em modo desenvolvimento**
```bash
pnpm run dev
```

4. **Acesse o sistema**
```
http://localhost:5173
```

---

## 🏗️ Build para Produção

```bash
# Build do frontend
pnpm run build

# Executar em produção
NODE_ENV=production node dist/index.js
```

---

## 📁 Estrutura do Projeto

```
conexa-saas/
├── client/                 # Frontend React
│   ├── src/
│   │   ├── components/    # Componentes reutilizáveis
│   │   ├── pages/         # Páginas do sistema
│   │   │   └── dashboard/ # 14 páginas do dashboard
│   │   ├── layouts/       # Layouts
│   │   └── App.tsx        # Componente principal
│   └── index.html
├── server/                # Backend Express
│   └── src/
│       └── index.ts       # Servidor HTTP
├── package.json
├── vite.config.ts
└── README.md
```

---

## 🔐 Autenticação

### Credenciais de Demonstração
- **Email:** demo@auraclass.com
- **Senha:** password

---

## 🚀 Deploy

### Vercel (Recomendado)
```bash
npm i -g vercel
vercel
```

### Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod
```

---

## 📝 Licença

Este projeto está sob a licença MIT.

---

## 📞 Contato

**CEPI Arara Canindé**  
📧 cepiararacaninde.abcc@gmail.com  
📱 WhatsApp: (61) 3686-2843  
📞 Telefones: (61) 3575-4125 / 3575-4119

---

**Versão:** 1.0.0  
**Status:** ✅ Produção  
**Desenvolvido com ❤️ por Manus AI**

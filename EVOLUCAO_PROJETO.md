# 🚀 Registro de Evolução - CheckHotel

Este arquivo documenta a progressão do projeto, decisões técnicas e novas funcionalidades implementadas.

---

## [2026-04-18] - Sincronização Offline e CRUD Administrativo

### ✨ Novas Funcionalidades
- **Gestão de Usuários Avançada:**
    - Sistema de **Inativação de Contas** (Soft Delete) para preservação de histórico.
    - Geração automática de **Senhas Temporárias** aleatórias no cadastro e reset.
    - Implementação de flag `requiresNewPassword` para fluxo de primeiro acesso.
    - Interface atualizada com feedback visual para usuários ativos/inativos.
- **Sincronização Offline Híbrida:** 
    - Implementação de persistência local via **IndexedDB (Dexie.js)**.
    - Motor de sincronização que prioriza dados (JSON) antes de fotos (Blobs).
    - Centro de Sincronização para gestão de rascunhos e erros de rede.
- **CRUD Completo do Painel Admin:**
    - Criadas páginas de gestão para **Usuários**, **Camareiras**, **Quartos** e **Checklist**.
    - Implementados modais de **Criação** e **Edição** com Server Actions.
    - Implementada função de **Exclusão** com confirmação.
- **Otimização de Mídia:**
    - Compressão automática de imagens no cliente antes do armazenamento/upload.
- **Correções de Build (CI/CD):**
    - Correção de erro de lint (`react/no-unescaped-entities`) no componente de quartos.
    - Correção de tipagem do TypeScript nas Server Actions (uso de Enums do Prisma).
    - Implementação de senha padrão (`checkhotel123`) para novos usuários, satisfazendo requisitos do esquema do banco de dados.

### 🛠️ Ajustes Técnicos
- **Idempotência na API:** O endpoint `/api/inspections` agora evita duplicidade de vistorias para o mesmo quarto no mesmo dia.
- **Design System:** Implementação de um componente `Modal` premium e padronização visual do painel admin com Tailwind CSS.
- **UX:** Adicionado `SyncIndicator` global para feedback de status de rede e sincronia.

### 📦 Dependências Adicionadas
- `dexie`: Persistência local.
- `browser-image-compression`: Otimização de fotos.
- `uuid`: Geração de IDs únicos locais.

---

## [Anterior] - Fundação do Projeto
- Configuração inicial com Next.js 14 (App Router).
- Autenticação via NextAuth.js.
- Modelagem do banco de dados com Prisma e PostgreSQL.
- Layout base PWA.

# CheckHotel 🏨 - Sistema PWA Completo de Vistoria de Quartos

Bem-vindo à documentação oficial do projeto **CheckHotel**. Este sistema foi projetado e construído para agilizar as operações de um hotel, gerenciar o desempenho da limpeza e o status de acesso aos quartos usando as mais modernas tecnologias web progressivas (PWA) e Server-Side Rendering.

---

## 🚀 Tecnologias Integradas (A Stack)

Este projeto foi construído usando uma arquitetura moderna Full-Stack:

- **Framework Core:** [Next.js 14](https://nextjs.org/) (App Router + Server Components)
- **Design Web UI/UX:** [Tailwind CSS](https://tailwindcss.com/) com design premium focado em micro-interações (Animações CSS), Layout Mobile-First
- **Banco de Dados Relacional:** [PostgreSQL](https://www.postgresql.org/)
- **ORM & Gestão de Dados:** [Prisma ORM](https://www.prisma.io/)
- **Autenticação Avançada:** [NextAuth.js v4](https://next-auth.js.org/) utilizando estratégia baseada em JWT, Middleware de redirecionamento nativo do Next.js, com controle RBAC (Role-Based Access Control).
- **Progressive Web App (PWA):** `next-pwa` configurado com Workbox para caching offline do app Mobile.
- **Relatórios:** API nativa NodeJS renderizando em server-side usando `@react-pdf/renderer`.
- **E-mails Transacionais:** Nodemailer configurado aguardando parametrização SMTP.
- **Hasing de Segurança:** `bcryptjs` para preservação segura de senhas no Banco de Dados.

---

## ⚙️ Detalhes de Arquitetura e Implementação

### 1. Modelagem do Banco de Dados (Schema)
O sistema conta com as estruturas primárias já prontas em `prisma/schema.prisma`:
- **Users**: Perfis Administrativos e Recepcionistas. Controle de senha e tokens ativos.
- **Maids (Camareiras)**: Para que os relatórios de vistoria sejam atrelados às equipes de limpeza locais acompanhando a recorrência de "Problemas" gerados por camareira.
- **Rooms (Quartos)**: Com tracking persistente do seu status: *LIVRE*, *PENDENTE* (Ocupado com Limpeza/Acesso), *APROVADO*, e *SEM ACESSO* (Ocupado sem permissão/Não perturbe).
- **ChecklistItems**: Estruturas globais e unificadas de checklist do hotel. Permitindo ativar/inativar na tela do painel e reordenação.
- **Inspections & Photos**: Tabelas 1-N que associam os dados gerados pelas recepcionistas com fotos geradas pela captura mobile e observações abertas.

### 2. Perfis e Controle RBAC
O *Middleware* local (`src/middleware.ts`) barra preventivamente e obriga a sessão ativa do usuário. Em caso de perfis:
- **`ADMIN`**: Redirecionado para a rota e painéis desktop: `/admin/*`. Tem o escopo de visualizar taxas de aprovação, histórico, controle dos usuários, reordenação de Checklist e métricas das camareiras.
- **`USER`** (Recepcionista/Inspetor): Redirecionado para a interface PWA e layout focado no uso Mobile e Ágil: `/app/*`. Apenas possui navegação para as listagens de quartos e envio de formulários offline (persistência de rascunhos IndexEDB e Background Sync em caso de queda de rede).

### 3. Progressive Web App & Offline
A pasta superior do App conta com configurações vitais e Manifests.
- Ao abrir o CheckHotel no Safari (iOS) ou Chrome (Android), a interface de Inspeção (`/app/vistoria/[id]`) funciona de forma auto-contida.
- O campo de foto nativo possui diretriz DOM `capture="environment"`, forçando o celular a acender a Câmera Traseira nativa do aparelho de imediato, e processando a foto local pelo `URL.createObjectURL` para performance na hora da exibição de Thumbnail, para então processar como objeto Blob/Form-Data para envio na rota.

### 4. Geração de Relatórios PDF Backend
Se a vistoria no frontend for classificada como contendo um DEFEITO/PROBLEMA (Status de Item como ISSUE), a função de visualização e compilação de laudo gera um PDF on-demand no servidor na rota estática e serializada baseada no identificador do relatório `/api/inspections/[id]/pdf`. 

### 5. Configuração de Variáveis de Ambiente (`.env`)
Um arquivo `.env` padrão requer parametrização para produção, contendo:
- `DATABASE_URL`: A connection string do Postgres em Produção.
- `NEXTAUTH_SECRET`: String aleatória secreta para encriptar sessão gerada global.
- `NEXTAUTH_URL`: Domínio Absoluto. Cuidado, o NextAuth utiliza isso obrigatoriamente (ex: `https://app.meuhotel.com.br`).

---

## 🚢 Passos para Implantação em Produção (Deploy VPS & EasyPanel)

Abaixo o guia consolidado para implantação na nuvem controlada em formato de Conteiner ou Node puro em sua VPS, usando plataformas como o EasyPanel gerenciar ambientes Dockerizados ou deploy customizado.

### 1. Preparação Local / GitHub
1. Certifique-se de realizar o commit total de seu projeto para o seu repositório remoto Git particular.
2. Certifique-se que `.env` está inserido no arquivo `.gitignore` (Ele é bloqueado por padrão pelo Nexjs) com fins de segurança para os containers.

### 2. Configurando o EasyPanel
1. Acesse o painel do seu EasyPanel e crie um **Novo Projeto**.
2. **Setup do PostgreSQL** (Se não for externo): 
   - No fluxo de serviços Adicione "Database Postgres". Guarde a string de conexão fornecida.
3. **No seu Projeto Node/Next.js no EasyPanel**:
   - Vá na configuração, Conecte seu Github Repo, selecione a Branch Padrão (ex: `main`), e set as ferramentas como Source (Build/App).

### 3. Variáveis de Aplicação
Na aba "Environment" na seção de configuração WebApp no EasyPanel, insira:

```ini
DATABASE_URL="postgresql://user:senha@seu-host:5432/checkhotel_db"
NEXTAUTH_URL="https://seu-dominio-configurado-no-painel.com"
NEXTAUTH_SECRET="gerar-uma-string-bem-longa-e-aleatoria-base64"
PORT="3000"
NODE_ENV="production"
```

### 4. Setup do Deploy & Build Steps
Normalmente imagens puras do Node ou templates Buildpacks conseguem montar o Next.js sozinhos. Mas a nossa etapa precisa que o schema do Prisma seja preparado e migrado pro banco ao gerar as imagens. No EasyPanel você pode declarar os `Build Command` e os `Start Command` de acordo.

1. **Build Command**: 
   ```bash
   npm install && npx prisma generate && npx prisma migrate deploy && npm run build
   ```
   *(Atenção: O Prisma exigirá as VARIÁVEIS de database já presentes na aba environment na hora de dar o Build).*
   
2. **Start Command**:
   ```bash
   npm start
   ```

3. **Deploy (Subir Produção)**:
   - Clique em Deploy/Rebuild no app do EasyPanel. O serviço instalará tudo, subirá as tabelas pro banco virgem, compilará todo o App Next.js offline cache e subirá na porta 3000 amarrada ao seu reverse proxy.

### 5. Setup do Primeiro Administrador 🔑
Com a aplicação em branco na nuvem, você vai precisar do primeiro usuário ADMIN para logar. Como não podemos criar do App:
- **No Console do EasyPanel / Conexão SSH / Ou CLI do Postgres**: Entre no prompt de banco de dados diretamente no shell da VPS e injete o seed manualmente.
- *Ou Localmente:* Na sua máquina de testes utilize o `npx prisma studio` apontando o `DATABASE_URL` momentaneamente para a Nuvem, e insira uma conta "Usuario" direto pela interface garantindo a "Role" igual a `ADMIN`. *(Siga um mock manual com a senha de hash criptografado temporário de base)*.

🎉 **Você terminou. Toda a infraestrutura foi enviada da Branch direto para os clientes offline.**
O projeto compilará as views App/Admin conforme modelagem arquitetural para escalar com sucesso.

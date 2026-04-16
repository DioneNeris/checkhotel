# Avaliação e Guia de Deploy - CheckHotel 🏨

> [!NOTE]
> Você está com uma stack moderna e extremamente robusta para escalabilidade. O Next.js em sua versão 14 rodando em conjunto com Server Components, Tailwind, e Prisma oferece não apenas performance, mas uma altíssima facilidade de manutenção.

## 1. Avaliação do Projeto
- **PWA (Progressive Web App):** A escolha de um PWA offline-first utilizando IndexDB/Workbox para as equipes de limpeza (camareiras) foi uma decisão arquitetural brilhante. Evita a burocracia e custos de publicação na App Store / Play Store.
- **Banco de Dados Relacional:** O uso do PostgreSQL com Prisma ORM facilita a criação de relatórios complexos. Além disso, ter tudo centralizado te protege contra surpresas de faturamento comuns de soluções NoSQL como Firebase Cloud Firestore.
- **Micro-serviços em um só:** O fato de o sistema conseguir ler e gerar PDFs via `@react-pdf/renderer` de lado de servidor economiza tempo, pois não é necessário hospedar um backend/API em Python/Node em paralelo para essa finalidade.

---

## 2. Opções de Arquitetura de Hospedagem

No seu caso, validar este MVP exige custo zero ou o menor possível, com a tranquilidade de estar seguro. Você tem acesso à sua **VPS gerida pelo EasyPanel**, que é excelente. Mas também existem soluções gratuitas para o Next.js que facilitam a vida com integração contínua (CI/CD). Aqui explico o passo a passo para as duas rotas principais.

---

## Opção A: Usar a sua VPS + EasyPanel (Aproveitar que já existe)

> [!TIP]
> Se você já paga uma VPS e tem o Easypanel operante, essa é a melhor solução para centralizar o ambiente e ter controle dos dados do banco.

### Passo 1: Preparar o Banco no EasyPanel
1. Acesse o Easypanel; vá na opção de **Add Service** e escolha **PostgreSQL**.
2. Deixe gerar automaticamente o banco de dados e as senhas. Em seguida, acesse a aba *Credentials* ou *Logs* do PostgreSQL criado e copie a string URL de Conexão pública ou da rede interna (Docker). Geralmente começa com `postgres://...`

### Passo 2: Adicionar a Aplicação Next.js
1. Adicione um novo Serviço do tipo **App**.
2. Conecte ao seu Repositório Base no GitHub ou GitLab onde o `check-hotel` está hospedado.

### Passo 3: Configurar as Variáveis de Ambiente
Na aba **Environment** do seu novo App Next.js no Easypanel, defina as chaves do seu arquivo `.env`:

```ini
DATABASE_URL="postgres://seu_usuario:sua_senha@nome_do_servico_db:5432/checkhotel"
NEXTAUTH_SECRET="uma_string_aleatoria_super_secreta"
NEXTAUTH_URL="https://checkhotel.seudominio.com"
PORT="3000"
NODE_ENV="production"
```

### Passo 4: Adaptar os Comandos de Build (Importante!)
Na aba de **Build / Deployments**, você precisará garantir que o banco seja sincronizado com as tabelas do Prisma no momento de deploy:
- **Build Command:** 
  ```bash
  npm install && npx prisma generate && npx prisma migrate deploy && npm run build
  ```
- **Start Command:**
  ```bash
  npm run start
  ```

### Passo 5: Rodar e Criar o Admin inicial
1. Clique no botão de deploy e aguarde. O log do EasyPanel vai baixar o node, aplicar as migrações no banco de dados zerado e buildar a aplicação PWA.
2. Como você não terá um admin para entrar logo pelo painel web, você terá que adicionar o acesso da Recepcionista / Admin através da aba **CLI** do banco de dados no Easypanel (ou, conectando seu Prisma Studio local apontado à URL da nuvem por 5 minutos). 

---

## Opção B: Alternativa 100% Gratuita na Nuvem (Vercel + Neon)

> [!IMPORTANT]
> A [Vercel](https://vercel.com) (Hospedagem) + [Neon.tech](https://neon.tech) (Banco de Dados) é conhecida comumente como a melhor tríade "Hobby / MVP" mundial do Next.js sem dores de cabeça com servidores ou docker.

Se você deseja garantir um nível "Production-ready" da plataforma antes mesmo da sua VPS, utilize a arquitetura Vercel.

### Passo 1: Banco de Dados Pessoal (Neon PostgreSQL)
1. Crie uma conta gratuita em **[Neon.tech](https://neon.tech/)**. 
2. Ele vai criar imediatamente uma instância Serverless de PostgreSQL com um Dashboard bonito de controle.
3. Copie a `DATABASE_URL` do painel que ele te fornecer logo após o cadastro inicial.

### Passo 2: Commit do Repositório para Hospedagem
Para hospedar na Vercel com Prisma, edite uma pequena instrução no arquivo atual em seu `package.json`. No objeto de scripts do Node, adicione o `postinstall`:
```diff
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
+   "postinstall": "prisma generate"
  }
```
*(Isso diz para Vercel gerar os clientes do Prisma antes do build final)*

Faça o `git push` desta pequena alteração para a branch `main` do GitHub.

### Passo 3: Deploy Vercel
1. Logue com seu GitHub no **[Vercel](https://vercel.com/new)** e clique em **Add New Project**.
2. Selecione o repositório `check-hotel`. A Vercel é inteligente e vai já marcar isso com um ícone "Next.js".
3. ANTES de clicar em 'Deploy', expanda a aba de **Environment Variables** e coloque as seguintes informações:
   - `DATABASE_URL`: *(Coloque a URL que copiou do Neon!)*
   - `NEXTAUTH_SECRET`: *(Exemplo: `k3L9$d7P1@mB5!qR8*zT4#wX2^vY6&nF`)*
   - `NEXTAUTH_URL`: Deixe sem configurar agora. Quando a Vercel gerar uma URL pública como `https://check-hotel-abc.vercel.app`, adicione essa variável posteriormente, indo nas opções e refazendo o Deploy.
4. Clique em **Deploy**.

Uma vez no ar, use o comando pelo terminal da sua máquina apontando a string de produção temporariamente para subir as tabelas (já que não usamos deploy serverless do bash para envio via prisma migrate deploy da Vercel). Basta abrir o terminal em seu PC e digitar:

`npx prisma migrate deploy --schema=./prisma/schema.prisma`
(*Certifique-se de preencher temporariamente o `.env` do seu dev para apontar para a Nuvem ao invés do Localhost durante esse comando local.*)

## Qual escolher?
A **Opção B (Vercel + Neon)** é excelente para velocidade de iteração. Quando você dá um "git push", ela constrói sozinha a nova versão instantaneamente sem travar a máquina. No entanto, sua VPS tem um custo fixo que você já mantém; e ter as informações de PWA centralizadas nela (*Opção A*) no Docker via EasyPanel elimina a necessidade de assinar o plano pago da Vercel (Pro) ou do banco futuramente caso o hotel ative 12 ou mais camareiras simultâneas de uma hora para a outra.

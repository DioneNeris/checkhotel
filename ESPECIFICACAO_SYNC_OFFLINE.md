# Especificação Técnica: Fluxo Offline & Sincronização (CheckHotel) 🏨

Este documento detalha o design e os requisitos técnicos para a implementação da funcionalidade de operação offline e sincronização híbrida do sistema CheckHotel.

---

## 1. Visão Geral
O objetivo é permitir que os inspetores realizem vistorias completas (incluindo fotos) em áreas do hotel com sinal de internet instável ou inexistente, garantindo a integridade dos dados e o feedback visual constante sobre o status do envio.

## 2. Decisões de Arquitetura (Decision Log)

- **Modelo de Sync:** Híbrido (Background + Visual). O sistema tenta enviar automaticamente, mas mantém uma fila visível para o usuário.
- **Camada de Persistência:** IndexedDB via **Dexie.js**.
- **Estratégia de Envio:** Prioridade de Dados. O checklist (JSON) é enviado primeiro; fotos (Blobs) são enviadas em segundo plano.
- **Processamento de Imagem:** Compressão no lado do cliente (Client-side) antes do armazenamento local.
- **Regra de Negócio (Edição):** Edições permitidas apenas para vistorias da **data atual**. Registros de datas passadas são imutáveis.
- **Tratamento de Erros:** Fotos corrompidas são descartadas e o sistema solicita uma nova captura manual.

## 3. Estrutura de Dados Local (IndexedDB)

### Tabela: `inspectionsQueue`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | string (UUID) | Identificador local único. |
| `roomId` | string | ID do quarto vinculado. |
| `roomStatus` | string | Status pós-vistoria (FREE, PENDING, etc). |
| `items` | array | Lista de itens do checklist (status + observações). |
| `createdAt` | date | Data de criação (usada para a regra de imutabilidade). |
| `syncStatus` | enum | `pending`, `data_synced`, `error`, `expired`. |
| `serverId` | string | ID retornado pelo banco de dados após o primeiro sync. |

### Tabela: `photosQueue`
| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | auto-increment | ID único. |
| `inspectionLocalId` | string | FK para `inspectionsQueue.id`. |
| `checklistItemId` | string | ID do item do checklist vinculado à foto. |
| `file` | Blob | Arquivo de imagem comprimido. |
| `status` | enum | `pending`, `uploading`, `error`. |

## 4. Fluxo de Trabalho (Data Flow)

### A. Captura e Compressão
1. O usuário finaliza a vistoria no formulário.
2. O sistema utiliza a biblioteca `browser-image-compression` para reduzir as fotos (Max: 1280px / 0.7 qualidade).
3. Os dados são salvos no Dexie.js e a tela de formulário é fechada, liberando o usuário para o próximo quarto.

### B. Motor de Sincronização (Sync Engine)
1. O motor varre a `inspectionsQueue` e envia o JSON para o endpoint `/api/inspections`.
2. Em caso de sucesso, o `serverId` é salvo e o status muda para `data_synced`.
3. O motor inicia o upload das fotos vinculadas aquele `serverId`.
4. Após o upload bem-sucedido de cada foto, ela é removida do IndexedDB local para liberar espaço.

### C. Interface de Usuário (UX)
1. **Indicador Global:** Um ícone na interface indica o progresso (ex: "Sincronizando...").
2. **Centro de Sincronização:** Uma tela lista as vistorias pendentes.
3. **Resgate de Erro:** Se uma foto falhar permanentemente, um botão "Capturar Novamente" aparece para o usuário substituir o arquivo.

## 5. Regras de Segurança e Integridade
- **Idempotência no Servidor:** A API de destino deve verificar se uma vistoria para aquele quarto e data já existe antes de criar duplicatas.
- **Validação de Data:** O sistema deve bloquear edições se `Date.now()` for diferente da data de criação da vistoria (considerando o dia do hotel).

---
*Documento gerado automaticamente via Brainstorming Skill - 18/04/2026*

# InterCon Consultoria Imobiliária — Site

Site institucional e de listagem de imóveis da InterCon Consultoria Imobiliária (Campo Grande - MS), publicado gratuitamente pelo GitHub Pages e administrado por um painel próprio (Decap CMS) — **sem precisar editar código ou arquivos JSON na mão**.

- 🌐 Site: https://interconconsultoria.com.br/ (domínio próprio, com HTTPS ativo)
- 🔐 Painel de administração: https://interconconsultoria.com.br/admin/
- 📦 Repositório: https://github.com/rafaelcorrea2308-cmd/intercon-imoveis
- 🔗 Link alternativo (sempre funciona, mesmo se o domínio próprio tiver problema): https://rafaelcorrea2308-cmd.github.io/intercon-imoveis/

**Status atual:** 7 imóveis cadastrados. Site com ~44MB (majoritariamente fotos de imóveis em `assets/anuncios/`), bem abaixo do limite de 1GB recomendado pelo GitHub Pages.

---

## Como adicionar, editar ou remover um imóvel

Todo o cadastro de imóveis é feito pelo **painel de administração**, não por edição manual de arquivos:

1. Acesse https://interconconsultoria.com.br/admin/
2. Faça login com sua conta do GitHub
3. Adicione, edite ou remova o imóvel pelo formulário (fotos, vídeos, preço, endereço, disponibilidade etc.)
4. Publique a alteração no painel

Depois de publicar, o GitHub Actions processa a mudança automaticamente e o site é atualizado em poucos minutos. Você pode acompanhar o andamento na aba [Actions](https://github.com/rafaelcorrea2308-cmd/intercon-imoveis/actions) do repositório.

**Não é necessário mexer em código para cadastrar imóveis.** As seções abaixo são para referência técnica de manutenção do site.

---

## Arquitetura

```
content/imoveis/*.json (um arquivo por imóvel, editado via painel)
        │
        ▼
scripts/build-properties.js (roda via GitHub Actions, valida os dados)
        │
        ▼
properties.json (gerado automaticamente)
        │
        ▼
GitHub Pages publica o site
```

- Cada imóvel é um arquivo `content/imoveis/{id}.json`, onde `{id}` é o mesmo valor do campo "id" dentro do arquivo. O build falha se o nome do arquivo e o id não baterem.
- O campo `id` é definido apenas na criação do imóvel e depois fica travado no painel (widget customizado `admin/locked-id-widget.js`), com checagem de duplicidade em tempo real via API do GitHub.
- Fotos e vídeos são cadastrados em campos separados no painel ("Fotos" e "Vídeos"). O `build-properties.js` reconstrói o campo `imagens` (formato que o `script.js` do site espera) a partir deles.
- O build roda automaticamente via GitHub Actions (`.github/workflows/build-properties.yml`) a cada push no `main`.

> ⚠️ **`properties.json` nunca deve ser editado manualmente.** Ele é gerado automaticamente a cada build e qualquer edição manual é sobrescrita.

---

## Domínio próprio e HTTPS

O domínio `interconconsultoria.com.br` foi registrado no Registro.br e configurado para apontar para o GitHub Pages:

- **Registros DNS:** 4 registros tipo A no domínio raiz (`185.199.108.153`, `.109.153`, `.110.153`, `.111.153`) + 1 registro CNAME do `www` apontando para `rafaelcorrea2308-cmd.github.io`
- **Arquivo `CNAME`** na raiz do repositório (gerado automaticamente pelo GitHub ao configurar o domínio em Settings → Pages) — não deve ser removido nem editado manualmente
- **HTTPS/certificado SSL:** emitido automaticamente via Let's Encrypt pelo próprio GitHub Pages, com "Enforce HTTPS" ativado (todo tráfego é redirecionado para `https://`)

Se precisar reconfigurar o domínio no futuro (ex: trocar de registrador ou de host), o passo a passo é: apontar os registros DNS acima → configurar "Custom domain" em Settings → Pages do repositório → aguardar emissão do certificado (pode levar de minutos a até algumas horas, mais ainda em domínios muito recém-registrados).

---

## Estrutura de arquivos

| Caminho | Descrição |
|---|---|
| `index.html` | Página inicial com a listagem de imóveis |
| `imovel.html` | Página de detalhe de um imóvel específico |
| `admin/` | Painel de administração (Decap CMS) e widgets customizados |
| `admin/config.yml` | Configuração das coleções e campos do painel |
| `admin/custom.css` | Estilos customizados do painel |
| `admin/locked-id-widget.js` | Widget que trava o campo ID e checa duplicidade |
| `admin/preview.js` | Template de pré-visualização customizado no painel |
| `admin/toolbar-button-style.js` | Estilização de botões da toolbar do painel (via JS, não CSS puro) |
| `admin/locale.js` / `admin/pt-locale-data.js` | Tradução do painel para português |
| `content/imoveis/*.json` | Um arquivo por imóvel — fonte de dados editada via painel |
| `scripts/build-properties.js` | Script que valida e gera o `properties.json` |
| `properties.json` | Arquivo gerado automaticamente — **não editar na mão** |
| `script.js` | Lógica do site (busca, filtros, listagem, detalhe) |
| `style.css` | Estilos do site |
| `assets/anuncios/` | Fotos e vídeos dos imóveis (maior parte do peso do repositório) |
| `assets/logo-share.png` | Imagem usada nas prévias de compartilhamento (WhatsApp, Facebook etc.) |
| `.github/workflows/build-properties.yml` | Workflow do GitHub Actions que roda o build a cada alteração |
| `CNAME` | Arquivo gerado automaticamente pelo GitHub — define o domínio próprio do site |

---

## Autenticação do painel

O login do painel (Decap CMS) usa GitHub OAuth através de um Cloudflare Worker (`intercon-oauth.rafaelcorrea2308.workers.dev`). O Client Secret desse OAuth App fica configurado apenas no Cloudflare Worker e nunca deve ser exposto em código, documentação ou conversas.

---

## Notas de manutenção

- Uma tentativa de migração do painel de Decap CMS para Sveltia CMS foi avaliada e **não seguiu adiante** por limitações da versão atual do Sveltia (campo de ID travado sem suporte, tema do editor não customizável). Detalhes em `admin/MIGRACAO-SVELTIA-NOTAS.md`, no branch `teste-sveltia`.
- Ao gerar um token de acesso (PAT) do GitHub para automações ou manutenção externa, use sempre um token de escopo restrito ao repositório (fine-grained, permissão "Contents: Read and write") e **revogue-o assim que a tarefa terminar**.

---

## Contato

Administrado por Edgar Oliveira Corrêa — Engenheiro Civil (CREA/MS 2546-D) e Corretor de Imóveis (CRECI/MS 2260).

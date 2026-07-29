# InterCon Consultoria Imobiliária — Site

Site institucional e de listagem de imóveis da InterCon Consultoria Imobiliária (Campo Grande - MS), publicado gratuitamente pelo GitHub Pages e administrado por um painel próprio (Decap CMS) — **sem precisar editar código ou arquivos JSON na mão**.

- 🌐 Site: https://interconconsultoria.com.br/
- 🔐 Painel de administração: https://interconconsultoria.com.br/admin/
- 📦 Repositório: https://github.com/rafaelcorrea2308-cmd/intercon-imoveis

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

- Cada imóvel é um arquivo content/imoveis/{id}.json, onde {id} é o mesmo valor do campo "id" dentro do arquivo. O build falha se o nome do arquivo e o id não baterem.
- O campo id é definido apenas na criação do imóvel e depois fica travado no painel (widget customizado admin/locked-id-widget.js), com checagem de duplicidade em tempo real via API do GitHub.
- Fotos e vídeos são cadastrados em campos separados no painel ("Fotos" e "Vídeos"). O build-properties.js reconstrói o campo imagens (formato que o script.js do site espera) a partir deles.

> ⚠️ **properties.json nunca deve ser editado manualmente.** Ele é gerado automaticamente a cada build e qualquer edição manual é sobrescrita.

---

## Estrutura de arquivos

| Caminho | Descrição |
|---|---|
| index.html | Página inicial com a listagem de imóveis |
| imovel.html | Página de detalhe de um imóvel específico |
| admin/ | Painel de administração (Decap CMS) e widgets customizados |
| content/imoveis/*.json | Um arquivo por imóvel — fonte de dados editada via painel |
| scripts/build-properties.js | Script que valida e gera o properties.json |
| properties.json | Arquivo gerado automaticamente — **não editar na mão** |
| script.js | Lógica do site (busca, filtros, listagem, detalhe) |
| style.css | Estilos do site |
| .github/workflows/ | Workflow do GitHub Actions que roda o build a cada alteração |

---

## Autenticação do painel

O login do painel (Decap CMS) usa GitHub OAuth através de um Cloudflare Worker (intercon-oauth.rafaelcorrea2308.workers.dev). O Client Secret desse OAuth App fica configurado apenas no Cloudflare Worker e nunca deve ser exposto em código, documentação ou conversas.

---

## Contato

Administrado por Edgar Oliveira Corrêa — Engenheiro Civil (CREA/MS 2546-D) e Corretor de Imóveis (CRECI/MS 2260).

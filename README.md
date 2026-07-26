# Intercon Imóveis

Sistema de catálogo imobiliário publicado com GitHub Pages, administrado pelo Decap CMS.

## Arquitetura

```
content/imoveis/*.json  ->  GitHub Actions (build-properties.js)  ->  properties.json  ->  GitHub Pages
```

- `index.html` - página inicial com a lista de imóveis
- `imovel.html` - página de detalhe de cada imóvel (link usado nos QR codes das placas)
- `content/imoveis/` - um arquivo `.json` por imóvel (fonte de verdade dos dados)
- `scripts/build-properties.js` - lê os arquivos de `content/imoveis/`, valida os dados e gera `properties.json`
- `properties.json` - arquivo gerado automaticamente, usado pelo site para montar a lista de imóveis
- `admin/` - painel Decap CMS para cadastrar e editar imóveis
- `.github/workflows/` - GitHub Actions que roda o build automaticamente a cada alteração em `content/imoveis/`

**Aviso importante:** não edite `properties.json` manualmente. Qualquer alteração feita direto nele será sobrescrita no próximo build. Para mudar um imóvel, edite o arquivo correspondente em `content/imoveis/` (ou use o painel em `/admin/`).

## Como administrar os imóveis

1. Acesse `/admin/` no site publicado
2. Faça login com sua conta do GitHub
3. Abra a coleção Imóveis
4. Cadastre um novo imóvel ou edite um existente
5. Salve - o Decap CMS faz o commit automaticamente em `content/imoveis/`
6. O GitHub Actions gera o novo `properties.json` e o GitHub Pages publica a atualização em poucos minutos

Para tirar um imóvel do ar sem perder o link/QR code, desmarque o campo Disponível em vez de excluir o imóvel.

### Preço conforme a finalidade

- Aluguel - o preço é sempre exibido por mês
- Venda - o preço é exibido como valor total, sem sufixo
- Temporada - use o campo Unidade de preço para escolher se o valor é por dia, por semana ou por mês

## Rodando localmente

Como o site usa `fetch('properties.json')`, ele precisa ser servido por um servidor local (não funciona abrindo o `index.html` direto pelo `file://`). Uma forma simples:

```
npx serve .
```

## Gerando o properties.json manualmente

```
node scripts/build-properties.js
```

O script valida os imóveis (id único, título, bairro, cidade, finalidade, tipo, preço, disponibilidade, WhatsApp) antes de gerar o arquivo. Se algum imóvel estiver com dado inválido, o script mostra os erros encontrados e não gera o `properties.json`.

## Domínio e QR codes

O link de cada imóvel é `https://SEU-DOMINIO/imovel.html?id=ID_DO_IMOVEL`. Esse link não muda enquanto o `id` do imóvel não for alterado, então o QR code impresso na placa continua funcionando mesmo que o imóvel fique indisponível temporariamente.

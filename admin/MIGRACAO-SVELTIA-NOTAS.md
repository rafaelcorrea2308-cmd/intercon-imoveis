# Notas — tentativa de migração Decap CMS → Sveltia CMS (jul/2026)

Testado no branch `teste-sveltia`. Resultado: **não migrar por enquanto.**

## O que funcionou
- `config.yml` — compatível quase sem alteração.
- `preview.js` (registerPreviewTemplate) — o card de pré-visualização
  customizado renderizou corretamente.

## O que bloqueou a migração
1. **`locked-id-widget.js` quebrado.** O Sveltia CMS ainda não implementa
   `registerFieldType`/`registerWidget` (aliases). Confirmado oficialmente
   como "Unimplemented" na documentação:
   https://sveltiacms.app/en/docs/api/field-types
   Está no roadmap para antes da versão 1.0, sem data definida.
   Sem isso, o campo de ID perde a checagem automática de duplicidade —
   proteção importante pro fluxo (evita sobrescrever imóvel por engano).

2. **Aparência do editor não é customizável via CSS externo.** Diferente
   do Decap, o Sveltia não expõe um jeito oficial de estilizar o editor
   em si (só a pré-visualização, via `registerPreviewStyle`). Pedido da
   comunidade em aberto desde 2023 sem solução:
   https://github.com/sveltia/sveltia-cms/issues/29
   Ou seja, não dá pra recriar o visual claro do Decap no formulário do
   Sveltia de forma confiável.

## Quando reavaliar
Revisitar quando o Sveltia CMS lançar a versão 1.0 (tem no roadmap deles)
ou quando as duas issues acima forem resolvidas. Repetir os mesmos
testes: campo `lockedid` e visual do editor.

## Como retestar
```
git fetch origin
git checkout teste-sveltia
git merge origin/main   # trazer mudanças do main pro branch de teste
```
Depois apontar o GitHub Pages temporariamente pro branch `teste-sveltia`
(Settings → Pages) pra ver o painel ao vivo, e reverter pro `main` depois.

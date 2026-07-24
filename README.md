# Intercon Consultoria Imobiliária — Guia rápido (sem programação)

Este site tem 3 partes:

- `index.html` — página inicial com todas as casas
- `imovel.html` — página de detalhe (é o link que vai no QR code de cada placa)
- `properties.json` — a "lista de casas". É o ÚNICO arquivo que você precisa editar para adicionar, remover ou atualizar um imóvel.

Você não precisa entender código. Só precisa saber editar um arquivo de texto e arrastar uma pasta num site.

---

## Passo 1 — Publicar o site de graça (Netlify)

1. Acesse **https://app.netlify.com/drop**
2. Arraste a pasta inteira `imobiliaria-site` (essa que eu criei) para a área de upload
3. Em alguns segundos o Netlify te dá um link tipo `https://intercon-imoveis-123.netlify.app`
4. Pronto — o site já está no ar, de graça, para sempre (sem cartão de crédito)

Depois, se quiser um endereço com o nome de vocês (ex: `correaimoveis.com.br`), dá pra comprar um domínio e apontar pro Netlify — isso eu te ajudo depois se quiser.

> Alternativas igualmente gratuitas: Vercel (vercel.com) ou GitHub Pages. O Netlify é o mais simples por arrastar-e-soltar.

---

## Passo 2 — Adicionar ou editar uma casa

Abra o arquivo `properties.json` em qualquer editor de texto (até o Bloco de Notas funciona, mas o **Notepad++** ou **VS Code** deixam mais fácil de não errar vírgula).

Cada casa é um bloco assim:

```json
{
  "id": "7",
  "titulo": "Casa no Bairro X",
  "bairro": "Bairro X",
  "cidade": "Campo Grande - MS",
  "preco": 1500,
  "quartos": 3,
  "banheiros": 2,
  "vagas": 1,
  "area": 120,
  "descricao": "Descreva a casa aqui.",
  "imagem": "https://link-da-foto.com/foto.jpg",
  "whatsapp": "5567998806767",
  "disponivel": true
}
```

Regras simples:
- **`id`**: um número único que não se repete entre as casas (ele forma o link da página)
- **`disponivel`**: mude para `false` quando a casa for alugada — ela some do site automaticamente, mas o link continua existindo (útil caso alguém escaneie uma placa antiga)
- Para adicionar uma casa nova, copie um bloco inteiro (entre `{` e `}`), cole depois do último, e separe os blocos com vírgula
- **`imagem`**: pode ser um link de foto (ex: hospedada no Google Fotos/Imgur) — depois te mostro como trocar por fotos reais das casas
- Depois de editar, salve o arquivo e arraste a pasta de novo no Netlify Drop (ou, se preferir, eu te mostro como conectar com o Github para atualizar automaticamente sem precisar arrastar toda vez)

---

## Passo 3 — Pegar o link de cada casa

Depois de publicado, o link de cada imóvel é:

```
https://SEU-SITE.netlify.app/imovel.html?id=NUMERO_DA_CASA
```

Exemplo: se o site for `intercon-imoveis-123.netlify.app` e a casa for a de `id: 3`, o link da placa dela é:

```
https://intercon-imoveis-123.netlify.app/imovel.html?id=3
```

Esse é o link que vai virar QR code.

---

## Passo 4 — Gerar o QR code da placa

1. Acesse **https://www.qrcode-monkey.com** (gratuito, sem cadastro)
2. Cole o link do Passo 3 no campo de URL
3. Baixe em alta resolução (PNG ou SVG) para imprimir na placa
4. Repita para cada casa, usando o link correspondente a cada `id`

Como o link do site nunca muda e nunca expira, o QR code também nunca expira — pode imprimir a placa e deixar na casa por quanto tempo precisar.

---

## Próximos passos possíveis (quando quiser)

- Trocar as fotos de exemplo pelas fotos reais das casas
- Domínio próprio (ex: correaimoveis.com.br)
- Formulário de contato além do WhatsApp
- Painel para adicionar casas sem editar o `.json` na mão

É só me chamar quando quiser avançar em algum desses pontos.

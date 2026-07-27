const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'content', 'imoveis');
const outFile = path.join(__dirname, '..', 'properties.json');

const FINALIDADES_VALIDAS = ['Aluguel', 'Venda', 'Temporada', 'Obras e serviços'];
const TIPOS_VALIDOS = ['Casa', 'Apartamento', 'Terreno', 'Sala/Galpão Comercial', 'Chácara/Fazenda', 'Studio', 'Outro'];
const UNIDADES_TEMPORADA_VALIDAS = ['dia', 'semana', 'mês', 'hóspede'];
const UFS_VALIDAS = ['AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'];

const files = fs.readdirSync(dir).filter((f) => f.endsWith('.json'));
const erros = [];
const idsVistos = new Set();

const imoveis = files.map((f) => {
    let dados;
    try {
          dados = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'));
    } catch (e) {
          erros.push(`${f}: JSON inválido (${e.message})`);
          return null;
    }
    return { arquivo: f, dados };
}).filter(Boolean);

imoveis.forEach(({ arquivo, dados }) => {
    const id = dados.id;
                  if (id === undefined || id === null || String(id).trim() === '') {
                        erros.push(`${arquivo}: campo "id" ausente`);
                  } else if (idsVistos.has(String(id))) {
                        erros.push(`${arquivo}: id "${id}" duplicado`);
                  } else {
                        idsVistos.add(String(id));
                  }
                  const idEsperado = arquivo.replace(/\.json$/, '');
                  if (id !== undefined && id !== null && String(id).trim() !== '' && String(id) !== idEsperado) {
                        erros.push(`${arquivo}: campo "id" ("${id}") não bate com o nome do arquivo ("${idEsperado}"). O id não deve ser alterado depois que o imóvel é criado — se isso foi intencional, renomeie o arquivo para "${id}.json".`);
                  }
                  if (!dados.titulo || !String(dados.titulo).trim()) {
                        erros.push(`${arquivo}: campo "titulo" ausente`);
                  }
                  if (!dados.bairro || !String(dados.bairro).trim()) {
                        erros.push(`${arquivo}: campo "bairro" ausente`);
                  }
                  if (!dados.cidade || !String(dados.cidade).trim()) {
                        erros.push(`${arquivo}: campo "cidade" ausente`);
                  }
                  const cidadeTemUFEmbutido = dados.cidade && String(dados.cidade).includes(' - ');
                  const temUF = dados.uf && String(dados.uf).trim();
                  if (!temUF && !cidadeTemUFEmbutido) {
                        erros.push(`${arquivo}: campo "uf" ausente (selecione o estado)`);
                  }
                  if (temUF && !UFS_VALIDAS.includes(String(dados.uf).trim())) {
                        erros.push(`${arquivo}: uf "${dados.uf}" inválida (use uma sigla de estado válida)`);
                  }
                  const finalidade = dados.finalidade || 'Aluguel';
    if (!FINALIDADES_VALIDAS.includes(finalidade)) {
          erros.push(`${arquivo}: finalidade "${finalidade}" inválida (use ${FINALIDADES_VALIDAS.join(', ')})`);
    }
                  if (dados.tipo && !TIPOS_VALIDOS.includes(dados.tipo)) {
                        erros.push(`${arquivo}: tipo "${dados.tipo}" inválido (use ${TIPOS_VALIDOS.join(', ')})`);
                  }
                  if (finalidade === 'Temporada' && dados.unidade_temporada && !UNIDADES_TEMPORADA_VALIDAS.includes(dados.unidade_temporada)) {
                        erros.push(`${arquivo}: unidade_temporada "${dados.unidade_temporada}" inválida (use ${UNIDADES_TEMPORADA_VALIDAS.join(', ')})`);
                  }
                  const precoPreenchido = dados.preco !== undefined && dados.preco !== null && String(dados.preco).trim() !== '';
    if (precoPreenchido) {
          const preco = Number(dados.preco);
          if (!Number.isFinite(preco) || preco <= 0) {
                erros.push(`${arquivo}: "preco" precisa ser um número maior que zero (ou deixe em branco)`);
          }
    }
                  if (typeof dados.disponivel !== 'boolean') {
                        erros.push(`${arquivo}: campo "disponivel" ausente ou não é true/false`);
                  }
                  if (!dados.whatsapp || !/^\d+$/.test(String(dados.whatsapp))) {
                        erros.push(`${arquivo}: "whatsapp" ausente ou deve conter só números (com DDI+DDD)`);
                  }
});

// Reconstrói o campo "imagens" (formato que o site espera) a partir dos
// campos "fotos" e "videos" do painel, e remove os campos auxiliares do
// arquivo final publicado.
imoveis.forEach(({ dados }) => {
    const fotos = Array.isArray(dados.fotos) ? dados.fotos.filter(Boolean) : [];
    const videos = Array.isArray(dados.videos) ? dados.videos.filter(Boolean) : [];
    dados.imagens = fotos.map((src) => ({ tipo: 'imagem', src })).concat(
          videos.map((src) => ({ tipo: 'video', src }))
    );
    delete dados.fotos;
    delete dados.videos;
});

// Reconstrói o campo "cidade" no formato "Cidade - UF" (o que o site já
// consome via extractUF() em script.js) a partir dos campos separados
// "cidade" e "uf" do painel. Imóveis antigos que ainda guardam a cidade
// já combinada (sem o campo "uf") são mantidos como estão.
imoveis.forEach(({ dados }) => {
    const uf = dados.uf && String(dados.uf).trim();
    if (uf) {
          const cidadeBase = String(dados.cidade || '').trim();
          dados.cidade = uf ? `${cidadeBase} - ${uf}` : cidadeBase;
    }
    delete dados.uf;
});

if (erros.length) {
    console.error('Foram encontrados problemas nos imóveis. Corrija antes de publicar:\n');
    erros.forEach((e) => console.error('  - ' + e));
    process.exit(1);
}

const lista = imoveis.map((i) => i.dados);
lista.sort((a, b) => Number(a.id) - Number(b.id));

fs.writeFileSync(outFile, JSON.stringify({ imoveis: lista }, null, 2) + '\n');
console.log('properties.json gerado com ' + lista.length + ' imoveis.');

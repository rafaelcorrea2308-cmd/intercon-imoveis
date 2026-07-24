// Formata número em Reais
function formatBRL(n) {
return n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });
}

// Monta link do WhatsApp com mensagem pré-preenchida
function whatsappLink(numero, titulo) {
const msg = encodeURIComponent(`Olá! Tenho interesse no imóvel: ${titulo}`);
return `https://wa.me/${numero}?text=${msg}`;
}

const ICONS = {
bed: `<svg viewBox="0 0 24 24"><path d="M3 18v-7a2 2 0 0 1 2-2h5v5"/><path d="M3 18v2"/><path d="M21 18v2"/><path d="M3 13h18v5H3z"/><path d="M10 9h9a2 2 0 0 1 2 2v2"/></svg>`,
bath: `<svg viewBox="0 0 24 24"><path d="M4 12h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3z"/><path d="M6 12V6a2 2 0 0 1 3-1.7"/><path d="M4 19v2"/><path d="M18 19v2"/></svg>`,
car: `<svg viewBox="0 0 24 24"><path d="M3 13l1.5-4.5A2 2 0 0 1 6.4 7h11.2a2 2 0 0 1 1.9 1.5L21 13"/><rect x="3" y="13" width="18" height="6" rx="1.5"/><circle cx="7" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/></svg>`,
area: `<svg viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h4M3 15h4M17 3v4M17 17v4"/></svg>`,
pin: `<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11a7 7 0 0 1 14 0c0 4.8-7 11-7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>`,
heart: `<svg viewBox="0 0 24 24"><path d="M12 20s-7-4.6-9.5-9C.6 7.6 2 4 5.5 4 8 4 10 5.8 12 8c2-2.2 4-4 6.5-4 3.5 0 4.9 3.6 3 7-2.5 4.4-9.5 9-9.5 9z"/></svg>`,
wa: `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none"><path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.1l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.4-.7-1.7-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.2-.3.2-.5.1-.2-.1-1-.4-2-1.2-.7-.6-1.2-1.4-1.4-1.6-.1-.2 0-.4.1-.5.1-.1.3-.3.4-.5.1-.1.2-.3.2-.4.1-.2 0-.3 0-.5s-.6-1.5-.9-2c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.2s1 2.6 1.1 2.7c.1.2 2 3 4.7 4.2.7.3 1.2.4 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3z"/></svg>`,
phone: `<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L8.1 9.7a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.9 2z"/></svg>`
};

async function loadProperties() {
const res = await fetch('properties.json');
if (!res.ok) throw new Error('Não foi possível carregar properties.json');
return res.json();
}

function cardTemplate(p) {
return `
<a class="card" href="imovel.html?id=${p.id}">
<div class="photo-wrap">
<img src="${p.imagem}" alt="Foto da casa em ${p.bairro}" loading="lazy">
<span class="badge-pill">${p.finalidade || 'Aluguel'}</span>
<button class="heart-btn" type="button" aria-label="Favoritar" onclick="event.preventDefault();this.classList.toggle('active')">${ICONS.heart}</button>
</div>
<div class="card-body">
<div class="card-price">${formatBRL(p.preco)}<span> /mês</span></div>
<div class="card-address"><strong>${p.bairro}</strong><br>${p.cidade}</div>
<div class="spec-row">
<span class="spec">${ICONS.bed}${p.quartos}</span>
<span class="spec">${ICONS.bath}${p.banheiros}</span>
<span class="spec">${ICONS.car}${p.vagas}</span>
<span class="spec">${ICONS.area}${p.area}m²</span>
</div>
</div>
</a>
`;
}

function renderGrid(properties) {
const grid = document.getElementById('grid');
const count = document.getElementById('listing-count');
const disponiveis = properties.filter(p => p.disponivel);

if (disponiveis.length === 0) {
grid.innerHTML = '';
count.textContent = '0 imóveis encontrados';
document.getElementById('empty-state').style.display = 'block';
return;
}
document.getElementById('empty-state').style.display = 'none';
count.textContent = `${disponiveis.length} imóve${disponiveis.length === 1 ? 'l encontrado' : 'is encontrados'}`;
grid.innerHTML = disponiveis.map(cardTemplate).join('');
}

function populateTipos(all) {
const sel = document.getElementById('filter-tipo');
const atual = sel.value;
const tipos = [...new Set(all.map(p => p.tipo).filter(Boolean))].sort();
sel.innerHTML = '<option value="">Todos os tipos</option>' +
tipos.map(t => `<option value="${t}">${t}</option>`).join('');
if (tipos.includes(atual)) sel.value = atual;
}

function populateCidades(all) {
const sel = document.getElementById('filter-cidade');
const atual = sel.value;
const cidades = [...new Set(all.map(p => p.cidade))].sort();
sel.innerHTML = '<option value="">Selecione a cidade</option>' +
cidades.map(c => `<option value="${c}">${c}</option>`).join('');
if (cidades.includes(atual)) sel.value = atual;
}

function populateBairros(all, cidade) {
const sel = document.getElementById('filter-bairro');
const atual = sel.value;
const base = cidade ? all.filter(p => p.cidade === cidade) : all;
const bairros = [...new Set(base.map(p => p.bairro))].sort();
sel.innerHTML = '<option value="">Todos os bairros</option>' +
bairros.map(b => `<option value="${b}">${b}</option>`).join('');
if (bairros.includes(atual)) sel.value = atual;
}

let finalidadeAtual = 'Aluguel';

function applyFilters(all) {
const keywordField = document.getElementById('search');
const q = keywordField ? keywordField.value.trim().toLowerCase() : '';
const tipo = document.getElementById('filter-tipo').value;
const cidade = document.getElementById('filter-cidade').value;
const bairro = document.getElementById('filter-bairro').value;

let filtered = all.filter(p => p.disponivel);
filtered = filtered.filter(p => (p.finalidade || 'Aluguel') === finalidadeAtual);
if (tipo) filtered = filtered.filter(p => p.tipo === tipo);
if (cidade) filtered = filtered.filter(p => p.cidade === cidade);
if (bairro) filtered = filtered.filter(p => p.bairro === bairro);
if (q) {
filtered = filtered.filter(p =>
p.bairro.toLowerCase().includes(q) ||
p.cidade.toLowerCase().includes(q) ||
p.titulo.toLowerCase().includes(q)
);
}
renderGrid(filtered);
}

async function initIndexPage() {
try {
const properties = await loadProperties();
populateTipos(properties);
populateCidades(properties);
populateBairros(properties, '');
renderGrid(properties.filter(p => p.disponivel && (p.finalidade || 'Aluguel') === finalidadeAtual));

document.querySelectorAll('.finalidade-tab').forEach(btn => {
btn.addEventListener('click', () => {
document.querySelectorAll('.finalidade-tab').forEach(b => b.classList.remove('active'));
btn.classList.add('active');
finalidadeAtual = btn.dataset.finalidade;
applyFilters(properties);
});
});

document.getElementById('filter-cidade').addEventListener('change', () => {
populateBairros(properties, document.getElementById('filter-cidade').value);
applyFilters(properties);
});

['filter-tipo', 'filter-bairro'].forEach(id => {
document.getElementById(id).addEventListener('change', () => applyFilters(properties));
});

const keywordField = document.getElementById('search');
if (keywordField) {
keywordField.addEventListener('input', () => applyFilters(properties));
}

const toggleBtn = document.getElementById('toggle-keyword');
const keywordWrap = document.getElementById('keyword-field');
if (toggleBtn && keywordWrap) {
toggleBtn.addEventListener('click', () => {
const showing = keywordWrap.style.display !== 'none';
keywordWrap.style.display = showing ? 'none' : 'flex';
if (!showing) keywordField.focus();
});
}

document.getElementById('search-form').addEventListener('submit', e => {
e.preventDefault();
applyFilters(properties);
});
} catch (e) {
document.getElementById('grid').innerHTML =
`<div class="empty-state">Não foi possível carregar os imóveis. Se você abriu este arquivo direto no navegador (file://), publique o site (veja o README) ou rode um servidor local para testar.</div>`;
}
}

async function initDetailPage() {
const params = new URLSearchParams(window.location.search);
const id = params.get('id');
const container = document.getElementById('detail-container');
const crumbTitle = document.getElementById('crumb-title');

try {
const properties = await loadProperties();
const p = properties.find(x => x.id === id);

if (!p) {
container.innerHTML = `<div class="empty-state">Imóvel não encontrado. <a href="index.html">Voltar para a lista</a>.</div>`;
return;
}

document.title = `${p.titulo} — Para alugar | Intercon`;
if (crumbTitle) crumbTitle.textContent = p.titulo;

container.innerHTML = `
<div>
<div class="gallery">
<img src="${p.imagem}" alt="Foto da casa em ${p.bairro}">
<span class="badge-pill">${p.finalidade || 'Aluguel'}</span>
</div>
<div class="detail-title-block">
<div class="address-line">${ICONS.pin}${p.bairro} · ${p.cidade}</div>
<h1>${p.titulo}</h1>
<div class="detail-spec-row">
<span class="spec">${ICONS.bed}${p.quartos} quartos</span>
<span class="spec">${ICONS.bath}${p.banheiros} banheiros</span>
<span class="spec">${ICONS.car}${p.vagas} vagas</span>
<span class="spec">${ICONS.area}${p.area} m²</span>
</div>
<div class="descricao-block">
<h3>Descrição</h3>
<p>${p.descricao}</p>
</div>
</div>
</div>
<div>
<div class="contact-box">
<div class="price-big">${formatBRL(p.preco)}<span>por mês</span></div>
<div class="divider"></div>
<div class="agent">
<img src="logo.svg" alt="Intercon" class="avatar-logo">
<div class="info"><strong>Intercon Consultoria Imobiliária</strong>Campo Grande - MS</div>
</div>
<a class="btn btn-wa" href="${whatsappLink(p.whatsapp, p.titulo)}" target="_blank" rel="noopener">${ICONS.wa}Falar no WhatsApp</a>
<a class="btn btn-call" href="tel:+${p.whatsapp}">${ICONS.phone}Ligar agora</a>
<div class="ref">Ref. imóvel #${p.id}</div>
</div>
</div>
`;
} catch (e) {
container.innerHTML = `<div class="empty-state">Não foi possível carregar este imóvel. Publique o site (veja o README) para testar corretamente.</div>`;
}
}

(function () {
  function waitForCMS() {
    if (!window.CMS || !window.h || !window.createClass) {
      setTimeout(waitForCMS, 50);
      return;
    }
    var h = window.h;
    var createClass = window.createClass;

    function resolveUrl(getAsset, path) {
      if (!path) return '';
      if (/^(https?:|data:|blob:)/.test(path)) return path;
      try {
        if (getAsset) {
          var asset = getAsset(path);
          var str = (asset && typeof asset === 'string') ? asset : (asset && asset.toString ? asset.toString() : '');
          if (str && /^(https?:|blob:|data:)/.test(str)) return str;
          if (asset && asset.url && /^(https?:|blob:|data:)/.test(asset.url)) return asset.url;
        }
      } catch (e) {}
      var base = window.location.href.split('/admin')[0];
      var rel = String(path).replace(/^\/+/, '');
      return base + '/' + rel;
    }

    function fmtPreco(preco) {
      if (preco === undefined || preco === null || preco === '') return '';
      var n = Number(preco);
      if (isNaN(n)) return String(preco);
      return 'R$ ' + n.toLocaleString('pt-BR');
    }

    function priceSuffix(finalidade, unidade) {
      var f = finalidade || 'Aluguel';
      if (f === 'Venda') return '';
      if (f === 'Temporada') {
        var u = unidade || 'dia';
        return ' /' + u;
      }
      return ' /mês';
    }

function orderMidias(lista) {
  if (!Array.isArray(lista) || lista.length < 2) return lista || [];
  if (!lista[0] || lista[0].tipo !== 'video') return lista;
  var idx = -1;
  for (var i = 1; i < lista.length; i++) {
    if (lista[i] && lista[i].tipo !== 'video') { idx = i; break; }
  }
  if (idx === -1) return lista;
  var arr = lista.slice();
  var item = arr.splice(idx, 1)[0];
  arr.unshift(item);
  return arr;
}

    var COLORS = {
      red: '#C81B2E',
      redDark: '#8F0F1E',
      redPale: '#FBEAEA',
      price: '#0F8A5F',
      ink: '#17233B',
      inkSoft: '#5B6B82',
      line: '#E3E8EE',
      bg: '#F3F5F7',
      surface: '#FFFFFF'
    };

    var PropertyPreview = createClass({
      render: function () {
        var entry = this.props.entry;
        var getAsset = this.props.getAsset;
        var data = entry.get('data');

        var id = data.get('id');
        var disponivel = data.get('disponivel');
        var titulo = data.get('titulo');
        var bairro = data.get('bairro');
        var cidade = data.get('cidade');
        var preco = data.get('preco');
        var finalidade = data.get('finalidade');
        var tipo = data.get('tipo');
        var unidade_temporada = data.get('unidade_temporada');
        var quartos = data.get('quartos');
        var banheiros = data.get('banheiros');
        var vagas = data.get('vagas');
        var area = data.get('area');
        var descricao = data.get('descricao');
        var endereco = data.get('endereco');
        var whatsapp = data.get('whatsapp');
        var imagens = data.get('imagens');

        var fotos = [];
        if (imagens) {
          imagens.forEach(function (img) {
            var itemTipo = img.get('tipo');
            var src = img.get('src');
            if (src) fotos.push({ tipo: itemTipo, src: src });
          });
        }
        fotos = orderMidias(fotos);

        var specs = [];
        if (quartos) specs.push(quartos + ' quarto' + (quartos == 1 ? '' : 's'));
        if (banheiros) specs.push(banheiros + ' banheiro' + (banheiros == 1 ? '' : 's'));
        if (vagas) specs.push(vagas + ' vaga' + (vagas == 1 ? '' : 's'));
        if (area) specs.push(area + ' m\u00b2');

        return h('div', { style: { fontFamily: "'Inter', system-ui, sans-serif", background: COLORS.bg, minHeight: '100%', padding: '24px' } },
          h('div', { style: { background: COLORS.surface, border: '1px solid ' + COLORS.line, borderRadius: '10px', padding: '24px', maxWidth: '720px', margin: '0 auto' } },

            h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' } },
              h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                h('span', { style: { display: 'inline-block', background: COLORS.red, color: '#fff', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', letterSpacing: '0.02em', textTransform: 'uppercase' } }, finalidade || 'Finalidade'),
                tipo ? h('span', { style: { display: 'inline-block', background: COLORS.bg, color: COLORS.inkSoft, padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '600', border: '1px solid ' + COLORS.line } }, tipo) : null
              ),
              h('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                id ? h('span', { style: { fontSize: '13px', fontWeight: '700', color: COLORS.inkSoft } }, '#' + id) : null,
                h('span', {
                  style: {
                    display: 'inline-block',
                    padding: '4px 12px',
                    borderRadius: '999px',
                    fontSize: '12px',
                    fontWeight: '700',
                    color: '#fff',
                    background: disponivel === false ? COLORS.red : '#1DA851'
                  }
                }, disponivel === false ? 'Indisponível' : 'Disponível')
              )
            ),

            h('h1', { style: { margin: '4px 0 6px', fontSize: '26px', fontWeight: '800', letterSpacing: '-0.02em', color: COLORS.ink } }, titulo || '(sem título)'),

            h('p', { style: { margin: '0 0 10px', color: COLORS.inkSoft, fontSize: '15px' } }, [bairro, cidade].filter(Boolean).join(', ')),

            preco ? h('p', { style: { margin: '0 0 6px', fontWeight: '800', fontSize: '22px', color: COLORS.price } }, fmtPreco(preco) + priceSuffix(finalidade, unidade_temporada)) : null,

            specs.length ? h('p', { style: { margin: '0 0 18px', color: COLORS.inkSoft, fontSize: '13px' } }, specs.join('  •  ')) : null,

            fotos.length ? h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '18px' } },
              fotos.map(function (foto, i) {
                var url = resolveUrl(getAsset, foto.src);
                if (foto.tipo === 'video') {
                  return h('video', { key: i, src: url, controls: true, style: { width: '210px', height: '150px', objectFit: 'cover', borderRadius: '8px', background: '#000' } });
                }
                return h('img', {
                  key: i,
                  src: url,
                  style: {
                    width: '210px',
                    height: '150px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: i === 0 ? '3px solid ' + COLORS.red : '1px solid ' + COLORS.line
                  }
                });
              })
            ) : h('p', { style: { color: COLORS.inkSoft, fontSize: '13px', fontStyle: 'italic', marginBottom: '18px' } }, 'Nenhuma foto ou vídeo adicionado ainda.'),

            descricao ? h('div', { style: { marginBottom: '16px' } },
              h('h3', { style: { fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: COLORS.inkSoft, marginBottom: '6px', fontWeight: '700' } }, 'Descrição'),
              h('p', { style: { margin: 0, fontSize: '14px', lineHeight: '1.5', color: COLORS.ink, whiteSpace: 'pre-wrap' } }, descricao)
            ) : null,

            endereco ? h('div', { style: { marginBottom: '16px' } },
              h('h3', { style: { fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: COLORS.inkSoft, marginBottom: '6px', fontWeight: '700' } }, 'Endereço'),
              h('p', { style: { margin: 0, fontSize: '14px', color: COLORS.ink } }, endereco)
            ) : null,

            whatsapp ? h('div', { style: { marginTop: '18px', paddingTop: '14px', borderTop: '1px solid ' + COLORS.line } },
              h('span', { style: { display: 'inline-block', background: '#1DA851', color: '#fff', padding: '8px 16px', borderRadius: '8px', fontWeight: '700', fontSize: '13px' } }, 'WhatsApp: ' + whatsapp)
            ) : null
          )
        );
      }
    });

    window.CMS.registerPreviewTemplate('imoveis', PropertyPreview);
  }

  waitForCMS();
})();

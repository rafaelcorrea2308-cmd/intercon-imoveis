(function () {
  function waitForCMS() {
    if (!window.CMS || !window.h || !window.createClass) {
      setTimeout(waitForCMS, 50);
      return;
    }
    var h = window.h;
    var createClass = window.createClass;

    var PropertyPreview = createClass({
      render: function () {
        var entry = this.props.entry;
        var getAsset = this.props.getAsset;
        var data = entry.get('data');
        var titulo = data.get('titulo');
        var bairro = data.get('bairro');
        var cidade = data.get('cidade');
        var preco = data.get('preco');
        var finalidade = data.get('finalidade');
        var imagens = data.get('imagens');
        var fotos = [];
        if (imagens) {
          imagens.forEach(function (img) {
            var tipo = img.get('tipo');
            var src = img.get('src');
            if (src) fotos.push({ tipo: tipo, src: src });
          });
        }
        return h('div', { style: { padding: '20px', fontFamily: 'sans-serif' } },
          h('span', { style: { display: 'inline-block', background: '#d0021b', color: '#fff', padding: '3px 10px', borderRadius: '999px', fontSize: '12px', marginBottom: '10px' } }, finalidade || ''),
          h('h1', { style: { margin: '6px 0' } }, titulo || '(sem título)'),
          h('p', { style: { color: '#555' } }, (bairro || '') + ', ' + (cidade || '')),
          h('p', { style: { fontWeight: 'bold', fontSize: '18px' } }, preco ? ('R$ ' + preco) : ''),
          h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '15px' } },
            fotos.map(function (foto, i) {
              var url = getAsset ? getAsset(foto.src) : foto.src;
              if (foto.tipo === 'video') {
                return h('video', { key: i, src: url, controls: true, style: { width: '200px', height: '140px', objectFit: 'cover', borderRadius: '8px' } });
              }
              return h('img', {
                key: i,
                src: url,
                style: {
                  width: '200px',
                  height: '140px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: i === 0 ? '3px solid #d0021b' : '1px solid #ccc'
                }
              });
            })
          )
        );
      }
    });

    window.CMS.registerPreviewTemplate('imoveis', PropertyPreview);
  }

  waitForCMS();
})();

(function () {
  // O Decap CMS não oferece uma API oficial para estilizar botões
  // específicos da barra de ferramentas do editor (excluir, publicar).
  // Por isso, aqui a gente localiza os botões pelo texto (já traduzido
  // pelo locale.js) e aplica o estilo diretamente. Como isso depende da
  // estrutura interna do painel, pode parar de funcionar se o Decap CMS
  // mudar essa tela numa atualização futura — nesse caso os botões
  // voltam a aparecer com o visual padrão, sem quebrar nada.
  var STYLED_FLAG = 'data-toolbar-estilizado';

  var REGRAS = [
    {
      textos: ['EXCLUIR ANÚNCIO'],
      estilo: {
        backgroundColor: '#D50000',
        color: '#ffffff',
        fontWeight: 'bold',
        border: 'none',
        order: '5',
        marginLeft: '24px'
      }
    },
    {
      textos: ['Publicar', 'Publicado'],
      estilo: {
        backgroundColor: '#00A62A',
        color: '#ffffff',
        fontWeight: 'bold',
        border: 'none'
      }
    },
    {
      // Esconde o link "Mídia" da barra de navegação principal (o painel
      // do anúncio continua abrindo a mídia normalmente pelos campos de
      // Fotos/Vídeos — só a galeria geral, sem contexto de anúncio,
      // fica escondida).
      textos: ['Mídia'],
      estilo: {
        display: 'none'
      }
    }
  ];

  function aplicarEstilos() {
    var buttons = document.querySelectorAll('button, a, a[role="button"]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (btn.getAttribute(STYLED_FLAG)) continue;
      var text = (btn.textContent || '').trim();
      for (var r = 0; r < REGRAS.length; r++) {
        if (REGRAS[r].textos.indexOf(text) !== -1) {
          btn.setAttribute(STYLED_FLAG, '1');
          var estilo = REGRAS[r].estilo;
          for (var prop in estilo) {
            btn.style[prop] = estilo[prop];
          }
          break;
        }
      }
    }
  }

  var observer = new MutationObserver(aplicarEstilos);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  aplicarEstilos();
})();

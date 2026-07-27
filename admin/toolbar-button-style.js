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
      // fica escondida). Comparação EXATA aqui, de propósito: se fosse
      // "contém", corria o risco de esconder por engano algum botão
      // dentro do seletor de foto/vídeo que também mencione "mídia".
      textos: ['Mídia'],
      modo: 'exato',
      estilo: {
        display: 'none'
      }
    }
  ];

  // Botões só de ícone (olho e seta dupla) não têm texto visível — o
  // Decap CMS só descreve eles via title/aria-label. Por isso usam uma
  // lista separada, comparada com esses atributos em vez do texto.
  var REGRAS_ICONE = [
    {
      alvos: ['Mudar pré-visualização', 'Toggle preview'],
      estilo: { display: 'none' }
    },
    {
      alvos: ['Sincronizar rolagem', 'Toggle scroll sync', 'Scroll Sync'],
      estilo: { display: 'none' }
    }
  ];

  function aplicarEstiloIcones() {
    var elementos = document.querySelectorAll('[title], [aria-label]');
    for (var i = 0; i < elementos.length; i++) {
      var el = elementos[i];
      if (el.getAttribute(STYLED_FLAG)) continue;
      var descricao = (el.getAttribute('title') || el.getAttribute('aria-label') || '').trim();
      if (!descricao) continue;
      for (var r = 0; r < REGRAS_ICONE.length; r++) {
        if (REGRAS_ICONE[r].alvos.indexOf(descricao) !== -1) {
          el.setAttribute(STYLED_FLAG, '1');
          var estilo = REGRAS_ICONE[r].estilo;
          for (var prop in estilo) {
            el.style[prop] = estilo[prop];
          }
          break;
        }
      }
    }
  }

  function textoContemAlvo(text, alvo) {
    // Usa "contém" em vez de igualdade exata, porque alguns desses
    // botões (ex: "Publicado ▼") têm um ícone de seta grudado no texto,
    // o que quebraria uma comparação exata.
    return text.indexOf(alvo) !== -1;
  }

  function aplicarEstilos() {
    var buttons = document.querySelectorAll(
      'button, a, [role="button"], [role="menuitem"]'
    );
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (btn.getAttribute(STYLED_FLAG)) continue;
      var text = (btn.textContent || '').trim();
      if (!text) continue;
      for (var r = 0; r < REGRAS.length; r++) {
        var textos = REGRAS[r].textos;
        var exato = REGRAS[r].modo === 'exato';
        var bateu = false;
        for (var t = 0; t < textos.length; t++) {
          if (exato ? text === textos[t] : textoContemAlvo(text, textos[t])) {
            bateu = true;
            break;
          }
        }
        if (bateu) {
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

  var observer = new MutationObserver(function () {
    aplicarEstilos();
    aplicarEstiloIcones();
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
  aplicarEstilos();
  aplicarEstiloIcones();
})();

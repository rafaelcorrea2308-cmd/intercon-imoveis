(function () {
  // O Decap CMS não oferece uma API oficial para estilizar ou reposicionar
  // botões específicos da barra de ferramentas do editor (como o de
  // excluir). Por isso, aqui a gente localiza o botão pelo texto (depois
  // de traduzido para "EXCLUIR ANÚNCIO" pelo locale.js) e aplica o estilo
  // diretamente. Como isso depende da estrutura interna do painel, pode
  // parar de funcionar se o Decap CMS mudar essa tela numa atualização
  // futura — nesse caso o botão volta a aparecer com o visual padrão,
  // sem quebrar nada.
  var STYLED_FLAG = 'data-excluir-anuncio-estilizado';

  function styleDeleteButtons() {
    var buttons = document.querySelectorAll('button, a[role="button"]');
    for (var i = 0; i < buttons.length; i++) {
      var btn = buttons[i];
      if (btn.getAttribute(STYLED_FLAG)) continue;
      var text = (btn.textContent || '').trim();
      if (text === 'EXCLUIR ANÚNCIO') {
        btn.setAttribute(STYLED_FLAG, '1');
        btn.style.backgroundColor = '#C81B2E';
        btn.style.color = '#ffffff';
        btn.style.fontWeight = 'bold';
        btn.style.border = 'none';
        // Empurra o botão mais para a direita dentro da barra de
        // ferramentas (que normalmente é um flex container).
        btn.style.order = '5';
        btn.style.marginLeft = '24px';
      }
    }
  }

  var observer = new MutationObserver(styleDeleteButtons);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  styleDeleteButtons();
})();

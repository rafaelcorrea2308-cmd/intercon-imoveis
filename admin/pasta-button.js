(function () {
  // Cria um botão extra chamado "Pasta" logo antes do botão nativo
  // "Adicionar Fotos". Ele não reimplementa nada: só clica de verdade
  // no botão original por baixo dos panos, então continua usando o
  // mesmo caminho confiável de sempre para abrir a galeria de mídia.
  var FLAG_ORIGINAL = 'data-pasta-injetado';

  function adicionarBotaoPasta() {
    var candidatos = document.querySelectorAll('button, [role="button"]');
    for (var i = 0; i < candidatos.length; i++) {
      var original = candidatos[i];
      if (original.getAttribute(FLAG_ORIGINAL)) continue;
      var texto = (original.textContent || '').trim();
      if (texto.indexOf('Adicionar Fotos') === -1) continue;

      original.setAttribute(FLAG_ORIGINAL, '1');

      var botaoPasta = document.createElement('button');
      botaoPasta.type = 'button';
      // Copia a classe visual do botão original (gerada pelo próprio
      // Decap), para o "Pasta" ficar com a mesma aparência sem
      // precisarmos adivinhar nenhum estilo.
      botaoPasta.className = original.className;
      botaoPasta.textContent = 'Pasta';
      botaoPasta.style.marginRight = '8px';
      botaoPasta.addEventListener('click', function (alvo) {
        return function (evento) {
          evento.preventDefault();
          alvo.click();
        };
      }(original));

      if (original.parentNode) {
        original.parentNode.insertBefore(botaoPasta, original);
      }
    }
  }

  function waitForCMS() {
    if (!window.CMS) {
      setTimeout(waitForCMS, 50);
      return;
    }
    var observer = new MutationObserver(adicionarBotaoPasta);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    adicionarBotaoPasta();
  }

  waitForCMS();
})();

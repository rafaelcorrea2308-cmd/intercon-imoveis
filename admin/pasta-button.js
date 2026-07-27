(function () {
  // Cria um botão extra chamado "Pasta" logo antes do botão nativo
  // "Adicionar Fotos". Ele não reimplementa nada: só clica de verdade
  // no botão original por baixo dos panos, então continua usando o
  // mesmo caminho confiável de sempre para abrir a galeria de mídia.
  //
  // IMPORTANTE: como o painel é feito em React, ele pode "limpar" um
  // elemento que a gente insere manualmente sempre que redesenha essa
  // parte da tela. Por isso, em vez de inserir uma vez só e marcar como
  // "already done", a gente confere TODA vez se o botão ainda está lá
  // e recoloca se o React tiver removido.
  var MARCA_BOTAO_PASTA = 'data-botao-pasta';

  function encontrarBotaoAdicionarFotos() {
    var candidatos = document.querySelectorAll('button, [role="button"]');
    for (var i = 0; i < candidatos.length; i++) {
      var el = candidatos[i];
      if (el.getAttribute(MARCA_BOTAO_PASTA)) continue; // não é o nosso clone
      var texto = (el.textContent || '').trim();
      if (texto.indexOf('Adicionar Fotos') !== -1) return el;
    }
    return null;
  }

  function criarBotaoPasta(original) {
    var botaoPasta = document.createElement('button');
    botaoPasta.type = 'button';
    botaoPasta.setAttribute(MARCA_BOTAO_PASTA, '1');
    // Copia a classe visual do botão original (gerada pelo próprio
    // Decap), para o "Pasta" ficar com a mesma aparência sem
    // precisarmos adivinhar nenhum estilo.
    botaoPasta.className = original.className;
    botaoPasta.textContent = 'Pasta';
    botaoPasta.style.marginRight = '8px';
    botaoPasta.addEventListener('click', function (evento) {
      evento.preventDefault();
      original.click();
    });
    return botaoPasta;
  }

  function garantirBotaoPasta() {
    var original = encontrarBotaoAdicionarFotos();
    if (!original || !original.parentNode) return;

    var anterior = original.previousSibling;
    var jaTemBotao =
      anterior &&
      anterior.nodeType === 1 &&
      anterior.getAttribute &&
      anterior.getAttribute(MARCA_BOTAO_PASTA);

    if (jaTemBotao) return;

    var botaoPasta = criarBotaoPasta(original);
    original.parentNode.insertBefore(botaoPasta, original);
  }

  function waitForCMS() {
    if (!window.CMS) {
      setTimeout(waitForCMS, 50);
      return;
    }
    var observer = new MutationObserver(garantirBotaoPasta);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    garantirBotaoPasta();
  }

  waitForCMS();
})();

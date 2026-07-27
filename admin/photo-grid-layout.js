(function () {
  // Tentativa de deixar as fotos do campo "Fotos" lado a lado (em grade)
  // em vez de empilhadas uma embaixo da outra. Isso é feito de forma
  // heurística (sem depender de nomes de classe do Decap, que não são
  // estáveis): a gente localiza as miniaturas das fotos pelo caminho do
  // arquivo (assets/anuncios/...) e sobe na árvore até achar o "cartão"
  // que se repete lado a lado com os outros.
  //
  // AVISO IMPORTANTE: o recurso de arrastar para reordenar as fotos foi
  // pensado pelo Decap para uma lista vertical. Forçar um layout em
  // grade pode fazer esse arrastar se comportar de forma estranha. Se
  // isso acontecer, essa função pode ser removida (arquivo inteiro) sem
  // afetar mais nada do painel.
  var FLAG_CONTAINER = 'data-grade-fotos-container';
  var FLAG_ITEM = 'data-grade-fotos-item';

  function acharCartaoRepetido(img) {
    var el = img;
    for (var subir = 0; subir < 8 && el && el.parentElement; subir++) {
      el = el.parentElement;
      var pai = el.parentElement;
      if (!pai) continue;
      var irmaosMesmaTag = 0;
      for (var i = 0; i < pai.children.length; i++) {
        if (pai.children[i].tagName === el.tagName) irmaosMesmaTag++;
      }
      if (irmaosMesmaTag > 1) {
        return { item: el, container: pai };
      }
    }
    return null;
  }

  function aplicarGrade() {
    var imagens = document.querySelectorAll('img[src*="assets/anuncios/"]');
    for (var i = 0; i < imagens.length; i++) {
      var resultado = acharCartaoRepetido(imagens[i]);
      if (!resultado) continue;

      if (!resultado.container.getAttribute(FLAG_CONTAINER)) {
        resultado.container.setAttribute(FLAG_CONTAINER, '1');
        resultado.container.style.display = 'flex';
        resultado.container.style.flexWrap = 'wrap';
        resultado.container.style.gap = '16px';
        resultado.container.style.alignItems = 'flex-start';
      }

      if (!resultado.item.getAttribute(FLAG_ITEM)) {
        resultado.item.setAttribute(FLAG_ITEM, '1');
        resultado.item.style.width = '220px';
        resultado.item.style.flex = '0 0 220px';
        resultado.item.style.boxSizing = 'border-box';
      }
    }
  }

  function waitForCMS() {
    if (!window.CMS) {
      setTimeout(waitForCMS, 50);
      return;
    }
    var observer = new MutationObserver(aplicarGrade);
    observer.observe(document.documentElement, { childList: true, subtree: true });
    aplicarGrade();
  }

  waitForCMS();
})();

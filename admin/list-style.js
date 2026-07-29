(function () {
  // Aplica a classe .intercon-entry-card aos links de entrada que o
  // Decap CMS já renderiza na lista de "Publicações". Não cria nenhum
  // elemento novo — apenas adiciona uma classe a nós que já existem no
  // DOM, o que é seguro mesmo com o React re-renderizando a lista.
  function applyStyles() {
    var links = document.querySelectorAll(
      'a[href*="/collections/imoveis/entries/"]'
    );
    for (var i = 0; i < links.length; i++) {
      links[i].classList.add('intercon-entry-card');
    }
  }

  var observer = new MutationObserver(applyStyles);
  observer.observe(document.body, { childList: true, subtree: true });
  applyStyles();
})();

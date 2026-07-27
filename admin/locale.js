(function () {
  function waitForCMS() {
    // Espera tanto o painel (window.CMS) quanto o arquivo local de
    // tradução (window.__PT_LOCALE__, carregado por pt-locale-data.js)
    // estarem prontos. Como o texto em português agora vem de um
    // arquivo local (sem precisar baixar nada da internet), isso
    // acontece quase instantaneamente — sem a demora/inconsistência de
    // buscar a tradução de um servidor externo.
    if (!window.CMS || !window.__PT_LOCALE__) {
      setTimeout(waitForCMS, 20);
      return;
    }

    var pt = window.__PT_LOCALE__;

    // Ajusta o texto do botão de excluir diretamente na tradução antes
    // de registrar, para valer em qualquer situação (entrada nova,
    // publicada, etc.).
    if (pt.editor && pt.editor.editorToolbar) {
      pt.editor.editorToolbar.deleteEntry = 'EXCLUIR ANÚNCIO';
      pt.editor.editorToolbar.deletePublishedEntry = 'EXCLUIR ANÚNCIO';
      pt.editor.editorToolbar.deleteUnpublishedEntry = 'EXCLUIR ANÚNCIO';
    }

    window.CMS.registerLocale('pt', pt);
  }

  waitForCMS();
})();

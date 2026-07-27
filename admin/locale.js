(function () {
      function waitForCMS() {
              if (!window.CMS) {
                        setTimeout(waitForCMS, 50);
                        return;
              }

        import('https://unpkg.com/decap-cms-locales@3.8.0/dist/esm/pt/index.js')
                .then(function (mod) {
                            var pt = (mod && mod.default) ? mod.default : mod;
                            window.CMS.registerLocale('pt', pt);
                            // Sobrescreve só o texto do botão de excluir, deixando o
                            // resto da tradução oficial intacta.
                            window.CMS.registerLocale('pt', {
                                          editor: {
                                                          editorToolbar: {
                                                                            deleteEntry: 'EXCLUIR ANÚNCIO',
                                                                            deletePublishedEntry: 'EXCLUIR ANÚNCIO',
                                                                            deleteUnpublishedEntry: 'EXCLUIR ANÚNCIO'
                                                          }
                                          }
                            });
                })
                .catch(function (e) {
                            console.error('Nao foi possivel carregar o idioma pt do painel', e);
                });
      }

   waitForCMS();
})();

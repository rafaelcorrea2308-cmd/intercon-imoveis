(function () {
  function waitForCMS() {
    if (!window.CMS || !window.h || !window.createClass) {
      setTimeout(waitForCMS, 50);
      return;
    }
    var h = window.h;
    var createClass = window.createClass;
    // Ajuste aqui se o repositório ou branch mudarem no futuro.
    var REPO = 'rafaelcorrea2308-cmd/intercon-imoveis';
    var BRANCH = 'main';
    var CONTENT_PATH = 'content/imoveis';
    // Busca a lista de ids já usados olhando os nomes dos arquivos
    // em content/imoveis (cada arquivo é sempre "{id}.json").
    function fetchExistingIds() {
      var url =
        'https://api.github.com/repos/' + REPO + '/contents/' + CONTENT_PATH + '?ref=' + BRANCH;
      return fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('GitHub respondeu ' + res.status);
          return res.json();
        })
        .then(function (list) {
          return (list || [])
            .filter(function (item) {
              return item && item.name && /\.json$/.test(item.name);
            })
            .map(function (item) {
              return item.name.replace(/\.json$/, '');
            });
        });
    }

    // Campo "id": editável apenas ao criar um imóvel novo, com checagem
    // automática de duplicidade. Depois que o imóvel já existe, o campo
    // fica travado (somente leitura).
    //
    // Importante: o Control de um widget customizado do Decap CMS NÃO
    // recebe a prop "entry" (isso só existe no Preview), então não dá
    // pra perguntar diretamente "isso é uma entrada nova?". Em vez disso,
    // guardamos no momento em que o campo é montado se ele já tinha um
    // valor preenchido: se já tinha, é um imóvel existente (trava); se
    // estava vazio, é um imóvel novo (fica editável durante toda a sessão
    // de criação, mesmo depois que o usuário digitar algo).
    var LockedIdControl = createClass({
      getInitialState: function () {
        var hadValueAtMount = !!(this.props.value && String(this.props.value).trim());
        return {
          lockedFromStart: hadValueAtMount,
          status: 'idle',
          message: ''
        };
      },
      componentWillUnmount: function () {
        if (this._timer) clearTimeout(this._timer);
      },
      checkId: function (value) {
        return fetchExistingIds()
          .then(function (ids) {
            var used = ids.indexOf(String(value).trim()) !== -1;
            return used
              ? {
                  status: 'duplicate',
                  message: 'Esse ID já está em uso por outro imóvel. Escolha outro número.'
                }
              : { status: 'available', message: 'ID disponível.' };
          })
          .catch(function () {
            return {
              status: 'error',
              message: 'Não foi possível verificar agora — será checado de novo ao salvar.'
            };
          });
      },
      handleChange: function (e) {
        var value = e.target.value;
        this.props.onChange(value);
        if (this.state.lockedFromStart) return;
        var self = this;
        if (this._timer) clearTimeout(this._timer);
        if (!value || !String(value).trim()) {
          this.setState({ status: 'idle', message: '' });
          return;
        }
        this.setState({ status: 'checking', message: 'Verificando disponibilidade...' });
        this._timer = setTimeout(function () {
          self.checkId(value).then(function (result) {
            self.setState(result);
          });
        }, 500);
      },
      // Chamado pelo Decap CMS antes de permitir salvar/publicar.
      // Retornar uma Promise faz o painel esperar o resultado antes
      // de liberar o salvamento.
      isValid: function () {
        if (this.state.lockedFromStart) return true;
        var value = this.props.value;
        if (!value || !String(value).trim()) return true; // "required" cuida do campo vazio
        return this.checkId(value).then(function (result) {
          if (result.status === 'duplicate') {
            return { error: { message: result.message } };
          }
          return true;
        });
      },
      render: function () {
        var value = this.props.value || '';
        if (this.state.lockedFromStart) {
          return h(
            'div',
            {},
            h('input', {
              type: 'text',
              value: value,
              disabled: true,
              readOnly: true,
              style: {
                width: '100%',
                padding: '8px 10px',
                fontSize: '15px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                background: '#f0f0f0',
                color: '#666',
                cursor: 'not-allowed',
                boxSizing: 'border-box'
              }
            }),
            h(
              'p',
              { style: { margin: '6px 0 0', fontSize: '12px', color: '#888' } },
              'Este ID foi definido na criação do imóvel e não pode ser alterado pelo painel.'
            )
          );
        }
        var status = this.state.status;
        var borderColor = '#ccc';
        var msgColor = '#888';
        if (status === 'duplicate') {
          borderColor = '#C81B2E';
          msgColor = '#C81B2E';
        } else if (status === 'available') {
          borderColor = '#1DA851';
          msgColor = '#1DA851';
        } else if (status === 'error') {
          msgColor = '#a86b00';
        }
        return h(
          'div',
          {},
          h('input', {
            type: 'text',
            value: value,
            placeholder: 'Número único, ex: 11',
            onChange: this.handleChange,
            style: {
              width: '100%',
              padding: '8px 10px',
              fontSize: '15px',
              border: '1px solid ' + borderColor,
              borderRadius: '4px',
              boxSizing: 'border-box'
            }
          }),
          this.state.message
            ? h(
                'p',
                { style: { margin: '6px 0 0', fontSize: '12px', color: msgColor } },
                this.state.message
              )
            : null
        );
      }
    });

    var LockedIdPreview = createClass({
      render: function () {
        return h('span', {}, this.props.value || '');
      }
    });

    window.CMS.registerWidget('lockedid', LockedIdControl, LockedIdPreview);
  }

  waitForCMS();
})();

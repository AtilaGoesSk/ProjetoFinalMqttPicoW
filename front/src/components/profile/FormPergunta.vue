<template>
    <div>
      <div class="modal fade" id="modalExemplo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true" ref="modal">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">{{ modalTitle }}</h5>
              <button type="button" class="close" @click="fecharModal" aria-label="Fechar">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div class="modal-body">
              <p><strong>Pergunta:</strong> {{ modalQuestion }}</p>
              <p><strong>Resposta:</strong> {{ modalMessage }}</p>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" @click="fecharModal">Fechar</button>
            </div>
          </div>
        </div>
      </div>
  
      <div class="container mt-4">
        <div class="row">
          <div class="col-sm-12">
            <span class="text-pergunta input-group">Digite sua pergunta de Verdadeiro ou Falso:</span>
            <form @submit.prevent="enviarPergunta" class="mt-3 mb-3">
              <div class="input-group">
                <textarea class="form-control" id="txtPergunta"></textarea>
              </div>
              <input class="btn btn-pergunta enviar mt-2" type="submit" />
            </form>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'FormPergunta',
    data() {
      return {
        modalTitle: '',
        modalMessage: '',
        modalQuestion: ''
      };
    },
    computed: {
      usuario() {
        return this.$store.getters['user/user'];  
      }
    },
    methods: {
      async enviarPergunta() {
        let pergunta = document.getElementById("txtPergunta").value;
  
        if (pergunta === "") {
          this.showModal('Pergunta', 'Por favor, digite uma pergunta!');
          return;
        } else {
          try {
            const response = await fetch(`http://localhost:3000/enviarPergunta/${this.usuario.id}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({ pergunta })
            });
  
            if (!response.ok) {
              const error = await response.json();
              throw new Error(error.message);
            }
  
            const result = await response.json();
            this.showModal('Pergunta', result.resposta, pergunta);
  
            this.$emit('pergunta-enviada', {
              pergunta,
              resposta: result.resposta
            });
          } catch (error) {
            this.showModal('Erro', 'Erro ao enviar a pergunta: ' + error);
          }
        }
      },
      showModal(title, message, question = '') {
        this.modalTitle = title;
        this.modalMessage = message;
        this.modalQuestion = question;
  
        const modal = new bootstrap.Modal(this.$refs.modal);
        modal.show();
      },
      fecharModal() {
        const modal = bootstrap.Modal.getInstance(this.$refs.modal);
        modal.hide();
      }
    }
  }
  </script>
  
  <style scoped>
  #formP {
    display: flex;
    justify-content: center;
    color: white;
    margin-bottom: 30px;
  }
  form {
    display: grid;
  }
  textarea {
    margin-bottom: 10px;
  }
  .btn-pergunta {
    background: #034127;
    color: #fff;
    text-transform: uppercase;
    padding: 10px;
  }
  .text-pergunta {
    color: #fff;
  }
  </style>
  
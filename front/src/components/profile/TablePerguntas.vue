<template>
  <div>
    <div class="modal fade" id="actionModal" tabindex="-1" aria-labelledby="modalLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalLabel">Confirmação</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body">
            <p id="modalMessage"></p>
            <div id="modalInputContainer" style="display: none;">
              <input type="text" id="modalInput" class="form-control" />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
            <button type="button" class="btn btn-danger" id="modalConfirmButton">Confirmar</button>
          </div>
        </div>
      </div>
    </div>
    
    <div style="max-height: 400px; width: 100%; overflow-y: auto;"> 
      <table class="table table-sm table-milhao">
        <thead>
          <tr>
            <th scope="col">Pergunta</th>
            <th scope="col">Resposta</th>
            <th scope="col"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="pergunta in perguntas" :key="pergunta.id_pergunta">
            <td>{{ pergunta.texto }}</td>
            <td>{{ pergunta.resposta?.resp || 'Sem Resposta' }}</td>
            <td>
              <div id="btnTable">
                <button class="btn btn-outline-success-milhao" v-on:click="editarPergunta(pergunta)">Editar</button>
                <button class="btn btn-outline-danger-milhao" v-on:click="apagarPergunta(pergunta.id_pergunta)">Apagar</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { notify } from "@kyvg/vue3-notification";

export default {
  name: 'TablePerguntas',
  props: {
    dados: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      perguntas: this.dados
    };
  },
  methods: {
    async listarPerguntas() {
      const id = this.usuario.id;
      const response = await fetch(`http://localhost:3000/perguntasPerfil/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const result = await response.json();
      this.perguntas = result.perguntaComResposta;
    },
    
    async apagarPergunta(id) {
      this.showModal(
        'Deletar pergunta',
        'Você realmente deseja apagar esta pergunta? Digite "Sim" para confirmar.',
        true,
        '',
        async (inputValue) => {
          if (inputValue.toLowerCase() === 'sim') {
            const response = await fetch(`http://localhost:3000/deletarPergunta/${id}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            });
            const result = await response.json();

            notify({
              title: 'Pergunta',
              text: result.message,
              type: result.code ? 'success' : 'warning',
              duration: 3000,
            });

            this.listarPerguntas();
          } else {
            this.showModal('Cancelado', 'Ação cancelada.', false, '', () => {
              this.listarPerguntas();
            });
          }
        }
      );
    },
    
    async editarPergunta(pergunta) {
      this.showModal(
        'Editar Pergunta',
        'Edite sua pergunta abaixo:',
        true,
        pergunta.texto,
        async (inputValue) => {
          if (inputValue) {
            const response = await fetch(`http://localhost:3000/editarPergunta/${pergunta.id_pergunta}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pergunta: inputValue })
            });

            const result = await response.json();

            notify({
              title: 'Pergunta',
              text: result.message,
              type: result.code ? 'success' : 'warning',
              duration: 3000,
            });

            
            this.listarPerguntas();
          } else {
            this.showModal('Cancelado', 'Ação cancelada.', false, '', () => {
              this.listarPerguntas();
            });
          }
        }
      );
    },

    showModal(title, message, showInput = false, defaultValue = '', callback) {
      const modal = new bootstrap.Modal(document.getElementById('actionModal'));
      const modalTitle = document.getElementById('modalLabel');
      const modalMessage = document.getElementById('modalMessage');
      const modalInputContainer = document.getElementById('modalInputContainer');
      const modalInput = document.getElementById('modalInput');
      const confirmButton = document.getElementById('modalConfirmButton');

      modalTitle.textContent = title;
      modalMessage.textContent = message;
      modalInputContainer.style.display = showInput ? 'block' : 'none';
      modalInput.value = defaultValue;

      confirmButton.onclick = () => {
        modal.hide();
        const inputValue = modalInput.value.trim();
        callback(inputValue);
      };

      modal.show();
    }
  },

  computed: {
    usuario() {
      return this.$store.getters['user/user'];
    }
  },

  watch: {
    dados(newDados) {
      this.perguntas = newDados;
    }
  },

  async mounted() {
    await this.listarPerguntas();
  }
};
</script>

<style scoped>
.table-milhao {
  display: inline-table;
  background: hsl(0deg 0% 0% / 75%);
  border: transparent;
  border-radius: 5px;
}
.table-milhao thead th {
  border-bottom: transparent;
  color: #fff;
  text-transform: uppercase;
}
.table-milhao tbody td {
  color: #fff;
  font-size: 14px;
}
.table td, .table th {
  border-top: 1px solid #141414;
  color: #ffffff;
}
#divTable {
  display: flex;
  justify-content: center;
}
#btnTable {
  display: flex;
  justify-content: space-around;
}
.btn-outline-success-milhao {
  color: #28a745;
  background-color: transparent;
  background-image: none;
  border-color: #28a745;
}
.btn-outline-danger-milhao {
  color: #dc3545;
  background-color: transparent;
  background-image: none;
  border-color: #dc3545;
}
</style>

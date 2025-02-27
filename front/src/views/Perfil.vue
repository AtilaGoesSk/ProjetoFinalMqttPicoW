<template>
    <div id="perfil">
      <div class="container">
        <div class="row">
          <div class="col-sm-12">
            <InfoUser />
          </div>
          <div class="col-sm-12">
            <FormPergunta @pergunta-enviada="atualizarTabela" />
          </div>
          <div class="col-sm-12">
            <TablePerguntas :dados="dadosTabela" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import Nav from '../components/Nav.vue';
  import InfoUser from '@/components/profile/InfoUser.vue';
  import FormPergunta from '../components/profile/FormPergunta.vue';
  import TablePerguntas from '../components/profile/TablePerguntas.vue';
  
  export default {
    name: "Perfil",
    components: {
      Nav,
      InfoUser,
      FormPergunta,
      TablePerguntas
    },
    data() {
      return {
        dadosTabela: []
      };
    },
    computed: {
        usuario() {
            return this.$store.getters['user/user'];
        }
    },
    methods: {
        async atualizarTabela(novosDados) {
            this.carregarPerguntas();
        },
        async carregarPerguntas() {
            try {
                const id = this.usuario.id;
                const response = await fetch(`http://localhost:3000/perguntasPerfil/${id}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const result = await response.json();
                this.dadosTabela = result.perguntaComResposta;
            } catch (error) {
                console.error("Erro ao carregar perguntas:", error);
            }
        }
    },
    mounted() {
      this.carregarPerguntas();
    }
  };
  </script>
  
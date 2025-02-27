<template>
  <div class="container mt-5">
    <table class="table table-striped">
      <thead class="table-milhao">
        <tr>
          <th></th>
          <th>Resposta</th>
          <th>Usuário</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dado in detector.dados" :key="dado.id_pergunta">
          <td>{{ dado.texto }}</td>
          <td>{{ dado.resposta.resp }}</td>
          <td>
            <span class="badge badge-primary">{{ dado.user.username ?? '' }}</span>
          </td>
        </tr>
        <template v-if="detector.dados.length == 0">
          <tr>
            <td colspan="3" class="text-center">
              <h1 class="info">Perguntas vazias</h1>
              <p class="info">Não foi encontrado nenhum registro de perguntas.</p>
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>

<script>
export default {
  name: "ListPerguntas",
  data() {
    return {
      detector: {
        dados: []
      }
    };
  },
  methods: {
    async listar() {
      const response = await fetch(`http://localhost:3000/listarPerguntas`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      
      const result = await response.json();

      this.detector.dados = result;
    }
  },
  async mounted() {
    await this.listar();
  }
};
</script>

<style scoped>
.table-milhao {
  background: hsl(0deg 0% 0% / 75%);
  border: transparent;
  border-radius: 5px;
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

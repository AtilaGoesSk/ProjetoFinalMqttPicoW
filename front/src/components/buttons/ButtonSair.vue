<template>
  <div>
    <button type="button" class="btn btn-outline-danger" v-on:click="openModal">Sair</button>
    <div class="modal fade" id="modalSair" tabindex="-1" aria-labelledby="modalExemploLabel" aria-hidden="true">
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="modalSairLabel">Desconectar</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
          </div>
          <div class="modal-body">
            Você deseja realmente sair da sua conta?
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-danger" @click="sair">Sair</button>
            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
      };
    },
    methods: {
      openModal() {
        const modal = new bootstrap.Modal(document.getElementById('modalSair'));
        modal.show();
      },
      sair() {
        this.$store.dispatch('user/logout');
        location.reload()
      }
    }
  };
</script>
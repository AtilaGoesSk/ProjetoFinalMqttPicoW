<template>
  <ContainerForm :alters="alters" />
</template>

<script>
import ContainerForm from '@/components/forms/ContainerForm.vue';

export default {
  name: 'Inicio',
  data() {
        return {
            alters: {
              topo: 'Login',
              btnEnviar: 'Login',
              span: true,
              tipo: 'login'
            }
        }
    },
  components:{
    ContainerForm
  }
}
</script>
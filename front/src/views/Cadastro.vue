<template>
    <ContainerForm :alters="alters" />
</template>

<script>
import ContainerForm from '@/components/forms/ContainerForm.vue';
export default {
    name: 'Cadastro',
    data() {
        return{
            alters: {
              topo: 'Cadastro',
              btnEnviar: 'Cadastrar',
              span: false,
              type: 'cadastro'
            }
        }
    },
    components: {
        ContainerForm
    }
}
</script>
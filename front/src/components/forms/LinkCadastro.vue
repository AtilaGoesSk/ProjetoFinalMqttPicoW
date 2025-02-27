<template>
    <span class="router"><a class="item" v-show="span" href='/Cadastro'>Não tem Login? Cadastre-se</a></span>
</template>

<script>
export default {
    name: "LinkCadastro",
    props: {
        span: {
            type: Boolean,
            required: true
        }
    }
}
</script>

<style scoped>
.router {
    display: block;
}

.router .item {
    display: grid;
    align-content: center;
    justify-content: center;
}
span{
    display: flex;
    justify-content: right;
}
span a{
    color: #fff;
    font-size: 12px;
    text-decoration: none;
}
</style>
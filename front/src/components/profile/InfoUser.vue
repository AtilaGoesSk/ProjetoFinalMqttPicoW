<template>
    <div class="container mt-4">
        <div class="row">
            <div class="col-sm-12 user">
                <h1 class="username">{{ usuario ?? '' }}</h1>
                <h2>R$ {{ saldo ?? 0 }}</h2>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "InfoUser",
    computed: {
        saldo() {
            const user = this.$store.getters['user/user'];

            if (user === null || user === undefined) {
                return '';
            }

            return user.saldo;
        },
        usuario() {
            const user = this.$store.getters['user/user'];
            
            if (user === null || user === undefined) {
                return '';
            }

            return user.username;
        }
    }
}
</script>

<style scoped>
#info {
    display: flex;
    justify-content: center;
    color: white;
    margin-bottom: 20px;
}
.user {
    color: #ffffff;
}
h1 {
    font-size: 60px;
}
</style>

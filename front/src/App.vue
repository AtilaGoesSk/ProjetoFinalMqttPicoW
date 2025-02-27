<template>
  <div id="main">
    <notifications position="top center" />
    <Nav v-if="logado" />
    <router-view/>
    <div class="modal">
      <div class="content">
        asasa
      </div>
    </div>
  </div>
</template>

<script>
import Nav from '@/components/Nav.vue'

export default {
    name: "InfoUser",
    components: {
        Nav,
    },
    computed: {
        logado() {
            const user = this.$store.getters['user/user'];
            return user !== null;
        }
    }
}
</script>

<style scoped>


.modal .content {
    background: #000;
    display: flex;
    width: 500px;
    margin-right: auto;
    margin-left: auto;
    margin-top: 50px;
    border: 2px solid #afafaf;
}
</style>
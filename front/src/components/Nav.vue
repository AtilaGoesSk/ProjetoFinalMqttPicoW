<template>
    <div id="navegacao">
        <div>
            <ul class="nav">
                <li class="nav-item">
                    <a class="nav-link" href="/Perfil">Perfil</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="/Lista">Lista de Perguntas</a>
                </li>
            </ul>
        </div>
        <div>
            <ButtonSair />
        </div>
    </div>
</template>

<script>
import ButtonSair from '../components/buttons/ButtonSair.vue';
 
export default {
    name: 'Nav',
    components: {
        ButtonSair
    }
}
</script>

<style>
#navegacao{
    background-color: #080808;
    padding: 10px;
    display: flex;
    justify-content: space-between;
}
.nav-link{
    color: white;
    font-size: 15px;
    text-decoration: none;
    transition: .5s;
}
.nav-link:hover{
    color: turquoise;
}
</style>
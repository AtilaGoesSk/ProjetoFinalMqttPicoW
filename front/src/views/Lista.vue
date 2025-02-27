<template>
    <div>
        <ListPerguntas />
    </div>
</template>

<script>
import Nav from '../components/Nav.vue'
import ListPerguntas from '@/components/lists/ListPerguntas.vue';

export default {
    name: "Lista",
    components: {
        Nav,
        ListPerguntas
    }
}
</script>

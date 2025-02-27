<template>
    <div>
        <div class="modal fade" id="modalExemplo" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">Título do modal</h5>
                        <button type="button" class="close" data-dismiss="modal" aria-label="Fechar">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body"></div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Fechar</button>
                    </div>
                </div>
            </div>
        </div>

        <div class="container">
            <div class="header">
                {{ alters.topo }}
            </div>
            <form @submit.prevent="enviarForm">
                <div class="input-container">
                    <template v-if="alters.tipo != 'login'">
                        <InputUser v-model="formData.user"/>
                    </template>
                    <InputEmail v-model="formData.email"/>
                    <InputSenha v-model="formData.senha"/>
                    <InputEnviar :btnEnviar="alters.btnEnviar" />
                    <LinkCadastro :span="alters.span"/>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import InputUser from './InputUser.vue';
import InputEmail from './InputEmail.vue';
import InputSenha from './InputSenha.vue';
import InputEnviar from './InputEnviar.vue';
import LinkCadastro from './LinkCadastro.vue';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { notify } from "@kyvg/vue3-notification";

export default {
    name: "ContainerForm",
    components: {
        InputUser,
        InputEmail,
        InputSenha,
        InputEnviar,
        LinkCadastro
    },
    props: {
        alters: {
            type: Object,
            required: true
        }
    },
    setup() {
        const store = useStore();
        const router = useRouter();
        return { store, router };
    },
    data() {
        return {
            formData: {
                user: '',
                email: '',
                senha: ''
            }
        };
    },
    methods: {
        enviarForm() {
            if (this.alters.tipo === 'login') {
                this.loginSubmit();
            } else {
                this.cadastroSubmit();
            }
        },
        async loginSubmit() {
            const data = this.formData;

            try {
                const response = await fetch('http://localhost:3000/logar', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: data.email, password: data.senha })
                });

                const result = await response.json();

                if (result.status === 1) {
                    this.$store.dispatch('user/setUser', result.account);
                    this.router.push({ name: 'perfil' });
                } else {
                    notify({
                        title: 'Email ou senha inválidos. Tente novamente.',
                        type: 'alert',
                        duration: 3000,
                    });
                }
            } catch (error) {
                notify({
                    title: 'Erro ao realizar login. Por favor, tente novamente.',
                    type: 'warning',
                    duration: 3000,
                });
            }
        },
        async cadastroSubmit() {
            if (!this.formData.user && !this.formData.email || !this.formData.senha) {
                notify({
                    title: 'Por favor, preencha todos os campos!',
                    type: 'warning',
                    duration: 3000,
                });
                return;
            } else {
                try {
                    const response = await fetch('http://localhost:3000/cadastrouser', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(this.formData)
                    });

                    if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.message);
                    }

                    const result = await response.json();

                    if (result.status === 2) {
                        notify({
                            title: 'Já existe um usuário cadastrado com este email.',
                            type: 'warning',
                            duration: 3000,
                        });
                    } else if (result.status === 1) {
                        notify({
                            title: 'Usuário cadastrado com sucesso.',
                            type: 'success',
                            duration: 3000,
                        });

                        setTimeout(() => {
                            this.$store.dispatch('user/setUser', result.account);
                            this.router.push({ name: 'perfil' });
                        }, 2000);
                    } else {
                        notify({
                            title: 'Não foi possível cadastrar o usuário.',
                            type: 'warning',
                            duration: 3000,
                        });
                    }
                } catch (error) {
                    this.showModal('Erro', 'Erro ao realizar o cadastro: ' + error);
                }
            }
        },
        showModal(title, message) {
            const modalTitle = document.querySelector('#exampleModalLabel');
            const modalBody = document.querySelector('.modal-body');

            if (modalTitle && modalBody) {
                modalTitle.textContent = title;
                modalBody.textContent = message;
            }

            const modal = new bootstrap.Modal(document.getElementById('modalExemplo'));
            modal.show();
        }
    }
}
</script>

<style scoped>
.container {
    background: #000000;
    background-repeat: no-repeat;
    background-size: cover;
    margin-top: 50pt;
    border-radius: 10px;
    height: 450px;
    width: 370px;
    box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2), 0 2px 20px 0 rgba(0,0,0,0.2);
}
.header {
    display: flex;
    justify-content: center;
    font-size: 40px;
    font-weight: 500;
    color: #fff;
}
.input-container {
    margin: 30px 30px 10px 30px;
}
</style>

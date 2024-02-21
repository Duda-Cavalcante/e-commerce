<template>
    <div class="login-page">
        <h1>Acessar conta</h1>
        <p class="subtitle">Insira os dados da sua conta para poder continuar com o processo de compra.</p>
        <p>Telefone</p>
        <input v-model="telefone" type="tel" placeholder="Insira seu telefone aqui..."
            :class="{ 'invalid': telefoneInvalido }" />
        <p v-if="telefoneInvalido" class="error-message">Ops, telefone inválido</p>
        <p>Senha</p>
        <input v-model="senha" type="password" placeholder="Insira sua senha aqui..." :class="{ 'invalid': senhaInvalida }" />
        <p v-if="senhaInvalida" class="error-message">Ops, senha inválida</p>

        <p v-if="userNotAuthorized" class="error-message">Ops, dados incorretos ou usuário não encontrado.</p>

        <p class="forgot-password">Esqueci minha senha</p>
        <button class="login-button" @click="entrar">Entrar</button>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    name: 'LoginView',
    data() {
        return {
            telefone: '',
            senha: '',
            telefoneInvalido: false,
            senhaInvalida: false,
            userNotAuthorized: false
        };
    },
    methods: {
        entrar() {
            this.telefoneInvalido = false;
            this.senhaInvalida = false;
            this.userNotAuthorized = false;

            if (!this.telefone) {
                this.telefoneInvalido = true;
                return;
            } else {
                this.telefoneInvalido = false;
            }

            if (!this.senha) {
                this.senhaInvalida = true;
                return;
            } else {
                this.senhaInvalida = false;
            }

            axios.post('http://165.227.177.3:8001/login/consumidor/', {
                username: this.telefone,
                password: this.senha
            }).then(response => {
                if (response.status === 200) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    this.$router.push(`/loja/${this.$route.params.slug}/checkout`);
                }
            }).catch(error => {
                if (error.response.status === 403) {
                    this.userNotAuthorized = true;
                }
            });
        }
    }
};
</script>
  
<style scoped>

h1{
    color: #FFFFFF;
    font-weight: 700;
    font-size: 32px;
    text-align: left;
}

p{
    color: #FFFFFF;
    text-align: left;
    font-weight: 400;
    font-size: 14px;
    padding: 10px;
}
.login-page {
    background-color: #596582;
    color: white;
    padding: 20px;
    text-align: center;
}

.subtitle {
    margin-bottom: 20px;
}

input[type="tel"],
input[type="password"] {
    width: 100%;
    box-sizing: border-box;
    border-radius: 5px;
    border: 1px solid #ccc;
}

.invalid {
    border-color: red;
}

.forgot-password {
    margin-top: 10px;
    cursor: pointer;
    text-align: center;
}

.login-button {
    background-color: #E74845;
    margin-top: 20px;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 60px;
    width: 100%;
    font-weight: 600;
}

.error-message {
    margin-top: 10px;
    color: red;
}
</style>
  
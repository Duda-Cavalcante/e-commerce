<template>
    <div class="authentication-page">
      <h1>Acesse sua conta ou cadastre-se!</h1>
      <p>Para continuar o processo de compra, escolha uma das opções abaixo.</p>
      <button class="existing-account-button" @click="redirectToLogin">Já sou cliente</button>
      <button class="new-account-button" @click="redirectToRegister">Criar nova conta</button>
    </div>
  </template>
  
  <script>
  export default {
    name: 'AuthenticationPage',
    methods: {
      redirectToLogin() {
        this.$router.push(`/loja/${this.$route.params.slug}/login`);
      },
      redirectToRegister() {
        this.$router.push('/loja/:slug/nova_conta');
      }
    }
  };
  </script>
  
  <style scoped>
  h1 {
    font-size: 32px;
    font-weight: 700;
    color: white;
    text-align: left;
  }
  
  p {
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
    padding: 10px;
  }
  
  .authentication-page {
    background-color: #596582;
    color: white;
    padding: 20px;
    text-align: center;
  }
  
  .existing-account-button,
  .new-account-button {
    display: block; 
    margin: 10px auto; 
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  .existing-account-button {
    background-color:#E74845;
    font-size: 14px;
    color: #ffffff;
    font-weight: 600;
    margin-top: 30px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 50px;
    width: 98%;
  }
  
  .new-account-button {
    background-color: transparent; 
    color: #ffffff; /* Cor do texto */
    border: 2px solid #ffffff; 
    font-size: 14px;
    font-weight: 600;
    height: 50px;
    width: 98%;
  }
  </style>
  
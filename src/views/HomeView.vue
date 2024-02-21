<template>
  <div class="loading-overlay" v-if="loading">
    <div class="loading-spinner"></div>
  </div>
  <div v-if="!loading">
    <img :src="banner ? banner : '@/assets/logo.png'" alt="Logo da Empresa" class="logo-client-company" />
    <h1>Olá, seja <br> bem-vindo!</h1>
    <p id="titulo1">Antes de começarmos, selecione uma de nossas unidades:</p>
    <div class="store-buttons">
      <button v-for="store in stores" :key="store.id" class="store-button" @click="navigateToStore(store.slug)">
        <i class="fas fa-map-marker-alt" style="color: #395bb9;"></i>
        {{ store.name }} - {{ store.street }}, {{ store.number }}
      </button>
    </div>
  </div>
</template>
  
<script>
import axios from 'axios';

export default {
  data() {
    return {
      stores: null,
      banner: null,
      loading: true,
    };
  },
  mounted() {
    axios
      .get('http://165.227.177.3:8001/clientes/cliente_01/')
      .then(response => (
        this.stores = response.data.stores,
        this.banner = response.data.banner,
        this.loading = false
      )).finally(() => {
        this.loading = false;
      });
  },
  methods: {
    navigateToStore(slug) {
      localStorage.setItem('selected_store', slug);
      this.$router.push(`/loja/${slug}/produtos`);
    },
  },
};
</script>
  
<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200; 1.300;1.400;1.500;1.600;1.700;1.800;1.900&display=swap');

* {
  font-family: 'Poppins', sans-serif;
}

h1 {
  padding: 10px;
  line-height: 36px;
  align-items: center;
  color: #F2F2F2;
  font-weight: bold;
  font-size: 32px;
}

#titulo1 {
  padding: 10px;
  font-weight: 400;
  font-size: 16px;
  line-height: 28px;
  align-items: center;
  color: #F2F2F2;
}

.store-buttons {
  padding: 20px;
  vertical-align: middle;
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
}

#btn {
  padding: 10px -20px;
  color: #4E4B66;
  font-size: 14px;
  margin-left: 35px;
  margin-top: 5px;
}

.store-button {
  background-color: #ffffff;
  color: #14142B;
  width: 365px;
  height: 76px;
  padding: 10px 15px;
  border-radius: 6px;
  cursor: pointer;
  border: none;
  text-align: left;
  font-size: 17px;
  font-weight: 600;
}

.bigger-icon {
  width: 30px;
  height: 4px;
}

.logo-client-company {
  max-width: 250px;
  max-height: 250px;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(255, 255, 255, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.loading-spinner {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
  
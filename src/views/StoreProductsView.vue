<template>
  <div class="container">
    <img src="@/assets/logo.png" alt="Logo da Empresa" class="logo-client-company" />

    <div class="search-container">
      <input v-model="searchQuery" @keyup.enter="performSearch" :class="{ 'no-results': noResultsMessageVisible }"
        placeholder="Digite a busca aqui">
    </div>

    <div>
      <div v-for="categoria in categorias" :key="categoria.id">
        <p class="title">{{ categoria.description }}</p>
        <div v-for="produto in categoria.products" :key="produto.id" v-on:click="gotToProductPage(produto.id)">
          <img v-if="produto.images.length > 0" class="imageprod" :src="produto.images[0].image" alt="Imagem do Produto" />
          <p class="description">{{ produto.short_description }}</p>
          <p class="price" v-for="stock in produto.stocks" :key="stock.unit_price"> R$ {{ stock.unit_price }}</p>
        </div>
      </div>
    </div>

    <div class="erro" v-if="categorias.length <= 0 && searchQuery.length > 0">
      Não encontramos nenhum resultado.
    </div>


    <div class="bottom-menu">
      <router-link :to="`/loja/${this.$route.params.slug}/produtos`"
        :class="{ 'active': getRouterActiveColor(`/loja/${this.$route.params.slug}/produtos`) === '#395BB9' }">
        <i class="fas fa-home" :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/produtos`) }"></i>
        <span :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/produtos`) }">Página
          Inicial</span>
      </router-link>
      <router-link :to="`/loja/${this.$route.params.slug}/carrinho`"
        :class="{ 'active': getRouterActiveColor(`/loja/${this.$route.params.slug}/carrinho`) === '#395BB9' }">
        <i class="fas fa-shopping-cart"
          :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/carrinho`) }"></i>
        <span :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/carrinho`) }">Carrinho</span>
      </router-link>
      <router-link :to="`/loja/${this.$route.params.slug}/minha_conta`"
        :class="{ 'active': getRouterActiveColor(`/loja/${this.$route.params.slug}/minha_conta`) === '#395BB9' }">
        <i class="fas fa-user"
          :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/minha_conta`) }"></i>
        <span :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/minha_conta`) }">Minha Conta</span>
      </router-link>
    </div>

  </div>
</template>

<script>
import axios from 'axios';
export default {
  data() {
    return {
      searchQuery: "",
      categorias: [],
    };
  },
  mounted() {
    axios.get(`http://165.227.177.3:8001/categorias/${this.$route.params.slug}/`).then((response) => {
      this.categorias = response.data;
    });
  },


  methods: {
    performSearch() {
      let url = `http://165.227.177.3:8001/categorias/${this.$route.params.slug}/`
      if (this.searchQuery.length > 0) {
        url = url.concat(`?search=${this.searchQuery}`);
      }
      axios.get(url).then((response) => {
        this.categorias = response.data;
      })
    },

    gotToProductPage(productID) {
      this.$router.push(`/loja/${this.$route.params.slug}/produtos/${productID}`);
    },
    getRouterActiveColor(route) {
      return this.$route.path === route ? "#395BB9" : "#A1A1AA";
    }
  },


};

</script>

  
<style>
* {
  margin: 0;
  padding: 0;
  border: 0;
}

img {
  width: 459px;
  height: 195px;
}

.container{
  height: 800px;
}

input {
  flex: 1;
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  outline: none;
  width: 80%;
  line-height: 40px;
  margin-top: 20px;
  font: 16px;
  font-weight: 400;
}

.title {
  color: #FFFFFFCC;
  font-weight: 600;
  font-size: 14px;
  line-height: 24px;
  margin-top: 15px;
  text-align: left;
  padding: 28px;
  text-transform: capitalize;
}

.description {
  max-width: 400px;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.75%;
  color: #ffffff;
  text-align: left; 
  margin: auto; 
  display: flex; 
  align-items: center; 
  padding-left: 28px; 
  }

  .price {
  font-weight: 200;
  font-size: 16px;
  color: #ffffff;
  text-align: left; 
  padding-left: 28px; 
  }

.erro {
  font-weight: 400;
  color: white;
  font-size: 16px;
  line-height: 28px;
  letter-spacing: 0.8px;
}

.imageprod{
  background-color: #f0f0f0; 
  border-radius: 10px; 
  max-width: 150px;
  max-height: 220px;
}

.bottom-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: #ffffff;
  display: flex;
  justify-content: space-around;
  padding: 5px;
}

.bottom-menu a {
  color: #fff;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
}

.bottom-menu i {
  display: block;
  font-size: 24px;
  margin-bottom: 5px;
}

span {
  color: #A1A1AA;
  font-weight: 600;
  font-size: 12px;
  line-height: 18px;
}
</style>
  
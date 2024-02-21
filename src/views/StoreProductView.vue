<template>
    <div class="product-details">
        <div class="carousel">
            <img class="imgprod" v-for="image in product.images" :key="image.id" :src="image.image" alt="Imagem do Produto" />
        </div>
        <div class="description">{{ product.short_description }}</div>
        <p class="observation-text">Você deseja adicionar alguma observação?</p>
        <input type="text" placeholder="Digite aqui..." v-model="observacao" />
        <button class="buy-button" @click="addToCart" v-if="product.stocks?.length">Comprar - R$ 
            {{ product.stocks[0].unit_price }}</button>

    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            product: {},
            observacao: ''
        };
    },
    mounted() {
        this.carregarProduto();
    },
    methods: {
        carregarProduto() {
            axios.get(`http://165.227.177.3:8001/produtos/?ids=${this.$route.params.produto_id}`)
                .then(response => {
                    this.product = response.data[0];
                })
                .catch(error => {
                    console.error('Erro ao carregar produto:', error);
                });
        },
        addToCart() {
            const cart = JSON.parse(localStorage.getItem(`${this.$route.params.slug}/cart`)) || [];
            cart.push({
                id: this.product.id,
                observacao: this.observacao,
                product: this.product,
            });

            localStorage.setItem(`${this.$route.params.slug}/cart`, JSON.stringify(cart));
        }
    }
};
</script>
  
<style scoped>
.product-details {
    background-color: #596582;
    color: white;
    padding: 20px;
}

.description {
    margin-top: 20px;
    font-size: 18px;
}

.observation-text {
    margin-top: 40px;
    font-size: 16px;
    color: #fff;
    text-align: justify; 
    letter-spacing: -0.7px;
}


input[type="text"] {
    margin-top: 5px;
    padding: 5px;
    width: 100%;
    box-sizing: border-box;
}

.buy-button {
    position: fixed;
    bottom: 0; 
    left: 0; 
    width: 100%; /* Ocupa toda a largura do viewport */
    padding: 15px 20px;
    background-color: #E74845;
    color: white;
    border: none;
    cursor: pointer;
}

.imgprod{
  background-color: #ffffff; 
  max-width: 250px;
  max-height: 300px;
  border-radius: 10px;
}
</style>
  
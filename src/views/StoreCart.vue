<template>
    <div class="cart-page">
        <h1>Carrinho</h1>

        <div v-if="cartItems.length > 0" class="cart-items">
            <div v-for="(item, index) in cartItems" :key="index" class="cart-item">
                <img :src="item.product.images[0].image" alt="Imagem do Produto" class="product-image" />
                <div class="product-details">
                    <h3>{{ item.product.short_description }}</h3>
                    <p class="value">R$ {{ item.product.stocks[0].unit_price }}</p>
                    <p> {{ item.quantity }}</p>
                </div>
                <button @click="removerItem(index)" class="delete-button"><i class="fas fa-trash-alt"></i></button>
            </div>
        </div>
        <div v-else>
            <p>O carrinho está vazio.</p>
        </div>
        <hr class="horizontal-line">

        <div class="summary">
            <h2>Resumo da Compra:</h2>
            <p class="sub">Subtotal: R$ {{ subtotal.toFixed(2) }}</p>
            <p class="delivery">Valor da Entrega: R$ {{ valorEntrega }}</p>
            <p class="total">Total: R$ {{ total.toFixed(2) }}</p>
        </div>

        <button class="checkout-button" v-on:click="handleCheckout">Finalizar Compra</button>
    </div>
    <div class="bottom-menu">
        <router-link :to="`/loja/${this.$route.params.slug}/produtos`"
            :class="{ 'active': getRouterActiveColor(`/loja/${this.$route.params.slug}/produtos`) === '#395BB9' }">
            <i class="fas fa-home"
                :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/produtos`) }"></i>
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
            <span :style="{ color: getRouterActiveColor(`/loja/${this.$route.params.slug}/minha_conta`) }">Minha
                Conta</span>
        </router-link>
    </div>
</template>
  
<script>
export default {
    data() {
        return {
            cartItems: [],
        };
    },
    computed: {
        subtotal() {
            return this.cartItems.reduce((total, item) => total + (Number(item.product.stocks[0].unit_price)), 0);
        },
        valorEntrega() {
            return 0;
        },
        total() {
            return this.subtotal + this.valorEntrega;
        },
    },
    mounted() {
        const cartKey = `${this.$route.params.slug}/cart`;
        const cart = localStorage.getItem(cartKey);
        if (cart) {
            this.cartItems = JSON.parse(cart);
        }
    },
    methods: {
        removerItem(index) {
            this.cartItems.splice(index, 1);
            this.atualizarLocalStorage();
        },
        atualizarLocalStorage() {
            const cartKey = `${this.$route.params.slug}/cart`;
            localStorage.setItem(cartKey, JSON.stringify(this.cartItems));
        },
        getRouterActiveColor(route) {
            return this.$route.path === route ? "#395BB9" : "#A1A1AA";
        },
        handleCheckout() {
            const localStorageUser = localStorage.getItem('user') || null;

            if (localStorageUser) {
                this.$router.push(`/loja/${this.$route.params.slug}/checkout`);
            } else {
                this.sendToAuthPage()
            }
        },
        sendToAuthPage() {
            this.$router.push(`/loja/${this.$route.params.slug}/valida_usuario`);
        }
    }
};
</script>
  
<style scoped>


h1{
text-align: left;
color: white;
}

h3{
    font-size: 14px;
    color: #263E80;
    text-align: left;
    line-height: 18px;
}

.value  {
    font-size: 14px;
    font-weight: 600;
    color: #4E4B66;
    text-align: left;
    margin-top: 5px;
}
.cart-page {
    background-color: #596582;
    color: white;
    padding: 20px;
}

.cart-items {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    margin-top: 15px;
}

.cart-item {
    display: flex;
    align-items: center;
    background-color: white;
    padding: 10px;
    border-radius: 5px;
    color: black;
}

.product-image {
    max-width: 55px;
    max-height: 70px;
    margin-right: 20px;
}

.delete-button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: red;
}

.summary {
    margin-top: 100px;
}

.checkout-button {
    background-color: #E74845;
    margin-top: 20px;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 50px;
    width: 100%;
}


.horizontal-line {
    border: none; 
    border-top: 1px solid #343435; 
    margin: 40px 0; 
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

h2{
    margin-top: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #FFFFFFCC;
    text-align: left;
}

.sub{
    margin-top: 8px;
    font-weight: 400;
    font-size: 16px;
    color: white;
    text-align: left;
}

.delivery{
    margin-top: 8px;
    font-weight: 400;
    font-size: 16px;
    color: white;
    text-align: left;
}

.total{
    margin-top: 8px;
    font-weight: 600;
    font-size: 20px;
    color: white;
    text-align: left;
}

</style>
  
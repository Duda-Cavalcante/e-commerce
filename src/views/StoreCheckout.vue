<template>
    <div class="checkout-step">
        <h1 class="finalize">Finalizar Compra</h1>
        <p class="subtitle">Confira as informações abaixo antes de finalizar a compra do produto.</p>

        <div v-if="showEnderecoForm">
            <h2 class="delivery">Onde você deseja receber?</h2>

            <div v-if="enderecos !== null && enderecos.length === 0">
                <p>Você não tem nenhum endereço cadastrado.</p>
            </div>

            <div v-else>
                <div v-for=" endereco  in  enderecos " :key="endereco.id" class="endereco-card">
                    <div class="bolinha" @click="selecionarEndereco(endereco.id)"
                        :class="{ 'active': endereco.id === enderecoSelecionado?.id }"></div>
                    <div class="endereco-info">
                        <p class="endereco-street">{{ endereco.street }} {{ endereco?.number }}</p>
                        <div v-if="endereco.id !== 'pick_up'">
                            <p class="endereco-details">{{ endereco.neighborhood }}, {{ endereco.city.name }} -
                                {{ endereco.city.uf }}
                            </p>
                            <p class="endereco-cep">CEP: {{ endereco.cep }}</p>
                        </div>
                    </div>
                </div>
                <div class="endereco-card">
                    <div class="endereco-info">
                        <p class="endereco-street"> + Adicionar endereço</p>
                    </div>
                </div>

            </div>
        </div>

        <div v-if="showPagamentoForm">
            <h2>Pagar pelo app</h2>

            <div class="pagamento-options">
                <div class="pagamento-option" @click="selecionarPagamento('pix')">
                    <div class="bolinha" :class="{ 'active': metodoPagamento === 'pix' }"></div>
                    <p class="pagamento-label">Pix</p>
                </div>
            </div>

            <h2>Pagar na entrega</h2>

            <div class="pagamento-options">
                <div class="pagamento-option" @click="selecionarPagamento('cartao')">
                    <div class="bolinha" :class="{ 'active': metodoPagamento === 'cartao' }"></div>
                    <p class="pagamento-label">Cartão de Crédito</p>
                </div>
                <div class="pagamento-option" @click="selecionarPagamento('dinheiro')">
                    <div class="bolinha" :class="{ 'active': metodoPagamento === 'dinheiro' }"></div>
                    <p class="pagamento-label">Dinheiro</p>
                </div>

            </div>
        </div>

        <div v-if="showResume">
            <div class="resumo-section">
                <h2>Produtos</h2>
                <div v-for="( produto, index ) in  products " :key="index" class="produto-card">
                    <img :src="produto.product.images[0].image" alt="Imagem do Produto" class="produto-imagem">
                    <div class="produto-info">
                        <p class="produto-nome">{{ produto.product.description }}</p>
                        <p class="produto-valor">Valor Unitário: R$ {{ produto.product.stocks[0].unit_price }}</p>
                        <p class="produto-quantidade">Quantidade: 1</p>
                    </div>
                    <i class="fas fa-trash-alt" @click="removerProduto(produto.id)"></i>
                </div>
            </div>
            
            <div class="resumo-section">
                <h2 class="endereco">Endereço</h2>
                <div v-if="enderecoSelecionado.id !== 'pick_up'">
                    <p class="local">{{ enderecoSelecionado.street }}, {{ enderecoSelecionado.number }},
                        {{ enderecoSelecionado.neighborhood }}
                    </p>
                    <p class="local">{{ enderecoSelecionado.city.name }} - {{ enderecoSelecionado.city.uf }}</p>
                    <p class="local">CEP: {{ enderecoSelecionado.cep }}</p>
                </div>
                <div v-else>
                    <p>Retirar na loja</p>
                </div>
            </div>

            <div class="resumo-section">
                <h2>Método de Pagamento</h2>
                <p class="pag">{{ metodoPagamento }}</p>
            </div>

            <p class="resume">Resumo da compra</p>
            <p class="subtot">Subtotal: R$ {{ calculateTotal() }}</p>
        </div>

        <button class="next-button" v-on:click="avancar">{{ showResume ? "Finalizar Compra" : "Avançar" }}</button>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            enderecos: null,
            enderecoSelecionado: null,
            metodoPagamento: null,
            showEnderecoForm: true,
            showPagamentoForm: false,
            showResume: false,
            products: []
        };
    },
    mounted() {
        this.carregarEnderecos();
        this.products = this.getLocalStorageCart();
    },
    methods: {
        carregarEnderecos() {
            const localStorageUser = JSON.parse(localStorage.getItem('user'));
            const userId = localStorageUser.id;
            axios.get(`http://165.227.177.3:8001/enderecos/?consumer__id=${userId}`).then(response => {
                this.enderecos = [
                    {
                        id: 'pick_up',
                        street: 'Retirar na Loja'
                    }, ...response.data
                ];
            });
        },
        selecionarEndereco(enderecoId) {
            if (this.enderecoSelecionado && this.enderecoSelecionado.id === enderecoId) {
                this.enderecoSelecionado = null;
            } else {
                this.enderecoSelecionado = this.enderecos.find(endereco => endereco.id === enderecoId);
            }
        },
        avancar() {
            if (this.showEnderecoForm) {
                this.showEnderecoForm = false;
                this.showPagamentoForm = true;
            } else if (this.showPagamentoForm) {
                this.showPagamentoForm = false;
                this.showResume = true;
            } else if (this.showResume) {
                this.finalizarCompra();
            }
        },
        selecionarPagamento(metodo) {
            if (this.metodoPagamento === metodo) {
                this.metodoPagamento = null;
            } else {
                this.metodoPagamento = metodo;
            }
        },
        getLocalStorageCart() {
            return JSON.parse(localStorage.getItem(`${this.$route.params.slug}/cart`));
        },
        removerProduto(produtoId) {
            const cart = this.getLocalStorageCart();
            const newCart = cart.filter(produto => produto.id !== produtoId);
            localStorage.setItem(`${this.$route.params.slug}/cart`, JSON.stringify(newCart));
            this.products = newCart;
        },
        calculateTotal() {
            return this.products.reduce((acc, produto) => {
                return acc + produto.product.stocks[0].unit_price;
            }, 0);
        },
        finalizarCompra() {

            const paymentsIDs = {
                pix: 1,
                cartao: 2,
                dinheiro: 3
            }

            const compra = {
                items: this.products.map(produto => {
                    return {
                        unit_price: produto.product.stocks[0].unit_price,
                        product: produto.product.id,
                        quantity: 1
                    };
                }),
                store: this.$route.params.slug,
                consumer: JSON.parse(localStorage.getItem('user')).id,
                phone: JSON.parse(localStorage.getItem('user')).phone,
                address: this.enderecoSelecionado.id !== 'pick_up' ? this.enderecoSelecionado.id : null,
                total_price: this.calculateTotal().toString(),
                payment: paymentsIDs[this.metodoPagamento],
                delivery: this.enderecoSelecionado.id !== 'pick_up'
            };

            axios.post('//165.227.177.3:8001/pedidos/', compra).then(response => {
                if (response.status !== 201) {
                    alert('Erro ao finalizar a compra');
                    return;
                }

                localStorage.removeItem(`${this.$route.params.slug}/cart`);
                localStorage.setItem('compraFinalizada', 'true');
                this.$router.push(`/loja/${this.$route.params.slug}/produtos`);
            });
        }
    }
};
</script>
  
<style scoped>

.finalize{
    text-align: left;
    color:#FFFFFF;
    padding: auto;
}

.subtitle {
    font-weight: 400;
    font-size: 14px;
    color: white;
    padding: 15px;
    text-align: left;
}

.delivery{
    font-weight: 600;
    font-size: 14px;
    color: #FFFFFFCC;
    text-align: left;
    padding: 15px;
}
.endereco-card {
    background-color: #ffffff;
    color: #4E4B66;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    transition: box-shadow 0.3s ease;
    cursor: pointer;
  }
  
  .bolinha {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    background-color: #ffffff;
    cursor: pointer;
    border: 2px solid #596582;
    margin-right: 16px;
    transition: background-color 0.3s ease;
  }
  
  .bolinha.active {
    background-color: #596582;
  }
  
  .endereco-info {
    flex-grow: 1;
    text-align: left;
  }
  
  .endereco-street {
    margin: 0;
    font-weight: 600;
    font-size: 16px;
    color: #263E80;
  }
  .endereco-details {
    font-weight: 600;
    font-size: 16px;
    color: #263E80;
    text-align: left;
  }
  .endereco-cep {
    font-weight: 600;
    font-size: 16px;
    color: #263E80;
    text-align: left;
  }

    .next-button {
    background-color: #E74845;
    margin-top: 20px;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 50px;
    width: 90%;
}

h2{
    font-weight: 600;
    font-size: 14px;
    text-align: left;
    color: #FFFFFFCC;
}
.pagamento-options {
    font-weight: 600;
    font-size: 16px;
    color: #4E4B66;
}

.pagamento-option {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    background-color: white;
    color: #4E4B66;
}

.pagamento-label {
    margin: 0;
    font-size: 16px;
}

.resumo-section {
    background-color: #596582;
    color: #666;
    padding: 20px;
    border-radius: 4px;
    margin-bottom: 20px;
    min-width: 400px;
    max-width: 500px;
}
.fa-trash-alt {
    cursor: pointer;
}

.endereco-card .fa-trash-alt {
    display: none;
    /* Ocultar o ícone de lixeira nos cards de endereço */
}

.resume{
    font-weight: 600;
    font-size: 16px;
    text-align: left;
    color: #ffffff;
    padding: 25px;
}

p{
    font-weight: 400;
    font-size: 16px;
    text-align: left;
    padding: 10px;
}

.subtot{
    font-weight: 400;
    font-size: 16px;
    color: #ffffff;
    text-align: left;
    padding: 25px;
}
.resumo-section h2{
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
}

.local {
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
}

.produto-nome{
    max-width: 300px;
    font-weight: 600;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
}

.produto-valor{
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
}

.produto-quantidade{
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
}
.pag{
    font-weight: 400;
    font-size: 14px;
    color: #ffffff;
    text-align: left;
    text-transform: capitalize;
}
.produto-imagem{
    max-width: 100px;
    max-height: 150px;
    border-radius: 5px;
}
</style>
  






  
 
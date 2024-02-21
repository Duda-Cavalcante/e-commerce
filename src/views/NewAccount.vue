<template>
    <div class="criar-conta">
        <h1>Passo {{ currentStep }} de 3</h1>
        <p class="subtitle">{{ currentStepSubtitle }}</p>

        <div v-if="currentStep === 1" class="etapa">
            <h2>Endereço para entrega</h2>
            <label for="cep">CEP</label>
            <input type="text" v-model="entity.address.cep" id="cep" placeholder="Insira o seu CEP aqui...">
            <label for="street">Rua</label>
            <input type="text" v-model="entity.address.street" id="street" placeholder="Insira a rua aqui...">
            <label for="number">Número</label>
            <input type="text" v-model="entity.address.number" id="number" placeholder="Insira o número aqui...">
            <label for="complement">Complemento</label>
            <input type="text" v-model="entity.address.complement" id="complement" placeholder="Insira o complemento aqui...">
            <label for="uf">Estado</label>
            <input type="text" v-model="entity.address.uf" id="uf" placeholder="Insira o estado aqui...">
            <label for="city">Cidade</label>
            <input type="text" v-model="entity.address.city" id="city" placeholder="Insira sua cidade...">
            <label for="neighborhood">Bairro</label>
            <input type="text" v-model="entity.address.neighborhood" id="neighborhood" placeholder="Insira o seu bairro...">
        
            <div class="erro" v-if="error">
                Preencha todos os campos.
            </div>
        </div>

        <div v-if="currentStep === 2" class="etapa">
            <h2>Dados Pessoais</h2>
            <label for="name">Nome</label>
            <input type="text" v-model="entity.consumer.name" id="name" placeholder="Insira o seu nome aqui...">
            <label for="phone">Telefone</label>
            <input type="text" v-model="entity.consumer.phone" id="phone" placeholder="Insira o seu CPF aqui...">
            <label for="birth_date">Data de Nascimento</label>
            <input type="date" v-model="entity.consumer.birth_date" id="birth_date">
            <label for="cpf_cnpj">CPF/CNPJ</label>
            <input type="text" v-model="entity.consumer.cpf_cnpj" id="cpf_cnpj" placeholder="(00) 00000 - 0000">
        </div>

        <div v-if="currentStep === 3" class="etapa">
            <h2>Dados de Acesso</h2>
            <label for="email">Telefone</label>
            <input type="text" v-model="entity.consumer.user.username" id="username" placeholder="(XX) XXXXX - XXXX">
            <label for="senha">Senha</label>
            <input type="password" v-model="entity.consumer.user.password" id="senha" placeholder="Insira a sua senha aqui...">
            <label for="confirmarSenha">Confirmar Senha</label>
            <input type="password" v-model="confirmarSenha" id="confirmarSenha" placeholder="Confirme a sua senha aqui...">
        </div>
        <button @click="currentStep <= 2 ? nextStep() : criarConta()">
            {{ currentStep <= 2 ? "Próximo" : "Criar conta" }}
        </button>
    </div>
</template>
  
<script>
import axios from 'axios';

export default {
    data() {
        return {
            error: false,
            currentStep: 1,
            entity: {
                consumer: {
                    birth_date: null,
                    name: null,
                    phone: null,
                    cpf_cnpj: null,
                    user: {
                        username: null,
                        password: null
                    }
                },
                address: {
                    neighborhood: null,
                    street: null,
                    number: null,
                    complement: null,
                    cep: null,
                    city: null,
                    uf: null
                }
            },
            confirmarSenha: ''
        };
    },
    computed: {
        currentStepSubtitle() {
            if (this.currentStep === 1) {
                return 'Confirme os seus dados de entrega.';
            } else if (this.currentStep === 2) {
                return 'Preencha os seus dados pessoais.';
            } else {
                return 'Defina os seus dados de acesso.';
            }
        }
    },
    methods: {
        nextStep() {
            if (this.currentStep === 1) {
                const { cep, street, number, uf, city, neighborhood } = this.entity.address;
                if (!cep || !street || !number || !uf || !city || !neighborhood) {
                    this.error = true;
                    return;
                }
            }

            if (this.currentStep === 2) {
                const { name, phone, birth_date, cpf_cnpj } = this.entity.consumer;
                if (!name || !phone || !birth_date || !cpf_cnpj) {
                    this.error = true;
                    return;
                }
            }

            if (this.currentStep === 3) {
                const { username, password } = this.entity.consumer.user;
                if (!username || !password || password !== this.confirmarSenha) {
                    this.error = true;
                    return;
                }
            }

            this.currentStep++;
        },
        criarConta() {
            const formatedEntity = {
                ...this.entity,
                consumer: {
                    ...this.entity.consumer,
                    cpf_cnpj: this.limparCPF(this.entity.consumer.cpf_cnpj),
                    birth_date: this.formatarDataParaISO(this.entity.consumer.birth_date)
                }
            };
            axios.post('http://165.227.177.3:8001/consumidores/', formatedEntity)
                .then(response => {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    this.$router.push(`/loja/${this.$route.params.slug}/checkout`);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        formatarDataParaISO(data) {
            const date = new Date(data);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}T00:00:00.000Z`;
        },
        limparCPF(cpf) {
            return cpf.replace(/\D/g, '');
        }
    }
};
</script>
  
<style scoped>

h1{
    font-weight: 700;
    font-size: 32px;
    text-align: left;
    padding: 20px;
    color: #FFFFFF;
}

p{
    text-align: left;
    margin-left: 20px;
    font-size: 14px;
    font-weight: 400;
    color: #FFFFFF;
}

h2{
    text-align: left;
    font-weight: 700;
    font-size: 24px;
    color: #FFFFFF;
    padding: 20px;
}

label{
    font-weight: 600;
    font-size: 14px;
    color:#FFFFFF;
    text-align: left;
    margin-left: 30px;
}

input[type="text"],
input[type="password"] {
    padding: 10px;
    border: 1px solid #596582;
    border-radius: 5px;
    background-color: #FFFFFF;
    color: #596582;
    margin-bottom: 10px;
}

label {
    display: block;
    margin-bottom: 5px;
}

button {
    background-color: #E74845;
    margin-top: 20px;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    height: 55px;
    width: 85%;
}

input{
    cursor: pointer;
    height: 40px;
}



</style>
  
<template>
    <section class="cta-section py-5 bg-gradient">
        <div class="container">
            <div class="row align-items-center">
                <div class="col-lg-6 mb-4 mb-lg-0">
                    <h2 class="display-4 font-weight-bold text-white mb-4">Pronto para cadastrar um novo produto?</h2>
                    <p class="lead text-white-50 mb-4" style="color:white">
                        Adicione produtos ao sistema e otimize o controle do seu estoque e vendas.
                    </p>
                    <div class="d-flex flex-wrap">
                        <router-link to="/" class="btn btn-light btn-lg font-weight-bold mr-3 mb-3">Voltar para
                            Home</router-link>
                    </div>
                </div>
                <div class="col-lg-6">
                    <div class="card border-0 shadow-lg">
                        <div class="card-body p-5">
                            <h3 class="card-title mb-4">Cadastro de Produto</h3>
                            <form @submit.prevent="addProduct">
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg" v-model="product.name"
                                        placeholder="Nome do Produto" required>
                                </div>
                                <div class="form-group">
                                    <textarea class="form-control form-control-lg" v-model="product.description"
                                        placeholder="Descrição" rows="4"></textarea>
                                </div>
                                <div class="form-group">
                                    <input type="text" class="form-control form-control-lg" v-model="product.category"
                                        placeholder="Categoria">
                                </div>
                                <button type="submit" class="btn btn-primary btn-lg btn-block">Adicionar
                                    Produto</button>
                            </form>
                            <p v-if="message" :class="messageType + ' mt-3 text-center'">{{ message }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    name: 'AddProduct',
    data() {
        return {
            product: {
                name: '',
                description: '',
                category: ''
            },
            message: '',
            messageType: ''
        };
    },
    methods: {
        async addProduct() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.message = 'Você precisa estar logado para adicionar um produto.';
                    this.messageType = 'error';
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const response = await axios.post('http://localhost:3000/api/products', this.product, config);

                // Corrigido: não depende de response.data.message
                this.message = 'Produto adicionado com sucesso!';
                this.messageType = 'success';

                // Limpar formulário
                this.product = { name: '', description: '', category: '' };
            } catch (error) {
                console.error('Erro ao adicionar produto:', error.response?.data || error);
                this.message = error.response?.data?.error || 'Erro ao adicionar produto.';
                this.messageType = 'error';
            }
        }
    }
};
</script>

<style scoped>
.bg-gradient {
    background: linear-gradient(90deg, #007bff 0%, #6610f2 100%);
}

.success {
    color: green;
}

.error {
    color: red;
}
</style>
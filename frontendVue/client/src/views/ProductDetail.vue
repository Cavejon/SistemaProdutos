<template>
    <div class="product-detail" v-if="product">
        <h1>{{ product.name }}</h1>
        <p>{{ product.description }}</p>
        <p>Categoria: {{ product.category }}</p>
        <p v-if="product.average_rating">Avaliação Média: {{ product.average_rating.toFixed(1) }} / 5</p>
        <p v-else>Sem avaliações ainda.</p>

        <hr>

        <h2>Feedbacks</h2>
        <div v-if="product.feedbacks && product.feedbacks.length > 0" class="feedback-list">
            <div v-for="feedback in product.feedbacks" :key="feedback.id" class="feedback-card">
                <p><strong>Usuário:</strong> {{ feedback.user_username }}</p>
                <p><strong>Avaliação:</strong> {{ feedback.rating }} / 5</p>
                <p v-if="feedback.comment"><strong>Comentário:</strong> {{ feedback.comment }}</p>
                <p><small>{{ new Date(feedback.created_at).toLocaleDateString() }}</small></p>
            </div>
        </div>
        <p v-else>Nenhum feedback aprovado para este produto ainda.</p>

        <hr>

        <div v-if="isLoggedIn">
            <h2>Deixe seu Feedback</h2>
            <form @submit.prevent="submitFeedback">
                <div>
                    <label for="rating">Avaliação:</label>
                    <select v-model.number="newFeedback.rating" id="rating" required>
                        <option value="">Selecione</option>
                        <option v-for="n in 5" :key="n" :value="n">{{ n }}</option>
                    </select>
                </div>
                <div>
                    <label for="comment">Comentário (opcional):</label>
                    <textarea v-model="newFeedback.comment" id="comment" rows="4"></textarea>
                </div>
                <button type="submit">Enviar Feedback</button>
            </form>
            <p v-if="feedbackMessage" :class="feedbackMessageType">{{ feedbackMessage }}</p>
        </div>
        <p v-else>Faça <router-link to="/login">login</router-link> para deixar seu feedback.</p>
    </div>
    <div v-else>
        Carregando detalhes do produto...
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'ProductDetail',
    props: ['id'], // Recebe o ID do produto da rota
    data() {
        return {
            product: null,
            newFeedback: {
                rating: '',
                comment: ''
            },
            isLoggedIn: false,
            feedbackMessage: '',
            feedbackMessageType: ''
        };
    },
    async created() {
        this.checkAuth();
        await this.fetchProductDetails();
    },
    methods: {
        checkAuth() {
            this.isLoggedIn = !!localStorage.getItem('token');
        },
        async fetchProductDetails() {
            try {
                const response = await axios.get(`http://localhost:3000/api/products/${this.id}`);
                this.product = response.data;
            } catch (error) {
                console.error('Erro ao buscar detalhes do produto:', error);
                this.product = null;
            }
        },
        async submitFeedback() {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.feedbackMessage = 'Você precisa estar logado para enviar feedback.';
                    this.feedbackMessageType = 'error';
                    return;
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };

                const payload = {
                    product_id: parseInt(this.id),
                    rating: this.newFeedback.rating,
                    comment: this.newFeedback.comment
                };

                await axios.post('http://localhost:3000/api/feedbacks', payload, config);
                this.feedbackMessage = 'Feedback enviado com sucesso! Aguardando moderação.';
                this.feedbackMessageType = 'success';
                this.newFeedback = { rating: '', comment: '' }; // Limpa o formulário
                // Não recarrega feedbacks automaticamente, pois eles estão pendentes
            } catch (error) {
                console.error('Erro ao enviar feedback:', error.response ? error.response.data : error);
                this.feedbackMessage = error.response ? error.response.data.message : 'Erro ao enviar feedback.';
                this.feedbackMessageType = 'error';
            }
        }
    }
};
</script>

<style scoped>
.feedback-list {
    margin-top: 20px;
}

.feedback-card {
    border: 1px dashed #eee;
    padding: 10px;
    margin-bottom: 10px;
    text-align: left;
}

.success {
    color: green;
}

.error {
    color: red;
}
</style>
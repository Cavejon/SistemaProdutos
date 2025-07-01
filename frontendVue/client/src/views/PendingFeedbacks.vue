<template>
    <div class="pending-feedbacks">
        <h1>Feedbacks Pendentes para Moderação</h1>
        <div v-if="pendingFeedbacks.length === 0">Nenhum feedback pendente.</div>
        <div v-else class="feedback-list">
            <div v-for="feedback in pendingFeedbacks" :key="feedback.id" class="feedback-card">
                <h3>Produto: {{ feedback.product_name }}</h3>
                <p><strong>Usuário:</strong> {{ feedback.user_username }}</p>
                <p><strong>Avaliação:</strong> {{ feedback.rating }} / 5</p>
                <p v-if="feedback.comment"><strong>Comentário:</strong> {{ feedback.comment }}</p>
                <p><small>{{ new Date(feedback.created_at).toLocaleDateString() }}</small></p>
                <button @click="moderateFeedback(feedback.id, 'approved')" class="approve-btn">Aprovar</button>
                <button @click="moderateFeedback(feedback.id, 'rejected')" class="reject-btn">Rejeitar</button>
            </div>
        </div>
        <p v-if="message" :class="messageType">{{ message }}</p>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    name: 'PendingFeedbacks',
    data() {
        return {
            pendingFeedbacks: [],
            message: '',
            messageType: ''
        };
    },
    async created() {
        await this.fetchPendingFeedbacks();
    },
    methods: {
        async fetchPendingFeedbacks() {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                const response = await axios.get('http://localhost:3000/api/feedbacks/pending', config);
                this.pendingFeedbacks = response.data;
            } catch (error) {
                console.error('Erro ao buscar feedbacks pendentes:', error.response ? error.response.data : error);
                this.message = 'Erro ao buscar feedbacks pendentes.';
                this.messageType = 'error';
            }
        },
        async moderateFeedback(feedbackId, status) {
            try {
                const token = localStorage.getItem('token');
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                };
                await axios.put(`http://localhost:3000/api/feedbacks/${feedbackId}/status`, { status }, config);
                this.message = `Feedback ${status === 'approved' ? 'aprovado' : 'rejeitado'} com sucesso!`;
                this.messageType = 'success';
                await this.fetchPendingFeedbacks(); // Recarrega a lista
            } catch (error) {
                console.error('Erro ao moderar feedback:', error.response ? error.response.data : error);
                this.message = 'Erro ao moderar feedback.';
                this.messageType = 'error';
            }
        }
    }
};
</script>

<style scoped>
.feedback-card {
    border: 1px solid #ccc;
    padding: 15px;
    margin-bottom: 15px;
    text-align: left;
}

.approve-btn {
    background-color: #4CAF50;
    /* Green */
    color: white;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
    margin-right: 10px;
}

.reject-btn {
    background-color: #f44336;
    /* Red */
    color: white;
    padding: 8px 12px;
    border: none;
    cursor: pointer;
}

.success {
    color: green;
}

.error {
    color: red;
}
</style>
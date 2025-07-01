<template>
    <section class="vh-100 d-flex align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="container py-5 h-100 d-flex align-items-center justify-content-center">
            <div class="row w-100 d-flex align-items-center justify-content-center">
                <div class="col-md-8 col-lg-7 col-xl-6 d-flex justify-content-center">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw1.svg"
                        class="img-fluid" alt="Register image">
                </div>
                <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1 d-flex justify-content-center">
                    <form @submit.prevent="register" class="w-100" style="max-width: 400px;">
                        <!-- Username input -->
                        <div class="form-outline mb-4">
                            <input type="text" id="registerUsername" class="form-control form-control-lg"
                                v-model="username" required />
                            <label class="form-label" for="registerUsername">Nome de Usuário</label>
                        </div>
                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <input type="email" id="registerEmail" class="form-control form-control-lg" v-model="email"
                                required />
                            <label class="form-label" for="registerEmail">Email</label>
                        </div>
                        <!-- Password input -->
                        <div class="form-outline mb-4">
                            <input type="password" id="registerPassword" class="form-control form-control-lg"
                                v-model="password" required />
                            <label class="form-label" for="registerPassword">Senha</label>
                        </div>
                        <button type="submit" class="btn btn-primary btn-lg btn-block w-100">Registrar</button>
                        <p v-if="message" :class="messageType" class="mt-3 text-center">{{ message }}</p>
                        <p class="mt-2 text-center">Já tem uma conta? <router-link to="/login">Faça login</router-link>
                        </p>
                    </form>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
import axios from 'axios';

export default {
    name: 'RegisterView',
    data() {
        return {
            username: '',
            email: '',
            password: '',
            role: 'user',
            message: '',
            messageType: ''
        };
    },
    methods: {
        async register() {
            const payload = {
                username: this.username,
                email: this.email,
                password: this.password,
                role: this.role
            };
            try {
                const response = await axios.post('http://localhost:3000/api/auth/register', payload);
                this.message = "Usuário registrado com sucesso!";
                this.messageType = 'success';
                this.username = '';
                this.email = '';
                this.password = '';
                this.role = 'user';
                this.$router.push('/login');
            } catch (error) {
                console.error('Erro no registro:', error.response ? error.response.data : error);
                let errorMessage = 'Erro ao registrar. Tente novamente.';
                if (error.response && error.response.data) {
                    if (error.response.data.message) {
                        errorMessage = error.response.data.message;
                    } else if (error.response.data.details && error.response.data.details.includes('UNIQUE constraint failed: users.email')) {
                        errorMessage = 'Este e-mail já está cadastrado.';
                    } else if (error.response.data.details && error.response.data.details.includes('UNIQUE constraint failed: users.username')) {
                        errorMessage = 'Este nome de usuário já está em uso.';
                    }
                }
                this.message = errorMessage;
                this.messageType = 'error';
            }
        }
    }
};
</script>

<style scoped>
.success {
    color: green;
    text-align: center;
}

.error {
    color: red;
    text-align: center;
}
</style>
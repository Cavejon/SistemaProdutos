<template>
    <section class="vh-100 d-flex align-items-center justify-content-center" style="min-height: 100vh;">
        <div class="container py-5 h-100 d-flex align-items-center justify-content-center">
            <div class="row w-100 d-flex align-items-center justify-content-center">
                <div class="col-md-8 col-lg-7 col-xl-6 d-flex justify-content-center">
                    <img src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.svg"
                        class="img-fluid" alt="Phone image">
                </div>
                <div class="col-md-7 col-lg-5 col-xl-5 offset-xl-1 d-flex justify-content-center">
                    <form @submit.prevent="login" class="w-100" style="max-width: 400px;">
                        <!-- Email input -->
                        <div class="form-outline mb-4">
                            <input type="email" id="form1Example13" class="form-control form-control-lg" v-model="email"
                                required />
                            <label class="form-label" for="form1Example13">Email address</label>
                        </div>

                        <!-- Password input -->
                        <div class="form-outline mb-4">
                            <input type="password" id="form1Example23" class="form-control form-control-lg"
                                v-model="password" required />
                            <label class="form-label" for="form1Example23">Password</label>
                        </div>

                        <button type="submit" class="btn btn-primary btn-lg btn-block w-100">Entrar</button>

                        <p v-if="message" :class="messageType" class="mt-3 text-center">{{ message }}</p>
                        <p class="mt-2 text-center">Não tem uma conta? <router-link to="/register">Crie uma aqui</router-link>
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
    name: 'LoginView',
    data() {
        return {
            email: '',
            password: '',
            message: '',
            messageType: ''
        };
    },
    methods: {
        async login() {
            try {
                const response = await axios.post('http://localhost:3000/api/auth/login', {
                    email: this.email,
                    password: this.password
                });
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('userId', response.data.userId);
                localStorage.setItem('userRole', response.data.role); // <-- Salva o papel

                this.message = 'Login realizado com sucesso!';
                this.messageType = 'success';
                this.email = '';
                this.password = '';

                // Redireciona para a rota original ou para a home
                const redirectPath = this.$route.query.redirect || '/';
                this.$router.push(redirectPath);
            } catch (error) {
                this.message = error.response ? error.response.data.message : 'Erro ao fazer login. Verifique suas credenciais.';
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
<template>
    <div class="admin-dashboard">
        <h1>Painel Administrativo</h1>
        <nav>
            <ul>
                <li><router-link to="/admin/add-product">Adicionar Novo Produto</router-link></li>
                <li><router-link to="/admin/pending-feedbacks">Moderar Feedbacks Pendentes</router-link></li>
            </ul>
        </nav>
        <p>Bem-vindo, Administrador!</p>
    </div>
</template>

<script>
export default {
    name: 'AdminDashboard',
    // Lógica de carregamento de dados do painel, se houver
};
</script>

<style scoped>
ul {
    list-style-type: none;
    padding: 0;
}

li {
    margin-bottom: 10px;
}

a {
    text-decoration: none;
    color: #42b983;
    font-weight: bold;
}
</style>
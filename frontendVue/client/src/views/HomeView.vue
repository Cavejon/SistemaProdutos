<template>
  <section class="py-5 min-vh-100 d-flex align-items-center justify-content-center">
    <div class="container d-flex flex-column align-items-center justify-content-center">
      <div class="row w-100 justify-content-center">
        <!-- Card Adicionar Produto -->
        <div class="col-lg-4 mb-4 d-flex justify-content-center">
          <div class="card h-100 card-hover text-center" @click="$router.push('/admin/add-product')"
            style="cursor:pointer; width: 100%; max-width: 320px;">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <span class="icon-circle mb-3">
                <svg width="48" height="48" fill="currentColor" class="bi bi-plus-square text-primary"
                  viewBox="0 0 16 16">
                  <path
                    d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  <path
                    d="M14 14V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM4 1a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H4z" />
                </svg>
              </span>
              <h3 class="card-title">Adicionar Produto</h3>
              <p class="card-text">Cadastre novos produtos no sistema.</p>
            </div>
          </div>
        </div>
        <!-- Card Avaliações -->
        <div class="col-lg-4 mb-4 d-flex justify-content-center">
          <div class="card h-100 card-hover text-center" @click="$router.push('/avaliacoes')"
            style="cursor:pointer; width: 100%; max-width: 320px;">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <span class="icon-circle mb-3">
                <svg width="48" height="48" fill="currentColor" class="bi bi-star-half text-warning"
                  viewBox="0 0 16 16">
                  <path
                    d="M5.354 5.119 7.002 1.566c.197-.4.797-.4.994 0l1.648 3.553 3.905.57c.441.064.617.607.298.92l-2.824 2.753.667 3.89c.075.438-.384.77-.746.566L8 12.347l-3.494 1.837c-.362.204-.821-.128-.746-.566l.667-3.89-2.824-2.753c-.319-.313-.143-.856.298-.92l3.905-.57zm2.633.283L8 2.223l-1.987 4.279-4.725.689 3.42 3.336-.808 4.71L8 12.347V5.402z" />
                </svg>
              </span>
              <h3 class="card-title">Avaliações</h3>
              <p class="card-text">Veja e gerencie as avaliações dos produtos.</p>
            </div>
          </div>
        </div>
        <!-- Card Sair -->
        <div class="col-lg-4 mb-4 d-flex justify-content-center">
          <div class="card h-100 card-hover text-center" @click="logout"
            style="cursor:pointer; width: 100%; max-width: 320px;">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <span class="icon-circle mb-3">
                <svg width="48" height="48" fill="currentColor" class="bi bi-box-arrow-right text-danger"
                  viewBox="0 0 16 16">
                  <path fill-rule="evenodd"
                    d="M6 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1v-2a.5.5 0 0 1 1 0v2h6V3H7v2a.5.5 0 0 1-1 0V3zm.146 5.146a.5.5 0 0 1 0 .708L4.707 10.293a.5.5 0 0 1-.708-.708L4.293 9H1.5a.5.5 0 0 1 0-1h2.793l-.647-.646a.5.5 0 0 1 .708-.708l1.439 1.439z" />
                </svg>
              </span>
              <h3 class="card-title">Sair</h3>
              <p class="card-text">Encerre sua sessão no sistema.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Lista de Produtos -->
      <div class="row justify-content-center mt-5 w-100">
        <div class="col-lg-10">
          <h2 class="mb-4 text-center">Produtos Cadastrados</h2>
          <div class="table-responsive">
            <table class="table table-bordered table-hover align-middle text-center">
              <thead class="thead-light">
                <tr>
                  <th>Nome</th>
                  <th>Categoria</th>
                  <th>Descrição</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in products" :key="product.id">
                  <td>{{ product.name }}</td>
                  <td>{{ product.category }}</td>
                  <td>{{ product.description }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: 'HomeView',
  data() {
    return {
      products: []
    };
  },
  async created() {
    try {
      const response = await axios.get('http://localhost:3000/api/products');
      this.products = response.data;
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      this.$router.push('/login');
    }
  }
};
</script>

<style scoped>
.card-hover {
  box-shadow: 0 4px 24px 0 #007bff33, 0 1.5px 4px 0 #00000022;
  transition: box-shadow 0.2s;
}

.card-hover:hover {
  box-shadow: 0 0 32px #007bff55;
}

.icon-circle {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 4px 24px 0 #007bff33, 0 1.5px 4px 0 #00000022;
  width: 70px;
  height: 70px;
}

.product-list {
  padding: 0;
  margin: 0;
}

.product-card {
  border: 1px solid #e3e3e3;
  border-radius: 8px;
  background: #fafbfc;
  box-shadow: 0 2px 8px #0000000d;
  padding: 16px 24px;
  transition: box-shadow 0.2s;
}

.product-card strong {
  font-size: 1.1rem;
}

.badge {
  font-size: 0.9rem;
}
</style>
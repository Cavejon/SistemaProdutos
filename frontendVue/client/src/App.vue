<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
    return {
      isLoggedIn: false,
      isAdmin: false
    };
  },
  created() {
    this.checkAuth();
  },
  watch: {
    $route: 'checkAuth'
  },
  methods: {
    checkAuth() {
      this.isLoggedIn = !!localStorage.getItem('token');
      this.isAdmin = localStorage.getItem('userRole') === 'admin';
    },
    logout() {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('userRole');
      this.isLoggedIn = false;
      this.isAdmin = false;
      this.$router.push('/login');
    }
  }
};
</script>

<template>
  <div class="verify-container">
    <div class="verify-box">
      <img src="@/assets/arara.png" alt="Logo" class="verify-logo" />
      <h1>Cadastro verificado com sucesso!</h1>
      <p>Seu e-mail foi confirmado. Agora você pode acessar o sistema normalmente.</p>
      <router-link to="/" class="btn primary">Ir para o login</router-link>
    </div>
  </div>
</template>

<script setup>
// Nenhuma lógica extra necessária
</script>

<style scoped>
.verify-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(120deg, #8da4b9 0%, #f5f6fa 100%);
}
.verify-box {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  padding: 48px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 400px;
  width: 100%;
}
.verify-logo {
  width: 64px;
  margin-bottom: 18px;
}
h1 {
  font-family: 'Tilt Warp', cursive;
  font-size: 2rem;
  color: #1e1e1e;
  margin-bottom: 12px;
}
p {
  font-family: 'Urbanist', sans-serif;
  color: #444;
  font-size: 1.1rem;
  margin-bottom: 28px;
  text-align: center;
}
.btn.primary {
  font-family: 'Urbanist', sans-serif;
  font-weight: bold;
  font-size: 1.1rem;
  background: #90A7BB;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 0;
  width: 100%;
  cursor: pointer;
  transition: background 0.2s;
  text-align: center;
  text-decoration: none;
  display: block;
}
.btn.primary:hover {
  background: #7c97ad;
}
</style>

<template>
  <div class="container">
    <div class="left-panel">
      <div class="logo-brand-row">
        <img src="@/assets/arara.png" alt="Arararquivos Logo" class="logo" />
        <div class="brand">Arararquivos</div>
      </div>
      <div class="slogan-container">
        <div class="slogan">Gerenciar livros nunca ficou tão mais fácil</div>
      </div>
    </div>
    <div class="right-panel">
      <img src="@/assets/book-bg.png" alt="Book Background" class="bg-image" />
      <div class="login-box">
        <div class="login-title">Seja bem-vindo ao Arararquivo</div>
        <form>
          <label class="input-label" for="email">email</label>
          <input
            id="email"
            type="email"
            class="input"
            placeholder="Digite seu e-mail aqui"
          />
          <label class="input-label" for="senha">senha</label>
          <input
            id="senha"
            type="password"
            class="input"
            placeholder="Digite sua senha aqui"
          />
          <button class="login-btn" type="submit">Login</button>
        </form>
        <div class="forgot">
          <a href="#">Esqueceu sua senha?</a>
        </div>
        <div class="register">
          Não possui cadastro?
          <a href="#">Cadastre-se</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// Nenhuma lógica adicional
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Teachers:wght@400&family=Tilt+Warp&family=Urbanist:ital,wght@0,400;0,700;1,400;1,700&display=swap');

.container {
  display: flex;
  height: 100vh;
  width: 100vw;
  background: #444;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.left-panel {
  background: #fff;
  width: 35vw;
  min-width: 340px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 48px 32px 0 32px;
  border-radius: 20px 0 0 20px;
  height: 100vh;
  box-sizing: border-box;
  position: relative;
}

.logo-brand-row {
  display: flex;
  align-items: center;
  margin-bottom: 40px;
}

.logo {
  width: 48px;
  margin-bottom: 0;
  margin-right: 12px;
}

.brand {
  font-family: 'Teachers', sans-serif;
  font-size: 1.3rem;
  color: #222;
  margin-left: 0;
  margin-bottom: 0;
}

/* Centraliza o slogan verticalmente */
.slogan-container {
  flex: 1;
  display: flex;
  align-items: flex-start;
  width: 100%;
  margin-top: 120px; /* Ajuste para descer um pouco o slogan */
}

.slogan {
  font-family: 'Tilt Warp', cursive;
  font-size: 1.5rem;
  font-weight: 600;
  color: #111;
  margin-left: 4px;
  max-width: 260px;
}

.right-panel {
  position: relative;
  width: 65vw;
  min-width: 400px;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 0 20px 20px 0;
  overflow: hidden;
}

.bg-image {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 215px;
  right: 77px;
  width: auto;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  opacity: 0.5;
  pointer-events: none;
}

.login-box {
  position: relative;
  z-index: 1;
  background: #F4F5F9;
  border-radius: 20px;
  box-shadow: 0 2px 16px rgba(0,0,0,0.04);
  padding: 32px 32px 24px 32px;
  width: 350px;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  margin: auto;
}

.login-title {
  font-family: 'Tilt Warp', cursive;
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 24px;
  color: #222;
}

form {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.input-label {
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #222;
  margin-bottom: 2px;
  margin-top: 8px;
  text-transform: lowercase;
}

.input {
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  border-radius: 20px;
  border: 1.5px solid #e0e0e0;
  padding: 10px 16px;
  outline: none;
  margin-bottom: 4px;
  background: #fff;
  font-style: normal;
}

.input::placeholder {
  font-family: 'Urbanist', sans-serif;
  font-style: italic;
  color: #b0b0b0;
  font-size: 1rem;
}

.login-btn {
  font-family: 'Urbanist', sans-serif;
  font-weight: bold;
  font-size: 1.1rem;
  background: #90A7BB;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 10px 0;
  margin-top: 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.login-btn:hover {
  background: #7c97ad;
}

.forgot {
  text-align: center;
  margin-top: 10px;
}

.forgot a {
  font-family: 'Urbanist', sans-serif;
  font-weight: bold;
  color: #90A7BB;
  font-size: 0.95rem;
  text-decoration: none;
}

.register {
  text-align: center;
  margin-top: 18px;
  font-family: 'Urbanist', sans-serif;
  font-size: 1rem;
  color: #444;
}

.register a {
  font-family: 'Urbanist', sans-serif;
  font-weight: bold;
  color: #90A7BB;
  text-decoration: none;
  margin-left: 2px;
}

@media (max-width: 900px) {
  .container {
    flex-direction: column;
    height: auto;
    width: 100vw;
  }
  .left-panel, .right-panel {
    width: 100vw;
    min-width: unset;
    border-radius: 0;
    height: auto;
  }
  .login-box {
    width: 90vw;
    min-width: 0;
  }
  .bg-image {
    left: 0;
    right: 0;
    height: 40vw;
    max-width: 100vw;
  }
  .slogan-container {
    justify-content: center;
  }
}
</style>
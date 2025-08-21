<template>
  <div class="container">
    <div class="left-panel">
      <div class="logo-brand-row">
        <img src="@/assets/arara.png" alt="Arararquivos Logo" class="logo" />
        <div class="brand">Arararquivos</div>
      </div>
      <div class="slogan-container">
        <transition-group name="slogan-fade" tag="div" class="slogan-carousel">
          <div class="slogan" :key="currentSloganIndex">
            {{ slogans[currentSloganIndex] }}
          </div>
        </transition-group>
      </div>
    </div>
    <div class="right-panel">
      <img src="@/assets/book-bg.png" alt="Book Background" class="bg-image" />
      <div class="login-box">
  <div class="login-title">Seja bem-vindo ao Arararquivos</div>
        <div v-if="message" :class="['alert', message.type]">
          {{ message.text }}
        </div>
        <form @submit.prevent="handleLogin">
          <label class="input-label" for="email">email</label>
          <input
            id="email"
            type="email"
            class="input"
            v-model="email"
            placeholder="Digite seu e-mail aqui"
            required
          />
          <label class="input-label" for="senha">senha</label>
          <input
            id="senha"
            type="password"
            class="input"
            v-model="password"
            placeholder="Digite sua senha aqui"
            required
          />
          <button class="login-btn" type="submit" :disabled="isLoading">
            {{ isLoading ? 'Processando...' : 'Login' }}
          </button>
        </form>
        <div class="forgot">
          <a href="#">Esqueceu sua senha?</a>
        </div>
        <div class="register">
          Não possui cadastro?
          <router-link to="/cadastro-usuario">Cadastre-se</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const isLoading = ref(false);
const message = ref(null);

const slogans = [
  'Gerenciar livros nunca ficou tão mais fácil',
  'O jeito inteligente de cuidar dos seus livros',
  'Organizar livros nunca foi tão Dattebayo',
  'A gestão dos livros que até Hermione aprovaria',
  'Nem Smaug acumularia tantos tesouros literários',
  'Leveza e praticidade para quem ama livros',
  'Amor verdadeiro é nunca perder um livro de vista',
  'Que a organização esteja com você',
  'Nem nas sombras você perde seus livro',
  'Sua biblioteca, seu mapa do tesouro',
];
const currentSloganIndex = ref(0);
let sloganInterval = null;

onMounted(() => {
  // Verificar se já existe um token para login automático
  if (localStorage.getItem('token')) {
    router.push('/dashboard');
  }
  // Iniciar carrossel de slogans
  sloganInterval = setInterval(() => {
    currentSloganIndex.value = (currentSloganIndex.value + 1) % slogans.length;
  }, 4500);
});

onUnmounted(() => {
  if (sloganInterval) clearInterval(sloganInterval);
});

const handleLogin = async () => {
  // Limpar mensagens anteriores
  message.value = null;
  
  if (!email.value || !password.value) {
    message.value = { type: 'error', text: 'Por favor, preencha todos os campos.' };
    return;
  }
  
  try {
    isLoading.value = true;
    const response = await AuthService.login(email.value, password.value);
    
    // Verificar se o login foi bem-sucedido
    if (response.data && response.data.session && response.data.session.access_token) {
      // Armazenar token de sessão no localStorage
      localStorage.setItem('token', response.data.session.access_token);
      
      // Mostrar mensagem de sucesso
      message.value = { type: 'success', text: 'Login realizado com sucesso! Redirecionando...' };
      
      // Redirecionar para a página principal após login
      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } else {
      message.value = { type: 'error', text: 'Resposta inválida do servidor.' };
    }
  } catch (error) {
    console.error('Erro no login:', error);
    
    if (error.response && error.response.data && error.response.data.error) {
      message.value = { type: 'error', text: error.response.data.error };
    } else {
      message.value = { type: 'error', text: 'Credenciais inválidas. Por favor, tente novamente.' };
    }
  } finally {
    isLoading.value = false;
  }
};
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
  margin-top: 160px;
  min-height: 60px;
  position: relative;
}

.slogan-carousel {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  position: relative;
  min-height: 60px;
}

.slogan-fade-enter-active, .slogan-fade-leave-active {
  transition: opacity 0.7s cubic-bezier(.77,0,.18,1), transform 0.7s cubic-bezier(.77,0,.18,1);
  position: absolute;
  width: 100%;
}
.slogan-fade-enter-from {
  opacity: 0;
  transform: translateX(60px);
}
.slogan-fade-leave-to {
  opacity: 0;
  transform: translateX(-60px);
}
.slogan-carousel {
  position: relative;
  width: 100%;
  min-height: 60px;
}

.slogan {
  font-family: 'Tilt Warp', cursive;
  font-size: 2.4rem;
  font-weight: 600;
  color: #111;
  margin-left: 4px;
  max-width: 100%;
  width: 100%;
  white-space: normal;
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
  font-size: 1.1rem;
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

.alert {
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 8px;
  font-family: 'Urbanist', sans-serif;
}

.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
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
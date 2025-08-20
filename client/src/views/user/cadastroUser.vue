<template>
  <div class="container">
    <div class="logo"@click="voltarParaLogin">
      <img src="@/assets/arara.png" alt="Logo" />
      <p>Arararquivos</p>
    </div>

    <div class="auth-container">
      <div class="welcome-panel">
        <h2>Seja Bem-Vindo!</h2>
        <p>Preencha os campos com os seus dados</p>
      </div>

      <div class="form-panel">
        <div v-if="message" :class="['alert', message.type]">
          {{ message.text }}
        </div>

        <form @submit.prevent="handleSubmit" class="form">
          <label class="input-label" for="email">Email</label>
          <input
            id="email"
            type="email"
            class="input"
            v-model="email"
            placeholder="Digite seu e-mail aqui"
            required
          />

          <label class="input-label" for="senha">Senha</label>
          <input
            id="senha"
            type="password"
            class="input"
            v-model="password"
            placeholder="Digite sua senha aqui"
            required
          />

          <label class="input-label" for="confirmarSenha">Confirme senha</label>
          <input
            id="confirmarSenha"
            type="password"
            class="input"
            v-model="confirmPassword"
            placeholder="Digite sua senha novamente aqui"
            required
          />

          <button type="submit" class="btn primary" :disabled="isLoading">
            {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
          <button type="button" class="btn secondary" @click="voltarParaLogin" :disabled="isLoading">
            Voltar
          </button>
        </form>
      </div>
    </div>
  </div>
</template>



<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { AuthService } from '@/services/api';

const router = useRouter();
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const isLoading = ref(false);
const message = ref(null);

const handleSubmit = async () => {
  message.value = null;

  if (!email.value || !password.value || !confirmPassword.value) {
    message.value = { type: 'error', text: 'Todos os campos são obrigatórios.' };
    return;
  }
  if (password.value !== confirmPassword.value) {
    message.value = { type: 'error', text: 'As senhas não coincidem.' };
    return;
  }
  if (password.value.length < 6) {
    message.value = { type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' };
    return;
  }

  try {
    isLoading.value = true;
    await AuthService.signup(email.value, password.value);
    message.value = { type: 'success', text: 'Cadastro realizado com sucesso! Redirecionando...' };
    setTimeout(() => router.push('/'), 2000);
  } catch (error) {
    if (error.response?.data?.error) {
      message.value = { type: 'error', text: error.response.data.error };
    } else {
      message.value = { type: 'error', text: 'Erro ao realizar o cadastro. Tente novamente.' };
    }
  } finally {
    isLoading.value = false;
  }
};

const voltarParaLogin = () => {
  router.push('/');
};
</script>

<style scoped>
.container {
  display: flex;
  font-family: 'Tilt Warp', sans-serif;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
}

.auth-container {
  display: flex;
  flex-direction: row;
  height: 75vh;
  width: 90%;
  background: #ffffff;
  font-family: 'Segoe UI', sans-serif;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.welcome-panel {
  flex: 1;
  background: #8da4b9;
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
}
.welcome-panel h2 {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-panel {
  flex: 1.2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
}

.form {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
}
.input-label {
  font-size: 14px;
  margin-bottom: 5px;
  text-transform: lowercase;
  color: #555;
}
.input {
  padding: 12px;
  border: none;
  border-radius: 8px;
  background: #f5f6fa;
  margin-bottom: 15px;
  font-size: 14px;
}
.input:focus {
  outline: 2px solid #8da4b9;
}

.btn {
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
  margin-top: 10px;
  transition: 0.3s;
}
.btn.primary {
  background: #8da4b9;
  color: white;
}
.btn.primary:hover:enabled {
  background: #7b92a8;
}
.btn.secondary {
  background: transparent;
  color: #8da4b9;
  border: 1px solid #8da4b9;
}
.btn.secondary:hover:enabled {
  background: #f0f3f6;
}

.alert {
  margin-bottom: 20px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-size: 14px;
}
.alert.success {
  background: #d4edda;
  color: #155724;
}
.alert.error {
  background: #f8d7da;
  color: #721c24;
}

.logo {
  cursor: pointer;
  position: absolute;
  top: 20px;
  left: 20px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo img {
  height: 60px;
  width: auto;
}

.logo p {
  margin: 0;
  font-size: 18px;
  color: #333;
}

@media (max-width: 768px) {
  .auth-container {
    flex-direction: column;
    height: auto;
    width: 100%;
  }

  .welcome-panel {
    border-radius: 16px 16px 0 0;
    padding: 20px;
    text-align: center;
  }

  .form-panel {
    padding: 20px;
  }

  .logo img {
    height: 45px;
  }

  .logo p {
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .welcome-panel h2 {
    font-size: 20px;
  }

  .logo img {
    height: 35px;
  }

  .logo p {
    font-size: 14px;
  }
}
</style>

<template>
  <div class="container">
    <div v-if="message" :class="['alert', message.type]">
      {{ message.text }}
    </div>

    <div class="logo">
      <img src="@/assets/arara.png" alt="Logo" />
      <h1>Arararquivos</h1>
    </div>
    <div class="card">
      <div class="text"></div>
      <div class="inputs">
        <form @submit.prevent="handleSubmit">
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
          
          <label class="input-label" for="confirmarSenha">Confirme sua senha</label>
          <input
            id="confirmarSenha"
            type="password"
            class="input"
            v-model="confirmPassword"
            placeholder="Confirme sua senha"
            required
          />
          
          <button type="submit" :disabled="isLoading">
            {{ isLoading ? 'Cadastrando...' : 'Cadastrar' }}
          </button>
          <button type="button" @click="voltarParaLogin" :disabled="isLoading">
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
  // Limpar mensagens anteriores
  message.value = null;
  
  // Validação de campos
  if (!email.value || !password.value || !confirmPassword.value) {
    message.value = { type: 'error', text: 'Todos os campos são obrigatórios.' };
    return;
  }
  
  // Validar se as senhas coincidem
  if (password.value !== confirmPassword.value) {
    message.value = { type: 'error', text: 'As senhas não coincidem.' };
    return;
  }
  
  // Verificar tamanho mínimo da senha
  if (password.value.length < 6) {
    message.value = { type: 'error', text: 'A senha deve ter pelo menos 6 caracteres.' };
    return;
  }
  
  try {
    isLoading.value = true;
    const response = await AuthService.signup(email.value, password.value);
    
    // Cadastro bem-sucedido
    message.value = { type: 'success', text: 'Cadastro realizado com sucesso! Redirecionando...' };
    
    // Aguardar um pouco para mostrar a mensagem de sucesso
    setTimeout(() => {
      router.push('/');
    }, 2000);
    
  } catch (error) {
    console.error('Erro no cadastro:', error);
    
    // Exibir mensagem de erro específica se disponível, ou genérica
    if (error.response && error.response.data && error.response.data.error) {
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
/* Sem estilos */
</style>

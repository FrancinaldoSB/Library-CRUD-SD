import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

// Criando uma instância do axios com interceptadores
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptador para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptador para tratamento global de erros
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Se receber um erro 401 (não autorizado), limpar o token e redirecionar para login
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const AuthService = {
  signup(email, password) {
    return api.post('/signup', { email, password });
  },
  
  login(email, password) {
    return api.post('/login', { email, password });
  },
  
  logout() {
    localStorage.removeItem('token');
    return api.post('/logout');
  },
  
  getCurrentUser() {
    const token = localStorage.getItem('token');
    return token ? true : false;
  }
};

export const BookService = {
  getAllBooks() {
    return api.get('/book');
  },
  
  getBookById(id) {
    return api.get(`/book/${id}`);
  },
  
  createBook(bookData) {
    return api.post('/book', bookData);
  },
  
  updateBook(id, bookData) {
    return api.put(`/book/${id}`, bookData);
  },
  
  deleteBook(id) {
    return api.delete(`/book/${id}`);
  }
};

export default api;

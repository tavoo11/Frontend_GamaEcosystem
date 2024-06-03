import axios from 'axios';

const Axios = axios.create({
  baseURL: 'http://localhost:4000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Asegúrate de habilitar esto si necesitas enviar cookies
});

export default Axios;

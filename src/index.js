import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import '@fontsource/montserrat';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App';
import { UserProvider } from '../src/componentes/context/UserContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider />
    <App />
  </React.StrictMode>
);


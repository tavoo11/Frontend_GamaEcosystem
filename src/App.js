import React from 'react';
import './assetss/css/App.css';
import Login from './Login.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import CrearCuenta from './CrearCuenta.jsx';
import Match from './componentes/Match.jsx';
import Perfil from './componentes/Perfil';

function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/crear" element={<CrearCuenta />}></Route>
          <Route path="/match"  element={<Match />}></Route>
          <Route path="/perfil" element={<Perfil />} ></Route>
          <Route path="*"  element={<Navigate replace to="/" />}></Route>
          </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;


import React from 'react';
import './assetss/css/App.css';
import Login from './componentes/Login.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import CrearCuenta from './componentes/CrearCuenta.jsx';
import Match from './componentes/Match.jsx';
import Perfil from './componentes/Perfil';
import Mensaje from './componentes/Mensaje';
import CreatePost from './componentes/CreatePost.jsx';


function App() {
  return (
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/crear" element={<CrearCuenta />}></Route>
          <Route path="/crear-post" element={<CreatePost />}></Route>
          <Route path="/match"  element={<Match />}></Route>
          <Route path="/perfil" element={<Perfil />} ></Route>
          <Route path="/mensaje" element={<Mensaje />} ></Route>
          <Route path="*"  element={<Navigate replace to="/" />}></Route>
          </Routes>
      </Router>
    </React.Fragment>
  );
}

export default App;


import React from 'react';
import './assetss/css/App.css';
import Login from './componentes/user/Login.jsx';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import CrearCuenta from './componentes/user/CrearCuenta.jsx';
import Match from './componentes/Match.jsx';
import Perfil from './componentes/user/Perfil.jsx';
import CreatePost from './componentes/posts/CreatePost.jsx';
import Principal from './componentes/feed/Principal.jsx';
import Following from './componentes/user/Following.jsx';
import Profiles from './componentes/user/Profiles.jsx';
import { UserProvider } from '../src/componentes/context/UserContext.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {
  return (
    <UserProvider>
    <React.Fragment>
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/crear" element={<CrearCuenta />}></Route>
          <Route path='/following' element= {<Following />}></Route>
          <Route path='/principal' element = {<Principal />}></Route>
          <Route path="/crear-post" element={<CreatePost />}></Route>
          <Route path="/match"  element={<Match />}></Route>
          <Route path="/perfil" element={<Perfil />} ></Route>
          <Route path='/profile/:id' element= {<Profiles />}></Route>
          <Route path="*"  element={<Navigate replace to="/" />}></Route>
          </Routes>
      </Router>
      <ToastContainer />
    </React.Fragment>
    </UserProvider>
  );
}

export default App;


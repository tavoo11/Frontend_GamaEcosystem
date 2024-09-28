import React, { useState } from "react";
import '../../assetss/css/LoginCss.css';
import { Link, useNavigate } from 'react-router-dom';
import Axios from '../../Axios';
import { toast } from 'react-toastify';

function Login() {
  const [form, setForm] = useState({
    username: '',
    password: ''
  });
  const navigate = useNavigate();

  const manejadorInput = (event) => {
    const { name, value } = event.target;
    setForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const manejadorBoton = async (event) => {
    event.preventDefault();
    const paquete = {
      username: form.username,
      password: form.password,
    };

    try {
      const respuesta = await Axios.post('http://localhost:4000/auth/login', paquete);

      if (respuesta.data.token) {
        const token = respuesta.data.token;
        localStorage.setItem('token', token);
        navigate('/perfil');
        window.location.reload();
      } else {
        toast.error(respuesta.data.message || 'Error desconocido');
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || 'Error de autenticación');
      } else {
        console.error('Error de red', error);
        toast.error('Error de red');
      }
    }
  };

  return (
    <div className="container my-5 gradient-form">
      <div className="row">
        <div className="col-6 mb-5">
          <div className="d-flex flex-column ms-5">
            <div className="text-center">
              <img src={`${process.env.PUBLIC_URL}/gamalogo.png`} className="img" alt="logo" />
              <h4 className="mt-1 mb-5 pb-1">Bienvenido a GamaEcosystem</h4>
            </div>
            <p className="justify-content-center text-bold">Por favor ingresa con tu cuenta</p>
            <form onSubmit={manejadorBoton}>
              <div className="mb-4">
                <label htmlFor="username">Usuario</label>
                <input id="username" name="username" type="text" className="form-control" placeholder="Ingresa tu usuario" onChange={manejadorInput} />
              </div>
              <div className="mb-4">
                <label htmlFor="password">Constraseña</label>
                <input id="password" name="password" type="password" className="form-control" placeholder="Ingresa tu constraseña" onChange={manejadorInput} />
              </div>
              <div className="text-center pt-1 mb-5 pb-1">
                <button type="submit" className="btn btn-primary mb-4 w-100 gradient-custom-2">Iniciar sesión</button>
              </div>
            </form>
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <p className="mb-0">¿No tienes una cuenta? </p>
            </div>
            <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
              <Link to="/crear">Registrarse</Link>
            </div>           
          </div>
        </div>
        <div className="col-6 mb-2">
          <div className="d-flex flex-column justify-content-center h-100 mb-4">
            <div className="text-black px-3 py-4 p-md-5 mx-md-4">
              <h4 className="mb-4">GamaEcosystem</h4>
              <img src={`${process.env.PUBLIC_URL}/Animation.gif`} style={{img : 'cover'}} />
              <p className="mb-0">
                GamaEcosystem es una aplicación dedicada al manejo de plantas y jardines. Te permite registrar y organizar tus plantas, así como recibir consejos y recordatorios para su cuidado. Además, podrás compartir tus experiencias y conocimientos con otros amantes de la jardinería en nuestra comunidad. ¡Únete a GamaEcosistem y descubre un mundo verde lleno de vida!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;

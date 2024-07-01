import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assetss/css/Following.css';
import Superior from '../feed/Superior';

const Following = () => {
  const [usuarios, setUsuarios] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    obtenerListaUsuarios();
  }, []);

  async function obtenerListaUsuarios() {
    try {
      const config = { headers: { Authorization: `Token ${token}` } };
      const response = await Axios.get("http://localhost:4000/users", config);
      const data = response.data;
      setUsuarios(data);
    } catch (error) {
      console.log(error);
    }
  }

  function SeeProfile(id) {
    navigate(`/profile/${id}`);
  }

  return (
    <div className="app-container">
      <div>
        <Superior />
      </div>
      {usuarios.map(usuario => (
        <ul key={usuario.id} className="user-card" style={{ listStyle: 'none' }}>
          <li>
            <div className="card custom-card">
              <div className="card-body">
                <h6>Empezar a seguir</h6>
                <div className="profile d-flex align-items-center mb-4">
                  <img
                    style={{ width: '70px', height: '70px' }}
                    className="img-fluid rounded-circle border border-dark border-3"
                    src={usuario.profilePhotoUrl}
                    alt='Profile'
                  />
                  <div className="details flex-grow-1 ms-3">
                    <div className="username-rating d-flex flex-row align-items-center mb-2">
                      <p className="mb-0 me-2">@{usuario.username}</p>
                      <ul className="stars mb-0 list-unstyled d-flex flex-row" style={{ color: '#108214' }}>
                        <li><i className="fas fa-star fa-xs" /></li>
                        <li><i className="fas fa-star fa-xs" /></li>
                        <li><i className="fas fa-star fa-xs" /></li>
                        <li><i className="fas fa-star fa-xs" /></li>
                        <li><i className="fas fa-star fa-xs" /></li>
                      </ul>
                    </div>
                    <div className="actions">
                      <button className="btn btn-outline-dark btn-sm">+ Seguir</button>
                      <button className="btn btn-outline-dark btn-sm mx-1" onClick={() => SeeProfile(usuario.id)}>Ver Perfil</button>
                    </div>
                  </div>
                </div>
                <hr />
                <p className="card-text">52 Seguidores</p>
              </div>
            </div>
          </li>
        </ul>
      ))}
      <button className="btn btn-success btn-lg btn-block">
        <i className="far fa-clock me-2" /> Terminar
      </button>
    </div>
  );
}

export default Following;

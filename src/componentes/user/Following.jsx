import React, { useEffect, useState, useContext } from 'react';
import Axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import '../../assetss/css/Following.css';
import Superior from '../feed/Superior';
import { UserContext } from '../context/UserContext';

const Following = () => {
  const [usuarios, setUsuarios] = useState([]);
  const { user, loading, setLoading } = useContext(UserContext);
  const navigate = useNavigate();
  const location = useLocation();
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!loading && user.id) {
      obtenerListaUsuarios();
    }
  }, [loading, user.id]);

  useEffect(() => {
    // Forzar la recreación del componente cuando la ubicación cambia
    if (location.search) {
      obtenerListaUsuarios();
    }
  }, [location]);

  async function obtenerListaUsuarios() {
    try {
      const config = { headers: { Authorization: `Token ${token}` } };
      const response = await Axios.get("http://localhost:4000/users", config);
  
      const usuarios = response.data;
      console.log("Usuarios recibidos de la API:", usuarios);
  
      const data = usuarios.map(usuario => ({
        ...usuario,
        isFollowed: usuario.user.following ? usuario.user.following.some(follower => follower.id === user.id) : false,
        followers: usuario.followers || []
      }));
  
      console.log("Datos procesados:", data);
      setUsuarios(data);
    } catch (error) {
      console.log("Error al obtener los usuarios:", error);
    }
  }

  async function toggleFollow(id) {
    const config = { headers: { Authorization: `Token ${token}` } };

    try {
      await Axios.post(`http://localhost:4000/users/${user.id}/toggle-follow/${id}`, {}, config);
      
      // Actualiza el estado después de la solicitud
      setUsuarios(usuarios.map(usuario => {
        if (usuario.id === id) {
          const isFollowed = !usuario.isFollowed;
          return {
            ...usuario,
            isFollowed,
            followers: isFollowed
              ? [...(usuario.followers || []), { id: user.id }]
              : (usuario.followers || []).filter(follower => follower.id !== user.id)
          };
        }
        return usuario;
      }));
    } catch (error) {
      console.log(error);
    }
  }

  function SeeProfile(id) {
    navigate(`/profile/${id}`);
  }

  return (
    <div>
      <Superior />
      <div className="app-container">
        {usuarios.map(usuario => (
          <ul key={usuario.id} className="user-card" style={{ listStyle: 'none' }}>
            <li>
              <div className="card custom-card">
                <div className="card-body">
                  <h6>{usuario.isFollowed ? 'Dejar de seguir' : 'Empezar a seguir'}</h6>
                  <div className="profile d-flex align-items-center mb-4">
                    <img
                      style={{ width: '70px', height: '70px' }}
                      className="img-fluid rounded-circle border border-dark border-3"
                      src={usuario.user.profilePhotoUrl}
                      alt='Profile'
                    />
                    <div className="details flex-grow-1 ms-3">
                      <div className="username-rating d-flex flex-row align-items-center mb-2">
                        <p className="mb-0 me-2">@{usuario.user.username}</p>
                        <ul className="stars mb-0 list-unstyled d-flex flex-row" style={{ color: '#108214' }}>
                          <li><i className="fas fa-star fa-xs" /></li>
                          <li><i className="fas fa-star fa-xs" /></li>
                          <li><i className="fas fa-star fa-xs" /></li>
                          <li><i className="fas fa-star fa-xs" /></li>
                          <li><i className="fas fa-star fa-xs" /></li>
                        </ul>
                      </div>
                      <div className="actions">
                        <button className="btn btn-outline-dark btn-sm" onClick={() => toggleFollow(usuario.user.id)}>
                          {usuario.isFollowed ? 'Dejar de seguir' : '+ Seguir'}
                        </button>
                        <button className="btn btn-outline-dark btn-sm mx-1" onClick={() => SeeProfile(usuario.id)}>Ver Perfil</button>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <p className="card-text">{usuario.user.following.length}</p>
                </div>
              </div>
            </li>
          </ul>
        ))}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button className="btn btn-success btn-lg btn-block">
            <i className="far fa-clock me-2" /> Terminar
          </button>
        </div>
      </div>
    </div>
  );
}

export default Following;

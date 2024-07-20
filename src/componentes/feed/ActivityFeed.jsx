import React, { useEffect, useState } from 'react';
import '../../assetss/css/ActivityFeed.css';
import Posted from '../posts/Posted';
import CreatePost from '../posts/CreatePost';
import Axios from '../../Axios';
import jwt_decode from 'jwt-decode';

const ActivityFeed = () => {
  const [form, setForm] = useState([]);
  const [postType, setPostType] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const pk = jwt_decode(token).userId.toString();
      if (token) {
        // Configurar cabecera de la solicitud
        const config = {
          headers: {
            "Authorization": `Token ${token}`
          }
        };

        // Realizar solicitud GET a la API para obtener el perfil del usuario
        Axios.get(`http://localhost:4000/users/${pk}`, config)
          .then(response => {
            const data = response.data;
            console.log(data)
            setForm({
              username: data.username,
              firstname: data.firstName,
              lastname: data.lastName,
              birthDate: data.birthDate,
              profilePhotoUrl: data.profilePhotoUrl
            });
          })
          .catch(error => console.log(error));
      }
    }
  }, []);

  const handleIconClick = (type) => {
    setPostType(prevType => (prevType === type ? null : type));
  };

  return (
    <div className="activity-feed-container">
      <div className="create-post">
        <img src={form.profilePhotoUrl} alt="Profile" className="profile-pic" />
        <input type="text" placeholder={`Comparte lo que tienes en mente, ${form.firstname}`} className="post-input" />
      </div>
      <div>
        <div className="post-options">
          <i className="bi bi-camera" onClick={() => handleIconClick('image')}></i>
          <i className="bi bi-camera-video" onClick={() => handleIconClick('video')}></i>
          <i className="bi bi-card-text" onClick={() => handleIconClick('text')}></i>
        </div>
      </div>
      <br />

      {postType && (
        <CreatePost type={postType} onClose={() => setPostType(null)} />
      )}

      <div className="posts">
        <Posted />
        {/* Más posts aquí */}
      </div>
    </div>
  );
}

export default ActivityFeed;

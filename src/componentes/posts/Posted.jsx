import React, { useState, useEffect,  } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assetss/css/Posted.css';
import jwtDecode from 'jwt-decode';
import Axios from '../../Axios';
import { MDBCardText } from 'mdb-react-ui-kit';

const Posted = () => {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    let pk = jwtDecode(token).userId.toString();

    if (token) {
      // Configurar cabecera de la solicitud
      const config = {
        headers: {
          "Authorization": `Token ${token}`
        }
      };

      Axios.get("http://localhost:4000/post/", config).then(
        response => {
          const data = response.data;
          console.log(data);
          setPosts(data);
        }
      ).catch(err => console.log(err));
    }
  }, []);

  function SeeProfile(id) {
    navigate(`/profile/${id}`);
  }

  return (
    <div className='post-container'>
      {posts.map((post) => {
        const formattedDate = new Date(post.createdAt).toLocaleDateString();
        const formattedTime = new Date(post.createdAt).toLocaleTimeString();

        return (
          <div key={post.id} className="post-container">
            <div className="post-header">
              <img src={post.author.profilePhotoUrl} alt="Profile" style={{cursor: 'pointer'}} className="profile-pic" onClick={()=>(SeeProfile(post.author.id))} />
              <div className="post-info">
                <span className="post-author" style={{cursor: 'pointer'}} onClick={()=>(SeeProfile(post.author.id))}>{post.author.firstName}</span>
                <span className="post-time">{formattedDate} a las {formattedTime}</span>
              </div>
            </div>
            <div className="post-content">
              {post.type === 'video' ? (
                <video
                  src={post.content}
                  className="post-video"
                  controls
                  onMouseEnter={e => e.target.play()}
                  onMouseLeave={e => e.target.pause()}
                />
              ) : post.type === 'image' ? (
                <img
                  src={post.content}
                  alt="post content"
                  className="post-image"
                />
              ) : (
                <p className="post-text">{post.content}</p>
              )}
            </div>
            <MDBCardText className="post-title">Descripción: {post.title}</MDBCardText>
            <MDBCardText className="post-date">Publicado: {formattedDate} a las {formattedTime}</MDBCardText>
            <MDBCardText className="post-type">Tipo: {post.type}</MDBCardText>
            <div className="post-actions">
              <i className="bi bi-hand-thumbs-up"></i>
              <span className="post-action">Me gusta</span>
              <i className="bi bi-chat-left-text"></i>
              <span className="post-action">Comentar</span>
            </div>
            <div className="post-comments">
              <div className="comment">
                <img src="path_to_profile_picture" alt="Profile" className="profile-pic" />
                <div className="comment-content">
                  <span className="comment-author">Jennifer</span>
                  <span className="comment-text">Where is that? Looks beautiful.</span>
                </div>
              </div>
              <div className="comment">
                <img src="path_to_profile_picture" alt="Profile" className="profile-pic" />
                <div className="comment-content">
                  <span className="comment-author">John</span>
                  <span className="comment-text">Our trip from last summer</span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Posted;

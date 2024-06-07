import React, { useEffect, useState } from 'react';
import {
  MDBCardText,
} from 'mdb-react-ui-kit';
import jwtDecode from 'jwt-decode';
import Axios from '../Axios';
import BarNav from './BarNav';
import '../assetss/css/Post.css'; 

function Post() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token")
    let pk = jwtDecode(token).userId.toString();

    if (token) {
      // Configurar cabecera de la solicitud
      const config = {
          headers: {
              "Authorization": `Token ${token}`
          }
      };
    
      Axios.get(`http://localhost:4000/post/user/${pk}`, config).then(
      response => {
        const data = response.data;
        console.log(data);
        setPosts(data);
      }
      ).catch(err => console.log(err));
    }

  }, []);

  return (
    <div className="post-container">
      {posts.map((post) => {
        const formattedDate = new Date(post.createdAt).toLocaleDateString();
        const formattedTime = new Date(post.createdAt).toLocaleTimeString();

        return (
          <div key={post.id} className="post">
            <div className="post-content">
              {post.type === 'video' ? (
                  <video
                    src={post.content}
                    className="w-100 h-100"
                    controls
                    onMouseEnter={e => e.target.play()}
                    onMouseLeave={e => e.target.pause()}
                  />
                ) : post.type === 'image' ? (
                  <img
                    src={post.content}
                    alt="post content"
                    className="w-100 h-100"
                  />
                ) : (
                  <p className="post-text">{post.content}</p>
              )}
            </div>
            <MDBCardText className="post-title">Descripción: {post.title}</MDBCardText>
            <MDBCardText className="post-date">Publicado: {formattedDate} a las {formattedTime}</MDBCardText>
            <MDBCardText className="post-type">Tipo: {post.type}</MDBCardText>
          </div>
        );
      })}
       <BarNav />
    </div>
  );
}

export default Post;

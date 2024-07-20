import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../assetss/css/Posted.css';
import jwtDecode from 'jwt-decode';
import Axios from '../../Axios';
import { MDBCardText } from 'mdb-react-ui-kit';

const Posted = () => {
  const [posts, setPosts] = useState([]);
  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const config = {
        headers: {
          "Authorization": `Token ${token}`
        }
      };

      Axios.get("http://localhost:4000/post/", config)
        .then(response => {
          const data = response.data;
          const postsWithDefaults = data.map(post => ({
            ...post,
            likes: [],
            comments: []
          }));
          setPosts(postsWithDefaults);
          fetchLikesAndComments();
        })
        .catch(err => console.log(err));
    }
  }, []);

  const fetchLikesAndComments = () => {
    const token = localStorage.getItem("token");
    const config = {
      headers: {
        "Authorization": `Token ${token}`
      }
    };

    Axios.get("http://localhost:4000/likes/", config)
  .then(response => {
    const likesData = response.data;
    setPosts(prevPosts => prevPosts.map(post => ({
      ...post,
      likes: likesData.filter(like => like.post.id === post.id).map(like => like.user.id)
    })));
  })
  .catch(err => console.log(err));

    Axios.get("http://localhost:4000/comments/", config)
      .then(response => {
        const commentsData = response.data;
        setPosts(prevPosts => prevPosts.map(post => ({
          ...post,
          comments: commentsData.filter(comment => comment.post.id === post.id)
        })));
      })
      .catch(err => console.log(err));
  };

  const SeeProfile = (id) => {
    navigate(`/profile/${id}`);
  };

  function handleLike(postId) {
    const token = localStorage.getItem("token");
    let userId = jwtDecode(token).userId;
    const config = {
      headers: {
        "Authorization": `Token ${token}`
      }
    };
    const paquete = {
      userId: userId,
      postId
    }
  
    Axios.post(`http://localhost:4000/likes/toggle`, paquete, config)
      .then(response => {
        console.log('Toggle like response:', response.data);
        setPosts(prevPosts => prevPosts.map(post => {
          if (post.id === postId) {
            if (post.likes.includes(userId)) {
              return { ...post, likes: post.likes.filter(likeUserId => likeUserId !== userId) };
            } else {
              return { ...post, likes: [...post.likes, userId] };
            }
          }
          return post;
        }));
      })
      .catch(err => console.log(err));
  }

  const handleComment = (postId) => {
    const token = localStorage.getItem("token");
    const userId = jwtDecode(token).userId;
    const config = {
      headers: {
        "Authorization": `Token ${token}`
      }
    };

    Axios.post(`http://localhost:4000/comments`, { postId, userId, content: commentText }, config)
      .then(response => {
        setPosts(prevPosts => prevPosts.map(post =>
          post.id === postId ? { ...post, comments: [...post.comments, response.data] } : post
        ));
        setCommentText(''); // Limpiar el campo de comentario después de enviar
        setShowCommentInput({ ...showCommentInput, [postId]: false });
      })
      .catch(err => console.log(err));
  };

  const toggleCommentInput = (postId) => {
    setShowCommentInput({ ...showCommentInput, [postId]: !showCommentInput[postId] });
  };


  return (
    <div className='post-container'>
      {posts.map((post) => {
        const formattedDate = new Date(post.createdAt).toLocaleDateString();
        const formattedTime = new Date(post.createdAt).toLocaleTimeString();

        return (
          <div key={post.id} className="post-container">
            <div className="post-header">
              <img src={post.author.profilePhotoUrl} alt="Profile" style={{ cursor: 'pointer' }} className="profile-pic" onClick={() => SeeProfile(post.author.id)} />
              <div className="post-info">
                <span className="post-author" style={{ cursor: 'pointer' }} onClick={() => SeeProfile(post.author.id)}>{post.author.firstName}</span>
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
              <i className="bi bi-hand-thumbs-up" onClick={() => handleLike(post.id)}>
                  <span className="post-action">Me gusta ({post.likes.length})</span>
              </i>
              <i className="bi bi-chat-left-text" onClick={() => toggleCommentInput(post.id)}><span className="post-action">Comentar</span></i>
              </div>
              {showCommentInput[post.id] && (
                <div className="comment-input">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escribe un comentario..."
                    className='post-input'
                  />
                  <button className='post-button' onClick={() => handleComment(post.id)}>Publicar</button>
                </div>
              )}
            
            <div className="post-comments">
              {post.comments.map(comment => (
                <div key={comment.id} className="comment">
                  <img src={comment.user.profilePhotoUrl} alt="Profile" className="profile-pic" />
                  <div className="comment-content">
                    <span className="comment-author">{comment.user.firstName}</span>
                    <span className="comment-text">{comment.content}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Posted;

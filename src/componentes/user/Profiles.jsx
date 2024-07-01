import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import '../../assetss/css/Post.css'; 
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography } from 'mdb-react-ui-kit';
import Axios from 'axios';
import Superior from "../feed/Superior";

const Profiles = () => {
  const { id } = useParams(); // Obtener el ID de los parámetros de la ruta
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    firstname: "",
    lastname: "",
    birthDate: "",
    profilePhotoUrl: ""
  });

  const bird = form.birthDate.slice(0, 10);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const config = {
        headers: {
          "Authorization": `Token ${token}`
        }
      };

      Axios.get(`http://localhost:4000/users/${id}`, config)
        .then(response => {
          const data = response.data;
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
  }, [id]);

  const [posts, setPosts] = useState([]);
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (token) {
      // Configurar cabecera de la solicitud
      const config = {
          headers: {
              "Authorization": `Token ${token}`
          }
      };
    
      Axios.get(`http://localhost:4000/post/user/${id}`, config).then(
      response => {
        const data = response.data;
        console.log(data);
        setPosts(data);
      }
      ).catch(err => console.log(err));
    }

  }, []);

  return (
    <div className="gradient-custom-2">
      <Superior />
      <MDBContainer className="py-5 h-100 ">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="9" xl="7">
            <MDBCard>
              <div className="rounded-top text-white d-flex flex-row"
                style={{ backgroundImage: "url('https://mdbootstrap.com/img/new/slides/041.webp')", backgroundSize: 'cover', height: '250px' }}>
                <div className="ms-4 mt-5 d-flex flex-column" style={{ width: '150px' }}>
                  <MDBCardImage src={form.profilePhotoUrl}
                    alt="Generic placeholder image" className="img" />
                </div>
                <div className="ms-3" style={{ marginTop: '130px' }}>
                  <MDBTypography tag="h5">{form.firstname} {form.lastname}</MDBTypography>
                </div>
              </div>
              <br />
              <div className="p-4 text-black" style={{ backgroundColor: '#f8f9fa' }}>
                <div className="d-flex justify-content-end text-center py-1">
                  <div>
                    <MDBCardText className="mb-1 h5">253</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Photos</MDBCardText>
                  </div>
                  <div className="px-3">
                    <MDBCardText className="mb-1 h5">1026</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Followers</MDBCardText>
                  </div>
                  <div>
                    <MDBCardText className="mb-1 h5">478</MDBCardText>
                    <MDBCardText className="small text-muted mb-0">Following</MDBCardText>
                  </div>
                </div>
              </div>
              <div className="gradient-custom-2">
                <MDBCardBody className="text-black p-4" style={{ backgroundColor: 'white' }}>
                  <div className="mb-5">
                    <p className="lead fw-normal mb-1">Descripción:</p>
                    <div className="p-4">
                      <MDBCardText className="font-italic mb-1">{form.firstname} {form.lastname}</MDBCardText>
                      <MDBCardText className="font-italic mb-1">Fecha De Nacimiento: {bird}</MDBCardText>
                      <MDBCardText className="font-italic mb-0">Intereses: todavia no tengo nada aqui</MDBCardText>
                    </div>
                  </div>
                  <div className="post-container">
      {posts.map((post) => {
        const formattedDate = new Date(post.createdAt).toLocaleDateString();
        const formattedTime = new Date(post.createdAt).toLocaleTimeString();

        return (
          <div key={post.id} className="post-content">
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
          </div>
        );
      })}
    </div>
                </MDBCardBody>
              </div>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}

export default Profiles;

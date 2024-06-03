import React from 'react'
import { 
  MDBCardImage,
  MDBCardText,
  MDBRow,
  MDBCol,
 } from 'mdb-react-ui-kit'

function Post() {
  return (
    <div>
    <div className="d-flex justify-content-between align-items-center mb-4">
        <MDBCardText className="lead fw-normal mb-0 m-5 p-5"><i class="bi bi-caret-right-square-fill"></i></MDBCardText>
        <MDBCardText className="lead fw-normal mb-0 m-5"><i class="bi bi-camera-reels-fill"></i></MDBCardText>
        <MDBCardText className="lead fw-normal mb-0 m-5 p-5"><i class="bi bi-card-image"></i></MDBCardText>
        </div>
        <MDBRow>
        <MDBCol className="mb-2">
            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(112).webp"
            alt="image 1" className="w-100 rounded-3" />
        </MDBCol>
        <MDBCol className="mb-2">
            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(107).webp"
            alt="image 1" className="w-100 rounded-3" />
        </MDBCol>
        </MDBRow>
        <MDBRow className="g-2">
        <MDBCol className="mb-2">
            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(108).webp"
            alt="image 1" className="w-100 rounded-3" />
        </MDBCol>
        <MDBCol className="mb-2">
            <MDBCardImage src="https://mdbcdn.b-cdn.net/img/Photos/Lightbox/Original/img%20(114).webp"
            alt="image 1" className="w-100 rounded-3" />
        </MDBCol>
        </MDBRow>
        </div>
  )
}

export default Post
import React from 'react'
import {
    MDBCardText,
  } from 'mdb-react-ui-kit';
import '../../assetss/css/BarNav.css';

const BarNav = () => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
              <MDBCardText className="lead fw-normal mb-0">
                <i className="bi bi-caret-right-square-fill"></i>
              </MDBCardText>
              <MDBCardText className="lead fw-normal mb-0">
                <i className="bi bi-camera-reels-fill"></i>
              </MDBCardText>
              <MDBCardText className="lead fw-normal mb-0">
                <i className="bi bi-card-image"></i>
              </MDBCardText>
            </div>
  )
}

export default BarNav
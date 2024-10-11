import React, { useState } from 'react';
import { MDBContainer, MDBRow, MDBCard, MDBCardBody, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import Axios from '../../Axios';
import jwtDecode from 'jwt-decode';

const CreateObservation = ({ taskId, onClose }) => {
  const [observation, setObservation] = useState({
    userId: '', // Esto lo llenaremos más tarde
    plantId: '', // Esto también
    observations: '',
    height: '',
    healthStatus: '',
    growthStage: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setObservation((prevState) => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        const userId = jwtDecode(token).userId.toString(); // Decodificamos el token para obtener el userId
        const observationData = { ...observation, userId, plantId: taskId }; // Asumimos que taskId corresponde al plantId

        const response = await Axios.post('http://localhost:4000/monitoring/', observationData);
        console.log('Observación enviada:', response.data);
        alert('Observación registrada con éxito');
        onClose(); // Cerrar el formulario después de enviar
      }
    } catch (error) {
      console.error('Error al registrar la observación:', error);
    }
  };

  return (
    <MDBContainer fluid>
      <MDBRow className='justify-content-center align-items-center m-5'>
        <MDBCard>
          <MDBCardBody className='px-4'>
            <h3 className="fw-bold mb-4 pb-2 pb-md-0 mb-md-5">Registrar Observación</h3>
            <MDBRow>
              <MDBCol md='12' className='mt-4'>
                <MDBInput wrapperClass='mb-4' label='Observaciones' size='lg' name="observations" type='textarea' onChange={handleInputChange} />
                <MDBInput wrapperClass='mb-4' label='Altura (cm)' size='lg' name="height" type='number' onChange={handleInputChange} />
                <MDBInput wrapperClass='mb-4' label='Estado de Salud' size='lg' name="healthStatus" type='text' onChange={handleInputChange} />
                <MDBInput wrapperClass='mb-4' label='Etapa de Crecimiento' size='lg' name="growthStage" type='text' onChange={handleInputChange} />
              </MDBCol>
            </MDBRow>
            <MDBBtn className="mb-4 w-50 gradient-custom-2" size='lg' onClick={handleSubmit}>Registrar Observación</MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBRow>
    </MDBContainer>
  );
};

export default CreateObservation;

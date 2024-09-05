import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: '',
    profilePhotoUrl: '',
    username: '',
    firstName: '',
    lastName: '',
    birthDate: '',
    role: '',
    position: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const pk = jwtDecode(token).userId.toString();
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      Axios.get(`http://localhost:4000/users/${pk}`, config)
        .then((response) => {
          const data = response.data;
          setUser({
            id: data.id,
            username: data.username,
            firstName: data.firstName,
            lastName: data.lastName,
            birthDate: data.birthDate,
            profilePhotoUrl: data.profilePhotoUrl,
            role: data.role,
            position: data.position,
            phoneNumber : data.phoneNumber
          });
          setLoading(false);
        })
        .catch((error) => {
          console.error(error);
          setError('Failed to load user data');
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, error }}>
      {children}
    </UserContext.Provider>
  );
};

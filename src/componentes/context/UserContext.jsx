// src/context/UserContext.js
import React, { createContext, useState, useEffect } from 'react';
import Axios from 'axios';
import jwtDecode from 'jwt-decode';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    profilePhotoUrl: '',
    username: '',
    firstname: '',
    lastname: '',
    birthDate: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const pk = jwtDecode(token).userId.toString();
      const config = {
        headers: {
          Authorization: `Token ${token}`,
        },
      };

      Axios.get(`http://localhost:4000/users/${pk}`, config)
        .then((response) => {
          const data = response.data;
          setUser({
            username: data.username,
            firstname: data.firstName,
            lastname: data.lastName,
            birthDate: data.birthDate,
            profilePhotoUrl: data.profilePhotoUrl,
          });
        })
        .catch((error) => console.log(error));
    }
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

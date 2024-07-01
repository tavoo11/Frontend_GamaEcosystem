import React, { useEffect, useRef, useState } from 'react';
import {
  MDBContainer,
  MDBNavbar,
  MDBInputGroup,
  MDBInput,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBBadge,
} from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import jwtDecode from 'jwt-decode';
import '../../assetss/css/NavBarCss.css'

const SOCKET_SERVER_URL = 'http://localhost:4000';

export default function NavBar({ photoProfile }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const pk = jwtDecode(token).userId.toString();

    const socket = io(SOCKET_SERVER_URL, {
      query: { userId: pk }
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log(`Conectado al servidor de WebSocket como usuario ${pk}`);
    });

    socket.on('notification', (notification) => {
      console.log('Notificación recibida del servidor:', notification);
      setNotifications((prevNotifications) => [...prevNotifications, notification]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  function logout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <header>
      <MDBNavbar expand="lg" >
        <MDBContainer fluid className="d-flex justify-content-between">
          <MDBInputGroup tag="form" className="d-flex w-auto mb-3">
            <MDBInput type="search" placeholder="Search" aria-label="Search" />
          </MDBInputGroup>
          <div className="d-flex">
            <MDBNavbarNav className="d-flex flex-row">
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    <i className="bi bi-bell-fill"></i>
                    {notifications.length > 0 && (
                      <MDBBadge pill color="danger">
                        {notifications.length}
                      </MDBBadge>
                    )}
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    {notifications.map((notification, index) => (
                      <MDBDropdownItem link key={index}>{notification.message}</MDBDropdownItem>
                    ))}
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    <i className="bi bi-wechat"></i>
                    {notifications.length > 0 && (
                      <MDBBadge pill color="primary">
                        {notifications.length}
                      </MDBBadge>
                    )}
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    {notifications.map((notification, index) => (
                      <MDBDropdownItem link key={index}>{notification.message}</MDBDropdownItem>
                    ))}
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    <img
                      src={photoProfile}
                      className="rounded-circle"
                      height="45"
                      width="45"
                      alt="Avatar"
                      loading="lazy"
                    />
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link>My Profile</MDBDropdownItem>
                    <MDBDropdownItem link>Settings</MDBDropdownItem>
                    <MDBDropdownItem link onClick={logout}>
                      Logout
                    </MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </div>
        </MDBContainer>
      </MDBNavbar>
    </header>
  );
}

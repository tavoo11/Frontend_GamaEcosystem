import React from 'react';
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

export default function NavBar({ photoProfile }) {
  const navigate = useNavigate();
  function logout() {
    localStorage.clear();
    navigate('/');
  }

  return (
    <header>
      <MDBNavbar expand="lg" light >
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
                    <MDBBadge pill color="danger">
                      1
                    </MDBBadge>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link>Notifications</MDBDropdownItem>
                  </MDBDropdownMenu>
                </MDBDropdown>
              </MDBNavbarItem>
              <MDBNavbarItem>
                <MDBDropdown>
                  <MDBDropdownToggle tag="a" className="nav-link" role="button">
                    <i className="bi bi-wechat"></i>
                    <MDBBadge pill color="primary">
                      1
                    </MDBBadge>
                  </MDBDropdownToggle>
                  <MDBDropdownMenu>
                    <MDBDropdownItem link>Messages</MDBDropdownItem>
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

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

export default function NavBar({photoProfile}) {
    const navigate = useNavigate();
    function logout(){
        localStorage.clear();
        navigate('/');
    }
  return (
    <header>
      {/* Main Navigation */}
      <MDBNavbar expand='lg' >
        {/* Container wrapper */}
        
        <MDBContainer fluid>
            
          {/* Search form */}
          <MDBInputGroup noBorder>
            <MDBInput
              autoComplete='off'
              className='active'
              type='search'
              placeholder='Search (ctrl + "/" to focus)'
              style={{ minWidth: '225px' }}
            />
          </MDBInputGroup>

          {/* Right links */}
          <MDBNavbarNav className='d-flex flex-row' right fullWidth={false}>
            {/* Notification dropdown */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow me-2 me-lg-0 nav-link' style={{ cursor: 'pointer' }}>
                <i className="bi bi-bell-fill"></i>
                  <MDBBadge pill notification color='danger'>
                    1
                  </MDBBadge>
                  </MDBDropdownToggle>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* messenger item */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow me-2 me-lg-0 nav-link' style={{ cursor: 'pointer' }}>
                <i className="bi bi-wechat"></i>
                  <MDBBadge pill notification color='primary'>
                    1
                  </MDBBadge>
                  </MDBDropdownToggle>
              </MDBDropdown>
            </MDBNavbarItem>

            {/* Avatar */}
            <MDBNavbarItem>
              <MDBDropdown>
                <MDBDropdownToggle tag='a' className='hidden-arrow d-flex align-items-center nav-link' style={{ cursor: 'pointer' }}>
                  <img
                    src={photoProfile}
                    className='rounded-circle'
                    height='40'
                    alt='Avatar'
                    loading='lazy'
                  />
                </MDBDropdownToggle>
                <MDBDropdownMenu>
                  <MDBDropdownItem link>MyProfile</MDBDropdownItem>
                  <MDBDropdownItem link>Settings</MDBDropdownItem>
                  <MDBDropdownItem link onClick={logout}>Logout</MDBDropdownItem>
                </MDBDropdownMenu>
              </MDBDropdown>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBContainer>
     </MDBNavbar>
    </header>
  );
}
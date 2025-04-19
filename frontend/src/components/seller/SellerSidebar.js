import { Link, useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { useState } from 'react';
import './sellersidebar.css'

export default function SellerSidebar() {

    const navigate = useNavigate();


        const [isCollapsed, setIsCollapsed] = useState(false);
    
        const toggleSidebar = () => {
            setIsCollapsed(prevState => !prevState);
        };
        
    return (
      <>
        {/* Old SIDEBAR */}
        {/* <section className="sidebar-section-procureg">
                <Link to="/admin/dashboard">
                    <p>Dashboard</p>
                </Link>
                <p>
                    <li>
                        <NavDropdown title="Products">
                            <NavDropdown.Item onClick={() => navigate('/seller/products')}> All</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => navigate('/seller/products/create')}>Create</NavDropdown.Item>
                        </NavDropdown>
                    </li>
                </p>
                <Link to="/seller/orders">
                    <p>Orders</p>
                </Link>
            </section> */}

        {/* New Seller Sidebar */}
        <div className="seller-sidebar-glc">
          <div
            id="sidenav"
            className={`sidenav ${isCollapsed ? 'is-collapsed' : ''}`}
          >
            <header className=" bg-white" style={{ borderRadius: '15px' }}>
              {/* <span className="header__icon">
                            <i className="fa fa-cube" aria-hidden="true"></i>
                        </span>
                        <span className="header__text">GLOCRE</span>
                        <button className="sidenav__button" aria-label="Toggle" onClick={toggleSidebar}>
                            <span className="sidenav__button-icon">
                                <i className={`fa ${isCollapsed ? 'fa-angle-right' : 'fa-angle-left'}`} aria-hidden="true"></i>
                            </span>
                        </button> */}
              <div className="sidebar-logo p-2">
                <Link to="/">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <img src={require('../../images/procure-g-logo.png')} />
                  </div>
                </Link>
              </div>
            </header>
            <div className="nav__divider"></div>
            <div className="sidenav__nav ">
              <ul className="nav__list">
                <Link to="/seller/dashboard">
                  <li className="nav__item is-active">
                    <button className="nav__button">
                      <span className="nav__icon">
                        <i className="fa fa-home" aria-hidden="true"></i>
                      </span>
                      <span className="nav__label">Dashboard</span>
                    </button>
                  </li>
                </Link>
                <Link to="/seller/products">
                  <li className="nav__item is-active">
                    <button className="nav__button">
                      <span className="nav__icon">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                      </span>
                      <span className="nav__label">Product List</span>
                    </button>
                  </li>
                </Link>
                <Link to="/seller/products/create">
                  <li className="nav__item is-active">
                    <button className="nav__button">
                      <span className="nav__icon">
                        <i className="fa fa-envelope" aria-hidden="true"></i>
                      </span>
                      <span className="nav__label">Create Products</span>
                    </button>
                  </li>
                </Link>
                <Link to="/seller/orders">
                  <li className="nav__item is-active">
                    <button className="nav__button">
                      <span className="nav__icon">
                        <i className="fa fa-flag" aria-hidden="true"></i>
                      </span>
                      <span className="nav__label">Orders List</span>
                    </button>
                  </li>
                </Link>
              </ul>
            </div>
          </div>
        </div>
      </>
    );
}
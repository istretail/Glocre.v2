import { Link, } from 'react-router-dom';
import './side.css'
import {useState } from 'react';


export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(prevState => !prevState);
    };
    return (
        <>
            <div className="app-side-nav-glocre">
                <div id="sidenav" className={`sidenav ${isCollapsed ? 'is-collapsed' : ''}`}>
                    <header className=" bg-white" style={{ borderRadius: "15px" }}>
                        {/* <span className="header__icon">
                            <i className="fa fa-cube" aria-hidden="true"></i>
                        </span>
                        <span className="header__text">GLOCRE</span>
                        <button className="sidenav__button" aria-label="Toggle" onClick={toggleSidebar}>
                            <span className="sidenav__button-icon">
                                <i className={`fa ${isCollapsed ? 'fa-angle-right' : 'fa-angle-left'}`} aria-hidden="true"></i>
                            </span>
                        </button> */}
                        <div className='sidebar-logo'>
                            <Link to="/">
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <img src={require("../../images/procure-g-logo.png")} className='w-75' alt="glocre" />
                                </div>
                            </Link>
                        </div>
                    </header>
                    <div className="nav__divider"></div>
                    <div className="sidenav__nav ">
                        <ul className="nav__list">
                            <Link to="/admin/dashboard">
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon">
                                            <i className="fa fa-home" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">Dashboard</span>
                                    </button>
                                </li>
                            </Link>
                            <Link to="/admin/products">
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon"> 
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">Product List</span>
                                    </button>
                                </li>
                            </Link>
                            <Link to="/admin/products/create">
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon">
                                            <i className="fa fa-envelope" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">Create Products</span>
                                    </button>
                                </li>
                            </Link>
                            <Link to="/admin/orders" >
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon">
                                            <i className="fa fa-flag" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">Orders List</span>
                                    </button>
                                </li>
                            </Link>
                            <Link to="/admin/users">
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">  Users</span>
                                    </button>
                                </li>
                            </Link>
                            <Link to="/admin/reviews">
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">Reviews</span>
                                    </button>
                                </li>
                            </Link>
                            <Link to="/admin/edit-banner">
                                <li className="nav__item is-active">
                                    <button className="nav__button">
                                        <span className="nav__icon">
                                            <i className="fa fa-calendar" aria-hidden="true"></i>
                                        </span>
                                        <span className="nav__label">Banner</span>
                                    </button>
                                </li>
                            </Link>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

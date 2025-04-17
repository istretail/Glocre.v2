import { Fragment, useEffect, useState } from "react";
import './userlist.css';
import { Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteUser, getUsers } from "../../actions/userActions";
import { clearError, clearUserDeleted } from "../../slices/userSlice";
import Loader from '../layouts/Loader';
import { toast } from 'react-toastify';
import Sidebar from "./Sidebar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import debounce from 'lodash.debounce';
import Pagination from 'react-js-pagination';
import avatar1 from '../../images/OIP.jpg'
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';

export default function UserList() {
    const { users = [], loading = true, error, isUserDeleted, userConut, resPerPage, } = useSelector(state => state.userState);
    const [searchKeyword, setSearchKeyword] = useState(""); // State for search input
    const [roleFilter, setRoleFilter] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();

    const deleteHandler = (e, id) => {
        e.target.disabled = true;
        dispatch(deleteUser(id));
    };
    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };
    const debouncedSearch = debounce((term) => {
        dispatch(getUsers(term, roleFilter));
    }, 300);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchKeyword.trim()) return; // Prevent empty searches

        const isObjectId = /^[a-f\d]{24}$/i.test(searchKeyword.trim()); // Check for ObjectId format
        dispatch(getUsers({ keyword: searchKeyword.trim(), idSearch: isObjectId }));
    };

    const handleFilterClick = () => {
        setFilterVisible(!filterVisible);
    };

    const handleFilterChange = (role) => {
        setRoleFilter(role);
        setFilterVisible(false);
        dispatch(getUsers(searchKeyword, role));
    };

    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            });
            return;
        }
        if (isUserDeleted) {
            toast('User Deleted Successfully!', {
                type: 'success',
                onOpen: () => dispatch(clearUserDeleted())
            });
            return;
        }

        dispatch(getUsers(searchKeyword, roleFilter, currentPage));
    }, [dispatch, error, isUserDeleted, searchKeyword, roleFilter, currentPage]);


    // Drawer
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    // Navbar
    const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 1000);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);


    return (
        <>
            <section className="userlist-glc">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 ">

                        <div className="mobile-logo">
                                 <img src={require("../../images/procure-g-logo.png")}/>
                        </div>

                        <div className="breadcrumbWrapperr">



                            {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
                            {isMobile ? (
                                <div className="row mobile-topbar">
                                    <div className="col-10">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/admin/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                                            </li>
                                            <li>User List</li>
                                        </ul>
                                    </div>
                                    <div className="col-2 text-end">
                                        <button className="fab" onClick={toggleDrawer}>
                                            <FontAwesomeIcon icon={faList} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row dash-navbar-big-glc">
                                    <div className="col-lg-3 col-md-12">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/admin/dashboard">Dashboard</Link>
                                            </li>
                                            <li>User List</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6" style={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                        <div className="dash-cont-glc">
                                            <div className="row">
                                                <div className="topnav">
                                                    <div className="search-container">
                                                        <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                                            <input type="text" placeholder="Search" name="search"
                                                                value={searchKeyword}
                                                                onChange={(e) => setSearchKeyword(e.target.value)} />
                                                            <button type="submit">
                                                                <FontAwesomeIcon icon={faSearch} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-1 col-md-2 dash-cont-glc" style={{ display: "flex", justifyContent: "center" }}>
                                        <Dropdown className="d-inline">
                                            <Dropdown.Toggle
                                                variant="default text-white"
                                                id="dropdown-basic"
                                                className="text-dark dropdown1 icon-list-filter-procureg"
                                                style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                            >
                                                <FontAwesomeIcon icon={faFilter} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleFilterChange("admin")} className="text-dark">
                                                    Admin
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("user")} className="text-dark">
                                                    User
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")} className="text-dark">
                                                    All
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className="col-lg-1 col-md-2 dash-cont-glc">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div>
                                </div>
                            )}
                            {/* Search, Filter & Avatar Row (For Mobile) */}
                            {isMobile && (
                                <div className="row mobile-bottombar">
                                    <div className="col-8">
                                        <div className="search-container">
                                            <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                                <input type="text" placeholder="Search" name="search"
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)} />
                                                <button type="submit">
                                                    <FontAwesomeIcon icon={faSearch} />
                                                </button>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-2 text-center">
                                        <Dropdown className="d-inline">
                                            <Dropdown.Toggle
                                                variant="default text-white"
                                                id="dropdown-basic"
                                                className="text-dark dropdown1 icon-list-filter-procureg"
                                                style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                            >
                                                <FontAwesomeIcon icon={faFilter} />
                                            </Dropdown.Toggle>
                                            <Dropdown.Menu>
                                                <Dropdown.Item onClick={() => handleFilterChange("admin")} className="text-dark">
                                                    Admin
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("user")} className="text-dark">
                                                    User
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")} className="text-dark">
                                                    All
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                    <div className="col-2 text-center">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div>
                                </div>
                            )}
                            {/* Drawer Component */}
                            <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer">
                                <div className="drawer-header">
                                    ADMIN DASHBOARD
                                    {/* <button className="drawer-close-btn" onClick={toggleDrawer}>&times;</button> */}
                                </div>
                                <div className="drawer-content">
                                    <ul className="drawer-links">
                                        <li><Link to="/admin/dashboard"><FontAwesomeIcon icon={faDashboard} /> &nbsp;Dashboard</Link></li>
                                        <li><Link to="/admin/products"><FontAwesomeIcon icon={faCartShopping} /> &nbsp;Product List</Link></li>
                                        <li><Link to="/admin/products/create"><FontAwesomeIcon icon={faShoppingBag} /> &nbsp;Create Product</Link></li>
                                        <li><Link to="/admin/orders"><FontAwesomeIcon icon={faSort} /> &nbsp;Order List</Link></li>
                                        <li><Link to="/admin/users"><FontAwesomeIcon icon={faUserPlus} /> &nbsp;User List</Link></li>
                                        <li><Link to="/admin/reviews"><FontAwesomeIcon icon={faPencil} /> &nbsp;Review List</Link></li>
                                    </ul>
                                    
                                </div>
                            </Drawer>

                        </div>


                        <h3 className="" style={{ color: "#ffad63", marginTop: "40px" }}>USER LIST</h3>
                        <p>Glocre</p>

                        <Fragment>

                            <div className="reviewlist-list-filter-procureg">
                                {/* <div className="row">
                                <div className="col-lg-6">
                                    <Dropdown className="d-inline text-dark">
                                        <Dropdown.Toggle
                                            variant="default text-white"
                                            id="dropdown-basic"
                                            className="text-dark dropdown1 icon-list-filter-procureg"
                                            style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                        >
                                            <FontAwesomeIcon icon={faFilter} className="" />
                                        </Dropdown.Toggle>

                                        <Dropdown.Menu>
                                            <Dropdown.Item onClick={() => handleFilterChange("admin")} className="text-dark">
                                                Admin
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFilterChange("user")} className="text-dark">
                                                User
                                            </Dropdown.Item>
                                            <Dropdown.Item onClick={() => handleFilterChange("")} className="text-dark">
                                                All
                                            </Dropdown.Item>
                                        </Dropdown.Menu>
                                    </Dropdown>
                                </div>
                                <div className="topnav col-lg-6">
                                    <div className="search-container">
                                        <form className="d-flex" onSubmit={(e) => e.preventDefault()}>
                                            <input
                                                type="text"
                                                placeholder="Search"
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                                name="search"
                                            />
                                            <button type="submit">
                                                <FontAwesomeIcon icon={faSearch} />
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div> */}

                                {/* {loading ? <Loader /> :
                                <div className="heading-userlist-main-procureg mt-2">
                                    <div className="heading-userlist-contents-procureg">
                                        <div className="row">
                                            <div className="col-lg-2">
                                                <h6>NAME</h6>
                                            </div>
                                            <div className="col-lg-2">
                                                <h6>E-MAIL</h6>
                                            </div>
                                            <div className="col-lg-2">
                                                <h6>ID</h6>
                                            </div>
                                            <div className="col-lg-2">
                                                <h6>ROLE</h6>
                                            </div>
                                            <div className="col-lg-2">
                                                <h6>DATE</h6>
                                            </div>
                                            <div className="col-lg-2">
                                                <h6>ACTIONS</h6>
                                            </div>
                                        </div>
                                    </div>

                                    <hr />

                                    {users.map(user => (
                                        <div className="contents-userlist-main-procureg mt-2" key={user._id}>
                                            <div className="contents-userlist-contents-procureg">
                                                <div className="row">
                                                    <div className="col-lg-2">
                                                        <p>{user.name} {user.lastName}</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>{user.email}</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>{user._id}</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>{user.role}</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <p>{user.createdAt}</p>
                                                    </div>
                                                    <div className="col-lg-2">
                                                        <Fragment>
                                                            <Link to={`/admin/user/${user._id}`} className="btn btn-primary">
                                                                <i className="fa fa-pencil"></i>
                                                            </Link>
                                                            <Button onClick={(e) => deleteHandler(e, user._id)} className="btn btn-danger py-1 px-2 ml-2">
                                                                <i className="fa fa-trash"></i>
                                                            </Button>
                                                        </Fragment>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            } */}

                            </div>

                        </Fragment>

                        {loading ? <Loader /> :
                            <div className="cartWrapper mt-4">
                                <div className="table-responsive" style={{ overflowX: "auto" }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: "150px" }}>NAME</th>
                                                <th style={{ minWidth: "300px" }}>E-MAIL</th>
                                                <th style={{ minWidth: "300px" }}>ID</th>
                                                <th style={{ minWidth: "120px" }}>ROLE</th>
                                                <th style={{ minWidth: "250px" }}>DATE</th>
                                                <th style={{ minWidth: "150px" }}>ACTIONS</th>
                                            </tr>
                                        </thead>

                                        {users.map(user => (

                                            <tbody key={user._id}>
                                                <tr>
                                                    <td>
                                                        <div className="d-flex align-items-center">
                                                            <span style={{ color: "#ffad63", fontSize: "15px" }}>
                                                                {user.name} {user.lastName}
                                                            </span>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#888888" }}>{user.email}</span>
                                                    </td>
                                                    <td>
                                                        <span style={{ color: "#888888" }}>{user.clocreUserId}</span>
                                                    </td>

                                                    <td>
                                                        <span style={{ color: "#888888" }}>
                                                            {user.role}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span style={{ color: "#888888" }}>
                                                            {user.createdAt}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <Link to={`/admin/user/${user._id}`} style={{ backgroundColor: "#ffad63", color: "#fff", outline: "none", border: "none" }} className="btn "><FontAwesomeIcon icon={faPencil} /></Link>
                                                        <Button style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none", color: "#fff" }} onClick={(e) => deleteHandler(e, user._id)} className="btn ms-2">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td>

                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                </div>
                            </div>
                        }
                        <br />
                    </div>

                    {userConut > 0 && userConut > resPerPage ? (
                        <div className="d-flex justify-content-center mt-5 tab-slider">
                            <Pagination
                                activePage={currentPage}
                                onChange={setCurrentPageNo}
                                totalItemsCount={userConut}
                                itemsCountPerPage={resPerPage}
                                nextPageText={"Next"}
                                firstPageText={"First"}
                                lastPageText={"Last"}
                                itemClass={"page-item"}
                                linkClass={"page-link"}
                            />
                        </div>
                    ) : null}
                </div>
            </section>
        </>
    );
}

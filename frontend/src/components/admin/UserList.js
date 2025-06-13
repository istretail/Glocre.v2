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
import Pagination from 'react-js-pagination';
import { Modal, Box, Typography } from "@mui/material";
import { faCartShopping, faFilter, faPencil, faSearch, faTrash, faDashboard, faList, faShoppingBag, faSort, faUserPlus, } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import MetaData from "../layouts/MetaData";

export default function UserList() {
    const { users = [], loading = true, error, isUserDeleted, userConut, resPerPage,ResultCount } = useSelector(state => state.userState);
    const [searchKeyword, setSearchKeyword] = useState(""); // State for search input
    const [roleFilter, setRoleFilter] = useState('');
    const [filterVisible, setFilterVisible] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const dispatch = useDispatch();

    const deleteHandler = (e, id) => {
        // e.target.disabled = true;
        dispatch(deleteUser(id));
    };
    const setCurrentPageNo = (pageNo) => {
        setCurrentPage(pageNo);
    };
    // const debouncedSearch = debounce((term) => {
    //     dispatch(getUsers(term, roleFilter));
    // }, 300);

    // const handleSearch = (e) => {
    //     e.preventDefault();
    //     if (!searchKeyword.trim()) return; // Prevent empty searches

    //     const isObjectId = /^[a-f\d]{24}$/i.test(searchKeyword.trim()); // Check for ObjectId format
    //     dispatch(getUsers({ keyword: searchKeyword.trim(), idSearch: isObjectId }));
    // };

    // const handleFilterClick = () => {
    //     setFilterVisible(!filterVisible);
    // };

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



    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null); // You can reuse the same state for all deletions

    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setDeleteModalOpen(true);
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setSelectedUserId(null);
    };

    const confirmDelete = () => {
        deleteHandler(null, selectedUserId); 
        console.log(selectedUserId)// Assuming deleteHandler handles user deletion
        setDeleteModalOpen(false);
        setSelectedUserId(null);
    };




    return (
        <>
        <MetaData title="User List | GLOCRE" />
            <section className="userlist-glc">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 pr-0">

                        <div className="mobile-logo">
                        < Link to = "/" >
                            <img src={require("../../images/procure-g-logo.png")} />
                            </Link>
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
                                    <div className="col-2 p-0 d-flex justify-content-center align-items-center">
                                        <button className="fab" onClick={toggleDrawer}>
                                            <FontAwesomeIcon icon={faList} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="row dash-navbar-big-glc small-sticky-navbar">
                                    <div className="col-lg-3 col-md-12">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/admin/dashboard">Dashboard</Link>
                                            </li>
                                            <li>User List</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
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
                                    <div className="col-lg-1 col-md-2 d-flex justify-content-center align-items-end">
                                        <Dropdown className="d-inline">
                                            <Dropdown.Toggle
                                                variant="default"
                                                id="dropdown-basic"
                                                className="custom-filter-toggle"
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
                                                <Dropdown.Item onClick={() => handleFilterChange("seller")} className="text-dark">
                                                  Seller
                                                </Dropdown.Item>
                                                    <Dropdown.Item onClick={() => handleFilterChange("user&isSeller=false")} className="text-dark">
                                                    Requested Seller
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")} className="text-dark">
                                                    All
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
                                    </div>
                                </div>
                            )}
                            {/* Search, Filter & Avatar Row (For Mobile) */}
                            {isMobile && (
                                <div className="row mobile-bottombar">
                                    <div className="col-9 col-md-10 pr-0">
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
                                    <div className="col-3 col-md-2  d-flex justify-content-center align-items-end">
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
                                                <Dropdown.Item onClick={() => handleFilterChange("seller")} className="text-dark">
                                                   Seller
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("user&isSeller=false")} className="text-dark">
                                                    Requested Seller
                                                </Dropdown.Item>
                                                <Dropdown.Item onClick={() => handleFilterChange("")} className="text-dark">
                                                    All
                                                </Dropdown.Item>
                                            </Dropdown.Menu>
                                        </Dropdown>
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
                                        <li><Link to="/admin/edit-banner"><FontAwesomeIcon icon={faPencil} className="me-2" />Banner</Link></li>
                                        <li><Link to="/admin/awsimages"><FontAwesomeIcon icon={faPencil} className="me-2" />Images</Link></li>
                                        <li><Link to="/admin/subscribers"><FontAwesomeIcon icon={faPencil} className="me-2" />All Emails</Link></li>
                                    </ul>

                                </div>
                            </Drawer>

                        </div>


                        <h3 className="" style={{ color: "#ffad63", marginTop: "40px" }}>USER LIST</h3>



                        {loading ? (
                            <Loader />) : users.length === 0 ? (
                                <div className="text-center py-5">
                                    <p style={{ color: "#8c8c8c", fontSize: "18px" }}>We have no Users. Please create one.</p>
                                </div>
                            ) : (<div className="cartWrapper mt-4">
                                <div className="table-responsive" style={{ overflowX: "auto" }}>
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th style={{ minWidth: "200px" }}>NAME</th>
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
                                                            <span
                                                                style={{
                                                                    fontSize: "15px",
                                                                    color:
                                                                        user.role === "admin"
                                                                            ? "red"
                                                                            : user.role === "seller"
                                                                                ? "green"
                                                                                : user.role === "user" && user.isSeller === false
                                                                                    ? "blue"
                                                                                    : "#ffad63",
                                                                }}
                                                            >
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

                                                    {/* <td>
                                                        <Link to={`/admin/user/${user._id}`} style={{ backgroundColor: "#ffad63", color: "#fff", outline: "none", border: "none" }} className="btn "><FontAwesomeIcon icon={faPencil} /></Link>
                                                        <Button style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none", color: "#fff" }} onClick={(e) => deleteHandler(e, user._id)} className="btn ms-2">
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td> */}
                                                    <td>
                                                        <Link
                                                            to={`/admin/user/${user._id}`}
                                                            style={{ backgroundColor: "#ffad63", color: "#fff", outline: "none", border: "none" }}
                                                            className="btn"
                                                        >
                                                            <FontAwesomeIcon icon={faPencil} />
                                                        </Link>
                                                        <Button
                                                            style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none", color: "#fff" }}
                                                            onClick={() => handleDeleteClick(user._id)} // open modal
                                                            className="btn ms-2"
                                                        >
                                                            <FontAwesomeIcon icon={faTrash} />
                                                        </Button>
                                                    </td>

                                                  


                                                </tr>
                                            </tbody>
                                        ))}
                                    </table>
                                        <Modal open={deleteModalOpen} onClose={cancelDelete}>
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: "50%",
                                                    left: "50%",
                                                    transform: "translate(-50%, -50%)",
                                                    bgcolor: "background.paper",
                                                    p: 4,
                                                    borderRadius: 2,
                                                    width: 300,
                                                    border: "none",
                                                    outline: "none",
                                                }}
                                            >
                                                <Typography variant="h6" mb={2} align="center" fontSize={17} color="#8c8c8c">
                                                    Are you sure you want to delete this user? (It won't be recovered)
                                                </Typography>
                                                <Box display="flex" justifyContent="space-between">
                                                    <Button
                                                        onClick={confirmDelete}
                                                        sx={{ margin: "3px" }}
                                                        className="left-but"
                                                    >
                                                        Yes
                                                    </Button>
                                                    <Button
                                                        onClick={cancelDelete}
                                                        sx={{ margin: "3px" }}
                                                        className="right-but"
                                                    >
                                                        No
                                                    </Button>
                                                </Box>
                                            </Box>
                                        </Modal>
                                </div>
                            </div>
                        )
                        }
                        {ResultCount > 0 && ResultCount > resPerPage ? (
                            <div className="d-flex justify-content-center mt-5 tab-slider">
                                <Pagination
                                    activePage={currentPage}
                                    onChange={setCurrentPageNo}
                                    totalItemsCount={ResultCount}
                                    itemsCountPerPage={resPerPage}
                                    nextPageText={"Next"}
                                    firstPageText={"First"}
                                    lastPageText={"Last"}
                                    itemClass={"page-item"}
                                    linkClass={"page-link"}
                                />
                            </div>
                        ) : null}
                        <br />
                    </div>
                </div>
            </section>
        </>
    );
}



const Dashboard = () => {
    const [isSidebarHidden, setIsSidebarHidden] = useState(window.innerWidth < 768);
    const [isSearchFormVisible, setIsSearchFormVisible] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 991) {
                setIsSidebarHidden(true);
            } else {
                setIsSidebarHidden(false);
            }
            if (window.innerWidth > 576) {
                setIsSearchFormVisible(false);
            }
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }
    }, [isDarkMode]);

    const toggleSidebar = () => {
        setIsSidebarHidden(!isSidebarHidden);
    };

    const [isOpen, setIsOpen] = useState(false);

    return (
        <body className="pro-body">

            <section id="sidebar" className={isSidebarHidden ? 'hide' : ''}>
                <a href="#" class="brand">
                <FontAwesomeIcon className="bx" icon={faBars} onClick={toggleSidebar}/>
                    <span class="text">AdminHub</span>
                </a>
                <div class="side-menu top">
                    <li className="active">
                        <a href="#">
                            <FontAwesomeIcon className="bx" icon={faTachometerAlt} />
                            <span className="text">Dashboard</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon className="bx" icon={faShoppingBag} />
                            <span className="text">My Store</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon className="bx" icon={faChartPie} />
                            <span className="text">Analytics</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon className="bx" icon={faComments} />
                            <span className="text">Message</span>
                        </a>
                    </li>
                    <li>
                        <a href="#">
                            <FontAwesomeIcon className="bx" icon={faUsers} />
                            <span className="text">Team</span>
                        </a>
                    </li>
                </div>
            </section>


            <section id="content">

                <nav className="sticky-top">
                    <FontAwesomeIcon icon={faBars} size="sm" onClick={toggleSidebar} />
                    <a href="#" className="nav-link" >Categories</a>

                    <form action="#">
                        <div className="form-input">
                            <input type="search" placeholder="Search..." />
                            <button type="submit" className="search-btn">
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                        </div>
                    </form>

                    <input type="checkbox" className="checkbox" id="switch-mode" hidden />
                    <label className="switch-lm" htmlFor="switch-mode">
                        <FontAwesomeIcon icon={faMoon} />
                        <FontAwesomeIcon icon={faSun} />
                        <div className="ball"></div>
                    </label>

                    <a href="#" className="notification" id="notificationIcon">
                        <FontAwesomeIcon icon={faBell} shake />
                        <span className="num">8</span>
                    </a>

                    <div className="notification-menu" id="notificationMenu">
                        <ul>
                            <li>New message from John</li>
                            <li>Your order has been shipped</li>
                            <li>New comment on your post</li>
                            <li>Update available for your app</li>
                            <li>Reminder: Meeting at 3PM</li>
                        </ul>
                    </div>

                    <a href="#" className="profile" id="profileIcon">
                        <img src="https://placehold.co/600x400/png" alt="Profile" />
                    </a>

                    <div className="profile-menu" id="profileMenu">
                        <ul>
                            <li><a href="#">My Profile</a></li>
                            <li><a href="#">Settings</a></li>
                            <li><a href="#">Log Out</a></li>
                        </ul>
                    </div>
                </nav>

                <main>
                    <div class="head-title">
                        <div class="left">
                            <h1>Dashboard</h1>
                            <ul class="breadcrumb">
                                <li>
                                    <a href="#">Dashboard</a>
                                </li>
                                <li><i class='bx bx-chevron-right'></i></li>
                                <li>
                                    <a class="active" href="#">Home</a>
                                </li>
                            </ul>
                        </div>
                        <a href="#" class="btn-download">
                            <i class='bx bxs-cloud-download bx-fade-down-hover'></i>
                            <span class="text">Get PDF</span>
                        </a>
                    </div>

                    <ul class="box-info">
                        <li>
                            <i class='bx bxs-calendar-check'></i>
                            <span class="text">
                                <h3>1020</h3>
                                <p>New Order</p>
                            </span>
                        </li>
                        <li>
                            <i class='bx bxs-group'></i>
                            <span class="text">
                                <h3>2834</h3>
                                <p>Visitors</p>
                            </span>
                        </li>
                        <li>
                            <i class='bx bxs-dollar-circle'></i>
                            <span class="text">
                                <h3>N$2543.00</h3>
                                <p>Total Sales</p>
                            </span>
                        </li>
                    </ul>

                    <div class="table-data">
                        <div class="order">
                            <div class="head">
                                <h3>Recent Orders</h3>
                                <i class='bx bx-search'></i>
                                <i class='bx bx-filter'></i>
                            </div>
                            <table>
                                <thead>
                                    <tr>
                                        <th>User</th>
                                        <th>Date Order</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            <img src="https://placehold.co/600x400/png" />
                                            <p>Micheal John</p>
                                        </td>
                                        <td>18-10-2021</td>
                                        <td><span class="status completed">Completed</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="https://placehold.co/600x400/png" />
                                            <p>Ryan Doe</p>
                                        </td>
                                        <td>01-06-2022</td>
                                        <td><span class="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="https://placehold.co/600x400/png" />
                                            <p>Tarry White</p>
                                        </td>
                                        <td>14-10-2021</td>
                                        <td><span class="status process">Process</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="https://placehold.co/600x400/png" />
                                            <p>Selma</p>
                                        </td>
                                        <td>01-02-2023</td>
                                        <td><span class="status pending">Pending</span></td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <img src="https://placehold.co/600x400/png" />
                                            <p>Andreas Doe</p>
                                        </td>
                                        <td>31-10-2021</td>
                                        <td><span class="status completed">Completed</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="todo">
                            <div class="head">
                                <h3>Todos</h3>
                                <i class='bx bx-plus icon'></i>
                                <i class='bx bx-filter'></i>

                            </div>
                            <ul class="todo-list">
                                <li class="completed">
                                    <p>Check Inventory</p>
                                    <i class='bx bx-dots-vertical-rounded'></i>
                                </li>
                                <li class="completed">
                                    <p>Manage Delivery Team</p>
                                    <i class='bx bx-dots-vertical-rounded'></i>
                                </li>
                                <li class="not-completed">
                                    <p>Contact Selma: Confirm Delivery</p>
                                    <i class='bx bx-dots-vertical-rounded'></i>
                                </li>
                                <li class="completed">
                                    <p>Update Shop Catalogue</p>
                                    <i class='bx bx-dots-vertical-rounded'></i>
                                </li>
                                <li class="not-completed">
                                    <p>Count Profit Analytics</p>
                                    <i class='bx bx-dots-vertical-rounded'></i>
                                </li>
                            </ul>
                        </div>
                    </div>
                </main>

            </section>
        </body>
    );
};

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import avatar1 from './OIP.jpg'
import { Link } from "react-router-dom";
import Sidebar from './Sidebar';

function AnalyticsReport() {
  const [analyticsData, setAnalyticsData] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await axios.get('/api/v1/analytics');
        setAnalyticsData(data.data);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error.message);
      }
    };

    fetchAnalytics();
  }, []);

  return (
    <>
      {/* <div>
        <h1>Analytics Report</h1>
        <table>
          <thead>
            <tr>
              <th>Event</th>
              <th>User</th>
              <th>Product</th>
              <th>Page URL</th>
              <th>Search Keyword</th>
              <th>Time Spent (s)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {analyticsData.map((entry) => (
              <tr key={entry._id}>
                <td>{entry.event}</td>
                <td>{entry.userId ? entry.userId.name : 'Guest'}</td>
                <td>{entry.productId ? entry.productId.name : 'N/A'}</td>
                <td>{entry.pageUrl || 'N/A'}</td>
                <td>{entry.searchKeyword || 'N/A'}</td>
                <td>{entry.timeSpent || 'N/A'}</td>
                <td>{new Date(entry.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div> */}


      <div className="d-flex">
        <div className="col-12 col-md-2">
          <Sidebar />
        </div>
        <div className="col-12 col-md-10">

          <div className="row breadcrumbWrapperr">
            <div className="col-lg-3" style={{ display: "flex", justifyContent: "start", alignItems: "center" }}>
              <div className="pl-0">
                <div className="">
                  <ul className="breadcrumb breadcrumb2 mb-0">
                    <li>
                      <Link to={"/admin/dashboard"} style={{ color: "#fff" }}>Dashboard</Link>
                    </li>
                    <li>Analytics</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-7" style={{ display: "flex", justifyContent: "end" }}>
              <div className="reviewlist-list-filter-procureg">
                <div className="row">
                  <div className="topnav ">
                    <div className="search-container">
                      <form className="d-flex"
                      // onSubmit={(e) => e.preventDefault()}
                      >
                        <input
                          type="text"
                          placeholder="Search"
                          // value={searchKeyword}
                          // onChange={(e) => setSearchKeyword(e.target.value)}
                          name="search"
                        />
                        <button type="submit">
                          <FontAwesomeIcon icon={faSearch} />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-1 reviewlist-list-filter-procureg" style={{ display: "flex", justifyContent: "center", alignItems: "end" }}>
              <div className="">
                <Dropdown className="d-inline">
                  <Dropdown.Toggle
                    variant="default text-white"
                    id="dropdown-basic"
                    className="text-dark dropdown1 icon-list-filter-procureg"
                    style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                  >
                    <FontAwesomeIcon icon={faFilter} className="" style={{ color: "#ffad63" }} />
                  </Dropdown.Toggle>

                  {/* <Dropdown.Menu>
                                        <Dropdown.Item onClick={() => handleFilterChange("admin")} className="text-dark">
                                            Admin
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleFilterChange("user")} className="text-dark">
                                            User
                                        </Dropdown.Item>
                                        <Dropdown.Item onClick={() => handleFilterChange("")} className="text-dark">
                                            All
                                        </Dropdown.Item>
                                    </Dropdown.Menu> */}
                </Dropdown>
              </div>
            </div>
            {/* <div className="col-lg-1" style={{ display: "flex", justifyContent: "start", alignItems: "end" }}>
              <img src={avatar1} alt="Avatar" class="avatar" />
            </div> */}
          </div>

          <h3 style={{ color: "#ffad63", marginTop: "40px" }}>ANALYTICS</h3>
          <p>Glocre</p>

          <div className="">

            <div className="cartWrapper mt-4">
              <div className="table-responsive" >
                <table className="table">
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>User</th>
                      <th>Product</th>
                      <th>Page URL</th>
                      <th>Search Keyword</th>
                      <th>Time Spent (s)</th>
                      <th>Timestamp</th>
                    </tr>
                  </thead>

                  <tbody >
                    {analyticsData.map((entry) => (
                      <tr key={entry._id}>

                        <td width="10%">
                          <div className="d-flex align-items-center">
                            <span style={{ color: "#ffad63", fontSize: "15px" }}>
                              {entry.event}
                            </span>
                          </div>
                        </td>

                        <td width="15%">
                          <span style={{ color: "#888888" }}>
                            {entry.userId ? entry.userId.name : 'Guest'}
                          </span>
                        </td>

                        <td width="15%">
                          <span style={{ color: "#888888" }}>
                            {entry.productId ? entry.productId.name : 'N/A'}
                          </span>
                        </td>

                        <td width="15%">
                          <span style={{ color: "#888888" }}>
                            {entry.pageUrl || 'N/A'}
                          </span>
                        </td>

                        <td width="15%">
                          <span style={{ color: "#888888" }}>
                            {entry.searchKeyword || 'N/A'}
                          </span>
                        </td>

                        <td width="15%">
                          <span style={{ color: "#888888" }}>
                            {entry.timeSpent || 'N/A'}
                          </span>
                        </td>

                        <td width="15%">
                          <span style={{ color: "#888888" }}>
                            {new Date(entry.timestamp).toLocaleString()}
                          </span>
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <br />
          </div>
        </div>
      </div>
    </>
  );
}

export default AnalyticsReport;

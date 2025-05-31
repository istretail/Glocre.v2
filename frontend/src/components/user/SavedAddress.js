import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  getAllSavedAddresses,
  deleteSavedAddress,
} from "../../actions/userActions";
import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import "./user.css";
import Nav from "../layouts/nav";
import { Button } from "@mui/material";
import MetaData from "../layouts/MetaData";

const SavedAddress = () => {
  const dispatch = useDispatch();
  const { savedAddresses = [], error } = useSelector(
    (state) => state.userState,
  );
  useEffect(() => {
    dispatch(getAllSavedAddresses());
  }, [dispatch, error]);

  const handleDeleteAddress = (addressId) => {
    dispatch(deleteSavedAddress(addressId, error))
      .then(() => { })
      .catch((error) => { });
  };

  return (
    <>
    <MetaData title={`Saved Address | GLOCRE`} />
      <Nav />

      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/myprofile'}>My Profile</Link>
            </li>
            <li>Saved Addres</li>
          </ul>
        </div>
      </div>


      <section className="container-fluid my-4">
        <h1 className="hd mb-3">SAVED ADDRESS</h1>
        <div className="row g-2">
          {savedAddresses.map(address => (
            <div className="cartRightBox col-lg-4 col-md-6 col-sm-12 p-1" key={address._id}>
              <div className="card p-2 d-flex flex-column justify-content-between" style={{ height: "300px" }}>
                <div className="info-box mb-3">
                  <p>
                    <b className="info-box-p-b">Name</b>
                    <b className="info-box-p-b2">:</b>
                    <span className="info-box-p-span">{address?.name || "Not given"}</span>
                  </p>
                  <p>
                    <b className="info-box-p-b">Phone</b>
                    <b className="info-box-p-b2">:</b>
                    <span className="info-box-p-span">{address.phoneNo}</span>
                  </p>
                  <p>
                    <b className="info-box-p-b">Address</b>
                    <b className="info-box-p-b2">:</b>
                    <span className="info-box-p-span">
                      {address.address}, {address.addressLine}, {address.city}, {address.postalCode}, {address.state}, {address.country}
                    </span>
                  </p>
                </div>

                <div>
                  <Button className="loyal-btn">
                    <Link to={`/myprofile/update-saved-address/${address._id}`} className="btn flex-grow-1">
                    <FontAwesomeIcon icon={faEdit} className="fa-icon" />
                  </Link>
                </Button>

                <Button className="loyal-btn btn-danger">
                  <FontAwesomeIcon
                    icon={faTrashAlt}
                    id="delete_cart_item"
                    onClick={() => handleDeleteAddress(address._id)}
                    className="fa-icon"
                  />
                </Button>
              </div>

             
            </div>
            </div>
          ))}
      </div>
    </section >


    </>
  );
};

export default SavedAddress;

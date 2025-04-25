import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import mailsend from "../../images/mailsent.jpg";
import { Button } from "@mui/material";
import { TryRounded } from "@mui/icons-material";
import Nav from "../layouts/nav";

const Sucess = () => {
  const { loading } = useSelector((state) => state.authState);
  return (
    <>
      <Nav />

      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>
              <Link to={'/register'}>Register</Link>
            </li>
            <li>Sucess</li>
          </ul>
        </div>
      </div>

      <div className="empty d-flex align-items-center justify-content-center flex-column mt-5 mb-5">
        <img src={mailsend} alt="glocre" width="350" className="mt-5" />
        <br />
        <h3>Thankyou for Choosing GLOCRE </h3>
        <p>
          {' '}
          Check your inbox or junk folder for the verification link.
        </p>
        <br />
        <Link to="/resend-verification">
          <Button
            className="btn-g bg-g btn-lg btn-big btn-round"
            disabled={loading}
          >
            <TryRounded /> &nbsp; Try again
          </Button>
        </Link>
      </div>
    </>
  );
};

export default Sucess;

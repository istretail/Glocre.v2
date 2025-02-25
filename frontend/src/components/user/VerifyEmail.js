import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // Assuming you're using React Router for routing
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import mailsend from "./Verification-success.png";
import { Link } from "react-router-dom";
import Nav from "../layouts/nav";
import { Button } from '@mui/material';
import { TryRounded } from '@mui/icons-material';

const EmailVerification = () => {
  const { token } = useParams();
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState({
    success: false,
    message: "",
  });

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`/api/v1/verify-email/${token}`);
        setVerificationStatus({
          success: response.data.success,
          message: response.data.message,
        });
      } catch (error) {
        toast.error("Something went wrong while verifying email.");
      }
      setLoading(false);
    };

    verifyEmail();
  }, [token]);

  useEffect(() => {
    if (!loading) {
      if (verificationStatus.success) {
        toast.success(verificationStatus.message);
      }
    }
  }, [loading, verificationStatus]);

  return (
    <>
      <Nav />

      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>Email Verified</li>
          </ul>
        </div>
      </div>

      <div className="empty d-flex align-items-center justify-content-center flex-column mt-5 mb-5">
        <img src={mailsend} alt="image" width="250" className="mt-5" />
        <br />
        <h3>Welcome for GLOCRE </h3>
        <p>
          Your account is verified successfully! You can now proceed to explore
          and purchase products on GLOCRE.
        </p>

        <br />
        <Link to="/login">
          <Button
            className="btn-g bg-g btn-lg btn-big btn-round"
            disabled={loading}
          >
            <TryRounded /> &nbsp; Login
          </Button>
        </Link>
      </div>
    </>
  );
};

export default EmailVerification;

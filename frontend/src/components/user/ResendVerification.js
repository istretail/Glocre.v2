import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { resendVerification } from '../../actions/userActions';
import Loader from '../layouts/Loader'
import { Link } from "react-router-dom";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";

const ResendVerification = () => {
    const [email, setEmail] = useState('');
    const { loading } = useSelector((state) => state.authState);
    const dispatch = useDispatch()
    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to handle email submission
        console.log('Email submitted:', email);
        dispatch(resendVerification(email))
        setEmail('')
    };

    return (
        <>

            <section className="signIn mb-5">
                <div class="breadcrumbWrapper">
                    <div class="container-fluid">
                        <ul class="breadcrumb breadcrumb2 mb-0">
                            <li>
                                <Link to="/">Home</Link>{" "}
                            </li>
                            <li>
                                <Link to="/login">Sign Up</Link>{" "}
                            </li>
                            <li>Resend Verification</li>
                        </ul>
                    </div>
                </div>

                <div className="loginWrapper">
                    <div className="card shadow">
                        <Backdrop
                            sx={{ color: "#000", zIndex: (theme) => theme.zIndex.drawer + 1 }}
                            className="formLoader"
                        >
                            <CircularProgress color="inherit" />
                        </Backdrop>

                        <h3>Resend Verification</h3>
                        {
                            loading ? (
                                <Loader />
                            ) : (
                                <form
                                    className="mt-4"
                                    encType="multipart/form-data"
                                    onSubmit={handleSubmit}
                                >
                                    <div className="form-group mb-4 w-100">
                                        <TextField
                                            id="email"
                                            type="email"
                                            name="email"
                                            label="Enter Email"
                                            className="w-100"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group mt-5 mb-4 w-100">
                                        <Button type="submit" className="btn btn-g btn-lg w-100">
                                            Submit
                                        </Button>
                                    </div>
                                </form>
                            )
                        }
                        
                    </div>
                </div>
            </section>


        </>
    );
};

export default ResendVerification;
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { forgotPassword, clearAuthError } from "../../actions/userActions";
import { Link } from "react-router-dom";
import "./user.css";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import MetaData from "../layouts/MetaData";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { error, message } = useSelector((state) => state.authState);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("email", email);

    
    dispatch(forgotPassword(formData));
  };

  useEffect(() => {
    if (message) {
      toast(message, {
        type: "success",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
      setEmail("");
     
      return;
    }

    if (error) {
      toast(error, {
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
      return;
    }
  }, [message, error, dispatch]);

  return (
    <>
    <MetaData title={`Forgot Password | GLOCRE`} />
      <section className="signIn mb-5">
        <div class="breadcrumbWrapper">
          <div class="container-fluid">
            <ul class="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{" "}
              </li>
              <li>
                <Link to="/login">Sign In</Link>{" "}
              </li>
              <li>Forgot Password</li>
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

            <h3>Forgot Password</h3>
            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <div className="form-group mb-4 w-100">
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  label="Enter Email"
                  className="w-100"
                  value={email}
                  onChange={(e) => {
                    const input = e.target.value;
                    // Convert to lowercase and remove spaces
                    const formattedInput = input.toLowerCase().replace(/\s/g, '');
                    setEmail(formattedInput);
                  }}
                />
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button type="submit" className="btn btn-g btn-lg w-100">
                  {" "}
                  Send Email
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

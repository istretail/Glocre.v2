import { useState, useEffect, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  register,
  clearAuthError,
  sendVerificationEmail,
} from "../../actions/userActions";
import { toast } from "react-toastify";
import MetaData from "../layouts/MetaData";
import { Link } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { sendVerificationEmailFail } from "../../slices/authSlice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import "./user.css";
import reg from "./Register-img.avif";
import TextField from "@mui/material/TextField";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";
import { Button } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

export default function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true); // State to check if passwords match
  const [showPassword, setShowPassword] = useState(false); // State for toggling password visibility
  const [avatar, setAvatar] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(
    "images/default_avatar.png",
  );
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  const onChange = (e) => {
    if (e.target.name === "avatar") {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(e.target.files[0]);
        }
      };

      reader.readAsDataURL(e.target.files[0]);
    } else {
      setUserData({ ...userData, [e.target.name]: e.target.value });
    }
  };

  // Check if passwords match
  useEffect(() => {
    if (userData.password && userData.confirmPassword) {
      setPasswordsMatch(userData.password === userData.confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [userData.password, userData.confirmPassword]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append('lastName', userData.lastName);
    formData.append("email", userData.email);
    formData.append("password", userData.password);
    formData.append("avatar", avatar);

    try {
      await dispatch(register(formData));
      try {
        await dispatch(sendVerificationEmail(userData.email));
        toast.success(
          "Verification email has been sent to your email address. Please check your inbox.",
        );
        setUserData({ name: "", email: "", password: "" });
        setAvatar("");
        setAvatarPreview("images/default_avatar.png");
        navigate("/success");
      } catch (verificationError) {
        toast.error("An error occurred while sending the verification email.");
      }
    } catch (error) {
      toast.error(
        error.response && error.response.status === 400
          ? "Email already exists."
          : "An error occurred.",
      );
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(sendVerificationEmailFail);
      dispatch(clearAuthError());
    }
  }, [error, dispatch]);

  return (
    <>
      <MetaData title={`Register`} />

      <section className="signIn mb-5">
        <div class="breadcrumbWrapper res-hide">
          <div class="container-fluid">
            <ul class="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{' '}
              </li>
              <li>SignUp</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <Backdrop
              sx={{ color: '#000', zIndex: theme => theme.zIndex.drawer + 1 }}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <h3>SignUp</h3>
            <form className="mt-4" onSubmit={submitHandler}>
              <div className="form-group mb-4 w-100">
                <TextField
                  id="Full Name"
                  type="text"
                  name="name"
                  label="Full Name"
                  className="w-100"
                  onChange={onChange}
                  value={userData.name}
                />
              </div>

              <div className="form-group mb-4 w-100">
                <TextField
                  id="Last Name"
                  type="text"
                  name="lastName"
                  label="Last Name"
                  className="w-100"
                  onChange={onChange}
                  value={userData.lastName}
                />
              </div>

              <div className="form-group mb-4 w-100">
                <TextField
                  id="email"
                  type="email"
                  name="email"
                  label="Email"
                  className="w-100"
                  onChange={onChange}
                  value={userData.email}
                />
              </div>

              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    name="password"
                    label="Password"
                    className="w-100"
                    onChange={onChange}
                    type={showPassword ? 'text' : 'password'}
                    value={userData.password}
                  />
                  <Button
                    className="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </Button>
                </div>
              </div>

              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    name="confirmPassword"
                    label="Confirm Password"
                    className="w-100"
                    onChange={onChange}
                    type={showPassword ? 'text' : 'password'}
                    value={userData.confirmPassword}
                  />
                  <Button
                    className="icon"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOffOutlinedIcon />
                    ) : (
                      <VisibilityOutlinedIcon />
                    )}
                  </Button>
                </div>
                {!passwordsMatch && (
                  <p style={{ color: 'red' }}>Passwords do not match</p>
                )}
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn btn-g btn-lg w-100"
                >
                  Sign Up
                </Button>
              </div>

              <p className="text-center">
                Already have an account
                <b className="ms-1">
                  <Link to="/login">Sign In</Link>
                </b>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

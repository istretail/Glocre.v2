import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAuthError } from "../../actions/userActions";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import Nav from '../layouts/nav';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import MetaData from "../layouts/MetaData";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { error, resetSuccess } = useSelector((state) => state.authState);
  const navigate = useNavigate();
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const submitHandler = (e) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    const formData = { password, confirmPassword };
    dispatch(resetPassword(formData, token));
  };
  

  useEffect(() => {
    if (resetSuccess) {
      toast.success("Password Reset Success!");
      navigate("/login"); // Redirect to login
      return;
    }

    if (error) {
      toast(error, {
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError());
        },
      });
    }
  }, [resetSuccess, error, dispatch, navigate]);
  

  return (
    <>
    <MetaData title={`Reset Password | GLOCRE`} />
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
            <li>Reset Password</li>
          </ul>
        </div>
      </div>

      <section className="container">
        <h1 className="hd mb-2">Reset Password</h1>
        <form onSubmit={submitHandler}>
          <div className="row">
            <div className="col-md-12">
              <div className="row">
                <div className="col-md-4 mb-4">
                  <div className="form-group">
                    <TextField
                      label="New Password"
                      variant="outlined"
                      className="w-100 form-control"
                      name="New Password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={e => setPassword(e.target.value.replace(/\s/g, ''))} // remove spaces
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                              {showPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />


                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <TextField
                      label="Confirm Password"
                      variant="outlined"
                      className="w-100 form-control"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value.replace(/\s/g, ''))} // remove spaces
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                              {showConfirmPassword ? <VisibilityOutlinedIcon /> : <VisibilityOffOutlinedIcon />}
                            </IconButton>
                          </InputAdornment>
                        )
                      }}
                    />


                  </div>
                </div>
              </div>

              <div className="form-group mt-4 mb-4">
                <Button
                  type="submit"
                  className="btn-g btn-lg btn-big"
                  id="new_password_button"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

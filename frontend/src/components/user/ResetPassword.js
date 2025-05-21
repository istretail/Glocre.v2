import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, clearAuthError } from "../../actions/userActions";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Link } from 'react-router-dom';
import Nav from '../layouts/nav';

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const dispatch = useDispatch();
  const { isAuthenticated, error } = useSelector((state) => state.authState);
  const navigate = useNavigate();
  const { token } = useParams();

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    dispatch(resetPassword(formData, token));
  };

  useEffect(() => {
    if (isAuthenticated) {
      toast("Password Reset Success!", {
        type: "success",
      });
      navigate("/");
      return;
    }
    if (error) {
      toast(error, {
        type: "error",
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [isAuthenticated, error, dispatch, navigate]);

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
                      type="password"
                      id="password_field"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                  </div>
                </div>

                <div className="col-md-4">
                  <div className="form-group">
                    <TextField
                      type="confirm password"
                      id="confirm_password_field"
                      label="confirm password"
                      variant="outlined"
                      className="w-100 form-control"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
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

import { useEffect, useState } from "react";
import {
  updatePassword as updatePasswordAction,
  clearAuthError,
} from "../../actions/userActions";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export default function UpdatePassword() {
  const [password, setPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const dispatch = useDispatch();
  const { isUpdated, error } = useSelector((state) => state.authState);

  const submitHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("oldPassword", oldPassword);
    formData.append("password", password);
    dispatch(updatePasswordAction(formData));
  };

  useEffect(() => {
    if (isUpdated) {
      toast("Password updated successfully", {
        type: "success",
      });
      setOldPassword("");
      setPassword("");
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
  }, [isUpdated, error, dispatch]);

  return (
    <>
      <section className="signIn mb-5">
        <div class="breadcrumbWrapper">
          <div class="container-fluid">
            <ul class="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{' '}
              </li>
              <li>
                <Link to={'/myprofile'}>My Profile</Link>
              </li>
              <li>Update Password</li>
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

            <h3 className="hd">Update Password</h3>
            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <div className="form-group mb-5 w-100">
                <TextField
                  id="old_password_field"
                  type="password"
                  name="Password"
                  label="Old Password"
                  className="w-100 form-control"
                  value={oldPassword}
                  onChange={e => setOldPassword(e.target.value)}
                />
              </div>
              <div className="form-group mb-4 w-100">
                <TextField
                  id="new_password_field"
                  type="password"
                  name="Password"
                  label="New Password"
                  className="w-100 form-control"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button type="submit" className="btn btn-g btn-lg w-100">
                  {' '}
                  Update Password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

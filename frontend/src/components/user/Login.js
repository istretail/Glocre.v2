import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearAuthError, login } from '../../actions/userActions';
import MetaData from '../layouts/MetaData';
import { toast } from 'react-toastify';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getCartItemsFromCart } from '../../actions/cartActions';
import './user.css';
import TextField from '@mui/material/TextField';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import { Button } from '@mui/material';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const { loading, error, isAuthenticated } = useSelector(
    state => state.authState
  );
  const redirect = location.search ? '/' + location.search.split('=')[1] : '/';

  const submitHandler = e => {
    e.preventDefault();
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getCartItemsFromCart());
      navigate(redirect);
    }

    if (error) {
          setTimeout(() => dispatch(clearAuthError()), 1000);
    }
  }, [error, isAuthenticated, dispatch, navigate, redirect]);


  return (
    <>
      <MetaData title={`Login`} />

      <section className="signIn mb-5">
        <div class="breadcrumbWrapper">
          <div class="container-fluid">
            <ul class="breadcrumb breadcrumb2 mb-0">
              <li>
                <Link to="/">Home</Link>{' '}
              </li>
              <li>Sign In</li>
            </ul>
          </div>
        </div>

        <div className="loginWrapper">
          <div className="card shadow">
            <Backdrop
              sx={{ color: '#000', zIndex: theme => theme.zIndex.drawer + 1 }}
              open={loading}
              className="formLoader"
            >
              <CircularProgress color="inherit" />
            </Backdrop>

            <h3>Sign In</h3>
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
                  label="Email"
                  className="w-100"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group mb-4 w-100">
                <div className="position-relative">
                  <TextField
                    id="password"
                    type={showPassword === false ? 'password' : 'text'}
                    name="password"
                    label="Password"
                    className="w-100"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
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
              <div className="form-group mb-2 w-100">
                <Link to="/password/forgot">
                  {' '}
                  <p>Forgot password?</p>
                </Link>
              </div>

              <div className="form-group mt-5 mb-4 w-100">
                <Button
                  type="submit"
                  disabled={loading}
                  className="btn btn-g btn-lg w-100"
                >
                  Sign In
                </Button>
              </div>

              <p className="text-center">
                Not have an account
                <b>
                  {' '}
                  <Link to="/register">Sign Up</Link>
                </b>
              </p>
              <p className="text-center">
               Need to Verify your email?
                <b>
                  {' '}
                  <Link to="/resend-verification">Verify Email</Link>
                </b>
              </p>
            </form>
          </div>
        </div>
      </section>
    </>
  );
}

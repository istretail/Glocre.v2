import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile, clearAuthError, updateUserProfile } from '../../actions/userActions';
import { clearUpdateProfile } from '../../slices/authSlice';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import MetaData from '../layouts/MetaData';

export default function UpdateProfile() {
  const { error, user, isUpdated } = useSelector(state => state.authState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');

  const dispatch = useDispatch();



  const submitHandler = e => {
    e.preventDefault();
    
    // Instead of FormData
    dispatch(updateUserProfile({ name, lastName }));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      setLastName(user.lastName);
      
    }

    if (isUpdated) {
      toast('Profile updated successfully', {
        type: 'success',
        onOpen: () => dispatch(clearUpdateProfile()),
      });
      return;
    }

    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => {
          dispatch(clearAuthError);
        },
      });
      return;
    }
  }, [user, isUpdated, error, dispatch]);

  return (
    <>
    <MetaData title={`Update Profile | GLOCRE`} />
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
              <li>Update Profile</li>
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

            <h3 className="hd">Update Profile</h3>
            <form
              className="mt-4"
              encType="multipart/form-data"
              onSubmit={submitHandler}
            >
              <div className="form-group mb-5 w-100">
                <TextField
                  label="Name"
                  variant="outlined"
                  id="name_field"
                  type="text"
                  size="small"
                  name="name"
                  className="w-100 form-control"
                  value={name}
                  inputProps={{
                    maxLength: 15,
                    pattern: "^[A-Za-z]*$" // Removed space from the pattern
                  }}
                  onKeyDown={(e) => {
                    const isLetter = /^[a-zA-Z]$/.test(e.key);
                    const isAllowedKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key);

                    if (!isLetter && !isAllowedKey) {
                      e.preventDefault();
                    }
                  }}
                  required
                  onChange={e => setName(e.target.value)}
                />

              </div>
              <div className="form-group mb-5 w-100">
                <TextField
                  label="Last Name"
                  variant="outlined"
                  id="lastName_field"
                  type="text"
                  size="small"
                  name="lastName"
                  className="w-100 form-control"
                  value={lastName}
                  inputProps={{
                    maxLength: 15,
                    pattern: "^[A-Za-z]*$" // Removed space from pattern
                  }}
                  onKeyDown={(e) => {
                    const isLetter = /^[a-zA-Z]$/.test(e.key);
                    const isAllowedKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key);

                    if (!isLetter && !isAllowedKey) {
                      e.preventDefault();
                    }
                  }}
                  required
                  onChange={e => setLastName(e.target.value)}
                />

              </div>

              <div className="form-group mb-4 w-100">
                <TextField
                  id="new_password_field"
                  type="email"
                  name="email"
                  label="email"
                  className="w-100 form-control"
                  value={email}
                  // onChange={e => setEmail(e.target.value)}
                />

              </div>
    <p className='text-warning'>You can not update e-mail</p>
              <div className="form-group mt-5 mb-4 w-100">
                <Button type="submit" className="btn btn-g btn-lg w-100">
                  {' '}
                  Update Profile
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </>
  );
}

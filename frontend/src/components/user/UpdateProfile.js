import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile, clearAuthError } from '../../actions/userActions';
import { clearUpdateProfile } from '../../slices/authSlice';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { Link } from 'react-router-dom';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';

export default function UpdateProfile() {
  const { error, user, isUpdated } = useSelector(state => state.authState);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('/images/1.jpg');
  const dispatch = useDispatch();

  const onChangeAvatar = e => {
    const reader = new FileReader();
    console.log('file selected');
    reader.onload = () => {
      if (reader.readyState === 2) {
        setAvatarPreview(reader.result);
        setAvatar(e.target.files[0]);
      }
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  const submitHandler = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('avatar', avatar);
    dispatch(updateProfile(formData));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
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
                  type="name"
                  size="small"
                  name="Password"
                  className="w-100 form-control"
                  value={name}
                  onChange={e => setName(e.target.value)}
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
                  onChange={e => setEmail(e.target.value)}
                />

              </div>

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

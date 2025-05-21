import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import MetaData from '../layouts/MetaData';
import './user.css';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import Nav from '../layouts/nav';
import profileimage from '../../images/profileimage.svg';
import { logEvent } from '../../actions/analyticsActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { updateProfile, clearAuthError } from '../../actions/userActions';
import { clearUpdateProfile } from '../../slices/authSlice';

export default function Profile() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [previews, setPreviews] = useState([]);
  const [userData, setUserData] = useState([]);

  const [formFields, setFormFields] = useState({
    name: '',
    email: '',
    phone: '',
    images: [],
    isAdmin: false,
    password: '',
  });

  const changeInput = e => {
    setFormFields(() => ({
      ...formFields,
      [e.target.name]: e.target.value,
    }));
  };

  // new profile
  const { user } = useSelector(state => state.authState);
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({
        event: 'page_view',
        pageUrl: window.location.pathname,
        timeSpent,
      });
    };
  }, []);

  const { error, isUpdated } = useSelector(state => state.authState);
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
      <MetaData title={`Profile`} />

      <Nav />

      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={'/'}>Home</Link>
            </li>
            <li>My Profile</li>
          </ul>
        </div>
      </div>

      <div className="container">
        <h3 className="hd mb-0">MY Profile</h3>
        <div className="row">
          <div className="col-md-4">
            <div className=" d-flex align-items-center justify-content-center">
              <img src={profileimage} style={{ objectFit: 'cover' }}/>
            </div>
          </div>

          <div className="col-md-8">
            <div class="info-box">
              <p>
                <b className="info-box-p-b" style={{width:"110px"}}>Full Name</b>
                <b className="info-box-p-b2">:</b>
                <span className="info-box-p-span">{user.name}</span>
              </p>
              <p>
                <b className="info-box-p-b" style={{width:"110px"}}>Email Address</b>
                <b className="info-box-p-b2">:</b>
                <span className="info-box-p-span">{user.email}</span>
              </p>

              <p>
                <b className="info-box-p-b" style={{width:"110px"}}>Joined</b>
                <b className="info-box-p-b2">:</b>
                <span className="info-box-p-span">
                  {String(user.createdAt).substring(0, 10)}
                </span>
              </p>

              {user.role === 'seller' && (
                <>
                  <p>
                    <b className="info-box-p-b">Business Address</b>
                    <b className="info-box-p-b2">:</b>
                    <span className="info-box-p-span">
                      {user?.businessAddress && user.businessAddress.length > 0 ? (
                        `${user.businessAddress[0].address}, ${user.businessAddress[0].addressLine}, ${user.businessAddress[0].city}, ${user.businessAddress[0].state} - ${user.businessAddress[0].postalCode}, ${user.businessAddress[0].country}`
                      ) : (
                        "User has no address"
                      )}
                    </span>
                  </p>
                </>
              )}
            </div>

            <div className="row mt-4">
              <div className="use-link mt-3 ">
                <Link
                  to="/myprofile/update"
                  className="btn btn-g col-lg-2  me-2 mb-3"
                >
                  update profile
                </Link>
                <Link
                  to="/orders"
                  className="btn btn-g col-lg-2  me-2 mb-3"
                >
                  My Orders
                </Link>
                <Link
                  to="/myprofile/update/password"
                  id="edit_profile"
                  className="btn btn-g col-lg-2   me-2 mb-3"
                >
                  Change Password
                </Link>
                <Link
                  to="/myprofile/saved-address"
                  id="edit_profile"
                  className="btn col-lg-2  btn-g mb-3"
                >
                  Saved Address
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

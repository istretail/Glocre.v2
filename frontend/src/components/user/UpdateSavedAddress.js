import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { countries } from 'countries-list';
import { getSavedAddressById, updateSavedAddress, } from '../../actions/userActions';
import { toast } from 'react-toastify';
import Loader from '../layouts/Loader';
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import Nav from '../layouts/nav';
import MetaData from '../layouts/MetaData';

const fetchPostalCodeDetails = async (pincode) => {
  try {
    const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching pin code details:', error);
    throw error;
  }
};

const UpdateSavedAddress = () => {
  const { id: addressId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, error: authError } = useSelector((state) => state.authState);
  const {  savedAddress } = useSelector((state) => state.userState);
  const countryList = Object.values(countries);

  const [addressData, setAddressData] = useState({
    address: '',
    addressLine: '',
    city: '',
    phoneNo: '',
    postalCode: '',
    country: '',
    state: '',
  });

  const [localities, setLocalities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getSavedAddressById(addressId));
  }, [addressId, dispatch]);
console.log(savedAddress, "savedAddress")
  useEffect(() => {
    if (savedAddress && savedAddress._id === addressId) {
      setAddressData(savedAddress);

      if (savedAddress.postalCode) {
        fetchPostalCodeDetails(savedAddress.postalCode)
          .then((data) => {
            if (data && data[0]?.PostOffice?.length > 0) {
              const offices = data[0].PostOffice;
              let localityNames = offices.map((office) => office.Name);

              // Include saved addressLine if it's not in the fetched localities
              if (savedAddress.addressLine && !localityNames.includes(savedAddress.addressLine)) {
                localityNames = [savedAddress.addressLine, ...localityNames];
              }
              setLocalities(localityNames);
            } else {
              toast.error('Invalid pin code for saved address');
            }
          })
          .catch(() => {
            toast.error('Failed to fetch postal code details');
          });
      }
      setIsLoading(false);
    }
  }, [savedAddress, addressId]);
  
  


  const handlePostalCodeChange = useCallback(async (e) => {
    const sanitized = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAddressData((prev) => ({ ...prev, postalCode: sanitized }));

    if (sanitized.length === 6) {
      try {
        const data = await fetchPostalCodeDetails(sanitized);
        if (data && data[0]?.PostOffice?.length > 0) {
          const offices = data[0].PostOffice;
          const localityNames = offices.map((office) => office.Name);
          setLocalities(localityNames);

          setAddressData((prev) => ({
            ...prev,
            addressLine: localityNames[0],
            city: offices[0].Name || '',
            state: offices[0].State || '',
            country: offices[0].Country || '',
          }));
        } else {
          toast.error('Invalid pin code');
        }
      } catch (error) {
        toast.error('Failed to fetch postal code details');
      }
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddressData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(addressData)
    try {
      await dispatch(updateSavedAddress(addressId, addressData));

      toast.success('Address updated successfully');
      navigate('/myprofile/saved-address');
    } catch (authError) {
      toast.error(authError?.response?.data?.message);
    }
  };

  // if (isLoading) return <Loader />;

  return (
    <>
    <MetaData title={`Update Saved Address | GLOCRE`} />
      <Nav />
      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li><Link to={'/'}>Home</Link></li>
            <li><Link to={'/myprofile'}>My Profile</Link></li>
            <li><Link to={'/myprofile/saved-address'}>Saved Address</Link></li>
            <li>Update Saved Address</li>
          </ul>
        </div>
      </div>

      <section className="container mb-5">
        <h1 className="hd">Update Saved Address</h1>
        <form onSubmit={handleSubmit}>
          <div className="cartWrapper Form Contents mt-1">
            <div className="row mt-3 mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Name"
                    size="small"
                    placeholder="Name"
                    type="text"
                    id="name_field"
                    name="name"
                    className="form-control w-100"
                    value={addressData.name}
                    onChange={handleChange}
                    inputProps={{
                      maxLength: 15
                    }}
                    onKeyDown={(e) => {
                      const key = e.key;
                      const value = e.target.value;
                      const cursorPos = e.target.selectionStart;

                      const isLetter = /^[a-zA-Z]$/.test(key);
                      const isAllowedKey = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key);

                      // Block any character that is not a letter, space, or allowed key
                      if (!isLetter && !isAllowedKey && key !== ' ') {
                        e.preventDefault();
                      }

                      // Block space at the start
                      if (key === ' ' && cursorPos === 0) {
                        e.preventDefault();
                      }

                     

                      // Allow only one space in the middle
                      if (key === ' ' && value.includes(' ')) {
                        e.preventDefault();
                      }

                     
                    }}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Postal code"
                    size="small"
                    placeholder="Eg: 560001"
                    type="text"
                    id="postalCode_field"
                    name="postalCode"
                    className="form-control w-100"
                    value={addressData.postalCode}
                    onChange={handlePostalCodeChange}
                    inputProps={{
                      inputMode: 'numeric',
                      pattern: '[0-9]*',
                      maxLength: 6,
                    }}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="Phone No"
                    id="phone_field"
                    variant="outlined"
                    className="form-control w-100"
                    size="small"
                    type="text"
                    name="phoneNo"
                    value={addressData.phoneNo}
                    onChange={(e) => {
                      let value = e.target.value;

                      // Remove all non-digit characters except +
                      value = value.replace(/[^\d+]/g, '');

                      // Ensure it starts with +91
                      if (!value.startsWith("+91")) {
                        value = "+91" + value.replace(/\D/g, "");
                      }

                      // Extract digits after +91
                      const digitsOnly = value.replace("+91", "").replace(/\D/g, "");

                      // Limit to 10 digits after +91
                      if (digitsOnly.length > 10) {
                        value = "+91" + digitsOnly.substring(0, 10);
                      } else {
                        value = "+91" + digitsOnly;
                      }

                      setAddressData((prev) => ({
                        ...prev,
                        phoneNo: value,
                      }));
                    }}
                    onKeyDown={(e) => {
                      const cursorPos = e.target.selectionStart;

                      // Prevent spacebar
                      if (e.key === ' ') e.preventDefault();

                      // Prevent deleting or modifying +91
                      if (
                        cursorPos <= 3 &&
                        (e.key === 'Backspace' || e.key === 'Delete')
                      ) {
                        e.preventDefault();
                      }

                      // Prevent Ctrl+X or Cmd+X cutting the prefix
                      if ((e.ctrlKey || e.metaKey) && ['x', 'X'].includes(e.key)) {
                        e.preventDefault();
                      }
                    }}
                    InputProps={{
                      inputProps: { maxLength: 13 }, // +91 + 10 digits = 13 characters
                    }}
                    required
                  />


                </div>
              </div>
            </div>

            <div className="Street mb-4">
              <div className="form-group">
                <TextField
                  label="House number and street name"
                  id="address_field"
                  variant="outlined"
                  className="form-control w-100"
                  size="small"
                  type="text"
                  name="address"
                  value={addressData.address}
                  onChange={handleChange}
                  inputProps={{ maxLength: 50 }}
                  required
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <div className="form-group">
                  <select
                    className="form-control custom-select"
                    value={addressData.addressLine || ""}
                    onChange={(e) => setAddressData((prev) => ({ ...prev, addressLine: e.target.value }))}
                  >
                    <option value="" disabled>Select locality</option>
                    {localities.map((locality, index) => (
                      <option key={index} value={locality}>
                        {locality}
                      </option>
                    ))}
                  </select>


                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="City"
                    variant="outlined"
                    className="form-control w-100"
                    id="city_field"
                    size="small"
                    name="city"
                    value={addressData.city}
                    // onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-1">
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    id="state_field"
                    label="State"
                    type="text"
                    variant="outlined"
                    className="w-100 form-control"
                    size="small"
                    name="state"
                    value={addressData.state}
                    // onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <select
                    id="country_field"
                    className="form-control"
                    name="country"
                    value={addressData.country}
                    // onChange={handleChange}
                    required
                  >
                    <option value="">Select Country *</option>
                    {countryList.map((country, i) => (
                      <option key={i} value={country.name}>{country.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button type="submit" className="btn-g btn-lg w-20 col-1">
              Update
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default UpdateSavedAddress;

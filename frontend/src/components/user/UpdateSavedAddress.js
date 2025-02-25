import React, { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { countries } from 'countries-list';
import { updateSavedAddress } from '../../actions/userActions';
import { toast } from 'react-toastify';
import Loader from '../layouts/Loader';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import Nav from '../layouts/nav';

// Define a function to fetch details from the Postal PIN Code API
const fetchPostalCodeDetails = async pincode => {
  try {
    const response = await fetch(
      `https://api.postalpincode.in/pincode/${pincode}`
    );
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
  const { user } = useSelector(state => state.authState);
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
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const savedAddress =
      user &&
      user.savedAddress &&
      user.savedAddress.find(address => address._id === addressId);
    if (savedAddress) {
      setAddressData(savedAddress);
      setIsLoading(false);
    }
  }, [user, addressId]);

  const handleChange = async e => {
    const { name, value } = e.target;
    setAddressData({ ...addressData, [name]: value });
    if (name === 'postalCode' && value.length === 6) {
      try {
        const data = await fetchPostalCodeDetails(value);
        if (data && data[0]?.PostOffice?.length > 0) {
          const office = data[0].PostOffice[0];
          setAddressData(prevState => ({
            ...prevState,
            city: office.Name,
            postalCode: value,
            state: office.State,
            country: office.Country,
          }));
        } else {
          toast.error('Invalid pin code');
        }
      } catch (error) {
        console.error('Error fetching pin code details:', error);
        toast.error('Error fetching pin code details');
      }
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await dispatch(
        updateSavedAddress(addressId, addressData)
      );
      toast.success('Address updated successfully');
      navigate('/myprofile/saved-address');
    } catch (error) {
      toast.error(error || 'Failed to update address');
    }
  };

  if (isLoading) {
    return <Loader />;
  }
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
            <li>
              <Link to={'/myprofile/saved-address'}>Saved Addres</Link>
            </li>
            <li>Update Saved Address</li>
          </ul>
        </div>
      </div>

      <section className="container mb-5">
        <h1 className="hd ">Update Saved Address</h1>
        <form onSubmit={handleSubmit}>
          <div className="cartWrapper Form Contents mt-1">
            <div className="row mt-3 mb-4">
              <div className="col-md-6">
                {/* phone no */}
                <div className="form-group">
                  <TextField
                    label="Postal code"
                    size="small"
                    placeholder="Eg:+91987654321"
                    type="phone"
                    id="postalCode_field"
                    name="postalCode"
                    className="form-control w-100"
                    value={addressData.postalCode}
                    onChange={handleChange}
                    maxLength={6}
                    required
                  />
                </div>
              </div>
              <div className="col-md-6">
                {/* pincode */}
                <div className="form-group">
                  <TextField
                    label="Phone No"
                    id="phone_field"
                    variant="outlined"
                    className="form-control w-100"
                    size="small"
                    type="phone"
                    name="phoneNo"
                    value={addressData.phoneNo}
                    onChange={handleChange}
                    maxLength={10}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="Street mb-4">
              <div className="Street">
                {/* address */}
                <div className="form-group">
                  <TextField
                    label="House number and street name"
                    id="address_field"
                    variant="outlined"
                    className="form-control w-100"
                    size="small"
                    type="text"
                    value={addressData.address}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <TextField
                  label="Locality"
                  variant="outlined"
                  id="address_field"
                  name="address"
                  size="small"
                  className="w-100 "
                  value={addressData.addressLine}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* City */}
              <div className="col-md-6">
                <div className="form-group">
                  <TextField
                    label="City"
                    variant="outlined"
                    className="form-control w-100"
                    id="address_field"
                    size="small"
                    name="City"
                    value={addressData.city}
                    required
                  />
                </div>
              </div>
            </div>

            <div className="row mb-1">
              {/* State */}
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
                    //onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group">
                  <select
                    label="Country *"
                    variant="outlined"
                    size="small"
                    name="state"
                    id="country_field"
                    className="form-control"
                    value={addressData.country}
                    //onChange={handleChange}
                    required
                  >
                    {countryList.map((country, i) => (
                      <option key={i} value={country.name}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <Button
              id="shipping_btn"
              type="submit"
              className="btn-g btn-lg w-20 col-1"
            >
              Update
            </Button>
          </div>
        </form>
      </section>
    </>
  );
};

export default UpdateSavedAddress;

// const UpdateSavedAddress1 = () => {
//   return (
//     <>

//       <section className="container mb-5">
//         <h1 className="hd ">Update Saved Address</h1>
//         <form className="" onSubmit={handleSubmit}>
//             <div className="cartWrapper Form Contents mt-1">
//               <div className="row mt-3 mb-4">
//                 <div className="col-md-6">
//                   {/* phone no */}
//                   <div className="form-group">
//                     <TextField
//                       label="Postal code"
//                       variant="outlined"
//                       className="w-100"
//                       size="small"
//                       type="text"
//                       required
//                       placeholder="Eg:+91987654321"
//                       id="postalCode_field"
//                       value={addressData.postalCode}
//                       onChange={handleChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   {/* pincode */}
//                   <div className="form-group">
//                     <TextField
//                       label="Phone No"
//                       id="phone_field"
//                       variant="outlined"
//                       className="w-100"
//                       size="small"
//                       type="text"
//                       name="pincode"
//                       value={addressData.phoneNo}
//                       onChange={handleChange}
//                       maxLength={10}
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="Street mb-4">
//                 <div className="Street">
//                   {/* address */}
//                   <div className="form-group">
//                     <TextField
//                       label="House number and street name"
//                       id="address_field"
//                       variant="outlined"
//                       className="w-100"
//                       size="small"
//                       type="text"
//                       value={addressData.address}
//                       onChange={handleChange}
//                       required
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row mb-4">
//                 <div className="col-md-6">
//                   <div className="form-group">
//                      <TextField
//                     type="text"
//                     id="address_field"
//                     name="address"
//                     className="form-control"
//                     value={addressData.addressLine}
//                     onChange={handleChange}
//                     required
//                   />
//                   </div>
//                 </div>

//                 {/* City */}
//                 <div className="col-md-6">
//                   <div className="form-group">
//                     <TextField
//                       label="City"
//                       variant="outlined"
//                       className="w-100"
//                       size="small"
//                       name="City"
//                       value={addressData.city}
//                     required
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="row mb-1">
//                 {/* State */}
//                 <div className="col-md-6">
//                   <div className="form-group">
//                     <TextField
//                     id="state_field"
//                       label="State"
//                       variant="outlined"
//                       className="w-100"
//                       size="small"
//                       name="state"
//     value={addressData.state}
//                     //onChange={handleChange}
//                     required
//                     />

//                   </div>
//                 </div>

//                 <div className="col-md-6">
//                   <div className="form-group">
//                     <select
//                       label="Country *"
//                       variant="outlined"
//                       size="small"
//                       name="state"
//                       id="country_field"
//                       className="form-control"
//              value={addressData.country}
//                     //onChange={handleChange}
//                     required
//                     >
//                        {countryList.map((country, i) => (
//                       <option key={i} value={country.name}>
//                         {country.name}
//                       </option>
//                     ))}
//                     </select>

//                   </div>
//                 </div>

//               </div>
//             </div>
//            <Button
//                 type="submit"
//                 className="btn-g btn-lg w-20 col-1"
//                 id="shipping_btn"
//               >
//                Update
//               </Button>
//         </form>
//       </section>

//     </>
//   );
// };

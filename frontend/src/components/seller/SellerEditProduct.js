import React, { Fragment, useEffect, useState } from "react";
import SellerSidebar from "./SellerSidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getSellerSingleProduct, updateSellerProduct, getCategoryHierarchy } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify"; import Loader from "../layouts/Loader";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import Drawer from '@mui/material/Drawer';
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import avatar1 from '../../images/OIP.jpg';
import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import { ErrorOutline } from "@mui/icons-material";
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

export default function SellerUpdateProduct() {
  const [formData, setFormData] = useState({
    name: "",
    offPrice: "",
    tax: "",
    price: "",
    keyPoints: ["", "", "", "", ""],
    description: "",
    images: [],
    maincategory: "",
    category: "",
    subcategory: "",
    fssai: "",
    stock: "",
    condition: "",
    brand: "",
    itemModelNum: "",
    isRefundable: "false", // Add this line
    manufactureDetails: "",

    sku: "",
    upc: "",
    hsn: "",
    countryofOrgin: "",
    productCertifications: "",
    itemLength: "",
    itemHeight: "",
    itemWeight: "",
    itemWidth: "",
    moq: "",
    shippingCostlol: "",
    shippingCostNorth: "",
    shippingCostSouth: "",
    shippingCostEast: "",
    shippingCostWest: "",
    shippingCostNe: "",
    unit: "",

    clocreId: "", // Add this line
  });

  const { id: productId } = useParams();
  const { loading, error, categories = {} } = useSelector(state => state.productsState);
  const { isProductUpdated, product } = useSelector(state => state.productState);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState([]);
  const [imageErrors, setImageErrors] = useState([]);
  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  const [variantDetails, setVariantDetails] = useState([]);
  const [hasVariants, setHasVariants] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleKeyPointsChange = (index, value) => {
    const newKeyPoints = [...formData.keyPoints];
    newKeyPoints[index] = value;
    setFormData({ ...formData, keyPoints: newKeyPoints });
  };

  const clearImagesHandler = () => {
    setFormData({ ...formData, images: [] });
    setImageFiles([]);
    setImagesPreview([]);
  };

  useEffect(() => {
    if (isProductUpdated) {
      toast('Product Updated Successfully!', {
        type: 'success',
        onOpen: () => dispatch(clearProductUpdated())
      });
      setImages([]);
      navigate('/seller/products');
      return;
    }

    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(updateSellerProduct(error.message)) }
      });
      return;
    }

    dispatch(getSellerSingleProduct(productId));
  }, [isProductUpdated, error, dispatch, navigate,]);

  const handleVariantChange = (index, name, value) => {
    setVariantDetails((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[index] = { ...newVariants[index], [name]: value };
      return newVariants;
    });
  };

  const handleVariantImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    setVariantDetails((prevVariants) => {
      const newVariants = [...prevVariants];
      const existingImages = newVariants[index].images || [];
      const newImages = [...existingImages, ...files].slice(0, 3); // Ensure only 3 images are allowed
      newVariants[index] = { ...newVariants[index], images: newImages };
      return newVariants;
    });
  };
  const handleRemoveVariantImage = (variantIndex, imageIndex) => {
    setVariantDetails((prevVariants) => {
      const newVariants = [...prevVariants];
      newVariants[variantIndex] = {
        ...newVariants[variantIndex],
        images: newVariants[variantIndex].images.filter((_, i) => i !== imageIndex)
      };
      return newVariants;
    });
  };
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        offPrice: product.offPrice,
        tax: product.tax,
        price: product.price,
        keyPoints: product.keyPoints,
        description: product.description,
        images: product.images,
        maincategory: product.maincategory,
        category: product.category,
        subcategory: product.subcategory,
        fssai: product.fssai,
        stock: product.stock,
        condition: product.condition,
        brand: product.brand,
        itemModelNum: product.itemModelNum,
        isRefundable: product.isRefundable ? "true" : "false",
        manufactureDetails: product.manufactureDetails,

        sku: product.sku,
        upc: product.upc,
        hsn: product.hsn,
        countryofOrgin: product.countryofOrgin,
        productCertifications: product.productCertifications,
        itemLength: product.itemLength,
        itemHeight: product.itemHeight,
        itemWeight: product.itemWeight,
        itemWidth: product.itemWidth,
        moq: product.moq,
        shippingCostlol: product.shippingCostlol,
        shippingCostNorth: product.shippingCostNorth,
        shippingCostSouth: product.shippingCostSouth,

        shippingCostEast: product.shippingCostEast,
        shippingCostWest: product.shippingCostWest,
        shippingCostNe: product.shippingCostNe,
        unit: product.unit,

        clocreId: product.clocreId,
      });
      setVariantDetails(product?.variants?.map(variant => ({
        ...variant,
        images: variant.images || [] // Ensure images is defined
      })));
      setHasVariants(product?.variants?.length > 0);
      setImagesPreview(product.images);
    }
  }, [product, productId]);

  useEffect(() => {
    if (product) {
      dispatch(getCategoryHierarchy());
    }

  }, [product, dispatch]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [];
    const errors = [];

    if (files?.length > 3) {
      errors.push("You can only upload a maximum of 3 images.");
    } else {
      files.forEach((file) => {
        if (file.size > 1024 * 1024) {
          errors.push(`${file.name} is larger than 1MB`);
        } else {
          newImages.push(file);
        }
      });
    }

    setImageErrors(errors);
    if (errors?.length === 0) {
      setImageFiles(newImages);
      setFormData({
        ...formData,
        images: newImages?.map((file) => URL.createObjectURL(file)),
      });
      setImagesPreview(newImages?.map((file) => URL.createObjectURL(file)));
    }
  };
  const handleAddKeyPoint = () => {
    setFormData((prev) => ({
      ...prev,
      keyPoints: [...prev.keyPoints, ""],
    }));
  };

  const handleRemoveKeyPoint = (index) => {
    setFormData((prev) => {
      const updated = [...prev.keyPoints];
      updated.splice(index, 1);
      return { ...prev, keyPoints: updated };
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageErrors?.length > 0) {
      toast("Please fix the image errors before submitting.");
      return;
    }

    const productData = new FormData();

    // Append product fields
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        imageFiles.forEach((file) => {
          productData.append("images", file);
        });
      } else if (key === "keyPoints") {
        formData[key].forEach((point) => {
          productData.append("keyPoints", point);
        });
      } else {
        productData.append(key, formData[key]);
      }
    });

    // Ensure ALL variants (both updated & unchanged) are included
    variantDetails.forEach((variant, index) => {
      productData.append(`variants[${index}][id]`, variant.id); // Keep existing ID
      productData.append(`variants[${index}][name]`, variant.name);
      productData.append(`variants[${index}][price]`, variant.price);
      productData.append(`variants[${index}][stock]`, variant.stock);

      if (variant.images && variant?.images?.length > 0) {
        variant.images.forEach((file, i) => {
          productData.append(`variants[${index}][images]`, file);
        });
      } else {
        // Preserve existing images if no new ones are uploaded
        productData.append(`variants[${index}][existingImages]`, JSON.stringify(variant.existingImages || []));
      }
    });
    try {
      await dispatch(updateSellerProduct(productId, productData));
      console.log(productData)
    } catch (error) {
      toast(error.message, {
        type: 'error',
      });
    }
  };
  // Removed duplicate handleSubmit function

  const openModal = (image) => {
    setModalImage(image);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalImage("");
  };



  // console.log("Variant Details before submitting:", variantDetails);
  // console.log("Final Variant Data:", variantDetails);

  // Drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setIsDrawerOpen(!isDrawerOpen);
  };

  // Navbar
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1000);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1000);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.common.white,
      color: '#8c8c8c',
      boxShadow: theme.shadows[1],
      fontSize: 11,
      border: "1px solid rgba(255, 172, 99, 0.42)",
      outline: "none",
    },
  }));

  return (
    <>
      <section className="seller-update-product-glc">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            <SellerSidebar />
          </div>
          {loading ? (
            <Loader />
          ) : (
            <div className="col-12 col-lg-10 col-md-12 newprod-right-glc">
              <Link to="/">
                <div className="mobile-logo">
                  <img src={require('../../images/procure-g-logo.png')} />
                </div>
              </Link>
              <div className="breadcrumbWrapperr">
                {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
                {isMobile ? (
                  <div className="row mobile-topbar">
                    <div className="col-10">
                      <ul className="breadcrumb breadcrumb2 mb-0">
                        <li>
                          <Link
                            to="/seller/dashboard"
                            style={{ color: '#fff' }}
                          >
                            Dashboard
                          </Link>
                        </li>
                        <li>
                          <Link
                            to="/seller/products"
                            style={{ color: '#fff' }}
                          >
                            Product List
                          </Link>
                        </li>
                        <li>Update Product</li>
                      </ul>
                    </div>
                    <div className="col-2 text-end">
                      <button className="fab" onClick={toggleDrawer}>
                        <FontAwesomeIcon icon={faList} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="row dash-navbar-big-glc">
                    <div className="col-lg-3 col-md-12">
                      <ul className="breadcrumb breadcrumb2 mb-0">
                        <li>
                          <Link to="/seller/dashboard">Dashboard</Link>
                        </li>
                        <li>
                          <Link to="/seller/products">Product List</Link>
                        </li>
                        <li>Update Product</li>
                      </ul>
                    </div>
                    <div
                      className="col-lg-7 col-md-6"
                      style={{
                        display: 'flex',
                        justifyContent: 'end',
                        alignItems: 'end',
                      }}
                    >
                      <div className="dash-cont-glc">
                        <div className="row">
                          <div className="topnav">
                            <div className="search-container">
                              <form className="d-flex">
                                <input
                                  type="text"
                                  placeholder="Search"
                                  name="search"
                                />
                                <button type="submit">
                                  <FontAwesomeIcon icon={faSearch} />
                                </button>
                              </form>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      className="col-lg-1 col-md-2 dash-cont-glc"
                      style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'end',
                      }}
                    >
                      <Dropdown className="d-inline">
                        <Dropdown.Toggle
                          variant="default text-white"
                          id="dropdown-basic"
                          className="text-dark dropdown1 icon-list-filter-procureg"
                          style={{
                            backgroundImage: 'none',
                            border: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          <FontAwesomeIcon icon={faFilter} />
                        </Dropdown.Toggle>
                      </Dropdown>
                    </div>
                    {/* <div className="col-lg-1 col-md-2 dash-cont-glc">
                      <img src={avatar1} alt="Avatar" className="avatar" />
                    </div> */}
                  </div>
                )}
                {/* Search, Filter & Avatar Row (For Mobile) */}
                {isMobile && (
                  <div className="row mobile-bottombar">
                    <div className="col-8">
                      <div className="search-container">
                        <form className="d-flex">
                          <input
                            type="text"
                            placeholder="Search"
                            name="search"
                          />
                          <button type="submit">
                            <FontAwesomeIcon icon={faSearch} />
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="col-2 text-center">
                      <Dropdown className="d-inline">
                        <Dropdown.Toggle
                          variant="default text-white"
                          id="dropdown-basic"
                          className="text-dark dropdown1 icon-list-filter-procureg"
                          style={{
                            backgroundImage: 'none',
                            border: 'none',
                            boxShadow: 'none',
                          }}
                        >
                          <FontAwesomeIcon icon={faFilter} />
                        </Dropdown.Toggle>
                      </Dropdown>
                    </div>
                    {/* <div className="col-2 text-center">
                      <img src={avatar1} alt="Avatar" className="avatar" />
                    </div> */}
                  </div>
                )}

                {/* Drawer Component */}
                <Drawer
                  open={isDrawerOpen}
                  onClose={toggleDrawer}
                  direction="right"
                  className="drawer"
                >
                  <div className="drawer-header">
                    SELLER DASHBOARD
                    {/* <button className="drawer-close-btn" onClick={toggleDrawer}>&times;</button> */}
                  </div>
                  <div className="drawer-content">
                    <ul className="drawer-links">
                      <li>
                        <Link to="/seller/dashboard">
                          <FontAwesomeIcon icon={faDashboard} />{' '}
                          &nbsp;Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="/seller/products">
                          <FontAwesomeIcon icon={faCartShopping} />{' '}
                          &nbsp;Product List
                        </Link>
                      </li>
                      <li>
                        <Link to="/seller/products/create">
                          <FontAwesomeIcon icon={faShoppingBag} />{' '}
                          &nbsp;Create Product
                        </Link>
                      </li>
                      <li>
                        <Link to="/seller/orders">
                          <FontAwesomeIcon icon={faSort} /> &nbsp;Order List
                        </Link>
                      </li>
                    </ul>
                  </div>
                </Drawer>
              </div>

              <h3
                className=""
                style={{ color: '#ffad63', marginTop: '40px' }}
              >
                UPDATE PRODUCT
              </h3>


              <form
                onSubmit={handleSubmit}
                className=""
                encType="multipart/form-data"
              >
                <div className="row">
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="name_field">Product Name:<span style={{ color: "red" }}> *</span></label>
                      <input
                        type="text"
                        id="name_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.name}
                        name="name"
                        maxLength={80}
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="description_field">Description:<span style={{ color: "red" }}> *
                        <LightTooltip title="Describe what the product is, what it does, and who it's for." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip></span></label>
                      <textarea
                        className="form-control"
                        id="description_field"
                        rows="8"
                        onChange={handleChange}
                        value={formData.description}
                        name="description"
                      ></textarea>
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label>Key Points:<span style={{ color: "red" }}> *</span></label>
                      {formData.keyPoints.map((point, index) => (

                        <div key={index} className="d-flex mb-2">

                          <input
                            type="text"
                            className="form-control me-2"
                            value={point}
                            onChange={(e) => handleKeyPointsChange(index, e.target.value)}
                            maxLength={80}
                            required
                          />
                          {formData.keyPoints.length > 3 && (
                            <button
                              type="button"
                              className="btn btn-danger"
                              onClick={() => handleRemoveKeyPoint(index)}
                            >
                              &times;
                            </button>
                          )}
                        </div>
                      ))}

                      {formData.keyPoints.length < 5 && (
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleAddKeyPoint}
                        >
                          Add Key Point
                        </button>
                      )}
                    </div>
                  </div>

                  {/* MAIN CATEGORY */}
                  <div className="col-lg-6">
                    <div className="form-group relative">
                      <div className="custom-select-wrapper">
                        <label htmlFor="maincategory">
                          Main Category:<span style={{ color: "red" }}> *
                            <LightTooltip title="Select the most appropriate category for your product." arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>
                        <select
                          id="maincategory"
                          name="maincategory"
                          className="form-control appearance-none pr-8 custom-select"
                          value={formData.maincategory}
                          onChange={(e) => {
                            handleChange(e);
                            // Reset category and subcategory when main category changes
                            setFormData((prev) => ({
                              ...prev,
                              category: "",
                              subcategory: ""
                            }));
                          }}
                        >
                          <option value="">Select Main Category</option>
                          {Object.keys(categories).map((main) => (
                            <option key={main} value={main}>
                              {main}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  {/* CATEGORY */}
                  <div className="col-lg-6">
                    <div className="form-group relative">
                      <div className="custom-select-wrapper">
                        <label htmlFor="category">
                          Category:<span style={{ color: "red" }}> *
                            <LightTooltip title="Select the most appropriate category for your product." arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>
                        <select
                          id="category"
                          name="category"
                          className="form-control appearance-none pr-8 custom-select"
                          value={formData.category}
                          onChange={(e) => {
                            handleChange(e);
                            setFormData((prev) => ({
                              ...prev,
                              subcategory: ""
                            }));
                          }}
                          disabled={!formData.maincategory}
                        >
                          <option value="">Select Category</option>
                          {formData.maincategory &&
                            Object.keys(categories[formData.maincategory] || {}).map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SUB CATEGORY */}
                  <div className="col-lg-6">
                    <div className="form-group relative">
                      <div className="custom-select-wrapper">
                        <label htmlFor="subcategory">
                          Sub Category:<span style={{ color: "red" }}> *
                            <LightTooltip title="Select the most appropriate category for your product." arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>
                        <select
                          id="subcategory"
                          name="subcategory"
                          className="form-control appearance-none pr-8 custom-select"
                          value={formData.subcategory}
                          onChange={handleChange}
                          disabled={!formData.category}
                        >
                          <option value="">Select Subcategory</option>
                          {formData.maincategory &&
                            formData.category &&
                            (categories[formData.maincategory]?.[formData.category] || []).map(
                              (sub, i) => (
                                <option key={i} value={sub}>
                                  {sub}
                                </option>
                              )
                            )}
                        </select>
                      </div>
                    </div>
                  </div>
                  {formData.maincategory === "Food and Beverage Products" && (
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>FSSAI Number:<span style={{ color: "red" }}> *
                          <LightTooltip title="Enter your FSSAI license number, required for food products in India." arrow>
                            <ErrorOutlineIcon className="errorout-icon" />
                          </LightTooltip>
                        </span></label>
                        <input
                          type="text"
                          className="form-control"
                          name="fssai"
                          value={formData.fssai.toLocaleUpperCase()}
                          onChange={handleChange}
                          maxLength={14}
                          required
                        />
                      </div>
                    </div>
                  )}
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="tax_field">Tax:(GST in %):<span style={{ color: "red" }}> *
                        <LightTooltip title="Enter the applicable tax percentage or value." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip></span></label>
                      <input
                        type="text"
                        id="tax_field"
                        className="form-control"
                        onChange={handleChange}
                        maxLength={2}
                        value={formData.tax}
                        name="tax"
                      />
                    </div>
                  </div>

                  {!hasVariants && (
                    <>
                      <div className="row">
                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="price_field">Maximum Retail Price (in '₹'):<span style={{ color: "red" }}> *</span></label>
                            <input
                              type="number"
                              id="price_field"
                              className="form-control"
                              onChange={handleChange}
                              value={formData.price}
                              name="price"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="offPrice_field">
                              Offer Price (in '₹')
                              <LightTooltip title="Provide the manufacturer’s model number, if available." arrow>
                                <ErrorOutlineIcon className="errorout-icon" />
                              </LightTooltip>
                            </label>
                            <input
                              type="number"
                              id="offPrice_field"
                              className="form-control"
                              onChange={handleChange}
                              value={formData.offPrice}
                              name="offPrice"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group">
                            <label htmlFor="stock_field">Stock:<span style={{ color: "red" }}> *
                              <LightTooltip title="Enter the quantity currently in stock." arrow>
                                <ErrorOutlineIcon className="errorout-icon" />
                              </LightTooltip></span></label>
                            <input
                              type="number"
                              id="stock_field"
                              className="form-control"
                              onChange={handleChange}
                              value={formData.stock}
                              name="stock"
                              required
                            />
                          </div>
                        </div>

                        <div className="col-lg-6">
                          <div className="form-group">
                            <label>Product Images:<span style={{ color: "red" }}> *
                              <LightTooltip title="Provide the manufacturer’s model number, if available." arrow>
                                <ErrorOutlineIcon className="errorout-icon" />
                              </LightTooltip></span></label>
                            <div className="custom-file">
                              <input
                                type="file"
                                name="product_images"
                                className="custom-file-input"
                                id="customFile"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                required={formData.images.length === 0}
                              />
                              <label
                                className="custom-file-label"
                                htmlFor="customFile"
                              >
                                Choose Images
                              </label>
                            </div>
                            {imageErrors?.length > 0 && (
                              <div className="alert alert-danger mt-2">
                                {imageErrors?.map((error, index) => (
                                  <p key={index}>{error}</p>
                                ))}
                              </div>
                            )}
                            {formData?.images?.length > 0 && (
                              <span
                                className="mr-2"
                                onClick={clearImagesHandler}
                                style={{ color: '#2f4d2a' }}
                              >
                                <FontAwesomeIcon icon={faTrash} />
                              </span>
                            )}
                            {formData?.images?.map((image, index) => (
                              <img
                                className="mt-3 mr-2"
                                key={index}
                                src={image}
                                alt={`Image Preview`}
                                width="55"
                                height="52"
                                onClick={() => openModal(image)}
                                style={{ cursor: 'pointer' }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="condition_field">Condition:<span style={{ color: "red" }}> *
                        <LightTooltip title="Specify if the product is new, used, or refurbished." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip></span></label>
                      <select
                        className="form-control"
                        id="condition_field"
                        onChange={handleChange}
                        value={formData.condition}
                        name="condition"
                      >
                        <option value="">Select Condition</option>
                        <option value="New">New</option>
                        <option value="Unboxed">Unboxed</option>
                        <option value="Refurbished">Refurbished</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="isRefundable_field">
                        Is Refundable:<span style={{ color: "red" }}> *</span>
                      </label>
                      <select
                        className="form-control"
                        id="isRefundable_field"
                        onChange={handleChange}
                        value={formData.isRefundable}
                        name="isRefundable"
                      >
                        <option value="false">No</option>
                        <option value="true">Yes</option>
                      </select>
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="brand_field">Brand:<span style={{ color: "red" }}> *</span></label>
                      <input
                        type="text"
                        id="brand_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.brand}
                        name="brand"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    {variantDetails?.map((variant, index) => (
                      <div key={index} className="variant-section">
                        <h4>Variant {index + 1}</h4>
                        <div className="form-group">
                          <label>Variant Type:<span style={{ color: "red" }}> *</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={variant.variantType}
                            onChange={e =>
                              handleVariantChange(
                                index,
                                'variantType',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Variant Name:<span style={{ color: "red" }}> *</span></label>
                          <input
                            type="text"
                            className="form-control"
                            value={variant.variantName}
                            onChange={e =>
                              handleVariantChange(
                                index,
                                'variantName',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Maximum Retail price (in '₹'):<span style={{ color: "red" }}> *</span></label>
                          <input
                            type="number"
                            className="form-control"
                            value={variant.price}
                            onChange={e =>
                              handleVariantChange(
                                index,
                                'price',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Offer Price (in '₹'):<span style={{ color: "red" }}> *
                            <LightTooltip title="Enter the discounted price (if any)." arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip></span></label>
                          <input
                            type="number"
                            className="form-control"
                            value={variant.offPrice}
                            onChange={e =>
                              handleVariantChange(
                                index,
                                'offPrice',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Stock:<span style={{ color: "red" }}> *
                            <LightTooltip title="Enter the quantity currently in stock." arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip></span></label>
                          <input
                            type="number"
                            className="form-control"
                            value={variant.stock}
                            onChange={e =>
                              handleVariantChange(
                                index,
                                'stock',
                                e.target.value
                              )
                            }
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Images:<span style={{ color: "red" }}> *
                            <LightTooltip title="Provide the manufacturer’s model number, if available." arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip></span></label>
                          <input
                            type="file"
                            className="form-control"
                            multiple
                            accept="image/*"
                            onChange={e => handleVariantImageChange(index, e)}
                          />
                          <div className="mt-2">
                            {variant?.images?.map((image, imageIndex) => (
                              <div
                                key={imageIndex}
                                className="d-inline-block position-relative mr-2"
                              >
                                <img
                                  src={
                                    image instanceof File
                                      ? URL.createObjectURL(image)
                                      : image
                                  }
                                  alt={`Preview ${imageIndex}`}
                                  className="img-thumbnail"
                                  width="100"
                                  onClick={() => openModal(image)}
                                  style={{ cursor: 'pointer' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-danger btn-sm position-absolute"
                                  style={{ top: 0, right: 0 }}
                                  onClick={() =>
                                    handleRemoveVariantImage(
                                      index,
                                      imageIndex
                                    )
                                  }
                                >
                                  <i className="fa fa-trash"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="itemModelNum_field">
                        Item Model Number
                      </label>
                      <input
                        type="text"
                        id="itemModelNum_field"
                        className="form-control"
                        onChange={handleChange}
                        maxLength={15}
                        value={formData.itemModelNum.toLocaleUpperCase()}
                        name="itemModelNum"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="sku_field">SKU
                        <LightTooltip title="Stock Keeping Unit – your internal tracking code for this product." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip>
                      </label>
                      <input
                        type="text"
                        id="sku_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.sku.toLocaleUpperCase()}
                        maxLength={15}
                        name="sku"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="upc_field">
                        UPC
                      </label>
                      <input
                        type="text"
                        id="upc_field"
                        className="form-control"
                        onChange={handleChange}
                        maxLength={15}
                        value={formData.upc.toLocaleUpperCase()}
                        name="upc"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="hsn_field">
                        HSN Code
                        <LightTooltip title="HSN code for GST classification of your product." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip>
                      </label>
                      <input
                        type="text"
                        id="hsn_field"
                        className="form-control"
                        onChange={handleChange}
                        maxLength={10}
                        value={formData.hsn.toLocaleUpperCase()}
                        name="hsn"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="countryofOrgin_field">Country of Orgin</label>
                      <input
                        type="text"
                        id="countryofOrgin_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.countryofOrgin}
                        name="countryofOrgin"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="productCertifications_field">
                        Product Certifications
                        <LightTooltip title="List any certifications (e.g., ISO, CE, Organic) your product has." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip>
                      </label>
                      <input
                        type="text"
                        id="productCertifications_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.productCertifications}
                        name="productCertifications"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="manufactureDetails_field">Manufacture Details
                          <LightTooltip title="Enter the country where the product was manufactured or produced." arrow>
                                                <ErrorOutlineIcon className="errorout-icon" />
                                              </LightTooltip>
                      </label>
                      <input
                        type="text"
                        id="manufactureDetails_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.manufactureDetails}
                        name="manufactureDetails"
                      />
                    </div>
                  </div>
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="itemLength_field">Item Length in Centimeters</label>
                      <input
                        type="number"
                        id="itemLength_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.itemLength}
                        name="itemLength"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="itemHeight_field">
                        Item Height in Centimeters
                      </label>
                      <input
                        type="number"
                        id="itemHeight_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.itemHeight}
                        name="itemHeight"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="itemWeight_field">
                        Item Weight in Kgs
                      </label>
                      <input
                        type="number"
                        id="itemWeight_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.itemWeight}
                        name="itemWeight"
                      />
                    </div>
                  </div>

                  <div className="col-lg-6">
                    <div className="form-group">
                      <label htmlFor="itemWidth_field">
                        Item Width in Centimeters
                      </label>
                      <input
                        type="number"
                        id="itemWidth_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.itemWidth}
                        name="itemWidth"
                      />
                    </div>
                  </div>

                  <div className="col-12">
                    <div className="form-group">
                      <label htmlFor="moq_field">
                        Minimum Order QTY(MOQ)
                      </label>
                      <input
                        type="number"
                        id="moq_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.moq}
                        name="moq"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="shippingCostlol_field">Shipping Cost local (in '₹') (Based on seller pincode)</label>
                      <input
                        type="number"
                        id="shippingCostlol_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.shippingCostlol}
                        name="shippingCostlol"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="shippingCostNorth_field">
                        Shipping Cost North India (in '₹')
                      </label>
                      <input
                        type="number"
                        id="shippingCostNorth_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.shippingCostNorth}
                        name="shippingCostNorth"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="shippingCostSouth_field">
                        Shipping Cost South India (in '₹')
                      </label>
                      <input
                        type="number"
                        id="shippingCostSouth_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.shippingCostSouth}
                        name="shippingCostSouth"
                      />
                    </div>
                  </div>



                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="shippingCostEast_field">Shipping Cost East India (in '₹')</label>
                      <input
                        type="number"
                        id="shippingCostEast_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.shippingCostEast}
                        name="shippingCostEast"
                      />
                    </div>
                  </div>

                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="shippingCostWest_field">Shipping Cost West India (in '₹')</label>
                      <input
                        type="number"
                        id="shippingCostWest_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.shippingCostWest}
                        name="shippingCostWest"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="shippingCostNe_field">shipping Cost Northeast India (in '₹')</label>
                      <input
                        type="number"
                        id="shippingCostNe_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.shippingCostNe}
                        name="shippingCostNe"
                      />
                    </div>
                  </div>
                  <div className="col-lg-4">
                    <div className="form-group">
                      <label htmlFor="unit_field">Unit (EA/ML/Set)</label>
                      <input
                        type="text"
                        id="unit_field"
                        className="form-control"
                        onChange={handleChange}
                        value={formData.unit.toLocaleUpperCase()}
                        name="unit"
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'end' }}>
                    <button
                      id="login_button"
                      type="submit"
                      disabled={loading}
                      className="btn mt-3"
                      style={{ backgroundColor: '#ffad63', color: '#fff' }}
                    >
                      Update Product
                    </button>
                  </div>
                </div>
              </form>

              {showModal && (
                <div className="modal" style={{ display: 'block' }}>
                  <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button
                          type="button"
                          className="close"
                          onClick={closeModal}
                        >
                          &times;
                        </button>
                      </div>
                      <div className="modal-body">
                        <img
                          src={modalImage}
                          alt="Preview"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
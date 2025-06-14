import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { addSellerNewProduct, getCategoryHierarchy } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import SellerSidebar from "./SellerSidebar";
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
import MetaData from "../layouts/MetaData";

const SellerCreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    maincategory: "",
    category: "",
    subcategory: "",
    fssai: "",
    brand: "",
    condition: "",
    keyPoints: ["", "", "", "", ""],
    variants: [],
    tax: "",
    itemModelNum: "",
    isRefundable: "false",
    offPrice: "",
    stock: "",
    price: "",

    sku: "",
    upc: "",
    hsn: "",
    countryofOrgin: "India",
    manufactureDetails: "",
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
    shippingCostCentral: "",
    shippingCostWest: "",
    shippingCostNe: "",
    additionalShippingCost: "",
    unit: "",
  });
  const { loading, isProductCreated, error } = useSelector(state => state.productState);
  const { categories = [] } = useSelector(state => state.productsState);
  const [hasVariants, setHasVariants] = useState(false);
  const [variantType, setVariantType] = useState("");
  const [variantCount, setVariantCount] = useState(2);
  const [variantDetails, setVariantDetails] = useState([
    {
      variantType: variantType,
      variantName: '',
      price: '',
      offPrice: '',
      stock: '',
      images: [],
    },
    {
      variantType: variantType,
      variantName: '',
      price: '',
      offPrice: '',
      stock: '',
      images: [],
    },
  ]);
  const [imageErrors, setImageErrors] = useState([]);
  const [productImages, setProductImages] = useState([]);
  const [selectedMainCategory, setSelectedMainCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  // const [variantType, setVariantType] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Fields that should be uppercase (alphanumeric fields)
    const upperCaseFields = ["sku", "upc", "itemModelNum", "hsn"];

    // Handle numeric fields like price and offPrice
    if (name === "price" || name === "offPrice") {
      const numericValue = Number(value);

      setFormData((prev) => {
        const updated = { ...prev, [name]: numericValue };

        const price = name === "price" ? numericValue : Number(prev.price);
        const offPrice = name === "offPrice" ? numericValue : Number(prev.offPrice);

        if (price !== 0 && offPrice !== 0 && price <= offPrice) {
          toast.error("Maximum Retail Price must be greater than Offer Price.");
          return prev; // block update
        }

        return updated;
      });
    } else {
      // For other fields (like sku, upc, hsn etc.)
      const transformedValue = upperCaseFields.includes(name)
        ? value.toUpperCase()
        : value;

      setFormData((prev) => ({
        ...prev,
        [name]: transformedValue,
      }));
    }
  };


  // Handle key points change
  const handleKeyPointsChange = (index, value) => {
    setFormData((prev) => {
      const newKeyPoints = [...prev.keyPoints];
      newKeyPoints[index] = value;
      return { ...prev, keyPoints: newKeyPoints };
    });
  };

  // Handle variant change (excluding images)
  const handleVariantChange = (index, name, value) => {
    setVariantDetails((prevVariants) => {
      const newVariants = [...prevVariants];
      const currentVariant = newVariants[index];

      // Decide whether to convert value to number
      const isNumericField = ['price', 'offPrice'].includes(name);
      const updatedValue = isNumericField ? Number(value) : value;

      // Validation: MRP should be greater than Offer Price
      if (isNumericField) {
        const price = name === 'price' ? updatedValue : Number(currentVariant.price);
        const offPrice = name === 'offPrice' ? updatedValue : Number(currentVariant.offPrice);

        if (price <= offPrice) {
          toast.error("MRP must be greater than Offer Price.");
          return prevVariants; // Block update
        }
      }

      // If valid, update the variant
      newVariants[index] = {
        ...currentVariant,
        [name]: updatedValue,
      };

      return newVariants;
    });
  };



  // Handle image upload
  const handleImageChange = (index, e) => {
    const files = Array.from(e.target.files);
    const validImages = files.filter((file) => file.size <= 1024 * 1024);
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      alert("Only image files are allowed.");
      return;
    }
    const errors = files
      .filter((file) => file.size > 1024 * 1024)
      .map((file) => `${file.name} is larger than 1MB`);

    setImageErrors(errors);

    if (validImages.length > 0) {
      setVariantDetails((prevVariants) => {
        const newVariants = [...prevVariants];
        if (!newVariants[index]) {
          newVariants[index] = {};
        }

        const existingImages = newVariants[index].images || [];

        // Filter out duplicates
        const newUniqueImages = validImages.filter(
          (file) =>
            !existingImages.some(
              (img) => img.name === file.name && img.size === file.size
            )
        );

        // Combine existing + new images
        const combinedImages = [...existingImages, ...newUniqueImages];

        // Limit to max 3 images
        if (combinedImages.length > 3) {
          setImageErrors((prev) => [
            ...prev,
            `Only 3 images allowed. You selected ${combinedImages.length}.`,
          ]);
          newVariants[index].images = combinedImages.slice(0, 3);
        } else {
          newVariants[index].images = combinedImages;
        }

        return newVariants;
      });
    }
  };


  // Remove selected image
  const handleRemoveImage = (variantIndex, imageIndex) => {
    setVariantDetails((prevVariants) => {
      const newVariants = [...prevVariants];
      if (newVariants[variantIndex]?.images) {
        newVariants[variantIndex].images = newVariants[variantIndex].images.filter((_, i) => i !== imageIndex);
      }
      return newVariants;
    });
  };
  const handleRemoveProductImage = (indexToRemove) => {
    setProductImages((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleProductImageChange = (e) => {
    const files = Array.from(e.target.files);
    const maxSize = 1024 * 1024; // 1MB
    const maxImages = 3;
    const imageFiles = files.filter(file => file.type.startsWith("image/"));
    if (imageFiles.length !== files.length) {
      alert("Only image files are allowed.");
      return;
    }
    setProductImages((prevImages) => {
      const errors = [];
      const validNewImages = [];

      files.forEach((file) => {
        const isDuplicate = prevImages.some(
          (img) => img.name === file.name && img.size === file.size
        );

        if (file.size > maxSize) {
          errors.push(`${file.name} is larger than 1MB`);
        } else if (isDuplicate) {
          errors.push(`${file.name} is already added`);
        } else {
          validNewImages.push(file);
        }
      });

      const combinedImages = [...prevImages, ...validNewImages];

      if (combinedImages.length > maxImages) {
        errors.push(`Only ${maxImages} images are allowed. You selected ${combinedImages.length}.`);
      }

      setImageErrors(errors);

      return combinedImages.slice(0, maxImages);
    });
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
  const validateForm = () => {
    const { itemModelNum, sku, upc, hsn, fssai, maincategory } = formData;
    const alphaNumericRegex = /^[A-Z0-9\-]+$/;

   const validUnits = ["EA", "ML", "SET", "KG", "LTR", "BOX", "PCS"]; // Customize list

    if (!validUnits.includes(formData.unit?.toUpperCase())) {
      toast.error("Please enter a valid unit (e.g., EA, ML, SET).");
      return false;
    }
    const isOnlyZerosOrDashes = (value) => /^[-0]+$/.test(value);

    // --- SKU ---
    if (!sku || !alphaNumericRegex.test(sku) || isOnlyZerosOrDashes(sku)) {
      toast.error("SKU is required, should be alphanumeric, and cannot be only zeros or dashes (e.g. '0000').");
      return false;
    }

    // --- HSN ---
    if (!/^\d{4}$|^\d{6}$|^\d{8}$/.test(hsn) || /^0+$/.test(hsn)) {
      toast.error("HSN code must be 4, 6, or 8 digits and cannot be all zeros.");
      return false;
    }

    // --- Item Model Number ---
    if (itemModelNum) {
      if (!alphaNumericRegex.test(itemModelNum) || isOnlyZerosOrDashes(itemModelNum)) {
        toast.error("Item Model Number should be alphanumeric and not just zeros or dashes.");
        return false;
      }
    }

    // --- UPC ---
    if (upc) {
      if (!/^\d{12}$/.test(upc) || /^0+$/.test(upc)) {
        toast.error("UPC must be a 12-digit numeric code and cannot be all zeros.");
        return false;
      }
    }
     if (maincategory === "Food and Beverage Products") {
                if (!/^\d{14}$/.test(fssai) || /^0+$/.test(fssai)) {
                    toast.error("FSSAI must be a 14-digit numeric code and cannot be all zeros.");
                    return false;
                }
              }
    return true;
  };
  // Submit the form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (imageErrors.length > 0) {
      toast.error("Please fix the image errors before submitting.");
      return;
    }
    if (validateForm()) {
      const productData = new FormData();

      // Append non-array fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== "variants" && key !== "keyPoints" && value) {
          productData.append(key, value);
        }
      });

      // Append key points
      formData.keyPoints.forEach((point, index) => {
        if (point) {
          productData.append(`keyPoints[${index}]`, point);
        }
      });

      if (hasVariants) {
        // Append variants as a JSON string
        variantDetails.forEach((variant, i) => {
          productData.append(`variants[${i}][variantType]`, variantType);
          productData.append(`variants[${i}][variantName]`, variant.variantName);
          productData.append(`variants[${i}][price]`, variant.price);
          productData.append(`variants[${i}][offPrice]`, variant.offPrice);
          productData.append(`variants[${i}][stock]`, variant.stock);


        });


        // Append variant images
        variantDetails.forEach((variant, variantIndex) => {
          if (variant.images && Array.isArray(variant.images)) {
            variant.images.forEach((imageFile) => {
              if (imageFile && typeof imageFile === 'object' && imageFile.name && imageFile.type) {
                productData.append(`variants[${variantIndex}][images]`, imageFile);
              }
            });
          }
        });
      }



      // Append product images if no variants
      if (!hasVariants) {
        productImages.forEach((imageFile) => {
          productData.append('images', imageFile);
        });
      }
      // Log the FormData entries
      // for (let [key, value] of productData.entries()) {
      //     if (value instanceof File) {
      //         console.log(`${key}: ${value.name}`);
      //     } else {
      //         console.log(`${key}: ${value}`);
      //     }
      // }


      // Dispatch action to add product
      // console.log("FormData before submission:", formData);

      try {
        await dispatch(addSellerNewProduct(productData));
        // toast("Product updated successfully!", { type: "success" });
      } catch (error) {
        toast(error.message, { type: "error" });
      }
    }


  };
  useEffect(() => {
    if (isProductCreated) {
      toast('Product Created Successfully!', {
        type: 'success',
        onOpen: () => dispatch(clearProductCreated())
      });
      navigate('/seller/products');
      return;
    }

    if (error) {
      toast(error, {
        type: 'error',
        onOpen: () => { dispatch(clearError()) }
      });
      return;
    }
  }, [isProductCreated, error, dispatch]);

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

  useEffect(() => {
    dispatch(getCategoryHierarchy());
  }, [dispatch]);

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
    <MetaData title="Create New Product | GLOCRE" />
      <section className="seller-create-product-glc">
        <div className="row container-fluid">
          <div className="col-12 col-md-2">
            <SellerSidebar />
          </div>

          <div className="col-12 col-lg-10 col-md-12 pr-0 newprod-right-glc">
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
                        <Link to="/seller/dashboard" style={{ color: '#fff' }}>
                          Dashboard
                        </Link>
                      </li>
                      <li>Create Product</li>
                    </ul>
                  </div>
                  <div className="col-2 p-0 d-flex justify-content-center align-items-center">
                    <button className="fab" onClick={toggleDrawer}>
                      <FontAwesomeIcon icon={faList} />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="row dash-navbar-big-glc small-sticky-navbar">
                  <div className="col-lg-3 col-md-12">
                    <ul className="breadcrumb breadcrumb2 mb-0">
                      <li>
                        <Link to="/seller/dashboard">Dashboard</Link>
                      </li>
                      <li>Create Product</li>
                    </ul>
                  </div>
                  <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
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
                  <div className="col-lg-1 col-md-2 d-flex justify-content-center align-items-end">
                    <Dropdown className="d-inline">
                      <Dropdown.Toggle
                        variant="default"
                        id="dropdown-basic"
                        className="custom-filter-toggle"
                      >
                        <FontAwesomeIcon icon={faFilter} />
                      </Dropdown.Toggle>
                    </Dropdown>
                  </div>
                </div>
              )}
              {/* Search, Filter & Avatar Row (For Mobile) */}
              {isMobile && (
                <div className="row mobile-bottombar">
                  <div className="col-9 col-md-10 pr-0">
                    <div className="search-container">
                      <form className="d-flex">
                        <input type="text" placeholder="Search" name="search" />
                        <button type="submit">
                          <FontAwesomeIcon icon={faSearch} />
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-3 col-md-2  d-flex justify-content-center align-items-end">
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
                        <FontAwesomeIcon icon={faDashboard} /> &nbsp;Dashboard
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/products">
                        <FontAwesomeIcon icon={faCartShopping} /> &nbsp;Product
                        List
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/products/create">
                        <FontAwesomeIcon icon={faShoppingBag} /> &nbsp;Create
                        Product
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/orders">
                        <FontAwesomeIcon icon={faSort} /> &nbsp;Order List
                      </Link>
                    </li>
                    <li>
                      <Link to="/seller/archive/product">
                        <FontAwesomeIcon icon={faSort} /> &nbsp;Archieved Products
                      </Link>
                    </li>
                  </ul>
                </div>
              </Drawer>
            </div>

            <h3 className="" style={{ color: '#ffad63', marginTop: '40px' }}>
              CREATE PRODUCT
            </h3>


            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Product Name:<span style={{ color: "red" }}> *
                    </span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      onKeyDown={(e) => {
                        if (e.target.selectionStart === 0 && e.key === " ") e.preventDefault();
                      }}
                      minLength="5"
                      maxlength="80"
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Description:<span style={{ color: "red" }}> *
                      <LightTooltip placement="top" title="Describe what the product is, what it does, and who it's for." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>
                    </span></label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onKeyDown={(e) => {
                        if (e.target.selectionStart === 0 && e.key === " ") e.preventDefault();
                      }}
                      onChange={handleChange}
                      maxLength={200}
                    />
                  </div>
                </div>

                {/* MAIN CATEGORY */}
                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="custom-select-wrapper">
                      <label>Main Category:<span style={{ color: "red" }}> *

                        <LightTooltip placement="top" title="Select the most appropriate category for your product." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip>

                      </span></label>
                      <select
                        className="form-control custom-select"
                        name="maincategory"
                        value={formData.maincategory}
                        onChange={(e) => {
                          const value = e.target.value;
                          setSelectedMainCategory(value);
                          setSelectedCategory(""); // Reset category and subcategory when main changes
                          handleChange(e);
                        }}
                        required
                      >
                        <option value="">Select Main Category</option>
                        {Object.keys(categories)?.map((mainCat) => (
                          <option key={mainCat} value={mainCat}>{mainCat}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* CATEGORY */}
                {selectedMainCategory && (
                  <div className="col-lg-6">
                    <div className="form-group">
                      <div className="custom-select-wrapper">
                        <label>Category:<span style={{ color: "red" }}> *

                          <LightTooltip placement="top" title="Select the most appropriate category for your product." arrow>
                            <ErrorOutlineIcon className="errorout-icon" />
                          </LightTooltip>

                        </span></label>
                        <select
                          className="form-control custom-select"
                          name="category"
                          value={formData.category}
                          onChange={(e) => {
                            const value = e.target.value;
                            setSelectedCategory(value);
                            handleChange(e);
                          }}
                          required
                        >
                          <option value="">Select Category</option>
                          {Object.keys(categories[selectedMainCategory] || {}).map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* SUBCATEGORY */}
                {selectedCategory && (
                  <div className="col-lg-6">
                    <div className="form-group">
                      <div className="custom-select-wrapper">
                        <label>Sub category:<span style={{ color: "red" }}> *

                          <LightTooltip placement="top" title="Select the most appropriate category for your product." arrow>
                            <ErrorOutlineIcon className="errorout-icon" />
                          </LightTooltip>

                        </span></label>
                        <select
                          className="form-control custom-select"
                          name="subcategory"
                          value={formData.subcategory}
                          onChange={handleChange}
                          required
                        >
                          <option value="">Select Subcategory</option>
                          {(categories[selectedMainCategory]?.[selectedCategory] || []).map((sub) => (
                            <option key={sub} value={sub}>{sub}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                )}
                {formData.maincategory === "Food and Beverage Products" && (
                  <div className="col-lg-6">
                    <div className="form-group">
                      <label>FSSAI Number:<span style={{ color: "red" }}> *

                        <LightTooltip placement="top" title="Enter your FSSAI license number, required for food products in India." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip>

                      </span></label>
                      <input
                        type="text"
                        className="form-control"
                        name="fssai"
                        value={formData.fssai}
                        onChange={(e) => {
                          const onlyDigits = e.target.value.replace(/\D/g, ""); // Remove non-digits
                          setFormData((prev) => ({ ...prev, fssai: onlyDigits }));
                        }}
                        maxLength={14}
                        required
                      />

                    </div>
                  </div>
                )}
                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Brand:<span style={{ color: "red" }}> *

                    </span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      required
                      maxLength={30}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label>Condition:<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="Specify if the product is new, used, or refurbished." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </span></label>
                    <select
                      className="form-control"
                      name="condition"
                      value={formData.condition}
                      onChange={handleChange}
                      required
                    >
                      <option value="">Select Condition<span style={{ color: "red" }}>
                      </span></option>
                      <option value="New">New</option>
                      <option value="Unboxed">Unboxed</option>
                      <option value="Refurbished">Refurbished</option>
                    </select>
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label>Key Points:<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="Highlight key features or selling points of the product." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </span></label>
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

                <div className="col-12">
                  <div className="form-group">
                    <label>Does this product have variants?<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="List product variants like size, color, etc." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </span></label>
                    <select
                      className="form-control"
                      value={hasVariants}
                      onChange={e => setHasVariants(e.target.value === 'true')}
                      required
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                  {hasVariants && (
                    <>
                      <div className="form-group">
                        <label>What is the variant type?<span style={{ color: "red" }}> *

                          <LightTooltip placement="top" title="List product variants like size, color, etc." arrow>
                            <ErrorOutlineIcon className="errorout-icon" />
                          </LightTooltip>

                        </span></label>
                        <input
                          type="text"
                          className="form-control"
                          value={variantType}
                          onChange={e => setVariantType(e.target.value)}
                          placeholder="e.g., color, size"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>
                          How many variants?<span style={{ color: "red" }}> *
                            <LightTooltip placement="top" title="You can add up to 7 variants" arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>

                        <div className="d-flex align-items-center gap-2">
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              if (variantCount > 2) {
                                const newCount = variantCount - 1;
                                setVariantCount(newCount);
                                setVariantDetails(prev => prev.slice(0, newCount));
                              }
                            }}
                            disabled={variantCount <= 2}
                          >
                            −
                          </button>

                          <span className="px-3">{variantCount}</span>

                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={() => {
                              if (variantCount < 7) {
                                const newCount = variantCount + 1;
                                setVariantCount(newCount);
                                setVariantDetails(prev => [
                                  ...prev,
                                  {
                                    variantType: variantType,
                                    variantName: '',
                                    price: '',
                                    offPrice: '',
                                    stock: '',
                                    images: [],
                                  },
                                ]);
                              }
                            }}
                            disabled={variantCount >= 7}
                          >
                            +
                          </button>
                        </div>
                      </div>


                      {variantDetails.map((variant, index) => (
                        <div key={index} className="variant-section">
                          <h4>Variant {index + 1}</h4>
                          <div className="form-group">
                            <label>
                              {variantType.charAt(0).toUpperCase() +
                                variantType.slice(1)}
                              :
                            </label>
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
                            <label>Price:<span style={{ color: "red" }}> *</span></label>
                            <input
                              type="number"
                              className="form-control"
                              value={variant.price}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value !== '' &&
                                  /^[1-9][0-9]{0,4}$/.test(value) // ensures 1–99999 and not starting with 0
                                ) {
                                  handleVariantChange(index, 'price', value);
                                }
                              }}
                              required
                              inputMode="numeric"
                              min="1"
                              max="99999"
                              onWheel={(e) => e.target.blur()} // disables mouse wheel
                              onKeyDown={(e) => {
                                // Block "+", "-", ".", "e", arrow keys
                                if (
                                  ["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label>
                              Offer Price:<span style={{ color: "red" }}> *
                                <LightTooltip placement="top" title="Enter the discounted price (if any)." arrow>
                                  <ErrorOutlineIcon className="errorout-icon" />
                                </LightTooltip>
                              </span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={variant.offPrice}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value !== '' &&
                                  /^[1-9][0-9]{0,4}$/.test(value)
                                ) {
                                  handleVariantChange(index, 'offPrice', value);
                                }
                              }}
                              required
                              inputMode="numeric"
                              min="1"
                              max="99999"
                              onWheel={(e) => e.target.blur()} // disables mouse wheel
                              onKeyDown={(e) => {
                                // Block "+", "-", ".", "e", arrow keys
                                if (
                                  ["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>

                          <div className="form-group">
                            <label>
                              Stock:<span style={{ color: "red" }}> *
                                <LightTooltip placement="top" title="Enter the quantity currently in stock." arrow>
                                  <ErrorOutlineIcon className="errorout-icon" />
                                </LightTooltip>
                              </span>
                            </label>
                            <input
                              type="number"
                              className="form-control"
                              value={variant.stock}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (
                                  value !== '' &&
                                  /^[1-9][0-9]{0,4}$/.test(value) // ensures 1–99999
                                ) {
                                  handleVariantChange(index, 'stock', value);
                                }
                              }}
                              required
                              inputMode="numeric"
                              min="1"
                              max="99999"
                              onWheel={(e) => e.target.blur()} // disables mouse wheel
                              onKeyDown={(e) => {
                                // Block "+", "-", ".", "e", arrow keys
                                if (
                                  ["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)
                                ) {
                                  e.preventDefault();
                                }
                              }}
                            />
                          </div>
                          <div className="form-group">
                            <label>Images:<span style={{ color: "red" }}> *

                              <LightTooltip placement="top" title="Provide the images of the product." arrow>
                                <ErrorOutlineIcon className="errorout-icon" />
                              </LightTooltip>

                            </span></label>
                            <input
                              type="file"
                              className="form-control"
                              multiple
                              accept="image/*"
                              onChange={e => handleImageChange(index, e)}
                              required
                            />
                            {imageErrors.length > 0 && (
                              <div className="alert alert-danger mt-2">
                                {imageErrors.map((error, index) => (
                                  <p key={index}>{error}</p>
                                ))}
                              </div>
                            )}
                            <div className="mt-2">
                              {variant.images.map((image, imageIndex) => (
                                <div
                                  key={imageIndex}
                                  className="d-inline-block position-relative mr-5"
                                >
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${imageIndex}`}
                                    className="img-thumbnail"
                                    width="100 "
                                  />
                                  <button
                                    type="button"
                                    className="btn btn-danger btn-sm position-absolute top-0 right-0"
                                    onClick={() =>
                                      handleRemoveImage(index, imageIndex)
                                    }
                                  >
                                    &times;
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </>
                  )}
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Tax: (GST in %)<span style={{ color: "red" }}> *
                      <LightTooltip placement="top" title="Enter the applicable tax percentage or value." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>
                    </span></label>

                    <input
                      type="text"
                      className="form-control"
                      name="tax"
                      value={formData.tax}
                      onChange={(e) => {
                        let value = e.target.value.replace(/\D/g, "");

                        if (value.length > 2) value = value.slice(0, 2);
                        if (value.length > 1 && value.startsWith("0")) {
                          value = String(parseInt(value, 10));
                        }
                        if (value === "00") value = "0";
                        if (parseInt(value || "0", 10) > 99) value = "99";

                        // Still alert here to give immediate feedback
                        if (parseInt(value, 10) === 0) {
                          alert("Tax percentage must be greater than 0.");
                          return;
                        }

                        handleChange({ target: { name: "tax", value } });
                      }}
                      
                      required
                      onKeyDown={(e) => {
                        // Block "+", "-", ".", "e", arrow keys
                        if (["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      onWheel={(e) => e.target.blur()}
                    />
                  </div>
                </div>


                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Is Refundable:<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="Select whether this product can be refunded after purchase." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>


                    </span></label>
                    <select
                      className="form-control"
                      name="isRefundable"
                      value={formData.isRefundable}
                      onChange={handleChange}
                      required
                    >
                      <option value="false">No</option>
                      <option value="true">Yes</option>
                    </select>
                  </div>
                </div>

                {!hasVariants && (
                  <>
                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>
                          Maximum Retail Price (in ₹)<span style={{ color: "red" }}> *
                            <LightTooltip placement="top" title="Enter the selling price of the product between '1' to '99999'" arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          required
                          inputMode="numeric"
                          max="99999"
                          min="1"
                          onWheel={(e) => e.target.blur()} // disables mouse wheel
                          onKeyDown={(e) => {
                            // Block "+", "-", ".", "e", arrow keys
                            if (
                              ["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>


                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>
                          Offer Price (in ₹):<span style={{ color: "red" }}> *
                            <LightTooltip placement="top" title="Enter the discounted price (if any). between '1' to '99999'" arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="offPrice"
                          value={formData.offPrice}
                          onChange={handleChange}

                          required
                          inputMode="numeric"
                          max="99999"
                          min="1"
                          onWheel={(e) => e.target.blur()} // disables mouse wheel
                          onKeyDown={(e) => {
                            // Block "+", "-", ".", "e", arrow keys
                            if (
                              ["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>



                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>
                          Stock:<span style={{ color: "red" }}> *
                            <LightTooltip placement="top" title="Enter the quantity currently in stock.between '1' to '9999'" arrow>
                              <ErrorOutlineIcon className="errorout-icon" />
                            </LightTooltip>
                          </span>
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="stock"
                          value={formData.stock}
                          onChange={handleChange}
                          required
                          inputMode="numeric"
                          min="1"
                          max="9999"
                          onWheel={(e) => e.target.blur()} // disables mouse wheel
                          onKeyDown={(e) => {
                            // Block "+", "-", ".", "e", arrow keys
                            if (
                              ["e", "E", "+", "-", ".", "ArrowUp", "ArrowDown"].includes(e.key)
                            ) {
                              e.preventDefault();
                            }
                          }}
                        />
                      </div>
                    </div>


                    <div className="col-lg-6">
                      <div className="form-group">
                        <label>Product Images:<span style={{ color: "red" }}> *

                          <LightTooltip placement="top" title="Provide the images of the product." arrow>
                            <ErrorOutlineIcon className="errorout-icon" />
                          </LightTooltip>

                        </span></label>
                        <input
                          type="file"
                          className="form-control"
                          multiple
                          accept="image/*"
                          onChange={handleProductImageChange}
                          required
                        />
                        {imageErrors.length > 0 && (
                          <div className="alert alert-danger mt-2">
                            {imageErrors.map((error, index) => (
                              <p key={index}>{error}</p>
                            ))}
                          </div>
                        )}
                        <div className="mt-2">
                          {productImages.map((image, index) => (
                            <div
                              key={index}
                              className="d-inline-block position-relative mr-5"
                            >
                              <img
                                src={URL.createObjectURL(image)}
                                alt={`Preview ${index}`}
                                className="img-thumbnail"
                                width="100"
                              />
                              <button
                                type="button"
                                className="btn btn-danger btn-sm position-absolute top-0 right-0"
                                onClick={() =>
                                  handleRemoveProductImage(index)
                                }
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Item Model Number:
                      <LightTooltip placement="top" title="Provide the item’s model number, if available." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="itemModelNum"
                      value={formData.itemModelNum.toLocaleUpperCase()}
                      maxLength={15}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Product Code SKU:<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="Stock Keeping Unit – your internal tracking code for this product." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="sku"
                      value={formData.sku.toLocaleUpperCase()}
                      maxLength={15}
                      onChange={(e) => {
                        const input = e.target.value;

                        // Allow only A-Z, 0-9, hyphen (-), underscore (_)
                        const sanitized = input.replace(/[^A-Z0-9-_]/gi, '');

                        // Update the state
                        handleChange({
                          target: {
                            name: 'sku',
                            value: sanitized.toUpperCase()
                          }
                        });
                      }}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>UPC:

                      <LightTooltip placement="top" title="Universal Product Code – used for barcode identification." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="upc"
                      value={formData.upc.toLocaleUpperCase()}
                      maxLength={12}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>HSN Code:<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="HSN code for GST classification of your product." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="hsn"
                      value={formData.hsn.toLocaleUpperCase()}
                      maxLength={8}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <div className="custom-select-wrapper">
                      <label>Country of Origin:<span style={{ color: "red" }}> *

                        <LightTooltip placement="top" title="Enter the country where the product was manufactured or produced." arrow>
                          <ErrorOutlineIcon className="errorout-icon" />
                        </LightTooltip>

                      </span></label>
                      <select
                        className="form-control custom-select"
                        name="countryofOrgin"
                        value={formData.countryofOrgin}
                        onChange={handleChange}
                        required
                      >
                        {[
                          "India",
                          "United States",
                          "United Kingdom",
                          "China",
                          "Germany",
                          "France",
                          "Japan",
                          "Australia",
                          "Canada",
                          "Brazil",
                          "Italy",
                          "South Korea",
                          "Singapore",
                          "UAE",
                          "South Africa"
                        ].map((country) => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Manufacture Details:

                      <LightTooltip placement="top" title="Enter the country where the product was manufactured or produced." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="manufactureDetails"
                      value={formData.manufactureDetails}
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Product Certifications:

                      <LightTooltip placement="top" title="List any certifications (e.g., ISO, CE, Organic) your product has." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>


                    </label>
                    <input
                      type="text"
                      className="form-control"
                      name="productCertifications"
                      value={formData.productCertifications}
                      onChange={handleChange}
                      maxLength={50}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Item Length in Centimeters:<span style={{ color: "red" }}> *
                    </span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="itemLength"
                      value={formData.itemLength}
                      onChange={handleChange}
                      required
                      min="0.01"
                      max="9999"
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const rounded = Math.round(parseFloat(e.target.value) * 10) / 10;
                        const updatedValue = isNaN(rounded) ? "" : rounded;

                        // Update your formData state with rounded value
                        setFormData(prev => ({
                          ...prev,
                          itemLength: updatedValue,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Item Height in Centimeters:<span style={{ color: "red" }}> *
                    </span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="itemHeight"
                      value={formData.itemHeight}
                      onChange={handleChange}
                      min="0.01"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const rounded = Math.round(parseFloat(e.target.value) * 10) / 10;
                        const updatedValue = isNaN(rounded) ? "" : rounded;

                        // Update your formData state with rounded value
                        setFormData(prev => ({
                          ...prev,
                          itemHeight: updatedValue,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-lg-6">
                  <div className="form-group">
                    <label>Item Weight in kgs:<span style={{ color: "red" }}> *
                    </span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="itemWeight"
                      value={formData.itemWeight}
                      onChange={handleChange}
                      min="0.01"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const rounded = Math.round(parseFloat(e.target.value) * 10) / 10;
                        const updatedValue = isNaN(rounded) ? "" : rounded;

                        // Update your formData state with rounded value
                        setFormData(prev => ({
                          ...prev,
                          itemWeight: updatedValue,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-12">
                  <div className="form-group">
                    <label>Item Width in Centimeters<span style={{ color: "red" }}> *
                    </span></label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control"
                      name="itemWidth"
                      value={formData.itemWidth}
                      onChange={handleChange}
                      min="0.01"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const rounded = Math.round(parseFloat(e.target.value) * 10) / 10;
                        const updatedValue = isNaN(rounded) ? "" : rounded;

                        // Update your formData state with rounded value
                        setFormData(prev => ({
                          ...prev,
                          itemWidth: updatedValue,
                        }));
                      }}
                    />
                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Minimum Order QTY(MOQ):<span style={{ color: "red" }}> *

                      <LightTooltip placement="top" title="Minimum Order Quantity – smallest amount a buyer can purchase." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>

                    </span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="moq"
                      value={formData.moq}
                      onChange={handleChange}
                      min="1"
                      max="1000"
                      required
                      onKeyDown={(e) => {
                        // Allow only digits and basic navigation keys
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight"].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        let value = parseInt(e.target.value, 10);

                        if (isNaN(value) || value < 1) {
                          value = 1;
                        } else if (value > 1000) {
                          value = 1000;
                        }

                        setFormData((prev) => ({
                          ...prev,
                          moq: value,
                        }));
                      }}
                    />

                  </div>
                </div>

                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost local (in ₹) (Based on pincode):<span style={{ color: "red" }}> *
                    </span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostlol"
                      value={formData.shippingCostlol}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost North India (in ₹):<span style={{ color: "red" }}> *</span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostNorth"
                      value={formData.shippingCostNorth}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost South India (in ₹):<span style={{ color: "red" }}> *</span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostSouth"
                      value={formData.shippingCostSouth}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost East India (in ₹):<span style={{ color: "red" }}> *</span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostEast"
                      value={formData.shippingCostEast}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost West India (in ₹):<span style={{ color: "red" }}> *</span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostWest"
                      value={formData.shippingCostWest}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost North east India (in ₹):<span style={{ color: "red" }}> * </span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostNe"
                      value={formData.shippingCostNe}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Shipping Cost central India (in ₹):<span style={{ color: "red" }}> * </span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="shippingCostCentral"
                      value={formData.shippingCostCentral}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Additional Shipping Cost for each Item (in ₹):<span style={{ color: "red" }}> * </span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="additionalShippingCost"
                      value={formData.additionalShippingCost}
                      onChange={handleChange}
                      min="0"
                      max="9999"
                      required
                      onKeyDown={(e) => {
                        // Allow: Backspace, Tab, Delete, arrows, numbers, dot
                        if (
                          !(
                            (e.key >= "0" && e.key <= "9") ||
                            ["Backspace", "Tab", "Delete", "ArrowLeft", "ArrowRight", "."].includes(e.key)
                          )
                        ) {
                          e.preventDefault();
                        }

                        // Prevent multiple dots
                        if (e.key === "." && e.target.value.includes(".")) {
                          e.preventDefault();
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="form-group">
                    <label>Unit (EA/ML/Set)<span style={{ color: "red" }}> *
                      <LightTooltip placement="top" title="Specify the unit of measurement (e.g., kg, piece, liter)." arrow>
                        <ErrorOutlineIcon className="errorout-icon" />
                      </LightTooltip>
                    </span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="unit"
                      value={formData.unit.toLocaleUpperCase()}
                      onChange={(e) => {
                        const value = e.target.value.toUpperCase();
                        // Allow only letters, max length 5
                        if (/^[A-Z]{0,5}$/.test(value)) {
                          setFormData((prev) => ({ ...prev, unit: value }));
                        }
                      }}
                      required
                    />

                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'end' }}>
                  <button
                    type="submit"
                    className="btn mt-3"
                    style={{ backgroundColor: '#ffad63', color: '#fff' }}
                  >
                    Create Product
                  </button>
                </div>
              </div>
            </form>



          </div>
        </div>
      </section>
    </>
  );
};

export default SellerCreateProduct;
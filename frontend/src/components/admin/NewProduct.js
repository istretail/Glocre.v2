import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { createNewProduct, getCategoryHierarchy } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import './newproduct.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const NewProduct = () => {
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
        shippingCostWest: "",
        shippingCostNe: "",
        unit: "",
    });
    const { loading, isProductCreated, error } = useSelector(state => state.productState);
    const { categories = [] } = useSelector(state => state.productsState);
    const [hasVariants, setHasVariants] = useState(false);
    const [variantType, setVariantType] = useState("");
    const [variantCount, setVariantCount] = useState(0);
    const [variantDetails, setVariantDetails] = useState([]);
    const [imageErrors, setImageErrors] = useState([]);
    const [productImages, setProductImages] = useState([]);
    const [selectedMainCategory, setSelectedMainCategory] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            newVariants[index] = { ...newVariants[index], [name]: value };
            return newVariants;
        });
    };

    // Handle image upload
    const handleImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const validImages = files.filter((file) => file.size <= 1024 * 1024);
        const errors = files.filter((file) => file.size > 1024 * 1024).map((file) => `${file.name} is larger than 1MB`);

        setImageErrors(errors);

        if (validImages.length > 0) {
            setVariantDetails((prevVariants) => {
                const newVariants = [...prevVariants];
                if (!newVariants[index]) {
                    newVariants[index] = {};
                }
                newVariants[index].images = validImages;
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
    const handleProductImageChange = (e) => {
        const files = Array.from(e.target.files);
        setProductImages(files);
    };
    // Submit the form

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

    const handleSubmit = (e) => {
        e.preventDefault();

        if (imageErrors.length > 0) {
            alert("Please fix the image errors before submitting.");
            return;
        }

        const filledPoints = formData.keyPoints.filter(point => point.trim() !== "");

        if (filledPoints.length < 3) {
            console.log(filledPoints.length);
            toast.error("Please provide at least 3 key points.");
            return;
        }

        // Proceed with form submission
        console.log("Form submitted with:", filledPoints);

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



        // Append variants as a JSON string
        productData.append('variants', JSON.stringify(variantDetails));

        // Append variant images
        variantDetails.forEach((variant, variantIndex) => {
            if (variant.images) {
                variant.images.forEach((imageFile) => {
                    productData.append(`variants[${variantIndex}][images]`, imageFile);
                });
            }
        });
        // Append product images if no variants
        if (!hasVariants) {
            productImages.forEach((imageFile) => {
                productData.append('images', imageFile);
            });
        }
        // Log the FormData entries
        for (let pair of productData.entries()) {
            console.log(pair[0] + ': ' + pair[1]);
        }

        // Dispatch action to add product
        dispatch(createNewProduct(productData));
    };
    useEffect(() => {
        if (isProductCreated) {
            toast('Product Created Successfully!', {
                type: 'success',
                onOpen: () => dispatch(clearProductCreated())
            });
            navigate('/admin/products');
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
            <section className="newprod-section">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 newprod-right-glc">

                        <div className="mobile-logo">
                            <img src={require("../../images/procure-g-logo.png")} />
                        </div>

                        <div className="breadcrumbWrapperr">

                            {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
                            {isMobile ? (
                                <div className="row mobile-topbar">
                                    <div className="col-10">
                                        <ul className="breadcrumb breadcrumb2 mb-0">
                                            <li>
                                                <Link to="/admin/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                                            </li>
                                            <li>Create Product</li>
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
                                                <Link to="/admin/dashboard">Dashboard</Link>
                                            </li>
                                            <li>Create Product</li>
                                        </ul>
                                    </div>
                                    <div className="col-lg-7 col-md-6" style={{ display: "flex", justifyContent: "end", alignItems: "end" }}>
                                        <div className="dash-cont-glc">
                                            <div className="row">
                                                <div className="topnav">
                                                    <div className="search-container">
                                                        <form className="d-flex">
                                                            <input type="text" placeholder="Search" name="search" />
                                                            <button type="submit">
                                                                <FontAwesomeIcon icon={faSearch} />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-1 col-md-2 dash-cont-glc" style={{ display: "flex", justifyContent: "center" }}>
                                        <Dropdown className="d-inline">
                                            <Dropdown.Toggle
                                                variant="default text-white"
                                                id="dropdown-basic"
                                                className="text-dark dropdown1 icon-list-filter-procureg"
                                                style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
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
                                                <input type="text" placeholder="Search" name="search" />
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
                                                style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
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
                            <Drawer open={isDrawerOpen} onClose={toggleDrawer} direction="right" className="drawer">
                                <div className="drawer-header">
                                    ADMIN DASHBOARD
                                    {/* <button className="drawer-close-btn" onClick={toggleDrawer}>&times;</button> */}
                                </div>
                                <div className="drawer-content">
                                    <ul className="drawer-links">
                                        <li><Link to="/admin/dashboard"><FontAwesomeIcon icon={faDashboard} /> &nbsp;Dashboard</Link></li>
                                        <li><Link to="/admin/products"><FontAwesomeIcon icon={faCartShopping} /> &nbsp;Product List</Link></li>
                                        <li><Link to="/admin/products/create"><FontAwesomeIcon icon={faShoppingBag} /> &nbsp;Create Product</Link></li>
                                        <li><Link to="/admin/orders"><FontAwesomeIcon icon={faSort} /> &nbsp;Order List</Link></li>
                                        <li><Link to="/admin/users"><FontAwesomeIcon icon={faUserPlus} /> &nbsp;User List</Link></li>
                                        <li><Link to="/admin/reviews"><FontAwesomeIcon icon={faPencil} /> &nbsp;Review List</Link></li>
                                    </ul>
                                </div>
                            </Drawer>

                        </div>


                        <h3 style={{ color: "#ffad63", marginTop: "40px" }}>CREATE NEW PRODUCT</h3>

                        <Fragment>
                            <form onSubmit={handleSubmit}>
                                <div className="row">
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Product Name:<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                 maxlength="80"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Description:<span style={{ color: "red" }}> *
                                                <LightTooltip title="Describe what the product is, what it does, and who it's for." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip></span></label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* MAIN CATEGORY */}
                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <div className="custom-select-wrapper">

                                                <label>Main Category:<span style={{ color: "red" }}> *
                                                    <LightTooltip title="Select the most appropriate category for your product." arrow>
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
                                                        <LightTooltip title="Select the most appropriate category for your product." arrow>
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
                                                        <LightTooltip title="Select the most appropriate category for your product." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip></span></label>
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
                                                    <LightTooltip title="Enter your FSSAI license number, required for food products in India." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip></span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    name="fssai"
                                                    value={formData.fssai.to}
                                                    onChange={handleChange}
                                                    maxLength={14}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    )}

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Brand:<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                                required

                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Condition:<span style={{ color: "red" }}> *
                                                <LightTooltip title="Specify if the product is new, used, or refurbished." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip></span></label>
                                            <select
                                                className="form-control"
                                                name="condition"
                                                value={formData.condition}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Condition<span style={{ color: "red" }}> *
                                                    <LightTooltip title="Provide the manufacturer’s model number, if available." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip></span></option>
                                                <option value="New">New</option>
                                                <option value="Unboxed">Unboxed</option>
                                                <option value="Refurbished">Refurbished</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Key Points:<span style={{ color: "red" }}> *
                                                <LightTooltip title="Highlight key features or selling points of the product." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip></span></label>
                                            {formData.keyPoints.map((point, index) => (

                                                <div key={index} className="d-flex mb-2">

                                                    <input
                                                        type="text"
                                                        className="form-control me-2"
                                                        value={point}
                                                        onChange={(e) => handleKeyPointsChange(index, e.target.value)}
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
                                            <label>Does this product have variants?
                                                <LightTooltip title="List product variants like size, color, etc." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </label>
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
                                                        <LightTooltip title="List product variants like size, color, etc." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip></span></label>
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
                                                    <label>How many variants?<span style={{ color: "red" }}> *
                                                        <LightTooltip title="List product variants like size, color, etc." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip></span></label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={variantCount}
                                                        onChange={e => {
                                                            const count = Number(e.target.value); // Ensure it's a number
                                                            setVariantCount(count);
                                                            setVariantDetails(
                                                                Array.from({ length: count }, () => ({
                                                                    variantType: variantType,
                                                                    variantName: '',
                                                                    price: '',
                                                                    offPrice: '',
                                                                    stock: '',
                                                                    images: [],
                                                                }))
                                                            );
                                                        }}
                                                        required
                                                    />
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
                                                            <label>Offer Price:<span style={{ color: "red" }}> *
                                                                <LightTooltip title="Enter the discounted price (if any)." arrow>
                                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                                </LightTooltip>
                                                            </span></label>
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
                                                                </LightTooltip>
                                                            </span></label>
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
                                                                </LightTooltip>
                                                            </span></label>
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={e => handleImageChange(index, e)}
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
                                                                        className="d-inline-block position-relative mr-2"
                                                                    >
                                                                        <img
                                                                            src={URL.createObjectURL(image)}
                                                                            alt={`Preview ${imageIndex}`}
                                                                            className="img-thumbnail"
                                                                            width="100"
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
                                            <label>Tax:(GST in %)<span style={{ color: "red" }}> *
                                                <LightTooltip title="Enter the applicable tax percentage or value." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="tax"
                                                value={formData.tax}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Is Refundable:<span style={{ color: "red" }}> *
                                                <LightTooltip title="Select whether this product can be refunded after purchase." arrow>
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
                                            <div className="row">
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Maximum Retail Price (in '₹'):<span style={{ color: "red" }}> *</span></label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="price"
                                                            value={formData.price}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Offer Price (in '₹'):<span style={{ color: "red" }}> *
                                                            <LightTooltip title="Provide the manufacturer’s model number, if available." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </span></label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="offPrice"
                                                            value={formData.offPrice}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>No Of Stock:<span style={{ color: "red" }}> *
                                                            <LightTooltip title="Enter the quantity currently in stock." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </span></label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            name="stock"
                                                            value={formData.stock}
                                                            onChange={handleChange}
                                                            required
                                                        />
                                                    </div>
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Product Images:<span style={{ color: "red" }}> *
                                                            <LightTooltip title="Provide the manufacturer’s model number, if available." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </span></label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={handleProductImageChange}
                                                        // required
                                                        />
                                                        <div className="mt-2">
                                                            {productImages.map((image, index) => (
                                                                <div
                                                                    key={index}
                                                                    className="d-inline-block position-relative mr-2"
                                                                >
                                                                    <img
                                                                        src={URL.createObjectURL(image)}
                                                                        alt={`Preview ${index}`}
                                                                        className="img-thumbnail"
                                                                        width="100"
                                                                    />
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Item Model Number:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="itemModelNum"
                                                value={formData.itemModelNum}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Product Code SKU:<span style={{ color: "red" }}> *
                                                <LightTooltip title="Stock Keeping Unit – your internal tracking code for this product." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="sku"
                                                value={formData.sku}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>UPC:
                                                <LightTooltip title="Universal Product Code – used for barcode identification." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="upc"
                                                value={formData.upc}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>HSN code:<span style={{ color: "red" }}> *
                                                <LightTooltip title="HSN code for GST classification of your product." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="hsn"
                                                value={formData.hsn}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <div className="custom-select-wrapper custom-select">
                                                <label>Country of Origin:<span style={{ color: "red" }}> *
                                                    <LightTooltip title="Enter the country where the product was manufactured or produced." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip>
                                                </span></label>
                                                <select
                                                    className="form-control"
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
                                                <LightTooltip title="Enter the country where the product was manufactured or produced." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="manufactureDetails"
                                                value={formData.manufactureDetails}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Product Certifications:
                                                <LightTooltip title="List any certifications (e.g., ISO, CE, Organic) your product has." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="productCertifications"
                                                value={formData.productCertifications}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Item Length in Centimeters:<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="itemLength"
                                                value={formData.itemLength}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Item Height in Centimeters:<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="itemHeight"
                                                value={formData.itemHeight}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Item Weight in Kgs:<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="itemWeight"
                                                value={formData.itemWeight}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Item Width in Centimeters:<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="itemWidth"
                                                value={formData.itemWidth}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Minimum Order QTY(MOQ):<span style={{ color: "red" }}> *
                                                <LightTooltip title="Minimum Order Quantity – smallest amount a buyer can purchase." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip>
                                            </span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="moq"
                                                value={formData.moq}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Shipping Cost local (in '₹')(based on seller pincode):<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="shippingCostlol"
                                                value={formData.shippingCostlol}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Shipping Cost North India (in '₹'):<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="shippingCostNorth"
                                                value={formData.shippingCostNorth}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Shipping Cost South India (in '₹'):<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="shippingCostSouth"
                                                value={formData.shippingCostSouth}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Shipping Cost East India (in '₹'):<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="shippingCostEast"
                                                value={formData.shippingCostEast}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Shipping Cost West India (in '₹'):<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="shippingCostWest"
                                                value={formData.shippingCostWest}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Shipping Cost North east India (in '₹'):<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="number"
                                                className="form-control"
                                                name="shippingCostNe"
                                                value={formData.shippingCostNe}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Unit(EA/ML/Set)<span style={{ color: "red" }}> *</span></label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="unit"
                                                value={formData.unit}
                                                onChange={handleChange}
                                                required
                                                maxLength={10}
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
                        </Fragment>

                    </div>
                </div>
            </section>
        </>

    );
};

export default NewProduct;
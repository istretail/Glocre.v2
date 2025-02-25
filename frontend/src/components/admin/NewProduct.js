import { Fragment, useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";
import { createNewProduct } from "../../actions/productActions";
import { clearError, clearProductCreated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import Sidebar from "./Sidebar";
import './newproduct.css'
import avatar1 from '../../images/OIP.jpg'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';

const NewProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        maincategory: "",
        category: "",
        subcategory: "",
        brand: "",
        condition: "",
        keyPoints: ["", "", "", "", ""],
        variants: [],
        tax: "",
        itemModelNum: "",
        serialNum: "",
        connectionType: "",
        hardwarePlatform: "",
        os: "",
        powerConception: "",
        batteries: "",
        packageDimension: "",
        portDescription: "",
        connectivityType: "",
        compatibleDevices: "",
        powerSource: "",
        specialFeatures: "",
        includedInThePackage: "",
        manufacturer: "",
        itemSize: "",
        itemWidth: "",
        isRefundable: "false",
        price: "",
        offPrice: "",
        stock: "",

    });
    const { loading, isProductCreated, error } = useSelector(state => state.productState);
    const [hasVariants, setHasVariants] = useState(false);
    const [variantType, setVariantType] = useState("");
    const [variantCount, setVariantCount] = useState(0);
    const [variantDetails, setVariantDetails] = useState([]);
    const [imageErrors, setImageErrors] = useState([]);
    const [productImages, setProductImages] = useState([]);
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
    const handleSubmit = (e) => {
        e.preventDefault();

        if (imageErrors.length > 0) {
            alert("Please fix the image errors before submitting.");
            return;
        }

        const filledPoints = formData.keyPoints.filter(point => point.trim() !== "");

        if (filledPoints.length > 3) {
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

        if (formData.keyPoints.length > 3) {
            toast.error("Give atleast 3 points");
            return;
        }

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


    return (
        <>
            <section className="newprod-section">
                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 newprod-right-glc">

                        <div className="mobile-logo">
                             <img src={require("../../images/procure-g-logo.png")}/>
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
                                    <div className="col-lg-1 col-md-2 dash-cont-glc">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div>
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
                                    <div className="col-2 text-center">
                                        <img src={avatar1} alt="Avatar" className="avatar" />
                                    </div>
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
                        <p>Glocre</p>

                        <Fragment>
                            <form onSubmit={handleSubmit}>
                                <div className="row">

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Product Name:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Description:</label>
                                            <textarea
                                                className="form-control"
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Main Category:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="maincategory"
                                                value={formData.maincategory}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Category:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Subcategory:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="subcategory"
                                                value={formData.subcategory}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Brand:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="brand"
                                                value={formData.brand}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Condition:</label>
                                            <select
                                                className="form-control"
                                                name="condition"
                                                value={formData.condition}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Condition</option>
                                                <option value="New">New</option>
                                                <option value="Unboxed">Unboxed</option>
                                                <option value="Refurbished">Refurbished</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-12">
                                        <div className="form-group">
                                            <label>Key Points:</label>
                                            {formData.keyPoints.map((point, index) => (
                                                <input
                                                    key={index}
                                                    type="text"
                                                    className="form-control mb-2"
                                                    value={point}
                                                    onChange={(e) => handleKeyPointsChange(index, e.target.value)}
                                                    required
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Does this product have variants?</label>
                                            <select
                                                className="form-control"
                                                value={hasVariants}
                                                onChange={(e) => setHasVariants(e.target.value === "true")}
                                                required
                                            >
                                                <option value="false">No</option>
                                                <option value="true">Yes</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        {hasVariants && (
                                            <>
                                                <div className="form-group">
                                                    <label>What is the variant type?</label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        value={variantType}
                                                        onChange={(e) => setVariantType(e.target.value)}
                                                        placeholder="e.g., color, size"
                                                        required
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>How many variants?</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        value={variantCount}
                                                        onChange={(e) => {
                                                            const count = Number(e.target.value); // Ensure it's a number
                                                            setVariantCount(count);
                                                            setVariantDetails(
                                                                Array.from({ length: count }, () => ({
                                                                    variantType: variantType,
                                                                    variantName: "",
                                                                    price: "",
                                                                    offPrice: "",
                                                                    stock: "",
                                                                    images: []
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
                                                            <label>{variantType.charAt(0).toUpperCase() + variantType.slice(1)}:</label>
                                                            <input
                                                                type="text"
                                                                className="form-control"
                                                                value={variant.variantName}
                                                                onChange={(e) => handleVariantChange(index, "variantName", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Price:</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={variant.price}
                                                                onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Offer Price:</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={variant.offPrice}
                                                                onChange={(e) => handleVariantChange(index, "offPrice", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Stock:</label>
                                                            <input
                                                                type="number"
                                                                className="form-control"
                                                                value={variant.stock}
                                                                onChange={(e) => handleVariantChange(index, "stock", e.target.value)}
                                                                required
                                                            />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Images:</label>
                                                            <input
                                                                type="file"
                                                                className="form-control"
                                                                multiple
                                                                accept="image/*"
                                                                onChange={(e) => handleImageChange(index, e)}
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
                                                                            onClick={() => handleRemoveImage(index, imageIndex)}
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
                                            <label>Tax:</label>
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
                                            <label>Is Refundable:</label>
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

                                    <div className="row">
                                        {!hasVariants && (
                                            <>
                                                <div className="form-group col-lg-6">
                                                    <label>Price:</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group col-lg-6">
                                                    <label>Offer Price:</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="offPrice"
                                                        value={formData.offPrice}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group col-lg-6">
                                                    <label>Stock:</label>
                                                    <input
                                                        type="number"
                                                        className="form-control"
                                                        name="stock"
                                                        value={formData.stock}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>

                                                <div className="form-group col-lg-6">
                                                    <label>Product Images:</label>
                                                    <input
                                                        type="file"
                                                        className="form-control"
                                                        multiple
                                                        accept="image/*"
                                                        onChange={handleProductImageChange}
                                                    />
                                                    <div className="mt-2">
                                                        {productImages.map((image, index) => (
                                                            <div key={index} className="d-inline-block position-relative mr-2">
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
                                            </>
                                        )}
                                    </div>

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
                                            <label>Serial Number:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="serialNum"
                                                value={formData.serialNum}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Connection Type:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="connectionType"
                                                value={formData.connectionType}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Hardware Platform:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="hardwarePlatform"
                                                value={formData.hardwarePlatform}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Operating System:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="os"
                                                value={formData.os}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Power Conception:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="powerConception"
                                                value={formData.powerConception}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Batteries:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="batteries"
                                                value={formData.batteries}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Package Dimension:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="packageDimension"
                                                value={formData.packageDimension}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Port Description:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="portDescription"
                                                value={formData.portDescription}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Connectivity Type:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="connectivityType"
                                                value={formData.connectivityType}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Compatible Devices:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="compatibleDevices"
                                                value={formData.compatibleDevices}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Power Source:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="powerSource"
                                                value={formData.powerSource}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-4">
                                        <div className="form-group">
                                            <label>Special Features:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="specialFeatures"
                                                value={formData.specialFeatures}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Included in the Package:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="includedInThePackage"
                                                value={formData.includedInThePackage}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Manufacturer:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="manufacturer"
                                                value={formData.manufacturer}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Item Size:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="itemSize"
                                                value={formData.itemSize}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="col-lg-6">
                                        <div className="form-group">
                                            <label>Item Width:</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="itemWidth"
                                                value={formData.itemWidth}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                </div>

                                <div className="d-flex justify-content-end mt-3 mb-5">
                                    <button type="submit" className="btn" style={{ backgroundColor: "#ffad63", color: "#fff" }}>
                                        Create Product
                                    </button>
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
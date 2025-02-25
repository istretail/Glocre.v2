import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getAdminProducts, updateProduct } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import avatar1 from '../../images/OIP.jpg'
import { Link } from "react-router-dom";
import { faCartShopping, faCheck, faMoneyBillTrendUp, faUpload, faUser, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown, DropdownButton, Image } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';

export default function UpdateProduct() {
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
        stock: "",
        condition: "",
        brand: "",
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
        status: "",
        manufacturer: "",
        itemSize: "",
        itemWidth: "",
        isRefundable: "false", // Add this line
        clocreId: "", // Add this line
    });

    const { id: productId } = useParams();
    const { loading, error, products } = useSelector(state => state.productsState);
    const { isProductUpdated, } = useSelector(state => state.productState);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState([]);
    const [imageErrors, setImageErrors] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState("");
    const [rejectionReason, setRejectionReason] = useState('');
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



    const handleRemoveImage = (index) => {
        const newImages = formData.images.filter((_, i) => i !== index);
        const newImageFiles = imageFiles.filter((_, i) => i !== index);
        setFormData({ ...formData, images: newImages });
        setImageFiles(newImageFiles);
        setImagesPreview(newImages);
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
            navigate('/admin/products');
            return;
        }

        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(updateProduct(error.message)) }
            });
            return;
        }

        dispatch(getAdminProducts(productId));
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
        if (products && products.length > 0) {
            const product = products.find(p => p._id === productId);
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
                    stock: product.stock,
                    condition: product.condition,
                    brand: product.brand,
                    itemModelNum: product.itemModelNum,
                    serialNum: product.serialNum,
                    connectionType: product.connectionType,
                    hardwarePlatform: product.hardwarePlatform,
                    os: product.os,
                    powerConception: product.powerConception,
                    batteries: product.batteries,
                    packageDimension: product.packageDimension,
                    portDescription: product.portDescription,
                    connectivityType: product.connectivityType,
                    compatibleDevices: product.compatibleDevices,
                    powerSource: product.powerSource,
                    specialFeatures: product.specialFeatures,
                    includedInThePackage: product.includedInThePackage,
                    manufacturer: product.manufacturer,
                    itemSize: product.itemSize,
                    itemWidth: product.itemWidth,
                    status: product.status,
                    isRefundable: product.isRefundable ? "true" : "false",
                    clocreId: product.clocreId,
                });
                setVariantDetails(product.variants);
                setHasVariants(product.variants.length > 0);
                setImagesPreview(product.images);
            }
        }
    }, [products, productId]);

    const openModal = (image) => {
        setModalImage(image);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalImage("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageErrors.length > 0) {
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

            if (variant.images && variant.images.length > 0) {
                variant.images.forEach((file, i) => {
                    productData.append(`variants[${index}][images]`, file);
                });
            } else {
                // Preserve existing images if no new ones are uploaded
                productData.append(`variants[${index}][existingImages]`, JSON.stringify(variant.existingImages || []));
            }
        });

        if (formData.status === 'rejected') {
            productData.append('rejectionReason', rejectionReason);
        }

        try {
            await dispatch(updateProduct(productId, productData));
        } catch (error) {
            toast(error.message, {
                type: 'error',
            });
        }
    };


    // console.log("Variant Details before submitting:", variantDetails);
    // console.log("Final Variant Data:", variantDetails);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];
        const errors = [];

        files.forEach((file) => {
            if (file.size > 1024 * 1024) {
                errors.push(`${file.name} is larger than 1MB`);
            }
            if (formData.images.length + files.length > 3) {
                errors.push(["You can upload a maximum of 3 images."]);
            } else {
                newImages.push(file);
            }
        });

        setImageErrors(errors);
        if (errors.length === 0) {
            setImageFiles(newImages);
            setFormData({
                ...formData,
                images: newImages.map((file) => URL.createObjectURL(file)),
            });
            setImagesPreview(newImages.map((file) => URL.createObjectURL(file)));
        }
    };


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
            <section className="updateprod-section">

                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 ">
                        <div className="mobile-logo">
                                <img src={require("../../images/procure-g-logo.png")}/>
                        </div>

                        <Fragment>
                            <div className="wrapper">

                                <div className="breadcrumbWrapperr">

                                    {/* Breadcrumbs & Menu Icon Row (For Mobile) */}
                                    {isMobile ? (
                                        <div className="row mobile-topbar">
                                            <div className="col-10">
                                                <ul className="breadcrumb breadcrumb2 mb-0">
                                                    <li>
                                                        <Link to="/admin/dashboard" style={{ color: "#fff" }}>Dashboard</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/admin/products" style={{ color: "#fff" }}>Product List</Link>
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
                                                        <Link to="/admin/dashboard">Dashboard</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/admin/products">Product List</Link>
                                                    </li>
                                                    <li>Update Product</li>
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
                                            <div className="col-lg-1 col-md-2 dash-cont-glc" style={{ display: "flex", justifyContent: "center", alignItems: "end" }}>
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

                                <form onSubmit={handleSubmit} className="updateproduct-right-glc" encType='multipart/form-data'>

                                    <h3 style={{ color: "#ffad63", marginTop: "40px" }}>UPDATE PRODUCT</h3>
                                    <p>Glocre</p>

                                    <div className="row">

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="name_field">Name</label>
                                                <input
                                                    type="text"
                                                    id="name_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.name}
                                                    name="name"
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description_field">Description</label>
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
                                                <label htmlFor="maincategory">Main Category</label>
                                                <input
                                                    type="text"
                                                    id="maincategory"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.maincategory}
                                                    name="maincategory"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="category_field">Category</label>
                                                <input
                                                    type="text"
                                                    id="category_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.category}
                                                    name="category"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="subcategory_field">Sub Category</label>
                                                <input
                                                    type="text"
                                                    id="subcategory_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.subcategory}
                                                    name="subcategory"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="tax_field">Tax</label>
                                                <input
                                                    type="text"
                                                    id="tax_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.tax}
                                                    name="tax"
                                                />
                                            </div>
                                        </div>

                                        {!hasVariants && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="price_field">Price</label>
                                                    <input
                                                        type="number"
                                                        id="price_field"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        value={formData.price}
                                                        name="price"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="offPrice_field">Offer Price</label>
                                                    <input
                                                        type="number"
                                                        id="offPrice_field"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        value={formData.offPrice}
                                                        name="offPrice"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label htmlFor="stock_field">Stock</label>
                                                    <input
                                                        type="number"
                                                        id="stock_field"
                                                        className="form-control"
                                                        onChange={handleChange}
                                                        value={formData.stock}
                                                        name="stock"
                                                    />
                                                </div>

                                                <div className="form-group">
                                                    <label>Images</label>
                                                    <div className='custom-file'>
                                                        <input
                                                            type='file'
                                                            name='product_images'
                                                            className='custom-file-input'
                                                            id='customFile'
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageChange}
                                                        />
                                                        <label className='custom-file-label' htmlFor='customFile'>
                                                            Choose Images
                                                        </label>
                                                    </div>
                                                    {imageErrors.length > 0 && (
                                                        <div className="alert alert-danger mt-2">
                                                            {imageErrors.map((error, index) => (
                                                                <p key={index}>{error}</p>
                                                            ))}
                                                        </div>
                                                    )}
                                                    {formData.images.length > 0 && (
                                                        <span
                                                            className="mr-2"
                                                            onClick={clearImagesHandler}
                                                            style={{ cursor: "pointer" }}
                                                        >
                                                            <i className="fa fa-trash"></i>
                                                        </span>
                                                    )}
                                                    {formData.images.map((image, index) => (
                                                        <img
                                                            className="mt-3 mr-2"
                                                            key={index}
                                                            src={image}
                                                            alt={`Image Preview`}
                                                            width="55"
                                                            height="52"
                                                            onClick={() => openModal(image)}
                                                            style={{ cursor: "pointer" }}
                                                        />
                                                    ))}
                                                </div>
                                            </>
                                        )}

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="condition_field">Condition</label>
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
                                                <label htmlFor="isRefundable_field">Is Refundable</label>
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
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label htmlFor="brand_field">Brand</label>
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
                                        {variantDetails.map((variant, index) => (
                                            <div key={index} className="variant-section row">
                                                <h4>Variant {index + 1}</h4>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Variant Type:</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={variant.variantType}
                                                            onChange={(e) => handleVariantChange(index, "variantType", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Variant Name:</label>
                                                        <input
                                                            type="text"
                                                            className="form-control"
                                                            value={variant.variantName}
                                                            onChange={(e) => handleVariantChange(index, "variantName", e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                </div>
                                                <div className="col-lg-6">
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
                                                </div>
                                                <div className="col-lg-6">
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
                                                </div>
                                                <div className="col-lg-6">
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
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Images:</label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={(e) => handleVariantImageChange(index, e)}
                                                        />
                                                        <div className="mt-2">
                                                            {variant.images.map((image, imageIndex) => (
                                                                <div key={imageIndex} className="d-inline-block position-relative mr-2">
                                                                    <img
                                                                        src={image instanceof File ? URL.createObjectURL(image) : image}
                                                                        alt={`Preview ${imageIndex}`}
                                                                        className="img-thumbnail"
                                                                        width="100"
                                                                        onClick={() => openModal(image)}
                                                                        style={{ cursor: "pointer" }}
                                                                    />
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-danger btn-sm position-absolute"
                                                                        style={{ backgroundColor: "#2f4d2a", color: "#fff", outline: "none", border: "none" }}
                                                                        onClick={() => handleRemoveVariantImage(index, imageIndex)}
                                                                    >
                                                                        <FontAwesomeIcon icon={faTrash} />
                                                                    </button>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>

                                            </div>
                                        ))}

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="itemModelNum_field">Item Model Number</label>
                                                <input
                                                    type="text"
                                                    id="itemModelNum_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemModelNum}
                                                    name="itemModelNum"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="serialNum_field">Serial Number</label>
                                                <input
                                                    type="text"
                                                    id="serialNum_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.serialNum}
                                                    name="serialNum"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="connectionType_field">Connection Type</label>
                                                <input
                                                    type="text"
                                                    id="connectionType_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.connectionType}
                                                    name="connectionType"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="hardwarePlatform_field">Hardware Platform</label>
                                                <input
                                                    type="text"
                                                    id="hardwarePlatform_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.hardwarePlatform}
                                                    name="hardwarePlatform"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="os_field">Operating System</label>
                                                <input
                                                    type="text"
                                                    id="os_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.os}
                                                    name="os"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="powerConception_field">Power Conception</label>
                                                <input
                                                    type="text"
                                                    id="powerConception_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.powerConception}
                                                    name="powerConception"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="batteries_field">Batteries</label>
                                                <input
                                                    type="text"
                                                    id="batteries_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.batteries}
                                                    name="batteries"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="packageDimension_field">Package Dimension</label>
                                                <input
                                                    type="text"
                                                    id="packageDimension_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.packageDimension}
                                                    name="packageDimension"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="portDescription_field">Port Description</label>
                                                <input
                                                    type="text"
                                                    id="portDescription_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.portDescription}
                                                    name="portDescription"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="connectivityType_field">Connectivity Type</label>
                                                <input
                                                    type="text"
                                                    id="connectivityType_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.connectivityType}
                                                    name="connectivityType"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="compatibleDevices_field">Compatible Devices</label>
                                                <input
                                                    type="text"
                                                    id="compatibleDevices_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.compatibleDevices}
                                                    name="compatibleDevices"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="powerSource_field">Power Source</label>
                                                <input
                                                    type="text"
                                                    id="powerSource_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.powerSource}
                                                    name="powerSource"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="specialFeatures_field">Special Features</label>
                                                <input
                                                    type="text"
                                                    id="specialFeatures_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.specialFeatures}
                                                    name="specialFeatures"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="includedInThePackage_field">Included in the Package</label>
                                                <input
                                                    type="text"
                                                    id="includedInThePackage_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.includedInThePackage}
                                                    name="includedInThePackage"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="manufacturer_field">Manufacturer</label>
                                                <input
                                                    type="text"
                                                    id="manufacturer_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.manufacturer}
                                                    name="manufacturer"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="itemSize_field">Item Size</label>
                                                <input
                                                    type="text"
                                                    id="itemSize_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemSize}
                                                    name="itemSize"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="itemWidth_field">Item Width</label>
                                                <input
                                                    type="text"
                                                    id="itemWidth_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemWidth}
                                                    name="itemWidth"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="status_field">Status</label>
                                                <select
                                                    className="form-control"
                                                    id="status_field"
                                                    onChange={handleChange}
                                                    value={formData.status}
                                                    name="status"
                                                >
                                                    <option value="pending">Pending</option>
                                                    <option value="approved">Approved</option>
                                                    <option value="rejected">Rejected</option>
                                                </select>
                                            </div>
                                        </div>
                                        {formData.status === 'rejected' && (
                                            <div className="col-lg-6">
                                                <div className="form-group">
                                                    <label htmlFor="rejectionReason_field">Rejection Reason</label>
                                                    <textarea
                                                        className="from-control"
                                                        id="rejectionReason_field"
                                                        rows="4"
                                                        onChange={(e) => setRejectionReason(e.target.value)}
                                                        value={rejectionReason}
                                                        name="rejectionReason"
                                                    ></textarea>
                                                </div>
                                            </div>
                                        )

                                        }

                                        <div className="d-flex justify-content-end">
                                            <button
                                                id="login_button"
                                                type="submit"
                                                disabled={loading}
                                                className="btn py-3"
                                                style={{ backgroundColor: "#ffad63", color: "#fff" }}
                                            >
                                                UPDATE
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>

                            {showModal && (
                                <div className="modal" style={{ display: 'block' }}>
                                    <div className="modal-dialog modal-dialog-centered">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close" onClick={closeModal}>
                                                    &times;
                                                </button>
                                            </div>
                                            <div className="modal-body">
                                                <img src={modalImage} alt="Preview" style={{ width: '100%', height: '100%' }} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </Fragment>
                    </div>
                </div>
            </section>
        </>
    );
}
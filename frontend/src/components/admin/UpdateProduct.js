import React, { Fragment, useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from "react-router-dom";
import { getAdminProducts, updateProduct, getCategoryHierarchy, deleteProductImage } from "../../actions/productActions";
import { clearError, clearProductUpdated } from "../../slices/singleProductSlice";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faCartShopping, faFilter, faPencil, faSearch, faTrash, faBars, faDashboard, faList, faShop, faShoppingBag, faSort, faUserPlus, faPen } from "@fortawesome/free-solid-svg-icons";
import { Dropdown } from "react-bootstrap";
import Drawer from '@mui/material/Drawer';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import MetaData from "../layouts/MetaData";
export default function UpdateProduct() {

    const { id: productId } = useParams();
    const { loading, products, categories = {} } = useSelector(state => state.productsState);
    const { isProductUpdated, isImageDeleted, error } = useSelector(state => state.productState);

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
        isRefundable: "false",
        manufacturer: "",

        sku: "",
        upc: "",
        hsn: "",
        countryofOrgin: "",
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
        additionalShippingCost: "",
        unit: "",
        rejectionReason: "",
        clocreId: "",
        variants: [],
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [imageFiles, setImageFiles] = useState([]);
    const [imageErrors, setImageErrors] = useState([]);
    const [images, setImages] = useState([]);
    const [imagesPreview, setImagesPreview] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [modalImage, setModalImage] = useState("");
    // const [rejectionReason, setRejectionReason] = useState('');
    const [variantDetails, setVariantDetails] = useState([]);
    const [hasVariants, setHasVariants] = useState([]);
    const [imagePreviews, setImagePreviews] = useState([]); // [{ url, file }]
    const [hasInitialized, setHasInitialized] = useState(false);


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
        if (products) {
            // Once product is fetched, then get categories
            dispatch(getCategoryHierarchy());
        }
    }, [products, dispatch]);

    useEffect(() => {
        if (!hasInitialized && products && products.length > 0) {
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
                    fssai: product.fssai,
                    stock: product.stock,
                    condition: product.condition,
                    brand: product.brand,
                    isRefundable: product.isRefundable ? "true" : "false",
                    clocreId: product.clocreId,
                    itemModelNum: product.itemModelNum,
                    manufacturer: product.manufacturer,
                    status: product.status,
                    countryofOrgin: product.countryofOrgin,
                    sku: product.sku,
                    upc: product.upc,
                    hsn: product.hsn,
                    moq: product.moq,
                    manufactureDetails: product.manufactureDetails,
                    productCertifications: product.productCertifications,
                    itemLength: product.itemLength,
                    itemHeight: product.itemHeight,
                    itemWeight: product.itemWeight,
                    itemWidth: product.itemWidth,
                    shippingCostlol: product.shippingCostlol,
                    shippingCostNorth: product.shippingCostNorth,
                    shippingCostSouth: product.shippingCostSouth,
                    shippingCostEast: product.shippingCostEast,
                    shippingCostWest: product.shippingCostWest,
                    shippingCostCentral: product.shippingCostCentral,
                    shippingCostNe: product.shippingCostNe,
                    additionalShippingCost: product.additionalShippingCost,
                    unit: product.unit,
                    rejectionReason: product.rejectionReason || '', // Initialize rejection reason if available
                    variants: product.variants

                });

                setVariantDetails(product?.variants?.map(variant => ({
                    ...variant,
                    images: variant.images || [] // Ensure images is defined
                  })));
                setHasVariants(product.variants.length > 0);
                setImagesPreview(product.images);
                setHasInitialized(true); // prevent future overwrites
            }
        }
    }, [products, productId, hasInitialized]);


    useEffect(() => {
        if (isProductUpdated) {
            toast('Product Updated Successfully!', {
                type: 'success',
                onOpen: () => dispatch(clearProductUpdated())
            });
            // setImages([]);
            navigate('/admin/products');
            return;
        }

        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }

        dispatch(getAdminProducts(productId));
    }, [isProductUpdated, error, dispatch, navigate,]);



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

    const handleVariantImageChange = (index, e) => {
        const files = Array.from(e.target.files);
        const maxImages = 3;
        const maxSizeInBytes = 1024 * 1024; // 1MB
        const imageFiles = files.filter(file => file.type.startsWith("image/"));
        if (imageFiles.length !== files.length) {
            alert("Only image files are allowed.");
            return;
        }
        const newValidImages = [];
        const errors = [];

        files.forEach((file) => {
            if (file.size > maxSizeInBytes) {
                errors.push(`${file.name} is larger than 1MB.`);
            } else {
                newValidImages.push(file);
            }
        });

        setVariantDetails((prevVariants) => {
            const newVariants = [...prevVariants];
            const existingImages = newVariants[index].images || [];

            const totalImages = existingImages.length + newValidImages.length;
            if (totalImages > maxImages) {
                errors.push("You can upload a maximum of 3 images per variant.");
            }

            const validImages = newValidImages.slice(0, maxImages - existingImages.length);
            newVariants[index] = {
                ...newVariants[index],
                images: [...existingImages, ...validImages],
            };

            return newVariants;
        });

        // Optional: Store/display errors for each variant (e.g., setVariantErrors)
        if (errors.length > 0) {
            toast.error(errors.join("\n")); // Replace with better UI if needed
        }
    };



    const openModal = (image) => {
        setModalImage(image);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setModalImage("");
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

        const isOnlyZerosOrDashes = (value) => /^[-0]+$/.test(value);

            const validUnits = ["EA", "ML", "SET", "KG", "LTR", "BOX", "PCS"]; // Customize list
        
            if (!validUnits.includes(formData.unit?.toUpperCase())) {
              toast.error("Please enter a valid unit (e.g., EA, ML, SET).");
              return false;
            }

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (imageErrors.length > 0) {
            toast("Please fix the image errors before submitting.");
            return;
        }
        if (validateForm()) {

            const productData = new FormData();

            // Append product fields
            Object.keys(formData).forEach((key) => {
                if (key === "images") {
                    formData.images.forEach((image) => {
                        if (typeof image === "string" && image.startsWith("http")) {
                            // Add only valid URLs to existingImages
                            productData.append("existingImages", image);
                        }
                    });
                    imageFiles.forEach((file) => {
                        // Add only File objects to images
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
                // productData.append(`variants[${index}][id]`, variant._id); // Keep existing ID
                productData.append(`variants[${index}][variantType]`, variant.variantType);
                productData.append(`variants[${index}][variantName]`, variant.variantName);
                productData.append(`variants[${index}][price]`, variant.price);
                productData.append(`variants[${index}][offPrice]`, variant.offPrice);
                productData.append(`variants[${index}][stock]`, variant.stock);

                if (variant.images && variant.images.length > 0) {
                    variant.images.forEach((file) => {
                        if (typeof file === "string" && file.startsWith("http")) {
                            // Add only valid URLs to existingImages
                            productData.append(`variants[${index}][existingImages]`, file);
                        } else {
                            // Add only File objects to images
                            productData.append(`variants[${index}][images]`, file);
                        }
                    });
                } else {
                    // Ensure existingImages is sent even if no new images are added
                    productData.append(`variants[${index}][existingImages]`, []);
                }
            });

            // if (formData.status === 'rejected') {
            //     productData.append('rejectionReason', rejectionReason);
            // }

            // Debugging: Log FormData
            // for (let pair of productData.entries()) {
            //     console.log(pair[0], pair[1]);
            // }
            // console.log("FormData before submission:", formData);
            try {
                await dispatch(updateProduct(productId, productData));
                // toast("Product updated successfully!", { type: "success" });
            } catch (error) {
                toast(error.message, { type: "error" });
            }
        }

    };


    const handleDeleteImage = async (imageUrl, productId, variantId = null) => {
        const isString = typeof imageUrl === "string";
        const isLocalImage = isString && imageUrl.startsWith("blob:");

        if (window.confirm("Are you sure you want to delete this image? It won't be recovered")) {
            try {
                if (variantId) {
                    if (!isString && imageUrl instanceof File) {
                        // Local file – just remove from variantDetails
                        setVariantDetails((prevVariants) =>
                            prevVariants.map((variant) =>
                                variant._id === variantId
                                    ? {
                                        ...variant,
                                        images: (variant.images || []).filter((img) => img !== imageUrl),
                                    }
                                    : variant
                            )
                        );
                        return;
                    }

                    if (!isLocalImage) {
                        await dispatch(deleteProductImage(imageUrl, productId, variantId));
                    }

                    // ✅ UPDATE variantDetails, not just formData
                    setVariantDetails((prevVariants) =>
                        prevVariants.map((variant) =>
                            variant._id === variantId
                                ? {
                                    ...variant,
                                    images: (variant.images || []).filter((img) => img !== imageUrl),
                                }
                                : variant
                        )
                    );
                  } else {
                    // Handle normal product images
                    if (!isLocalImage) {
                        await dispatch(deleteProductImage(imageUrl, productId));
                    }

                    setFormData((prev) => ({
                        ...prev,
                        images: (prev.images || []).filter((img) => img !== imageUrl),
                    }));

                    setImagePreviews((prev) => prev.filter((img) => img.url !== imageUrl));
                    setImageFiles((prev) =>
                        prev.filter((file) => {
                            const matching = imagePreviews.find(
                                (img) => img.url === imageUrl && img.file === file
                            );
                            return !matching;
                        })
                    );

                    if (isLocalImage) {
                        URL.revokeObjectURL(imageUrl);
                    }
                }
            } catch (error) {
                toast.error("Failed to delete image.");
            }
        }
    };


    // console.log("Variant Details before submitting:", variantDetails);
    // console.log("Final Variant Data:", variantDetails);
    useEffect(() => {
        if (error) {
            toast(error, {
                type: 'error',
                onOpen: () => { dispatch(clearError()) }
            })
            return
        }
        if (isImageDeleted) {
            toast('Image Delete Successfully!', {
                type: 'success',
                onOpen: () => dispatch(clearProductUpdated())
            });
            dispatch(getAdminProducts(productId))
            // navigate('/admin/products');
            return;
        }
    }, [dispatch, isImageDeleted]);

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const newImages = [];
        const errors = [];
        const imageFiles = files.filter(file => file.type.startsWith("image/"));
        if (imageFiles.length !== files.length) {
            alert("Only image files are allowed.");
            return;
        }
        files.forEach((file) => {
            if (file.size > 1024 * 1024) {
                errors.push(`${file.name} is larger than 1MB`);
            } else if (formData.images.length + newImages.length >= 3) {
                errors.push("You can upload a maximum of 3 images.");
            } else {
                const url = URL.createObjectURL(file);
                newImages.push({ file, url });
            }
        });

        setImageErrors(errors);
        if (errors.length === 0) {
            setFormData((prev) => ({
                ...prev,
                images: [...prev.images, ...newImages.map((img) => img.url)], // URLs only
            }));

            setImagePreviews((prev) => [...prev, ...newImages]); // file + url pairs
            setImageFiles((prev) => [...prev, ...newImages.map((img) => img.file)]); // actual files
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
        <MetaData title="Update Product | GLOCRE" />
            <section className="updateprod-section">

                <div className="row container-fluid">
                    <div className="col-12 col-md-2">
                        <Sidebar />
                    </div>
                    <div className="col-12 col-lg-10 col-md-12 pr-0">
                        <div className="mobile-logo">
                        < Link to = "/" >
                            <img src={require("../../images/procure-g-logo.png")} />
                            </Link>
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
                                                        <Link to="/admin/dashboard">Dashboard</Link>
                                                    </li>
                                                    <li>
                                                        <Link to="/admin/products">Product List</Link>
                                                    </li>
                                                    <li>Update Product</li>
                                                </ul>
                                            </div>
                                            <div className="col-lg-7 col-md-6 d-flex justify-content-end align-items-end">
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
                                                        style={{ backgroundImage: 'none', border: 'none', boxShadow: "none" }}
                                                    >
                                                        <FontAwesomeIcon icon={faFilter} />
                                                    </Dropdown.Toggle>
                                                </Dropdown>
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
                                                <li><Link to="/admin/edit-banner"><FontAwesomeIcon icon={faPencil} className="me-2" />Banner</Link></li>
                                                <li><Link to="/admin/awsimages"><FontAwesomeIcon icon={faPencil} className="me-2" />Images</Link></li>
                                            </ul>
                                        </div>
                                    </Drawer>

                                </div>

                                <form onSubmit={handleSubmit} className="updateproduct-right-glc" encType='multipart/form-data'>

                                    <h3 style={{ color: "#ffad63", marginTop: "40px" }}>UPDATE PRODUCT</h3>


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
                                                    onKeyDown={(e) => {
                                                        if (e.target.selectionStart === 0 && e.key === " ") e.preventDefault();
                                                    }}
                                                    name="name"
                                                    minLength="5"
                                                    maxlength="80"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="description_field">Description:<span style={{ color: "red" }}> * <LightTooltip placement="top" title="Describe what the product is, what it does, and who it's for." arrow>
                                                    <ErrorOutlineIcon className="errorout-icon" />
                                                </LightTooltip></span></label>
                                                <textarea
                                                    className="form-control"
                                                    id="description_field"
                                                    rows="8"
                                                    onChange={handleChange}
                                                    value={formData.description}
                                                    name="description"
                                                    maxLength={200}
                                                    required
                                                ></textarea>
                                            </div>
                                        </div>

                                        {/* MAIN CATEGORY */}
                                        <div className="col-lg-6">
                                            <div className="form-group relative">
                                                <div className="custom-select-wrapper">
                                                    <label htmlFor="maincategory">
                                                        Main Category:<span style={{ color: "red" }}> *
                                                            <LightTooltip placement="top" title="Select the most appropriate category for your product." arrow>
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
                                                            <LightTooltip placement="top" title="Select the most appropriate category for your product." arrow>
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
                                                            <LightTooltip placement="top" title="Select the most appropriate category for your product." arrow>
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
                                                        <LightTooltip placement="top" title="Enter your FSSAI license number, required for food products in India." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip>
                                                    </span></label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="fssai"
                                                        value={formData?.fssai || ""}
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
                                        <div className="col-12">
                                            <div className="form-group">
                                                <label>Key Points:<span style={{ color: "red" }}> *
                                                    <LightTooltip placement="top" title="Highlight key features or selling points of the product." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip></span></label>
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


                                        {!hasVariants && (
                                            <>
                                                <div className="form-group">
                                                    <label htmlFor="price_field">
                                                        Maximum Retail Price (in ₹):<span style={{ color: "red" }}> *</span>
                                                        <LightTooltip placement="top" title="Enter the selling price of the product." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="price_field"
                                                        className="form-control"
                                                        name="price"
                                                        value={formData.price}
                                                        onChange={handleChange}
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
                                                    <label htmlFor="offPrice_field">
                                                        Offer Price (in ₹):<span style={{ color: "red" }}> *</span>
                                                        <LightTooltip placement="top" title="Enter the offer price of the product." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="offPrice_field"
                                                        className="form-control"
                                                        name="offPrice"
                                                        value={formData.offPrice}
                                                        onChange={handleChange}
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
                                                    <label htmlFor="stock_field">
                                                        Stock:<span style={{ color: "red" }}> *</span>
                                                        <LightTooltip placement="top" title="Enter the quantity currently in stock." arrow>
                                                            <ErrorOutlineIcon className="errorout-icon" />
                                                        </LightTooltip>
                                                    </label>
                                                    <input
                                                        type="number"
                                                        id="stock_field"
                                                        className="form-control"
                                                        name="stock"
                                                        value={formData.stock}
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            if (value === '' || (Number(value) >= 1 && Number(value) <= 9999)) {
                                                                handleChange(e);
                                                            }
                                                        }}
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
                                                        required
                                                    />
                                                </div>


                                                <div className="form-group">
                                                    <label>Images:<span style={{ color: "red" }}> *</span></label>
                                                    <div className="existing-images">
  {formData.images.map((image, index) => (
    <div
      key={index}
      className="d-flex align-items-center mb-2 ms-4 me-4"
      style={{ gap: '10px' }}
    >
      <img
        className="mt-2"
        src={image}
        alt={`Image Preview ${index}`}
        width="55"
        height="52"
        style={{ cursor: "pointer" }}
        onClick={() => openModal(image)}
      />
      <button
        type="button"
        className="btn btn-danger btn-sm"
        onClick={() => handleDeleteImage(image, productId)}
      >
        Delete
      </button>
    </div>
  ))}
</div>

                                                    <div className="custom-file mt-3">
                                                        <input
                                                            type="file"
                                                            name="product_images"
                                                            className="custom-file-input"
                                                            id="customFile"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={handleImageChange}

                                                        />
                                                        <label className="custom-file-label" htmlFor="customFile">
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
                                                </div>
                                            </>
                                        )}

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="condition_field">Condition:<span style={{ color: "red" }}> *
                                                    <LightTooltip placement="top" title="Specify if the product is new, used, or refurbished." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip>
                                                </span></label>
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
                                                <label htmlFor="isRefundable_field">Is Refundable:<span style={{ color: "red" }}> *
                                                    <LightTooltip placement="top" title="Select whether this product can be refunded after purchase." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip>
                                                </span></label>
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
                                                    maxLength={30}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        {variantDetails.map((variant, index) => (
                                            <div key={index} className="variant-section row">
                                                <h4>Variant {index + 1}</h4>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Variant Type:<span style={{ color: "red" }}> *
                                                            <LightTooltip placement="top" title="List product variants like size, color, etc." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </span></label>
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
                                                </div>
                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>Variant Name:<span style={{ color: "red" }}> *
                                                            <LightTooltip placement="top" title="List product variants like size, color, etc." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </span></label>
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
                                                        <label>
                                                            Maximum Retail Price (in ₹):<span style={{ color: "red" }}> *</span>
                                                            <LightTooltip placement="top" title="Enter the selling price of the product." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={variant.price}
                                                            onChange={(e) => handleVariantChange(index, "price", e.target.value)}
                                                            required
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
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>
                                                            Offer Price (in ₹):<span style={{ color: "red" }}> *</span>
                                                            <LightTooltip placement="top" title="Enter the offer price of the product." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={variant.offPrice}
                                                            onChange={(e) => handleVariantChange(index, "offPrice", e.target.value)}
                                                            required
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
                                                </div>

                                                <div className="col-lg-6">
                                                    <div className="form-group">
                                                        <label>
                                                            Stock:<span style={{ color: "red" }}> *</span>
                                                            <LightTooltip placement="top" title="Enter the quantity currently in stock." arrow>
                                                                <ErrorOutlineIcon className="errorout-icon" />
                                                            </LightTooltip>
                                                        </label>
                                                        <input
                                                            type="number"
                                                            className="form-control"
                                                            value={variant.stock}
                                                            onChange={(e) => {
                                                                const value = e.target.value;
                                                                if (value === '' || (Number(value) >= 1 && Number(value) <= 9999)) {
                                                                    handleVariantChange(index, 'stock', value);
                                                                }
                                                            }}
                                                            required
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
                                                        <label>Images:<span style={{ color: "red" }}> *</span></label>
                                                        <input
                                                            type="file"
                                                            className="form-control"
                                                            multiple
                                                            accept="image/*"
                                                            onChange={(e) => handleVariantImageChange(index, e)}
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
                                                                        className="btn btn-danger btn-sm"
                                                                        onClick={() => handleDeleteImage(image, productId, variant._id)}
                                                                    >
                                                                        Delete
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
                                                    value={formData.itemModelNum || ""}
                                                    maxLength={15}
                                                    name="itemModelNum"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="sku">SKU:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="text"
                                                    id="sku_field"
                                                    className="form-control"
                                                    // onChange={handleChange}
                                                    value={formData.sku || ""}
                                                    maxLength={15}
                                                    name="sku"
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
                                                <label htmlFor="upc_field">UPC
                                                    <LightTooltip placement="top" title="Universal Product Code – used for barcode identification" arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip>
                                                </label>
                                                <input
                                                    type="text"
                                                    id="upc_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    maxLength={12}
                                                    value={formData.upc || ""}
                                                    name="upc"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="hsn_field">HSN Code:<span style={{ color: "red" }}> *
                                                    <LightTooltip placement="top" title="HSN code for GST classification of your product." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip></span></label>
                                                <input
                                                    type="text"
                                                    id="hsn_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    maxLength={8}
                                                    value={formData.hsn || ""}
                                                    name="hsn"
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
                                                <label htmlFor="productCertifications_field">Product Certifications
                                                    <LightTooltip placement="top" title="List any certifications (e.g., ISO, CE, Organic) your product has." arrow>
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
                                                    maxLength={50}

                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="batteries_field">Item Length in Centimeters:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="itemLength_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemLength}
                                                    name="itemLength"
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
                                                            itemLength: updatedValue,
                                                        }));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="itemHeight_field">Item Height in Centimeters:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="itemHeight_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemHeight}
                                                    name="itemHeight"
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
                                                <label htmlFor="portDescription_field">Item Weight in Kgs:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="itemWeight_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemWeight}
                                                    name="itemWeight"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="itemWidth_field">Item Width in Centimeters:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    id="itemWidth_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.itemWidth}
                                                    name="itemWidth"
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
                                        <div className="col-6">
                                            <div className="form-group">
                                                <label htmlFor="moq_field">
                                                    Minimum Order QTY(MOQ):<span style={{ color: "red" }}> *</span>
                                                </label>
                                                <input
                                                    type="number"
                                                    id="moq_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.moq}
                                                    name="moq"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="manufactureDetails_field">Manufacture Details
                                                    <LightTooltip placement="top" title="Enter the country where the product was manufactured or produced." arrow>
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
                                                <label htmlFor="shippingCostlol_field">Shipping Cost local (Based on sellers pincode):<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostlol_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostlol}
                                                    name="shippingCostlol"
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

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="shippingCostNorth_field">Shipping Cost North India:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostNorth_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostNorth}
                                                    name="shippingCostNorth"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="shippingCostSouth_field">Shipping Cost South India:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostSouth_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostSouth}
                                                    name="shippingCostSouth"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="shippingCostEast_field">Shipping Cost East India:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostEast_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostEast}
                                                    name="shippingCostEast"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="shippingCostCentral_field">Shipping Cost Central India:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostCentral_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostCentral}
                                                    name="shippingCostCentral"
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

                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="shippingCostWest_field">Shipping Cost West India:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostWest_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostWest}
                                                    name="shippingCostWest"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="shippingCostNe_field">Shipping Cost NorthEast India:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="shippingCostNe_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.shippingCostNe}
                                                    name="shippingCostNe"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="additionalShippingCost_field">Additional Shipping Cost for each Item:<span style={{ color: "red" }}> *</span></label>
                                                <input
                                                    type="number"
                                                    id="additionalShippingCost_field"
                                                    className="form-control"
                                                    onChange={handleChange}
                                                    value={formData.additionalShippingCost}
                                                    name="additionalShippingCost"
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
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <label htmlFor="unit_field">Unit(EA/ML/Set):<span style={{ color: "red" }}> *
                                                    <LightTooltip placement="top" title="List any certifications (e.g., ISO, CE, Organic) your product has." arrow>
                                                        <ErrorOutlineIcon className="errorout-icon" />
                                                    </LightTooltip>
                                                </span></label>
                                                <input
                                                    type="text"
                                                    id="unit_field"
                                                    className="form-control"
                                                    onChange={(e) => {
                                                        const value = e.target.value.toUpperCase();
                                                        // Allow only letters and max 5 characters
                                                        if (/^[A-Z]{0,5}$/.test(value)) {
                                                            setFormData((prev) => ({ ...prev, unit: value }));
                                                        }
                                                    }}
                                                    value={formData.unit?.toUpperCase()}
                                                    name="unit"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-6">
                                            <div className="form-group">
                                                <div className="custom-select-wrapper">
                                                    <label htmlFor="status_field">Status:<span style={{ color: "red" }}> *</span></label>
                                                    <select
                                                        className="form-control custom-select"
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
                                        </div>
                                        {formData.status === 'rejected' && (
                                            <div className="col-lg-6">
                                                <div className="form-group">

                                                    <label htmlFor="rejectionReason_field">Rejection Reason:<span style={{ color: "red" }}> *</span></label>
                                                    <textarea
                                                        className="from-control "
                                                        id="rejectionReason_field"
                                                        rows="4"
                                                        onChange={(e) => setFormData({ ...formData, rejectionReason: e.target.value })}
                                                        value={formData.rejectionReason}
                                                        name="rejectionReason"
                                                        style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "10px", width: "100%", resize: "none" }}
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

                                            <Zoom>
                                                <img
                                                    src={modalImage}
                                                    alt="Preview"
                                                    style={{ width: '100%', height: '100%' }}
                                                />
                                            </Zoom>

                                        </div>
                                    </div>
                                </div>
                            )}
                        </Fragment >
                    </div >
                </div >
            </section >
        </>
    );
}
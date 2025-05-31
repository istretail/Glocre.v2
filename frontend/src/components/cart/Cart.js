import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeCartItemFromCart,
  updateCartItemQuantityInCart,
  validateCartItems,
  getCartItemsFromCart,
  updateItems
} from "../../actions/cartActions";
import { removeCartItem, updateCartItemQuantity } from "../../slices/cartSlice";
import empty from "../../images/cartempty.png";
import "./cart.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Nav from "../layouts/nav";
import { logEvent } from '../../actions/analyticsActions';
import { Modal, Box, Typography } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Cart() {
  const { items = [], cartItems = [] } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [items, setItems] = useState([]);

  // console.log("cartItems", cartItems);
  const getActualStock = (item, cartItems) => {
    const matched = cartItems.find(ci => ci._id === item._id);
    return matched?.variant?.stock ?? matched?.stock ?? 0;
  };

  // Function to increase quantity
  const increaseQty = (item) => {
    const matchedCartItem = cartItems.find((ci) => ci._id === item._id);
    const stock = matchedCartItem?.variant?.stock ?? matchedCartItem?.stock ?? 0;

    if (item.quantity >= stock) return;

    if (user) {
      dispatch(updateCartItemQuantityInCart(
        item.product,
        item.quantity + 1,
        stock,
        item.variant?._id
      ));
    } else {
      dispatch(updateCartItemQuantity({
        productId: item.product,
        variantId: item.variant?._id,
        quantity: item.quantity + 1,
        stock,
      }));
    }
  };


  // Function to decrease quantity
  const decreaseQty = (item) => {
    const count = item.quantity;
    if (count === 1) return;

    const stock = getActualStock(item, cartItems); // Get validated stock

    if (user) {
      dispatch(
        updateCartItemQuantityInCart(
          item.product,
          item.quantity - 1,
          stock,
          item.variant?._id
        )
      );
    } else {
      dispatch(
        updateCartItemQuantity({
          productId: item.product,
          variantId: item.variant ? item.variant._id : null,
          quantity: item.quantity - 1,
          stock,
        })
      );
    }
  };


  // Handle quantity change
  const handleQuantityChange = (e, item) => {
    const value = parseInt(e.target.value);
    const stock = getActualStock(item, cartItems); // Always use updated stock

    if (!isNaN(value) && value >= 0 && value <= stock) {
      const cartItemId = item.variant ? item.variant._id : item.product;

      if (user) {
        dispatch(updateCartItemQuantityInCart(
          item.product,
          value,
          stock,
          item.variant?._id
        ));
      } else {
        dispatch(
          updateCartItemQuantity({
            productId: item.product,
            variantId: item.variant ? item.variant._id : null,
            quantity: value,
            stock,
          })
        );
      }
    }
  };


  // Fetch cart items on mount
  useEffect(() => {
    dispatch(getCartItemsFromCart());
  }, [dispatch]);

  // Validate cart items
  useEffect(() => {
    if (
      Array.isArray(items) &&
      items.length > 0 &&
      items.every(item => item?.product && item?.quantity != null)
    ) {
      dispatch(validateCartItems(items));
    }
  }, [items]);

  // Checkout handler
  const checkoutHandler = () => {
    const unavailableItems = getUnavailableItems();

    // Remove unavailable items from cart
    unavailableItems.forEach(item => {
      removeItemHandler(item.product, item.variant?._id);
    });
    dispatch(updateItems(cartItems));
    // Proceed to checkout
    navigate("/login?redirect=shipping");
  };


  // Remove item from cart handler
  const removeItemHandler = (productId, variantId) => {
    if (user) {
      dispatch(removeCartItemFromCart(productId, variantId));
    } else {
      dispatch(removeCartItem({ productId, variantId }));
    }
  };

  // Track page view with analytics
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({ event: 'page_view', pageUrl: window.location.pathname, timeSpent });
    };
  }, []);

  // Modal for item removal
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const handleOpen = (item) => {
    setSelectedItem(item);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
  };
  const handleConfirm = () => {
    if (selectedItem) {
      removeItemHandler(selectedItem.product, selectedItem.variant?._id);
    }
    handleClose();
  };

  // Function to compare item properties and display update messages
  const getUpdateMessages = (item, updatedItem) => {
    const messages = [];
    if (item.price !== updatedItem.price) {
      messages.push(`Price has changed from Rs.${item.price} to Rs.${updatedItem.price}`);
    }
    if (item.quantity > updatedItem.stock) {
      messages.push(`Only ${updatedItem.stock} items are currently available.`);
    }
    if (updatedItem.status === "pending" || updatedItem.isArchived) {
      messages.push("This product is currently not available.");
    }
    return messages;
  };
  const getUnavailableItems = () => {
    return cartItems.filter(item =>
      item.status === "pending" ||
      item.isArchived !== false ||
      (item.variant?.stock ?? item.stock) === 0
    );
  };
  // console.log("cartItems", cartItems);

  const getAvailableItems = () => {
    return cartItems.filter(item => item.status !== "pending" || item.isArchived !== false);
  };

  // Function to check if at least one item is available
  const isAnyItemAvailable = () => {
    return cartItems.some(item => item.status !== "pending" || item.isArchived !== false);
  };

  const isCheckoutDisabled = () => {
    const unavailableItems = cartItems.filter(
      item => item.status === "pending" || item.isArchived !== false

    );
    return unavailableItems.length === cartItems.length || (cartItems.length === 1 && unavailableItems.length === 1);

  };

  return (
    <>
      <MetaData title={"Cart | GLOCRE"} />
      <Nav />
      < div className="breadcrumbWrapper mb-4" >
        <div className="container-fluid" >
          <ul className="breadcrumb breadcrumb2 mb-0" >
            <li>
              <Link to={"/"}> Home </Link>
            </li>
            < li > Cart </li>
          </ul>
        </div>
      </div>
      {
        items.length === 0 ? (
          <>
            <div className="empty d-flex align-items-center justify-content-center flex-column mb-5" >
              <Link to="/" >
                <img src={empty} alt="image" width="150" height="150px" />
              </Link>
              < h3 > Your Cart is currently empty </h3>
              < br />
              <Link to="/" >
                <Button className="btn-g bg-g btn-lg btn-big btn-round" >
                  <HomeIcon /> &nbsp; Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <>
            <div className="container-fluid" >
              <h1 className="hd mb-0" > Your Cart </h1>
              <p>
                There are{" "}
                <span className="text-g" >
                  <b>{items.length} </b>
                </span>{" "}
                products in your cart
              </p>
            </div>

            < section className="cartSection mb-5" >
              <div className="container-fluid" >
                <div className="row d-flex" >
                  {/* Left Section */}
                  < div className="col-md-9 col-12" >
                    <div className="cartWrapper mt-4" >
                      <div className="table-responsive" >
                        <table className="table" >
                          <thead>
                            <tr>
                              <th style={{minWidth:"125px"}}>Product </th>
                              < th  style={{minWidth:"125px"}}> Unit Price </th>
                              < th  style={{minWidth:"125px"}}> Quantity </th>
                              {/* < th  style={{minWidth:"125px"}}> Stock </th> */}
                              < th  style={{minWidth:"125px"}}> Subtotal </th>
                              < th  style={{minWidth:"125px"}}> Remove </th>
                            </tr>
                          </thead>
                          {
                            items.map((item) => {
                              const updatedItem = cartItems.find((cartItem) => cartItem._id === item._id);
                              const updateMessages = updatedItem ? getUpdateMessages(item, updatedItem) : [];

                              return (
                                <tbody key={item.product} >
                                  <tr>
                                    <td>
                                      <div className="d-flex align-items-center" >
                                        <div className="img" >
                                          <img
                                            src={item.image}
                                            className="w-100"
                                            alt={item.name}
                                          />
                                        </div>
                                        < div className="info pl-4" >
                                          <Link to={`/products/${item.product}`}>
                                            <h4>{item.name} </h4>
                                          </Link>
                                          {
                                            updateMessages.length > 0 && (
                                              <div className="update-messages" >
                                                {
                                                  updateMessages.map((msg, index) => (
                                                    <p key={index} className="text-warning" > {msg} </p>
                                                  ))
                                                }
                                              </div>
                                            )
                                          }
                                        </div>
                                      </div>
                                    </td>
                                    < td >
                                      <span>Rs: {updatedItem ? updatedItem.price : item.price} </span>
                                    </td>
                                    < td >
                                      <div className="quantityDrop d-flex align-items-center" >
                                        <Button onClick={() => decreaseQty(item)}>
                                          <RemoveIcon />
                                        </Button>
                                        <input
                                          type="number"
                                          value={
                                            updatedItem && item.quantity > updatedItem?.stock
                                              ? updatedItem?.stock
                                              : item.quantity
                                          }
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow empty string temporarily (user is typing)
                                            if (value === "") {
                                              handleQuantityChange(e, item); // or just set a temporary state
                                              return;
                                            }

                                            // Allow numbers starting with 0 but longer than 1 digit (like 05)
                                            if (/^0\d+/.test(value)) {
                                              handleQuantityChange(e, item);
                                              return;
                                            }

                                            // Disallow standalone zero or any value less than 1
                                            const numericValue = Number(value);
                                            if (numericValue >= 1) {
                                              handleQuantityChange(e, item);
                                            }
                                          }}
                                          onBlur={(e) => {
                                            // If user leaves the input as empty or 0, reset to 1
                                            if (!e.target.value || Number(e.target.value) === 0) {
                                              handleQuantityChange({ target: { value: 1 } }, item);
                                            }
                                          }}
                                        />


                                        < Button onClick={() => increaseQty(item)}>
                                          <AddIcon />
                                        </Button>
                                      </div>
                                    </td>
                                    {/* < td >
                                      <span className="text-g" >
                                       { updatedItem.stock }
                                      </span>
                                    </td> */}
                                    < td >
                                      <span className="text-g" >
                                        Rs: {(updatedItem ? updatedItem.price : item.price) * item.quantity}
                                      </span>
                                    </td>
                                    {/* < td >
                                      <button className="cartRemove" onClick={() => handleOpen(item)}>
                                        <DeleteOutlineOutlinedIcon />
                                      </button>
                                    </td> */}
                                    <td>
                                      <Button
                                        style={{ backgroundColor: "#2f4d2a", outline: "none", border: "none", color: "#fff" }}
                                        onClick={() => handleOpen(item)}
                                        className="btn ms-2"
                                      >
                                        <FontAwesomeIcon icon={faTrash} />
                                      </Button>
                                    </td>
                                  </tr>
                                </tbody>
                              );
                            })}
                        </table>
                        <Modal open={open} onClose={handleClose}>
                          <Box
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              bgcolor: "background.paper",
                              p: 4,
                              borderRadius: 2,
                              width: 300,
                              border: "none",
                              outline: "none",
                            }}
                          >
                            <Typography variant="h6" mb={2} align="center" fontSize={17} color="#8c8c8c">
                              Are you sure want to remove this item?
                            </Typography>
                            <Box display="flex" justifyContent="space-between">
                              <Button onClick={handleConfirm}
                                className="left-but"
                                sx={{
                                  margin: "3px"
                                }}>
                                Yes
                              </Button>
                              <Button onClick={handleClose}
                                className="right-but"
                                sx={{
                                  margin: "3px"
                                }}
                              >
                                No
                              </Button>
                            </Box>

                          </Box>
                        </Modal>
                      </div>
                      < Link to="/" >
                        <Button className="btn-g bg-g btn-round mt-3" >
                          <KeyboardBackspaceIcon /> Continue Shopping
                        </Button>
                      </Link>
                    </div>
                  </div>
                  <div className="col-md-3 col-12 cartRightBox p-0">
                    <div className="card p-4">
                      <div className="d-flex align-items-center mb-4">
                        <h5 className="mb-0 text-light">Quantity</h5>
                        <h3 className="ml-auto mb-0 font-weight-bold">
                          <span className="text-g">
                            {items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                            (Units)
                          </span>
                        </h3>
                      </div>

                      <div className="d-flex align-items-center mb-4">
                        <h5 className="mb-0 text-light">items</h5>
                        <h3 className="ml-auto mb-0 font-weight-bold">
                          {" "}
                          <b>{items.length}</b>
                        </h3>
                      </div>
                      <div className="d-flex align-items-center mb-4">
                        <h5 className="mb-0 text-light">Subtotal</h5>
                        <h3 className="ml-auto mb-0 font-weight-bold">
                          <span className="text-g">
                            ₹
                            {
                              items.reduce((acc, item) => {
                                const updatedItem = cartItems.find(cartItem => cartItem.product === item.product);
                                const price = updatedItem ? updatedItem.price : item.price;
                                return acc + price * item.quantity;
                              }, 0)
                            }
                          </span>
                        </h3>
                      </div>
                      <br />
                      {
                        getUnavailableItems().length > 0 && getAvailableItems().length > 0 && (
                          <p className="text-sm text-red-600 mb-2">
                            Proceeding without{" "}
                            {getUnavailableItems().map((item, index) => (
                              <span key={item._id}>
                                 <b>{item.name}</b>
                                {index !== getUnavailableItems().length - 1 ? ", " : ""}
                              </span>
                            ))}
                          </p>
                        )
                      }
                      <Button
                        variant="contained"
                        className="btn-g btn-lg"
                        onClick={checkoutHandler}
                        disabled={!isAnyItemAvailable() || isCheckoutDisabled()}
                      >
                        Proceed to Checkout
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
        )}
    </>
  );
}

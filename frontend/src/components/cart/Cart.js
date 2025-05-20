import React, { Fragment, useEffect, useState } from "react";
import MetaData from "../layouts/MetaData";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeCartItemFromCart,
  updateCartItemQuantityInCart,
  getCartItemsFromCart,
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
export default function Cart() {
  const { items } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQty = (item) => {
    const count = item.quantity;
    if (item.stock === 0 || count >= item.stock) return;

    const cartItemId = item.variant ? item.variant._id : item.product;

    if (user) {
      dispatch(
        updateCartItemQuantityInCart(
          item.product,
          item.quantity + 1,
          item.stock,
          item.variant?._id
        )
      );
    } else {
      dispatch(
        updateCartItemQuantity({
          productId: item.product,      // Always pass product ID
          variantId: item.variant ? item.variant._id : null,  // Only pass if variant exists
          quantity: item.quantity + 1,
          stock: item.stock,
        })
      );
    }
  };

  const decreaseQty = (item) => {
    const count = item.quantity;
    if (count === 1) return;

    const cartItemId = item.variant ? item.variant._id : item.product;

    if (user) {
      dispatch(
        updateCartItemQuantityInCart(
          item.product,
          item.quantity - 1,
          item.stock,
          item.variant?._id
        )
      );
    } else {
      dispatch(
        updateCartItemQuantity({
          productId: item.product,      // Always pass product ID
          variantId: item.variant ? item.variant._id : null,  // Only pass if variant exists
          quantity: item.quantity - 1,
          stock: item.stock,
        })
      );
    }
  };

  const handleQuantityChange = (e, item) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= item.stock) {
      const cartItemId = item.variant ? item.variant._id : item.product;

      if (user) {
        dispatch(updateCartItemQuantityInCart(cartItemId, value));
      } else {
        dispatch(
          updateCartItemQuantity({
            productId: cartItemId,
            quantity: value,
            stock: item.stock,
          })
        );
      }
    }
  };
  

  useEffect(() => {
    // Fetch cart items when the component mounts
    dispatch(getCartItemsFromCart());
  }, [dispatch]);

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  const removeItemHandler = (productId, variantId) => {
    if (user) {
      // Dispatch removeCartItem action from actions file
      dispatch(removeCartItemFromCart(productId, variantId));
    } else {
      // Dispatch removeCartItem action from slice
      dispatch(removeCartItem({ productId, variantId }));
    }
  };
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({ event: 'page_view', pageUrl: window.location.pathname, timeSpent });
    };
  }, []);


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

  return (
    <>
      <MetaData title={"Cart"} />

      <Nav />
      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>My Profile</li>
          </ul>
        </div>
      </div>

      {items.length === 0 ? (
        <>
          <div className="empty d-flex align-items-center justify-content-center flex-column mb-5">
            <Link to="/">
              <img src={empty} alt="image" width="150" height="150px" />
            </Link>
            <h3>Your Cart is currently empty</h3>
            <br />
            <Link to="/">
              <Button className="btn-g bg-g btn-lg btn-big btn-round">
                <HomeIcon /> &nbsp; Continue Shopping
              </Button>
            </Link>
          </div>
        </>
      ) : (
        <>
          <div className="container-fluid">
            <h1 className="hd mb-0">Your Cart</h1>
            <p>
              There are{" "}
              <span className="text-g">
                <b>{items.length}</b>
              </span>{" "}
              products in your cart
            </p>
          </div>

          <section className="cartSection mb-5">
            <div className="container-fluid">
              <div className="row d-flex">
                {/* Left Section */}
                <div className="col-md-8 col-12">
                  <div className="cartWrapper mt-4">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Unit Price</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        {items.map((item) => (
                          <tbody key={item.product}>
                            <tr>
                              <td width={"50%"}>
                                <div className="d-flex align-items-center">
                                  <div className="img">
                                    <img
                                      src={item.image}
                                      className="w-100"
                                      alt={item.name}
                                    />
                                  </div>
                                  <div className="info pl-4">
                                    <Link to={`/products/${item.product}`}>
                                      <h4>{item.name}</h4>
                                    </Link>
                                  </div>
                                </div>
                              </td>

                              <td width="20%">
                                <span>Rs:{item.price}</span>
                              </td>

                              <td>
                                <div className="quantityDrop d-flex align-items-center">
                                  <Button onClick={() => decreaseQty(item)}>
                                    <RemoveIcon />
                                  </Button>
                                  <input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => handleQuantityChange(e, item)}
                                  />
                                  <Button onClick={() => increaseQty(item)}>
                                    <AddIcon />
                                  </Button>
                                </div>

                              </td>

                              <td>
                                <span className="text-g">
                                  Rs:{(item.price * item.quantity).toFixed(2)}
                                </span>
                              </td>
                              {/* Remove Item Button */}
                              <td align="center">
                                <span className="cursor">
                                  <DeleteOutlineOutlinedIcon onClick={() => handleOpen(item)} />
                                </span>
                              </td>

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



                            </tr>
                          </tbody>
                        ))}
                      </table>
                    </div>
                  </div>
                  <br />
                  <div className="d-flex align-items-center">
                    <Link to="/">
                      <Button className="btn-g">
                        <KeyboardBackspaceIcon /> Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>

                {/* Right Section */}
                <div className="col-md-4 col-12 cartRightBox">
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
                          {items
                            .reduce(
                              (acc, item) => acc + item.quantity * item.price,
                              0,
                            )
                            .toFixed(2)}
                        </span>
                      </h3>
                    </div>
                    <br />
                    <Button className="btn-g btn-lg" onClick={checkoutHandler}>
                      Proceed To CheckOut
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

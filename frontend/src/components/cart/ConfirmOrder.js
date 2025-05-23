import MetaData from "../layouts/MetaData";
import { Fragment, useEffect } from "react";
import { validateShipping } from "./Shipping";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import Nav from "../layouts/nav";
import "./cart.css";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import { useDispatch } from "react-redux";
import { logEvent } from "../../actions/analyticsActions.js";
import axios from "axios";
import { toast } from "react-toastify";
import { clearError as clearOrderError } from "../../slices/orderSlice";
import { createOrder, getShippingCost } from "../../actions/orderActions";
import { clearCart } from "../../actions/cartActions";

export default function ConfirmOrder() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    shippingInfo,
    billingInfo,
    cartItems,
  } = useSelector((state) => state.cartState);
  const { user } = useSelector((state) => state.authState);
  const { error: orderError, cost=[] } = useSelector((state) => state.orderState);

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );
  const totalTax = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price * (item.tax / 100),
    0,
  );
  const shippingPrice = cost.totalShippingCost
  const totalPrice = Number(itemsPrice + shippingPrice + totalTax).toFixed(2);

  useEffect(() => {
    validateShipping(shippingInfo, navigate);
  }, [shippingInfo, navigate]);

  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({
        event: "page_view",
        pageUrl: window.location.pathname,
        timeSpent,
      });
    };
  }, []);

  useEffect(() => {
    if (orderError) {
      toast(orderError, {
        type: "error",
        onOpen: () => {
          dispatch(clearOrderError());
        },
      });
    }
  }, [orderError, dispatch]);

  const processPayment = async () => {
    try {
      const { data } = await axios.post("/api/v1/payment/process", {
        amount: Math.round(totalPrice * 100),
      });

      const options = {
        key: "rzp_test_C7SggW0eq2oIyy",
        amount: data.order.amount,
        currency: data.order.currency,
        name: "Glocre",
        description: "Order Payment",
        image: "/images/logo.png",
        order_id: data.order.id,
        handler: async function (response) {
          const order = {
            orderItems: cartItems,
            shippingInfo,
            billingInfo,
            itemsPrice,
            shippingPrice,
            taxPrice: totalTax,
            totalPrice,
            paymentInfo: {
              id: response.razorpay_payment_id,
              status: "paid",
            },
          };
          dispatch(createOrder(order));
          dispatch(clearCart());
          navigate("/order/success");
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: shippingInfo.phoneNo,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast("Payment failed! Please try again.", { type: "error" });
    }
  };
  useEffect(() => {
    if (shippingInfo) {
      dispatch(getShippingCost(cartItems,shippingInfo));
    }
  }, [shippingInfo, dispatch]);
  return (
    <>
      <MetaData title={"Confirm Order"} />

      <Nav />

      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>
              <Link to={"/cart"}>Cart</Link>
            </li>
            <li>
              <Link to={"/shipping"}>Shipping Address</Link>
            </li>
            <li>Confirm Order</li>
          </ul>
        </div>
      </div>

      <section className="container-fluid cartSection mb-5">
        <div className="container-fluid">
          <div className="row">
            {/* Left Section */}
            <div className="col-lg-6 col-md-12 col-12">
              <h1 className="hd">Shipping Info :</h1>
              <div class="info-box">
                <p>
                  <b className="info-box-p-b">Name</b>{" "}
                  <b className="info-box-p-b2">:</b>{" "}
                  <span className="info-box-p-span">{shippingInfo.name}</span>
                </p>
                <p>
                  <b className="info-box-p-b">Phone</b>{" "}
                  <b className="info-box-p-b2">:</b>{" "}
                  <span className="info-box-p-span">
                    {shippingInfo.phoneNo}
                  </span>
                </p>
                <p>
                  <b className="info-box-p-b">Address</b>{" "}
                  <b className="info-box-p-b2">:</b>{" "}
                  <span className="info-box-p-span">
                    {shippingInfo.address},{shippingInfo.addressLine},{shippingInfo.city},{shippingInfo.postalCode},
                    {shippingInfo.state},{shippingInfo.country}
                  </span>
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-lg-6 col-md-12 col-12 cartRightBox">
              <h1 className="hd">Billing Info :</h1>
              <div class="info-box">
                <p>
                  <b className="info-box-p-b">Name</b>{" "}
                  <b className="info-box-p-b2">:</b>{" "}
                  <span className="info-box-p-span">{billingInfo.name}</span>
                </p>
                <p>
                  <b className="info-box-p-b">Organization name</b>{" "}
                  <b className="info-box-p-b2">:</b>
                  <span className="info-box-p-span">{billingInfo.organizationName}</span>
                </p>
                <p>
                  <b className="info-box-p-b">GST</b>{" "}
                  <b className="info-box-p-b2">:</b>
                  <span className="info-box-p-span">{billingInfo.gstNumber}</span>
                </p>
                <p>
                  <b className="info-box-p-b">Phone</b>{" "}
                  <b className="info-box-p-b2">:</b>
                  <span className="info-box-p-span">{billingInfo.phoneNo}</span>
                </p>
                <p>
                  <b className="info-box-p-b">Address</b>{" "}
                  <b className="info-box-p-b2">:</b>{" "}
                  <span className="info-box-p-span">
                    {" "}
                    {billingInfo.address}, {billingInfo.addressLine},{" "}
                    {billingInfo.city}, {billingInfo.postalCode},{" "}
                    {billingInfo.state}, {billingInfo.country}{" "}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-fluid cartSection mb-5">
        <div className="container-fluid">
          <div className="row">
            {/* Left Section */}
            <div className="col-lg-8 col-md-12 col-12">
              <h1 className="hd">YOUR ORDER ITEMS :</h1>
              <div className="cartWrapper mt-4">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Unit Price</th>
                        <th>Subtotal</th>
                      </tr>
                    </thead>
                    {cartItems.map((item) => (
                      <tbody key={item._id}>
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
                          <td width="10%">
                            <div className="d-flex align-items-center justfy-items-center">
                              <span>{item.quantity} </span>
                            </div>
                          </td>
                          <td width="10%">
                            <span>₹{item.price}</span>
                          </td>
                          <td width="10%">
                            <span>₹{item.quantity * item.price}</span>
                          </td>
                        </tr>
                      </tbody>
                    ))}
                  </table>
                </div>
              </div>
            </div>

            {/* Right Section */}
            <div className="col-lg-4 col-md-12 col-12 cartRightBox">
              <h1 className="hd">ORDER SUMMARY :</h1>
              <div className="card p-4">
                <div className="d-flex align-items-center mb-4">
                  <h5 className="mb-0 text-light">Subtotal:</h5>
                  <h3 className="ml-auto mb-0 ">₹{itemsPrice.toFixed(2)}</h3>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <h5 className="mb-0 text-light">Shipping: </h5>
                  <h3 className="ml-auto mb-0 ">₹{shippingPrice}</h3>
                </div>
                <div className="d-flex align-items-center mb-4">
                  <h5 className="mb-0 text-light">GST 18% :</h5>
                  <h3 className="ml-auto mb-0 ">₹{totalTax}</h3>
                </div>
                <hr />
                <div className="d-flex align-items-center mb-2">
                  <h5 className="mb-0 text-light">Total:</h5>
                  <h3 className="ml-auto mb-0 ">₹{totalPrice}</h3>
                </div>
                <br />
                <Button
                  id="checkout_btn"
                  className="btn-g btn-lg"
                  onClick={processPayment}
                >
                  Proceed to Payment
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

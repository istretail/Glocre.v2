import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { userOrders as userOrdersAction } from "../../actions/orderActions";
import { Link } from "react-router-dom";
import {
  removeCartItemFromCart,
  updateCartItemQuantityInCart,
  getCartItemsFromCart,
} from "../../actions/cartActions";
import { removeCartItem, updateCartItemQuantity } from "../../slices/cartSlice";
import empty from "../../images/cartempty.png";
import "../cart/cart.css";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@mui/material";
import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import HomeIcon from "@mui/icons-material/Home";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Nav from "../layouts/nav";

export default function UserOrders() {
  const { userOrders = [] } = useSelector((state) => state.orderState);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userOrdersAction);
  }, []);

  return (
    <>
      <Nav />
      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li> My Orders</li>
          </ul>
        </div>
      </div>

      <Fragment>
        <MetaData title={"My Orders | GLOCRE"} />
        {userOrders.length === 0 ? (
          <>
            <div className="empty d-flex align-items-center justify-content-center flex-column mb-5">
              <Link to="/">
                <img src={empty} alt="image" height="150px" />
              </Link>
              <h3> Orders page is currently empty</h3>
              <br />
              <Link to="/">
                <Button className="btn-g bg-g btn-lg btn-big btn-round">
                  <HomeIcon /> &nbsp; Continue Shopping
                </Button>
              </Link>
            </div>
          </>
        ) : (
          <Fragment>
            <div className="container-fluid">
              <h1 className="hd mb-0"> My Orders</h1>
              <p>
                There are{" "}
                <span className="text-g">
                  <b>{userOrders.length}</b>
                </span>{" "}
                products in My Orders
              </p>
            </div>

            <section className="cartSection mb-5">
              <div className="container-fluid">
                <div className="row d-flex">
                  {/* Left Section */}
                  <div className="col-md-12 col-12">
                    <div className="cartWrapper mt-4">
                      <div className="table-responsive">
                        <table className="table">
                          <thead>
                            <tr>
                              <th style={{minWidth:"200px"}}>Order ID</th>
                              <th style={{minWidth:"200px"}}>Number of Items</th>
                              <th style={{minWidth:"200px"}}>Amount</th>
                              <th style={{minWidth:"200px"}}>Status</th>
                              <th style={{minWidth:"150px"}}>Actions</th>
                            </tr>
                          </thead>

                          {userOrders.map((items) => (
                            <tbody>
                              <tr>
                                <td>
                                  <span>{items.clocreOrderId}</span>
                                </td>
                                <td>
                                  <span>{items.orderItems.length}</span>
                                </td>
                                <td>
                                  <span>Rs: {items.totalPrice}</span>
                                </td>
                                <td>
                                  <span>{items.orderStatus}</span>
                                </td>
                                <td>
                                  <Link
                                    to={`/order/${items._id}`}
                                    className="btn"
                                    style={{backgroundColor:"#ffad63", color:"#fff"}}
                                  >
                                    <i className="fa fa-eye"></i>
                                  </Link>
                                </td>
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
                </div>
              </div>
            </section>
          </Fragment>
        )}
      </Fragment>
    </>
  );
}

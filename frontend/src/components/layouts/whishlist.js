import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import { useDispatch, useSelector } from "react-redux";
import { fetchWishlist, removeFromWishlist } from "../../actions/userActions";
import Loader from "../layouts/Loader";
import { logEvent } from "../../actions/analyticsActions";
import empty from "../../images/wishlist.png";
import Nav from "./nav";

export default function Wishlist() {
  const { wishlist: items = [], loading } = useSelector(
    (state) => state.wishlistState,
  );
  const { user } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchWishlist());
  }, [dispatch]);

  const removeItemHandler = (productId) => {
    dispatch(removeFromWishlist(productId));
    // dispatch(fetchWishlist());
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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

  return (
    <>
      <Nav />

      <div className="breadcrumbWrapper mb-4">
        <div className="container-fluid">
          <ul className="breadcrumb breadcrumb2 mb-0">
            <li>
              <Link to={"/"}>Home</Link>
            </li>
            <li>My List</li>
          </ul>
        </div>
      </div>

      <section className="cartSection mb-5">
        <div className="container-fluid">
          <div className="row">
            <div className="col-md-12">
              <div className="myListWrapper">
                <div className="d-flex align-items-center w-100">
                  <div className="left">
                    <h1 className="hd mb-0">My List</h1>
                    <p>
                      There are{" "}
                      <span className="text-g">
                        <b>{items.length}</b>
                      </span>{" "}
                      products in your Wishlist
                    </p>
                  </div>
                </div>

                {loading ? (
                  <Loader />
                ) : items.length === 0 ? (
                  <div className="empty d-flex align-items-center justify-content-center flex-column mt-5">
                    <img src={empty} alt="Empty Wishlist" width="100" />
                    <br />
                    <h3>Your Wishlist is currently empty</h3>
                    <br />
                    <Link to="/">
                      <Button className="btn-g bg-g btn-lg btn-big btn-round">
                        <HomeIcon /> &nbsp; Continue Shopping
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="cartWrapper mt-4">
                    <div className="table-responsive">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>Product</th>
                            <th>Brand</th>
                            <th>OffPrice</th>
                            <th>Price</th>
                            <th>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {items.map((item) => (
                            <tr key={item._id}>
                              <td width={"50%"}>
                                <div className="d-flex align-items-center">
                                  <div className="img">
                                    <Link to={`/products/${item._id}`}>
                                      <img
                                        src={
                                          item?.images?.[0] ||
                                          item?.variants?.[0]?.images?.[0] ||
                                          item?.variants?.[1]?.images?.[0] ||
                                          "/images/default.jpg"
                                        }
                                        className="w-100"
                                        alt={item.name}
                                      />
                                    </Link>
                                  </div>
                                  <div className="info pl-4">
                                    <Link to={`/products/${item._id}`}>
                                      <h4>{item.name}</h4>
                                    </Link>
                                  </div>
                                </div>
                              </td>

                              <td width="10%">
                                <span>{item.brand}</span>
                              </td>
                              <td width="10%">
                                <span>Rs: ₹{item?.offPrice || item?.variants?.[0]?.offPrice || item?.variants?.[1]?.offPrice }.00/-</span>
                              </td>
                              <td width="10%">
                                <span>Rs: ₹{item?.price || item?.variants?.[0]?.price || item?.variants?.[1]?.price}.00/-</span>
                              </td>
                              <td width="10%">
                                <span className="cursor">
                                  <DeleteOutlineOutlinedIcon
                                    onClick={() => removeItemHandler(item._id)}
                                    style={{ color: "red", cursor: "pointer" }}
                                  />
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import React, { useEffect } from "react";
import "../layouts/nav.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProducts } from "../../actions/productActions";
import { toast } from "react-toastify";

export default function Nav() {
  const dispatch = useDispatch();
  const { products = [], error, resPerPage } = useSelector((state) => state.productsState);
  const navigate = useNavigate();
  // Get unique maincategories from products
  const availableMainCategories = [
    ...new Set(products.map((product) => product.maincategory).filter(Boolean)),
  ];

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch(getProducts(null, null, null, null, null, null, resPerPage));
  }, [dispatch]);

  const handleCategoryClick = (category) => {
    navigate(`/category/${category}`);
  };
  return (
    <div className="nav d-flex align-items-center">
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-2 part1 d-flex align-items-center">
            <nav>
              <li className="list-inline-item sec-nav-pro">
                <Button className="bg-g text-white catTab res-hide">
                  <GridViewIcon /> &nbsp;Browse All Availabe Categories{" "}
                  <KeyboardArrowDownIcon />
                </Button>
                <div className="dropdown_menu">
                  <ul className="mb-0 p-0">
                    {availableMainCategories?.map((main) => (
                      <li key={main} onClick={() => handleCategoryClick(main)}>
                        <HomeIcon className="icon-sec-nav" /> {main}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </nav>
          </div>

          <div className="col-sm-8 part2 position-static">
            <nav>
              <ul className="list list-inline mb-0">
                <li className="list-inline-item sec-nav-pro">
                  Electricals <KeyboardArrowDownIcon className="rotateIcon" />
                </li>
                <li className="list-inline-item sec-nav-pro">Power Tools</li>
                <li className="list-inline-item sec-nav-pro">Pumps & Motors</li>
                <li className="list-inline-item sec-nav-pro">
                  Office Stationery & Supplies
                </li>
                <li className="list-inline-item sec-nav-pro">Medical Supplies</li>
              </ul>
            </nav>
          </div>

          <div className="col-sm-2 part3 d-flex align-items-center">
            <div className="phNo d-flex align-items-center ml-auto">
              <span>
                <HeadphonesOutlinedIcon />
              </span>
              <div className="info ml-3">
                <Link to={"/support"}>
                  <p className="mb-0">24/7 Support Center</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

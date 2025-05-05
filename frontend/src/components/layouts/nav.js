import React, { useEffect } from "react";
import "../layouts/nav.css";
import { Link } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../actions/productActions";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export default function Nav1() {
  const dispatch = useDispatch();
  const { categories = [], error } = useSelector((state) => state.categoryState);
  const navigate = useNavigate();



  useEffect(() => {
    if (error) {
      toast.error(error);
    }
    dispatch(getCategories());
  }, [dispatch, error]);

  const handleCategoryClick = (category) => {
    navigate(`/maincategory/${category}`);
  };
  const handleSubCategoryClick = (category) => {
    navigate(`/maincategory/${category}`);
  };
  return (
    <>
      <nav className="Mobile-second-nav respon-nav headerWrapper1" >
        <div class="nav-container">
          <div class="logo me-5">
            <ul class="menu">
              <li className="list-inline-item sec-nav-pro">
                <Button className="bg-g text-white catTab res-hide" style={{ border: "none" }}>
                  <GridViewIcon /> &nbsp; Categories
                  <KeyboardArrowDownIcon />
                </Button>

                <div className="dropdown_menu">
                  <ul className="mb-0 p-2" style={{ border: "1px solid #ccc" }}>
                    {categories.map((main, i) => (
                      <li
                        style={{ fontSize: "13px" }}
                        key={i}
                        onClick={() => handleCategoryClick(main.maincategory)}
                      >
                        <HomeIcon className="icon-sec-nav me-2" style={{ fontSize: "20px" }} /> {main.maincategory}
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          <input type="checkbox" id="toggle" />
          <label for="toggle" class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </label>

          <ul className="list list-inline mb-0 menu">
            {categories.flatMap((main) =>
              main.categories?.map((cat) => ({
                maincategory: main.maincategory,
                category: cat.category,
                subcategories: cat.subcategories || []
              }))
            ).slice(0, 5).map((catItem, i) => (
              <li className="list-inline-item sec-nav-pro dropdown-hover" key={i}>
                {catItem.category}
                <ul className="dropdown_menu mt-1" style={{ border: "1px solid #ccc" }}>
                  {catItem.subcategories.map((sub, j) => (
                    <li
                      key={j}
                      onClick={() => navigate(`/maincategory/${catItem.maincategory}`, {
                        state: {
                          category: catItem.category,
                          subcategory: sub,
                        },
                      })}
                    >
                      {sub}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
}


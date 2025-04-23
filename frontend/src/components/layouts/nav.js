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
import { getCategories } from "../../actions/productActions";
import { toast } from "react-toastify";

export default function Nav() {
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
                    {categories.map((main, i) => (
                      <li
                        key={i}
                        onClick={() => handleCategoryClick(main.maincategory)}
                      >
                        <HomeIcon className="icon-sec-nav" /> {main.maincategory}
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
                {categories.flatMap((main) =>
                  main.categories?.map((cat) => ({
                    maincategory: main.maincategory,
                    category: cat.category,
                    subcategories: cat.subcategories || []
                  }))
                ).slice(0, 7).map((catItem, i) => (
                  <li className="list-inline-item sec-nav-pro dropdown-hover" key={i}>
                    {catItem.category}
                    <ul className="sub-dropdown">
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

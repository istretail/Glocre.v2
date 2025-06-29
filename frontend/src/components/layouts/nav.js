import React, { useEffect } from "react";
import "../layouts/nav.css";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import HomeIcon from "@mui/icons-material/Home";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../actions/productActions";
import { toast } from "react-toastify";
import Button from 'react-bootstrap/Button';
 import { Dropdown } from "react-bootstrap";


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
 
  // Prepare the first 5 category items flattened as you did
  const flatCategories = categories
    .flatMap((main) =>
      main.categories?.map((cat) => ({
        maincategory: main.maincategory,
        category: cat.category,
        subcategories: cat.subcategories || [],
      }))
    )
    .slice(0, 5);


  return (
    <>
      <nav className="Mobile-second-nav respon-nav headerWrapper1" >
        <div class="nav-container">
          <div class="logo me-5">

            <div class="menu-wraper d-xl-block d-none">

              <Button className="bg-g text-white catTab res-hide" style={{ border: "none" }}>
                <GridViewIcon /> &nbsp; Categories
                <KeyboardArrowDownIcon />
              </Button>

              <div class="menu-content" id="wstabitem-loader">
                <ul class="main-category desktop-mega-menu">
                  {categories.map((main, i) => (
                    <li class="has-child-menu" key={i}
                      onClick={() => handleCategoryClick(main.maincategory)}>
                      <a >
                        <HomeIcon className="icon-sec-nav me-2" />
                        {main.maincategory}
                      </a>
                    </li>
                  ))}
                </ul>

              </div>
            </div>
          </div>

          <input type="checkbox" id="toggle" />
          <label for="toggle" class="hamburger">
            <span></span>
            <span></span>
            <span></span>
          </label>

          {/* <ul className="list list-inline mb-0 menu">
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
          </ul> */}


          <ul className="list list-inline mb-0 menu">
            {flatCategories.map((catItem, i) => (
              <li className="" key={i}>
                <Dropdown>
                  <Dropdown.Toggle
                    variant="light"
                    id={`dropdown-${i}`}
                    className="text-dark"
                    style={{ backgroundColor: "transparent", border: "none", boxShadow: "none" }}

                  >
                    {catItem.category}
                  </Dropdown.Toggle>

                  <Dropdown.Menu
                    style={{ border: "1px solid #ccc", padding: "7px" }}
                  >
                    {catItem.subcategories.map((sub, j) => (
                      <Dropdown.Item
                        key={j}
                        onClick={() =>
                          navigate(`/maincategory/${catItem.maincategory}`, {
                            state: {
                              category: catItem.category,
                              subcategory: sub,
                            },
                          })
                        }
                      >
                        {sub}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </li>
            ))}
          </ul>


        </div>
      </nav>
     
    </>
  );
}


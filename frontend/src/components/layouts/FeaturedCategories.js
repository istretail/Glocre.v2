import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getCategories } from "../../actions/productActions";// update with your correct path
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import fe1 from '../../images/fea.webp'
import fe2 from '../../images/fe-icons/safety-suit.webp'
import fe3 from '../../images/fe-icons/appliances.webp'
import fe4 from '../../images/fe-icons/device.webp'
import fe5 from '../../images/fe-icons/crane.webp'
import fe6 from '../../images/fe-icons/home-appliance.webp'
import fe7 from '../../images/fe-icons/motherboard.webp'
import fe8 from '../../images/fe-icons/mechanical.webp'
const categoryImageMap = {
  "Personal Protective Equipment (PPE) and Safety Gear": fe2,
  "Electrical Instruments and Appliances": fe6,
  "Industrial Tools and Machinery": fe5,
  "Electronic Components": fe7,
  "Mechanical Components": fe8,
  "Home Appliances": fe3,
  "Gadgets": fe1,
  "Medical, Laboratory and Hospital Equipment": fe1,
  "Office Supplies and Stationery": fe4,
  "Automotive Parts and Accessories": fe1,
  "Construction and Building Materials": fe1,
  "Farming and Agricultural Tools": fe1,
  "Packaging Solutions and Material Handling Equipment": fe1,
  "Food and Beverage Products": fe1,
  "Apparel and Fashion Items": fe1,
  "Toys and Games": fe1,
  "Electric Switchgear and Accessories": fe1,
  "Electric Panel Bleeding – Causes, Safety Measures, and Tools": fe1,
  "Clean Room Components and Equipment": fe1
};

const bgColors = ["#ecffec", "#fdeee9", "#d3ffd9", "#fdf0ff", "#def3ff", "#e3fffa", "#fff8e1", "#f0f4c3"];

const FeaturedCategories = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { categories = [], error } = useSelector((state) => state.categoryState);

  useEffect(() => {
    if (error) toast.error(error);
    dispatch(getCategories());
  }, [dispatch, error]);

  // Flatten the categories: mainCategory -> category -> subcategory
  const flattenedCategories = useMemo(() => {
    const categoryList = [];

    categories.forEach(({ maincategory, categories }) => {
      categories.forEach(({ category }) => {
        categoryList.push({
          mainCategory: maincategory,
          category,
        });
      });
    });

    return categoryList;
  }, [categories]);
  

  // Randomly select 8 subcategories to display
  const featuredItems = useMemo(() => {
    const shuffled = [...flattenedCategories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 8);
  }, [flattenedCategories]);
  
console.log("Featured Items:", featuredItems);
  return (
    <div className="catSliderSection">
      <h2 className="hd ms-3">Featured Categories</h2>
      <div className="">
        <div className="cat_slider_Main" id="cat_slider_Main">
          {featuredItems.map((item, i) => {
            const imageSrc = categoryImageMap[item.mainCategory] || "/icons/default.png";
            const bgColor = bgColors[i % bgColors.length];

            return (
              <div
                className="item"
                key={i}
                // onClick={() => navigate(`/products?category=${encodeURIComponent(item.category)}`)}
                onClick={() =>
                  navigate(`/maincategory/${item.mainCategory}`, {
                    state: {
                      category: item.category,
                      // subcategory: sub,
                    },
                  })
                }
                style={{ cursor: "pointer" }}
              >
                <div className="info" style={{ background: bgColor }}>
                  <img src={imageSrc} alt={item.category} width="80%" />
                </div>
                <h5 className="text-capitalize text-center">{item.category}</h5>
              </div>
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default FeaturedCategories;

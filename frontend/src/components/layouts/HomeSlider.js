import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Slider from "react-slick";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { getBanners } from "../../actions/userActions";
import "react-lazy-load-image-component/src/effects/blur.css";
import "../layouts/Header.css";
import Nav from "./nav";
import Featured1 from "../../images/fea.webp";
import Featured2 from "../../images/fea2.webp";
import Featured3 from "../../images/fea3.webp";
import Featured4 from "../../images/fea4.webp";
import Featured5 from "../../images/fea5.webp";
import Featured6 from "../../images/fea6.webp";

export default function Slideshow() {
  const dispatch = useDispatch();
  const { banners = [] } = useSelector((state) => state.authState); // update path if different

  useEffect(() => {
    dispatch(getBanners());
  }, [dispatch]);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
    autoplay: true,
  };

  return (
    <>
      <section className="homeSlider">
        <div className="container-fluid position-relative">
          <Slider {...settings} className="home_slider_Main">
            {banners.map((banner, index) => (
              <div className="item" key={index}>
                <LazyLoadImage
                  src={banner.url}
                  className="w-100"
                  effect="blur"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))}
          </Slider>
        </div>
      </section>

      <Nav />
      <CatSlider />
    </>
  );
}

const CatSlider = () => {
  return (
    <>
      <div className="catSliderSection">
        <h2 className="hd ms-3">Featured Categories</h2>
        <div className="container">
          <div className=" cat_slider_Main" id="cat_slider_Main">
            <div className="item">
              <div className="info" style={{ background: "#ecffec" }}>
                <img src={Featured1} width="80%" />
              </div>
              <h5 className="text-capitalize">Electricals</h5>
            </div>
            <div className="item">
              <div className="info" style={{ background: "#fdeee9" }}>
                <img src={Featured2} width="80%" />
              </div>
              <h5 className="text-capitalize">Power Tools</h5>
            </div>
            <div className="item">
              <div className="info" style={{ background: "#d3ffd9" }}>
                <img src={Featured3} width="80%" />
              </div>
              <h5 className="text-capitalize">Pumps & Motors</h5>
            </div>
            <div className="item">
              <div className="info" style={{ background: "#fdf0ff" }}>
                <img src={Featured4} width="80%" />
              </div>
              <h5 className="text-capitalize">Office Stationery & Supplies</h5>
            </div>
            <div className="item">
              <div className="info" style={{ background: "#def3ff" }}>
                <img src={Featured5} width="80%" />
              </div>
              <h5 className="text-capitalize">Featured</h5>
            </div>
            <div className="item">
              <div className="info" style={{ background: "#e3fffa" }}>
                <img src={Featured6} width="80%" />
              </div>
              <h5 className="text-capitalize">Medical Supplies</h5>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

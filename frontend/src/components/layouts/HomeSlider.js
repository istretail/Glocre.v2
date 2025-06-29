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
import FeaturedCategories from "./FeaturedCategories";
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
      {/* <section className="homeSlider">
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
      </section> */}

      <div className="container-fluid carousel-pad">
        <div
          id="carouselExample"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          data-bs-interval="3000"
          data-bs-pause="false"
        >
          <div className="carousel-inner" style={{ borderRadius: "10px" }}>
            {banners.map((banner, index) => (
              <div className={`carousel-item ${index === 0 ? "active" : ""}`} key={index}>
                <img
                  src={banner.url}
                  className="d-block w-100"
                  alt={`Slide ${index + 1}`}
                  style={{ pointerEvents: "none", userSelect: "none" }}
                  onContextMenu={(e) => e.preventDefault()}
                />
              </div>
            ))}
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="prev"
          >
            <span className="custom-arrow-icon" aria-hidden="true">&#8592;</span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExample"
            data-bs-slide="next"
          >
            <span className="custom-arrow-icon" aria-hidden="true">&#8594;</span>
            <span className="visually-hidden">Next</span>
          </button>

        </div>
      </div>

      <Nav />
      <FeaturedCategories />
    </>
  );
}



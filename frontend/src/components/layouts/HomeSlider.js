import Slider from "react-slick";
import "../layouts/Header.css";
import slide1 from "../../images/banner (1).webp";
import slide2 from "../../images/banner (2).webp";
import slide3 from "../../images/banner (3).webp";
import slide4 from "../../images/banner (4).webp";
import slide5 from "../../images/banner (5).webp";
import slide6 from "../../images/banner (6).webp";
import Featured1 from "../../images/fea.webp";
import Featured2 from "../../images/fea2.webp";
import Featured3 from "../../images/fea3.webp";
import Featured4 from "../../images/fea4.webp";
import Featured5 from "../../images/fea5.webp";
import Featured6 from "../../images/fea6.webp";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import React, { useEffect, useRef, useState, useContext } from "react";
import Nav from "./nav";

const images = [slide1, slide2, slide3, slide4, slide5, slide6];

export default function Slideshow() {
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
        <div className="container position-relative">
          <Slider {...settings} className="home_slider_Main">
            {images.map((image, index) => (
              <div className="item" key={index}>
                <LazyLoadImage
                  src={image}
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

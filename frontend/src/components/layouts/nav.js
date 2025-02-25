import React, { useEffect, useContext } from "react";
import "../layouts/nav.css";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import GridViewIcon from "@mui/icons-material/GridView";
import HeadphonesOutlinedIcon from "@mui/icons-material/HeadphonesOutlined";
import Logo from "../../images/procure-g-logo.png";
import HomeIcon from "@mui/icons-material/Home";
import BuildIcon from "@mui/icons-material/Build";
import WaterIcon from "@mui/icons-material/Water";
import SchoolIcon from "@mui/icons-material/School";
import MedicalServicesIcon from "@mui/icons-material/MedicalServices";

export default function Nav() {
  return (
    <>
      <div className="nav d-flex align-items-center">
        <div className="container-fluid">
          <div className="row ">
            <div className="col-sm-2 part1 d-flex align-items-center">
              <nav>
                <li className="list-inline-item sec-nav-pro">
                  {" "}
                  <Button className="bg-g text-white catTab res-hide">
                    <GridViewIcon /> &nbsp;Browse All Categories{" "}
                    <KeyboardArrowDownIcon />
                  </Button>
                  <div className="dropdown_menu">
                    <ul className="mb-0">
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Personal
                        Protective Equipment (PPE) & Safety Gear
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Industrial Tools &
                        Machinery
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Electrical
                        Instruments & Appliances
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Home Appliances
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Gadgets
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Medical,
                        Laboratory & Hospital Equipment
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Office Supplies &
                        Stationery
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Automotive Parts &
                        Accessories
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Construction &
                        Building Materials
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Farming &
                        Agricultural Tools
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Packaging
                        Solutions & Material Handling Equipment
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Food & Beverage
                        Products
                      </li>
                      <li>
                        <HomeIcon className="icon-sec-nav" /> Apparel & Fashion
                        Items
                      </li>
                    </ul>
                  </div>
                </li>
              </nav>
            </div>

            <div className="col-sm-8 part2 position-static">
              <nav>
                <ul className="list list-inline mb-0">
                  <li className="list-inline-item sec-nav-pro">
                    {" "}
                    Electricals
                    <KeyboardArrowDownIcon className="rotateIcon" />
                  </li>
                  <li className="list-inline-item sec-nav-pro"> Power Tools</li>
                  <li className="list-inline-item sec-nav-pro">
                    {" "}
                    Pumps & Motors
                  </li>
                  <li className="list-inline-item sec-nav-pro">
                    {" "}
                    Office Stationery & Supplies
                  </li>
                  <li className="list-inline-item sec-nav-pro">
                    {" "}
                    Medical Supplies
                  </li>
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
    </>
  );
}

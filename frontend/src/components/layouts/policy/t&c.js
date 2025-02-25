import React from "react";
import "./tc.css";
import Nav from "../nav.js";

export default function TermsConditions() {
  return (
    <>
      <Nav />
      {/* Terms & Conditions */}
      <body className="body-tc-glc">
        <section className="container">
          {/* Heading */}
          <div className="heading-tc-glc">
            <h1>Terms & Conditions </h1>
            <h4>Effective Date: 08-02-2025</h4>
            <p>
              Welcome to GLOCRE! By accessing or using our website, glocre.com,
              you agree to comply with and be bound by the following Terms and
              Conditions. Please read these terms carefully before using our
              site. If you do not agree to these terms, you must not use our
              website. These Terms and Conditions apply to all visitors, users,
              and others who wish to access or use Glocre.com.
            </p>
          </div>
          {/* Contents */}
          <div className="">
            <div className="contents-tc-glc">
              <h6>1. Account & User Eligibility </h6>
              <p>
                In order to access certain features of our website, including
                the ability to purchase products, users are required to create
                an account.{" "}
              </p>
              <ul>
                <li>
                  <b>Guest Users:</b>You may browse our website as a guest
                  without creating an account; however, to complete a purchase
                  or checkout process, you must create an account with valid
                  credentials.{" "}
                </li>
                <li>
                  <b>Age Requirements: </b>To make a purchase on Glocre.com, you
                  must be at least 16 years old. We verify this age requirement
                  through mobile number registration and the availability of
                  acceptable payment methods. By agreeing to these Terms, you
                  represent that you meet the age requirement.{" "}
                </li>
                <li>
                  <b>Account Responsibilities:</b>You are responsible for
                  maintaining the confidentiality of your account and password,
                  and you agree to accept responsibility for all activities that
                  occur under your account. If you suspect any unauthorized use
                  of your account, please contact us immediately.
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>2. Prohibited Activities </h6>
              <p>
                To maintain a safe and fair environment for all users, we have
                outlined certain activities that are strictly prohibited on
                Glocre.com:{" "}
              </p>
              <ul>
                <li>
                  <b>Fraudulent Transactions:</b>You are prohibited from
                  engaging in any fraudulent activity, including but not limited
                  to the misuse of payment methods or conducting transactions
                  with intent to deceive.
                </li>
                <li>
                  <b>Violation of Laws:</b>You agree not to use the website in
                  any manner that violates local, state, national, or
                  international laws or regulations. This includes, but is not
                  limited to, actions related to data protection, intellectual
                  property, or consumer protection laws.{" "}
                </li>
                <li>
                  <b>Copyright & Content Infringement:</b> Copying, reproducing,
                  or imitating the content found on Glocre.com, such as product
                  listings, images, or the website’s design, without express
                  written permission, is strictly prohibited. Any violation of
                  intellectual property rights will result in legal
                  actions.{" "}
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>3. Orders & Payments </h6>
              <p>
                When you place an order on Glocre.com, you agree to the
                following terms regarding payment and order processing:{" "}
              </p>
              <ul>
                <li>
                  <b>Secure Payment Processing:</b>Payments for purchases are
                  processed securely via a third-party payment collection
                  platform (e.g., Razor Pay). We ensure that your payment
                  information is handled with the utmost security using
                  industry-standard encryption protocols.
                </li>
                <li>
                  <b>Order Cancellation: </b>Once an order is processed, it
                  cannot be canceled. However, if you need to modify an order
                  (e.g., add additional quantities), you must contact us at
                  support@glocre.com within 2 hours of placing the order. Any
                  modification request outside of this window may not be
                  entertained.{" "}
                </li>
                <li>
                  <b>Order Confirmation: </b>After placing an order, you will
                  receive an order confirmation email. Please review the details
                  of your order immediately. If there are any discrepancies,
                  contact us at support@glocre.com within the cancellation or
                  modification window.{" "}
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>4. Product Warranty & Liability </h6>
              <ul>
                <li>
                  <b>No Warranty Provided by GLOCRE:</b>Products listed on
                  Glocre.com are provided by various vendors. As such, GLOCRE
                  does not offer any direct warranties on the products sold
                  through the platform. The warranty, if any, is provided solely
                  by the vendor, and you should refer to the vendor's policies
                  for specific warranty details.
                </li>
                <li>
                  <b>Liability Disclaimer: </b> GLOCRE is not liable for any
                  defects, damages, or issues arising from the products sold by
                  third-party vendors. Any claims for defective products or
                  damages must be directed to the respective vendor in
                  accordance with their warranty policy.{" "}
                </li>
                <li>
                  <b>Limitation of Liability:</b>To the fullest extent permitted
                  by applicable law, GLOCRE shall not be liable for any
                  indirect, incidental, special, consequential, or punitive
                  damages resulting from the use of our website or the products
                  purchased. Our liability is limited to the amount you paid for
                  the product in question.{" "}
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>5. Changes to Terms </h6>
              <p>
                We reserve the right to update, modify, or revise these Terms
                and Conditions at any time. These changes may include updates to
                the rules regarding user conduct, privacy practices, and other
                terms. When updates are made, we will post the revised terms on
                this page and update the "Effective Date" at the top.{" "}
              </p>
              <ul>
                <li>
                  <b>Your Continued Use:</b>By continuing to use Glocre.com
                  after such changes are posted, you agree to the modified
                  terms. We encourage you to periodically review these Terms and
                  Conditions to stay informed about any updates.
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>6. Governing Law </h6>
              <p>
                These Terms and Conditions shall be governed by and construed in
                accordance with the laws of the jurisdiction in which Glocre.com
                operates. Any disputes arising out of or related to these terms
                will be subject to the exclusive jurisdiction of the courts
                located within that jurisdiction.
              </p>
            </div>
            <div className="contents-tc-glc">
              <h6>7. Contact Information </h6>
              <p>
                If you have any questions about these Terms and Conditions,
                please contact us at:{" "}
              </p>
              <p style={{ fontSize: "22px", margin: "20px 0" }}>
                {" "}
                Email: <b style={{ color: "#ffad63" }}>support@glocre.com</b>
              </p>
              <p>
                {" "}
                Our customer support team is available to assist with any
                inquiries or concerns you may have regarding our Terms and
                Conditions.{" "}
              </p>
            </div>
          </div>
        </section>
      </body>
    </>
  );
}

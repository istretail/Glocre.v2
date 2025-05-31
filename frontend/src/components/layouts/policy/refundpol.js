import React from "react";
import "./tc.css";
import Nav from "../nav.js";
import MetaData from "../MetaData.js";

export default function RefundPolicy() {
  return (
    <>
    <MetaData title="Terms & Conditions | GLOCRE" />
      <Nav />
      {/* Terms & Conditions */}
      <body className="body-tc-glc">
        <section className="container">
          {/* Heading */}
          <div className="heading-tc-glc">
            <h1>Return & Refund Policy </h1>
            <h4>Effective Date: 05-01-2025 </h4>
            <p>
              At GLOCRE, we are committed to ensuring your satisfaction with
              every purchase. If you are not completely happy with your order,
              we offer a clear and straightforward process for returns and
              refunds. Please review the details of our policy below to
              understand the conditions under which returns and refunds are
              accepted, as well as the steps to initiate the process.{" "}
            </p>
          </div>
          {/* Contents */}
          <div className="">
            <div className="contents-tc-glc">
              <h6>1. Return Eligibility</h6>
              <p>
                We understand that sometimes a product may not meet your
                expectations, and we want to make it easy for you to return it.
                You can return eligible products within 7 days of delivery. To
                be eligible for a return, the following conditions must be
                met:{" "}
              </p>
              <ul>
                <li>
                  <b>Return Eligibility Criteria:</b>The product must be unused,
                  in its original packaging, and include all accessories (if
                  any).{" "}
                </li>
                <li>
                  <b>Non-returnable items:</b>Non-returnable items: Some
                  products are marked as non-returnable and are not eligible for
                  return or refund under any circumstances. These items will be
                  clearly identified on the product page before purchase, so
                  please check carefully before completing your order.{" "}
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>2. Return Process</h6>
              <p>
                If you wish to return a product for a valid reason, you will
                need to follow these steps:
              </p>
              <ul>
                <li>
                  <b>Contact Us: </b>You must contact our customer support team
                  by emailing us at support@glocre.com. Please include the order
                  details and a reason for the return in your email. The subject
                  line should include "Return: Order ID" and must be sent from
                  the email address you used to place the order.
                </li>
                <li>
                  <b>Review & Approval:</b>Once we receive your request, our
                  team will review the details and assess the eligibility of
                  your return. You will receive an acceptance email from us
                  confirming whether your return has been approved.{" "}
                </li>
                <li>
                  <b>Return Shipping Costs:</b>The cost of return shipping will
                  depend on the specific circumstances of your return. This will
                  be clearly communicated to you in the acceptance email. Please
                  note that returns are only accepted once the return shipping
                  details have been confirmed and approved by us.{" "}
                </li>
                <li>
                  <b>Condition of the Product: </b> The product must be returned
                  in its original condition, unused, and with all accessories
                  and packaging intact. We cannot accept returns for items that
                  have been damaged, altered, or used in any way.{" "}
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>3. Refund Policy</h6>
              <p>
                Once we receive and verify the returned product, we will
                initiate the refund process. Refunds are issued using the
                original payment method used for the purchase. Please allow 3 to
                5 business days for the refund to be processed, starting from
                the date we verify the returned product at our premises. The
                exact timing of the refund may depend on the processing time of
                your payment provider.{" "}
              </p>

              <ul>
                <li>
                  <b>Refund Processing:</b>Once we receive and verify the
                  returned product, we will initiate the refund process. Refunds
                  are issued using the original payment method used for the
                  purchase. Please allow 3 to 5 business days for the refund to
                  be processed, starting from the date we verify the returned
                  product at our premises. The exact timing of the refund may
                  depend on the processing time of your payment provider.{" "}
                </li>
              </ul>
            </div>
            <div className="contents-tc-glc">
              <h6>4. Exchange Policy</h6>
              <p>
                Currently, we do not offer exchanges for any products purchased
                from GLOCRE. If you need a different product or size, we
                recommend following the return process and then placing a new
                order for the desired item.{" "}
              </p>
              <p>
                We hope this policy ensures that your experience with us remains
                simple and hassle-free. Should you have any questions or need
                assistance regarding returns, refunds, or any other concerns,
                please don’t hesitate to contact us at{" "}
                <b style={{ color: "#ffad63", fontSize: "20px" }}>
                  support@glocre.com.{" "}
                </b>
              </p>
            </div>
          </div>
        </section>
      </body>
    </>
  );
}

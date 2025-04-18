import React, {
  useEffect,
  useState,
  useRef
} from "react";
import "./Footer.css";
import Logo from "../../images/procure-g-logo.png";
import { Link } from "react-router-dom";
import { Button } from "@mui/material";

const Faqs = () => {
  useEffect(() => {
    const items = document.querySelectorAll(".accordion button");

    function toggleAccordion() {
      const itemToggle = this.getAttribute("aria-expanded");

      for (let i = 0; i < items.length; i++) {
        items[i].setAttribute("aria-expanded", "false");
      }

      if (itemToggle === "false") {
        this.setAttribute("aria-expanded", "true");
      }
    }

    items.forEach((item) => item.addEventListener("click", toggleAccordion));

    // Optional cleanup
    return () => {
      items.forEach((item) => item.removeEventListener("click", toggleAccordion));
    };
  }, []);

  return (
    <>
      < Faqs1 />
    </>
  );
};

export default Faqs;


const Faqs1 = () => {
  return (
    <>
      <div className="faqsglocre">
        <div className="container">
          <h2 className="text-center">Frequently Asked Questions</h2>
          <p className="text-center text-gray-600 max-w-xl mx-auto mt-2">
            Find quick answers to common questions about our products, shipping, returns, and more. If you can't find what you're looking for, feel free to contact our support team.
          </p>

          <div className="accordion mt-5">
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                <span className="accordion-title" > How do I place an order ? </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  To place an order, browse the products on Glocre.com, add your desired items to the cart, and proceed to checkout.Follow the steps to provide your shipping details and complete payment.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > Does Glocre sell the products directly ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, Glocre sells products directly as well as through trusted and verified sellers
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > How will my order be delivered ?

                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Your order will be delivered to your address via a reliable third - party courier service like India post, DTDC, BlueDart, Professional courier.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > How will I know
                  if my order has been placed successfully ?

                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Once your order is placed, you’ ll receive a confirmation email with the order number and details.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > What is the standard delivery time ?

                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Standard delivery usually takes 2– 10 business days, depending on your location and order volume.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > Will I be notified once my order is processed ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, you’ ll receive notifications via email as your order is processed, shipped and delivered.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > Do you accept orders over the phone ?

                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, we do accept orders over the phone;
                  however, an advance payment is required to confirm the order.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > How can I check the status of my order ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  You can check your order status by logging into your Glocre account or using the tracking link provided in your email.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > Can I place a bulk order
                  for item(s) ?

                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, bulk orders are welcome.Please contact our customer support team
                  for more details and assistance.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > The tracking status shows delivery was attempted but I wasn’ t available.Can I still receive it ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, the courier will attempt redelivery.You can also contact the delivery service or our support team to reschedule.
                </p>
              </div>
            </div>
            {/* inside */}
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                <span className="accordion-title">
                  What are the return and exchange guidelines?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p className="mb-4">
                  Currently, Glocre does not offer exchanges for any products. If you need a different item or size,
                  we recommend completing the return process and placing a new order for the desired product.
                </p>
                <p className="mb-4">
                  If you wish to return a product for a valid reason, please follow the steps below:
                </p>
                <ul className="list-disc pl-6 space-y-2 text-base text-gray-700">
                  <li>
                    Customers must contact Glocre Customer Support within < strong > 48 hours </strong> of product delivery by emailing support  @glocre.com.
                    <a href="mailto:support@glocre.com" className="text-blue-600 underline">
                      support@glocre.com
                    </a>.
                  </li>
                  <li>
                    The subject line of the email should include, <strong> "Return: Order ID" </strong>, and the request must be sent from the same email used to place the order.
                  </li>
                  <li>
                    In cases of empty packages or quantity discrepancies, customers must < strong > record a video
                      while unboxing </ strong > and share it with our support team.
                  </li>
                  <li>
                    When raising a return or replacement request, customers must provide 7– 8 clear images showing:
                    <ul className="list-disc pl-6 mt-1">
                      < li > The complete product </li>
                      < li > Outer and inner packaging / box </li>
                      < li > Shipping label </li>
                      < li > Return shipping costs will vary based on the
                        case and will be communicated clearly in the approval email.Returns will only be accepted once the
                        return shipping has been confirmed by Glocre </li>
                      < li > All returned items must be in unused and original condition, with all original packaging, tags, manuals, warranty / guarantee cards, freebies, and accessories(including keys, straps, locks, etc.) intact. </li>
                      < li > For industrial goods, returns are only accepted
                        if the product is wrong, defective, or damaged. </li>
                      < li > For faulty electronic products, customers should contact the nearest authorized service center
                        for repair or replacement under the product’ s warranty. </li>
                      < li > Glocre aims to process refunds within 7 working days from the date the
                        return request is approved by our Customer Support team. </li>
                      < li > Return, exchange, or replacement eligibility is determined by the individual seller and may vary by product category.The
                        return policy mentioned on the product page will override this general policy. </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > When is a customer not eligible for return or exchange ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Customer tried to handle the product and unable to use it which promotes any tear / damage.Made to Product(on demand) will not be returned.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > I haven’ t received my refund yet.Why ?

                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Refunds can take time due to banking procedures.If it’ s been longer than the standard refund period, please contact our support team with your order details.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > How long does it take to process a refund ?


                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Refunds are typically processed within 7– 10 business days after the returned item is received and approved.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > What payment methods are accepted on Glocre.com


                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  We accept payment through secured third - party service provider RazorPay.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > Is it safe to use my credit or debit card on Glocre ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, Glocre uses secure third - party service provider RazorPay to ensure your transaction is safe.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > Can I make card or internet banking payments through my mobile ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  Yes, our website is mobile - friendly and supports payments through cards, net banking, UPI, and wallets on mobile devices.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > What should I do if my payment fails ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  If your payment fails,
                  try again or use a different payment method.If the issue persists, contact your bank or Glocre support.
                </p>
              </div>
            </div>
            <div className="accordion-item">
              <button id="accordion-button-1" aria-expanded="false">
                < span className="accordion-title" > My transaction failed, but the amount was deducted.What should I do ?
                </span>
                <span className="icon" aria-hidden="true"></span>
              </button>
              <div className="accordion-content">
                <p>
                  If the transaction failed but money was deducted, the amount is usually refunded within 5– 7 business days.If not, please contact our support team with the transaction reference.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};


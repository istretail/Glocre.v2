import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Document,
  Image,
  Page,
  PDFDownloadLink,
  StyleSheet,
  Text,
  View,
} from '@react-pdf/renderer';
import { Fragment, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { logEvent } from '../../actions/analyticsActions';
import { orderDetail as orderDetailAction } from '../../actions/orderActions';
// import lod from "../../images/logo.png";
import Loader from '../layouts/Loader';
import './OrderDetail.css';
import Nav from '../layouts/nav';
import MetaData from '../layouts/MetaData';

export default function OrderDetail() {
  const { orderDetail, loading } = useSelector(state => state.orderState);
  const {
    shippingInfo = {},
    billingInfo = {},
    user = {},
    orderStatus = 'Processing',
    orderItems = [],
    totalPrice = 0,
    paymentInfo = {},
    createdAt = 0,
  } = orderDetail;
  const isPaid =
    paymentInfo && paymentInfo.status === 'succeeded' ? true : false;
  const dispatch = useDispatch();
  const { id } = useParams();
  const [generatePdf, setGeneratePdf] = useState(false);
  const [progress, setProgress] = useState(); // Initial progress

  const date = new Date(createdAt);

  // Add 7 days to the date
  date.setDate(date.getDate() + 7);

  // Format the date as D - M - YYYY
  const day = date.getDate();
  const month = date.getMonth() + 1; // months are 0-indexed, so add 1
  const year = date.getFullYear();

  // Format it in "D - M - YYYY" format
  const formattedDate = `${day} - ${month} - ${year}`;

  useEffect(() => {
    // Update progress based on orderStatus
    switch (orderStatus) {
      case 'Processing':
        setProgress(17);
        break;
      case 'Shipped':
        setProgress(50);
        break;
      case 'Delivered':
        setProgress(99);
        break;
      default:
        setProgress(0); // Default to initial progress
        break;
    }
  }, [orderStatus]);
  const handleGeneratePdf = () => {
    setGeneratePdf(true);
  };

  useEffect(() => {
    dispatch(orderDetailAction(id));
  }, [id, dispatch]);

  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    heading: {
      fontSize: 20,
      marginBottom: 10,
    },
    subheading: {
      fontSize: 16,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 5,
    },
    greenColor: {
      color: 'green',
    },
    redColor: {
      color: 'red',
    },
    tableContainer: {
      marginTop: 10,
      border: '1px solid #000',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottom: '1px solid #000',
      padding: 5,
    },
    tableCell: {
      width: '35%',
      padding: 3,
      fontSize: 10,
    },
    image: {
      height: '50',
      width: '50',
      marginHorizontal: '45%',
    },
  });
  useEffect(() => {
    const startTime = Date.now();
    return () => {
      const timeSpent = (Date.now() - startTime) / 1000;
      logEvent({
        event: 'page_view',
        pageUrl: window.location.pathname,
        timeSpent,
      });
    };
  }, []);

  const OrderDetailPDF = ({ orderDetail }) => (
    <Document>
      <Page size="A4">
        <View style={styles.container}>
          {/* <Image src={lod} style={styles.image} /> */}
          <Text style={styles.heading}>Order #{orderDetail._id}</Text>

          <Text style={styles.subheading}>Shipping Info</Text>
          <Text>Name: {orderDetail.user.name}</Text>
          <Text>Phone: {orderDetail.shippingInfo.phoneNo}</Text>
          <Text>
            Address: {orderDetail.shippingInfo.address},{' '}
            {orderDetail.shippingInfo.city},{' '}
            {orderDetail.shippingInfo.postalCode},{' '}
            {orderDetail.shippingInfo.state}, {orderDetail.shippingInfo.country}
          </Text>
          <Text style={styles.subheading}>Billing Info</Text>
          <Text>Name: {orderDetail.user.name}</Text>
          <Text>Phone: {orderDetail.billingInfo.phoneNo}</Text>
          <Text>
            Address: {orderDetail.billingInfo.address},{' '}
            {orderDetail.billingInfo.city}, {orderDetail.billingInfo.postalCode}
            , {orderDetail.billingInfo.state}, {orderDetail.billingInfo.country}
          </Text>
          <Text>Amount: RS.{orderDetail.totalPrice}</Text>

          <Text style={styles.subheading}>Payment</Text>
          <Text
            style={
              orderDetail.paymentInfo &&
                orderDetail.paymentInfo.status === 'paid'
                ? styles.greenColor
                : styles.redColor
            }
          >
            {orderDetail.paymentInfo &&
              orderDetail.paymentInfo.status === 'paid'
              ? 'PAID'
              : 'NOT PAID'}
          </Text>

          <Text style={styles.subheading}>Order Status</Text>
          <Text
            style={
              orderDetail.orderStatus &&
                orderDetail.orderStatus.includes('Delivered')
                ? styles.greenColor
                : styles.redColor
            }
          >
            {orderDetail.orderStatus}
          </Text>

          <Text style={styles.subheading}>Order Items</Text>
          <View style={styles.tableContainer}>
            <View style={styles.tableRow}>
              <Text style={styles.tableCell}>ID</Text>
              <Text style={styles.tableCell}>HSN</Text>
              <Text style={styles.tableCell}>Name</Text>
              <Text style={styles.tableCell}>Price</Text>
              <Text style={styles.tableCell}>Quantity</Text>
            </View>
            {orderDetail.orderItems &&
              orderDetail.orderItems.map(item => (
                <View key={item._id} style={styles.tableRow}>
                  <Text style={styles.tableCell}>{item.product}</Text>
                  <Text style={styles.tableCell}>202456</Text>
                  <Text style={styles.tableCell}>{item.name}</Text>
                  <Text style={styles.tableCell}>RS.{item.price}</Text>
                  <Text style={styles.tableCell}>{item.quantity} Piece(s)</Text>
                </View>
              ))}
          </View>
        </View>
      </Page>
    </Document>
  );

  return (
    <>
      <MetaData title={`${orderDetail.clocreOrderId} | Order Details | GLOCRE`} />
      {loading ? (
        <Loader />
      ) : (
        <section>
          {/* ORDER TRACKING */}
          <Nav />

          <div className="breadcrumbWrapper mb-4">
            <div className="container-fluid">
              <ul className="breadcrumb breadcrumb2 mb-0">
                <li>
                  <Link to={'/'}>Home</Link>
                </li>
                <li>
                  <Link to={'/orders'}>My Orders</Link>
                </li>
                <li>OrderDetails</li>
              </ul>
            </div>
          </div>

          <section className="container-fluid order-tracking-section-procureg mb-4">
            <div class="">
              <div class="cartRightBox pt-0">

                <div className="row mb-2">
                  <div className="col-lg-9">
                    <h4 style={{ color: '#ffad63' }}>
                      Order ID :{orderDetail.clocreOrderId}{' '}
                    </h4>
                  </div>
                  <div className="col-lg-3">
                    <h5 class="card-title2">
                      TOTAL AMOUNT :{' '}
                      <span style={{ color: '#ffad63' }}>₹ {totalPrice}</span>
                    </h5>
                  </div>
                </div>

                <div className="order-tracking-box-contents-procureg ">
                  <div className="row">
                    <div className="col-lg-3 mb-2 col-sm-6 col-md-6 ">
                      <div className="card">
                        <div className="">
                          <h5>Estimated time of delivery</h5>
                          <p>{formattedDate}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 mb-2 col-sm-6 col-md-6 ">
                      <div className="card">
                        <div className="">
                          <h5>Delivering to</h5>
                          <p>
                            {shippingInfo.address}, {shippingInfo.city},{' '}
                            {shippingInfo.postalCode}, {shippingInfo.state},{' '}
                            {shippingInfo.country}{' '}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-3 mb-2 col-sm-6 col-md-6 ">
                      <div className="card">
                        <div className="">
                          <h5>Status</h5>
                          <p>{orderStatus}</p>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6 col-md-6 col-lg-3 ">
                      <div className="card">
                        <div>
                          {orderStatus === "Processing" ? (
                            <p style={{ fontStyle: 'italic', color: '#888' }}>
                              Tracking information will be available after the order is shipped.
                            </p>
                          ) : (
                            <>
                              <h5>Tracking Number:</h5>
                              <p>{orderDetail?.trackingInfo?.trackingNumber || "N/A"}</p>

                              <h5>Courier Slug:&nbsp;&nbsp;<b className="text-g">{orderDetail?.trackingInfo?.courierSlug || "N/A"}</b></h5>
                             
                            </>
                          )}
                        </div>

                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="progress mt-4"
                  style={{ backgroundColor: '#f5f5f5 ', height: '7px' }}
                >
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: `${progress}%` }}
                    aria-valuenow={progress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>

                <div class="order-tracking-progress-contents-procureg">
                  <div className="row ">
                    <div className="col-lg-4" style={{ display: "flex", justifyContent: "center" }}>
                      <div>
                        <FontAwesomeIcon icon={faCheck} className="iconnn" />
                        <h6>Order Confirmed</h6>
                      </div>
                    </div>
                    <div className="col-lg-4" style={{ display: "flex", justifyContent: "center" }}>
                      <div>
                        <FontAwesomeIcon icon={faCheck} className="iconnn" />
                        <h6>Shipped</h6>
                      </div>
                    </div>
                    <div className="col-lg-4" style={{ display: "flex", justifyContent: "center" }}>
                      <div>
                        <FontAwesomeIcon icon={faCheck} className="iconnn" />
                        <h6>Delivered</h6>
                      </div>
                    </div>
                  </div>
                </div>

                  <div className="order-tracking-pdf-contents-procureg">
                    <div className="row">
                      {orderItems &&
                        orderItems.map(item => (
                          <div key={item.product} className="col-12 col-sm-6 col-md-6 col-lg-3 mb-3 mt-3">
                            <div className="card h-100">
                              <div className="card-body p-0">
                                <div className="row align-items-center">
                                  <div className="col-5">
                                    <img
                                      className="img-fluid"
                                      src={item.image}
                                      alt={item.name}
                                    />
                                  </div>
                                  <div className="col-7">
                                    <div>
                                      <Link to={`/products/${item.product}`} style={{ color: "#2f4d2a" }}>
                                        <h6>{item.name}</h6>
                                      </Link>
                                      <p className="mb-1">₹{item.price}</p>
                                      <p className="mb-0">{item.quantity} Piece(s)</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                <div className="order-tracking-buttons-procureg">
                  {loading ? (
                    <Loader />
                  ) : generatePdf ? (
                    <PDFDownloadLink
                      document={<OrderDetailPDF orderDetail={orderDetail} />}
                      fileName={`${orderDetail._id}.pdf`}
                      className="btn-primary"
                    >
                      {({ blob, url, loading, error }) =>
                        loading ? 'Loading...' : 'Click to download Invoice'
                      }
                    </PDFDownloadLink>
                  ) : orderDetail.orderStatus === 'Delivered' ? (
                    <button onClick={handleGeneratePdf} className="btn-g">
                      Generate Invoice
                    </button>
                  ) : null}{' '}
                  {/* This will hide the button if the status is not 'Delivered' */}
                  <Link to="/">
                    <button className="btn-g">Back to home</button>
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* original */}
        </section>
      )}
    </>
  );
}

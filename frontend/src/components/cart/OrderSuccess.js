import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import mailsend from "../../images/ordersuccess.jpg";
import { Button } from "@mui/material";
import { TryRounded } from "@mui/icons-material";
import MetaData from "../layouts/MetaData";

export default function OrderSuccess() {
  const { loading } = useSelector((state) => state.authState);
  return (
    <>
    <MetaData title="Order Success | GLOCRE" />
      <div className="empty d-flex align-items-center justify-content-center flex-column mt-5 mb-5">
        <img src={mailsend} alt="image" width="350" className="mt-5" />
        <br />
        <h3>Your Order has been placed successfully!</h3>
        <p> Visit the My Orders page to track your order status and details.</p>
        <br />
        <Link to="/orders">
          <Button
            className="btn-g bg-g btn-lg btn-big btn-round"
            disabled={loading}
          >
            <TryRounded /> &nbsp; My Orders
          </Button>
        </Link>
      </div>
    </>
  );
}

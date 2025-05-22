import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    uploadBanner,
    getBanners,
    deleteBanner,
} from "../../actions/userActions"; // adjust path if needed
import { Button, Spinner } from "react-bootstrap"; // optional if using Bootstrap
import Sidebar from "./Sidebar";
const AdminBannerPage = () => {
    const dispatch = useDispatch();

    const { banners = [], loading, error } = useSelector(state => state.authState); // adjust based on your root reducer

    const [bannerImage, setBannerImage] = useState(null);

    useEffect(() => {
        dispatch(getBanners());
    }, [dispatch]);

    const handleUpload = (e) => {
        e.preventDefault();

        if (!bannerImage) return;

        const formData = new FormData();
        formData.append("images", bannerImage);

        dispatch(uploadBanner(formData));
        setBannerImage(null); // clear after upload
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this banner?")) {
            dispatch(deleteBanner(id));
        }
    };

    return (
        <section className="newprod-section">
            <div className="row container-fluid">
                <div className="col-12 col-md-2">
                    <Sidebar />
                </div>
                <div className="col-12 col-lg-10 col-md-12 newprod-right-glc">
                    <div className="container mt-4">
                        <h2>Manage Banner Images</h2>

                        <form onSubmit={handleUpload} className="mb-3">
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setBannerImage(e.target.files[0])}
                            />
                            <Button type="submit" className="ms-2 btn-g border-0" disabled={loading}>
                                {loading ? <Spinner size="sm" /> : "Upload"}
                            </Button>
                        </form>
                        <p>need image size in </p>
                        <h5>Width = 1660 px || Height = 400px </h5>
                        {error && <p className="text-danger">{error}</p>}

                        <div className="row">
                            {banners &&
                                banners?.map((banner) => (
                                    <div className="col-md-4 mb-4" key={banner._id}>
                                        <div className="card">
                                            <img
                                                src={banner.url}
                                                className="card-img-top"
                                                alt="banner"
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                            <div className="card-body text-center">
                                                <Button
                                                    variant="danger"
                                                    onClick={() => handleDelete(banner._id)}
                                                    className="btn-g border-0"
                                                >
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default AdminBannerPage;

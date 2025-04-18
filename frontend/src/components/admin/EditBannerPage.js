import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    uploadBanner,
    getBanners,
    deleteBanner,
} from "../../actions/userActions"; // adjust path if needed
import { Button, Spinner } from "react-bootstrap"; // optional if using Bootstrap

const AdminBannerPage = () => {
    const dispatch = useDispatch();

    const { banners=[], loading, error } = useSelector(state => state.authState); // adjust based on your root reducer

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
        <div className="container mt-4">
            <h3>Manage Banner Images</h3>

            <form onSubmit={handleUpload} className="mb-3">
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setBannerImage(e.target.files[0])}
                />
                <Button type="submit" className="ms-2" disabled={loading}>
                    {loading ? <Spinner size="sm" /> : "Upload"}
                </Button>
            </form>

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
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default AdminBannerPage;

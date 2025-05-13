import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './dash.css'
import Sidebar from './Sidebar';
const S3ImageGallery = () => {
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const res = await axios.get('/api/v1/get-images');
            // console.log('Fetched S3 image data:', res.data); 
            setImages(res.data.images);
            // Make sure this is an array
        } catch (error) {
            console.error('Failed to fetch images', error);
        }
    };


    const deleteImage = async (key) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;

        try {
            await axios.delete(`/api/v1/deleteawsimages`, { data: { key } }); // Backend expects { key }
            setImages(images.filter(img => !img.includes(key)));
        } catch (error) {
            console.error('Failed to delete image', error);
        }
    };

    return (
        <div className="d-flex">
            <div className="col-12 col-md-2">
                <Sidebar />
            </div>
            <div className="image-gallery">
                {images?.map((url) => {
                    const key = url.split('/').slice(3).join('/');
                    return (
                        <div key={url} className="image-card">
                            <img src={url} alt="S3 file" />
                            <button
                                onClick={() => deleteImage(key)}
                                className="delete-btn"
                                title="Delete"
                            >
                                ×
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>

    );
};

export default S3ImageGallery;

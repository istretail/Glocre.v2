import React, { Fragment, useEffect, useState } from 'react';
import axios from 'axios';
import './dash.css'
import Sidebar from './Sidebar';
import MetaData from '../layouts/MetaData';
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
        <Fragment>

            <MetaData title="Admin S3 Image Gallery | GLOCRE" />
            < div className = "container-fluid"  >
            < div className = "row"  >
            <div className="col-md-2 d-none d-md-block">
    <Sidebar />
  </div>
  < div className = "col-12 col-md-10" >
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
            </div>
        </div>
        </Fragment>
        

    );
};

export default S3ImageGallery;

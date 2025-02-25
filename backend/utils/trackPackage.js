const axios = require('axios');

// AfterShip API endpoint and your API Key
const API_KEY = process.env.AFTERSHIP_API_KEY;
const BASE_URL = process.env.AFTERSHIP_BASE_URL;

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'aftership-api-key': API_KEY,
        'Content-Type': 'application/json',
    }
});

// Function to create a new tracking
const createTracking = async (trackingNumber, courierSlug, order_id) => {
    try {
        const response = await axios.post(
            "https://api.aftership.com/v4/trackings",
            {
                tracking: {
                    tracking_number: trackingNumber,
                    slug: courierSlug, // Ensure this is correct
                    order_id: order_id

                },
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "aftership-api-key": API_KEY, // API Key in headers
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error creating tracking:", error.response?.data || error.message);
        throw new Error("Error creating tracking");
    }
};

// Function to get tracking info by tracking number
const getTracking = async (trackingNumber, courierSlug) => {
    try {
        const response = await axios.get(
            `https://api.aftership.com/v4/trackings/${courierSlug}/${trackingNumber}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "aftership-api-key": API_KEY, // API Key in headers
                },
            }
        );

        return response.data.data.tracking; // Extract tracking details
    } catch (error) {
        console.error("Error fetching tracking info:", error.response?.data || error.message);
        return null; // Return null if tracking is not found
    }
};

module.exports = { createTracking, getTracking };

import React from 'react';

const AnalyticsModal = ({ onAccept, onDecline }) => {
    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                width: '100%',
                backgroundColor: '#ffad63',
                color: '#fff',
                padding: '20px',
                boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.2)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1000,
                // flexDirection: 'wrap',
            }}
        >
            <div style={{ maxWidth: '80%' }}>
                <h2 style={{ margin: 0, fontSize: '26px', color: "#343a40" }}>We use cookies</h2>
                <p style={{ margin: '5px 0', fontSize: '18px', color:"#343a40" }}>
                    We use cookies to enhance your browsing experience and analyze site traffic. By clicking
                    "Accept", you consent to the use of cookies.
                </p>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
                <button
                    onClick={onAccept}
                    style={{
                        backgroundColor: '#00c853',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Accept
                </button>
                <button
                    onClick={onDecline}
                    style={{
                        backgroundColor: '#d32f2f',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        padding: '10px 20px',
                        cursor: 'pointer',
                        fontSize: '14px',
                    }}
                >
                    Decline
                </button>
            </div>
        </div>
    );
};

export default AnalyticsModal;

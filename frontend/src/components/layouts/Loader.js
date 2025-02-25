import React from "react";
import loaderGif from "../../images/loader.gif"; // Adjust the path based on where you store the GIF

export default function Loader() {
  return (
    <div
      style={{
        position: "fixed", // Ensures it stays centered on screen
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(240, 239, 239, 0.83)", // Optional: Light overlay
        zIndex: 9999, // Ensures it's on top
      }}
    >
      <img
        src={loaderGif}
        alt="Loading..."
        style={{ width: "100px", height: "100px" }}
      />
    </div>
  );
}

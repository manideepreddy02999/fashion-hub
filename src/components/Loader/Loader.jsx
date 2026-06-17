import React from "react";
import "./Loader.css";

const Loader = ({ size = "md", text = "Loading...", fullscreen = false }) => {
  const sizeClass = size === "sm" ? "spinner-sm" : size === "lg" ? "spinner-lg" : "";
  const containerClass = fullscreen
    ? "loader-overlay loader-fullscreen"
    : "loader-overlay";

  return (
    <div className={containerClass}>
      <div className={`spinner ${sizeClass}`}></div>
      {text && <p className="loader-text">{text}</p>}
    </div>
  );
};

export default Loader;

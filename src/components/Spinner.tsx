import React from "react";

interface SpinnerProps {
  size?: "sm" | "lg"; // small or large spinner
  color?: "primary" | "secondary" | "success" | "danger" | "warning" | "info" | "light" | "dark";
  className?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ size, color = "primary", className="" }) => {
  const sizeClass = size === "sm" ? "spinner-border spinner-border-sm" : "spinner-border";
  return (
    <div className={`d-flex justify-content-center align-items-center ${className || ""}`}>
      <div className={`${sizeClass} text-${color}`} role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;

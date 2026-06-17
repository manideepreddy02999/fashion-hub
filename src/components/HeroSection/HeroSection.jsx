import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./HeroSection.css";

const HeroSection = ({ banners = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const heroBanners = banners.filter((b) => b.type === "hero");

  useEffect(() => {
    if (heroBanners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroBanners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroBanners.length]);

  const goToSlide = (index) => setCurrentSlide(index);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  const nextSlide = () =>
    setCurrentSlide((prev) => (prev + 1) % heroBanners.length);

  if (heroBanners.length === 0) return null;

  return (
    <section className="hero-section">
      <div className="hero-slider">
        {heroBanners.map((banner, index) => (
          <div
            key={banner.id}
            className={`hero-slide ${index === currentSlide ? "active" : ""}`}
          >
            <img src={banner.image} alt={banner.title} />
            <div className="hero-overlay">
              <div className="hero-content">
                <h1>{banner.title}</h1>
                <p>{banner.subtitle}</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(banner.buttonLink)}
                >
                  {banner.buttonText}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {heroBanners.length > 1 && (
        <>
          <div className="hero-arrows">
            <button className="hero-arrow" onClick={prevSlide}>
              <FiChevronLeft />
            </button>
            <button className="hero-arrow" onClick={nextSlide}>
              <FiChevronRight />
            </button>
          </div>
          <div className="hero-dots">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                className={`hero-dot ${index === currentSlide ? "active" : ""}`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
};

export default HeroSection;

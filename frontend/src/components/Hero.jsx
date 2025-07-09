import { useEffect, useState } from "react";
import { assets } from "../assets/assets";

// Define carousel items with different fonts
const carouselItems = [
  {
    title: "Join Us Today & Elevate Your Style",
    description:
      "Discover the latest trends in fashion with our curated collection of clothing, shoes, and accessories for every occasion.",
    color: "text-pink-400",
    animation: "animate-fadeInLeft",
    font: "Great Vibes",
    img: assets.hero_img,
  },
  {
    title: "Unbeatable Fashion Deals Daily",
    description:
      "Shop stylish outfits at affordable prices. Enjoy exclusive discounts on top brands and express delivery to your doorstep.",
    color: "text-yellow-300",
    animation: "animate-bounceIn",
    font: "Pacifico",
    img: assets.hero_img,
  },
  {
    title: "Your Fashion. Your Rules.",
    description:
      "From casual wear to glam looks, find everything you need to express your unique style — all in one place.",
    color: "text-purple-300",
    animation: "animate-zoomIn",
    font: "Island Moments",
    img: assets.hero_img,
  },
];

const Hero = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(true);

  useEffect(() => {
    setAnimate(true);
    const timer = setInterval(() => {
      setAnimate(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % carouselItems.length);
        setAnimate(true);
      }, 300);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const { title, description, img, color, animation, font } =
    carouselItems[currentIndex];

  return (
    <section
      className="relative bg-cover bg-center min-h-[60vh] md:min-h-[90vh] flex items-center justify-start text-white transition-all duration-700 rounded-sm"
      style={{ backgroundImage: `url(${img})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 rounded-sm" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-2xl md:max-w-3xl lg:max-w-4xl pl-10 md:pl-28 lg:pl-40 space-y-4">
        <h1
          className={`text-4xl md:text-5xl lg:text-6xl tracking-tight drop-shadow-xl italic transition-all duration-700 ${
            animate ? `${animation} opacity-100` : "opacity-0"
          } ${color}`}
          style={{ fontFamily: font }}
        >
          {title}
        </h1>
        <p
          className={`text-sm md:text-sm italic text-gray-100 font-light leading-relaxed transition-all duration-700 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          {description}
        </p>
      </div>
    </section>
  );
};

export default Hero;

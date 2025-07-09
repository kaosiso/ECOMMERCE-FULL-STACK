import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const About = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="text-2xl text-center pt-8 border-t">
        <Title text1={"ABOUT"} text2={"US"} />
      </div>

      {/* About Content */}
      <div className="my-10 flex flex-col md:flex-row justify-center items-center gap-10 mb-20">
        {/* Image */}
        <img
          className="w-full md:w-1/2 object-cover"
          src={assets.about_img}
          alt="About Everest"
        />

        {/* Text */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4">
          <div className="flex flex-col gap-6 text-center md:text-left text-gray-600">
            <p>
              Everest was born from a vision to inspire confidence, elevate everyday style, and empower individuals to reach their personal peak.
            </p>
            <p>
              We don’t just follow trends — we redefine them. Every collection is crafted with purpose, driven by passion, and designed to stand the test of time.
            </p>
            <b className="text-gray-800">Our Mission</b>
            <p>
              To deliver fashion that’s bold yet refined, modern yet timeless — helping you conquer every day with confidence and style.
            </p>
          </div>
        </div>
      </div>

      {/* Why Choose Us Title */}
      <div className="text-xl py-4 text-center">
        <Title text1={"WHY"} text2={"CHOOSE US"} />
      </div>

      {/* Features Section */}
      <div className="flex flex-col md:flex-row text-sm mb-20">
        {/* Quality Assurance */}
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Quality Assurance</b>
          <p className="text-gray-600">
            At Everest, quality isn’t a feature — it’s a foundation. Every piece is crafted with precision, ensuring lasting value and elevated style.
          </p>
        </div>

        {/* Convenience */}
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Convenience</b>
          <p className="text-gray-600">
            From seamless browsing to fast, reliable delivery — Everest makes your shopping experience as smooth and empowering as the products themselves.
          </p>
        </div>

        {/* Customer Service */}
        <div className="border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5">
          <b>Exceptional Customer Service</b>
          <p className="text-gray-600">
            We’re here for you — always. Everest delivers not just products, but peace of mind, with responsive support and genuine care for every customer.
          </p>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsletterBox />
    </div>
  );
};

export default About;

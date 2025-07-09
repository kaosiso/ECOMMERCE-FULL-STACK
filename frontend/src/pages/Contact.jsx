import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div>
      {/* Page Title */}
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      {/* Contact Info Section */}
      <div className="my-10 flex flex-col md:flex-row justify-center items-center gap-10 mb-28">
        {/* Image (Left) */}
        <img
          className="w-full md:w-1/2 object-cover"
          src={assets.contact_img}
          alt="Contact"
        />

        {/* Text Content (Right) */}
        <div className="w-full md:w-1/2 flex items-center justify-center px-4">
          <div className="flex flex-col gap-6 text-center md:text-left">
            <p className="font-semibold text-xl text-gray-600">Our Store</p>
            <p>
              41 Abacha Station <br /> Suite 350, Washington, USA
            </p>
            <p>
              Tel: (415) 555-0132 <br /> Email: admin@everest.com
            </p>
            <p className="font-semibold text-xl text-gray-600">
              Careers at Everest
            </p>
            <p className="text-gray-500">
              Learn about our team and job openings
            </p>
            <button className="border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transition-all duration-500">
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Box */}
      <NewsletterBox />
    </div>
  );
};

export default Contact;

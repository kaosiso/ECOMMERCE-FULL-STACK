import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className="flex items-center py-2 px-[4%] justify-between ">
      <h1 className="logo text-gray-800 hover:text-black transition-transform duration-300 hover:scale-105">
        Everest
      </h1>{" "}
      <button
        onClick={() => setToken("")}
        className="bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm"
      >
        Log Out
      </button>
    </div>
  );
}

export default Navbar

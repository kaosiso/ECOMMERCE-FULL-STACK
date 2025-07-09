import React, { useContext } from "react";
import { ShopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";

const ProductItem = ({ id, image, name, price }) => {
  const { currency } = useContext(ShopContext);

  return (
    <Link
      className="text-gray-700 cursor-pointer rounded-md bg-white shadow-sm w-full max-w-xs"
      to={`/product/${id}`}
    >
      <div className="overflow-hidden h-64 w-full bg-white">
        <img
          className="h-full rounded w-full   object-cover hover:scale-110 transition ease-in-out duration-300"
          src={image[0]}
          alt={name}
        />
      </div> 
      <p className="pt-3 pb-1 text-black px-3 text-sm truncate">{name}</p>
      <p className= " px-3 pb-1 text-sm ">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;

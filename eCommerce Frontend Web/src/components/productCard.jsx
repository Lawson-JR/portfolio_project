import React from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { addToCart } from "../redux/cartSlice";
import { useDispatch } from "react-redux";

const ProductCard = ({ product, onProductClick }) => {
    const dispatch= useDispatch();
    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        e.preventDefault();
        dispatch(addToCart(product))
        alert(`${product.name} added to cart succesfully!`);
    }
    return (
        <div 
            className="bg-gray-800 rounded-lg shadow-md p-4 transition-transform duration-300 hover:scale-105 flex flex-col"
            onClick={() => onProductClick(product)}
        >
            <img
                src={product.image}
                alt={product.name}
                className="object-cover rounded-lg mb-3"
            />
            
            {/* This will push the text and button to the bottom */}
            <h3 className="text-lg font-semibold text-gray-100">{product.name}</h3>
            <div className="mt-auto">
                <p className="text-green-500 mt-2">${product.price}</p>
                <p className="text-gray-400 text-sm mt-2">{product.genre}</p>
                <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center">
                        <FaStar className="text-yellow-500 text-sm"></FaStar>
                        <FaStar className="text-yellow-500"></FaStar>
                        <FaStar className="text-yellow-500 text-lg"></FaStar>
                        <FaStar className="text-yellow-500"></FaStar>
                        <FaStar className="text-yellow-500 text-sm"></FaStar>
                    </div>
                    <span  onClick={(e) => handleAddToCart(e, product)} className="flex items-center bg-indigo-500 cursor-pointer px-3 py-1 rounded-lg group hover:bg-indigo-700 transition duration-300">
                        <FaPlus className="mr-2" />
                        <div>
                            <button className='text-xs outline-0'>Add to cart</button>
                        </div>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
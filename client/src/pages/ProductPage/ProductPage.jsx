import React, { useEffect, useState } from 'react';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';
import p1 from './peanut1.jpg'
import p2 from './peanut2.jpg'
import { useParams } from "react-router-dom";
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';


function ProductPage() {
  const { _id } = useParams();
 
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product,setProduct] = useState({})
  
  const handleFetchProduct = async() => {
    try {
      const {data} = await axios.get(`http://localhost:7400/api/v1/get-product/${_id}`)
      setProduct(data.data)
    } catch (error) {
      console.log("Internal server error",error)
    }
  }
 
  
  useEffect(()=>{
    handleFetchProduct()
    window.scrollTo({
      top:0,
      behavior:'smooth'
    })
  },[_id])

  

  const handleQuantityChange = (increment) => {
    const newQuantity = quantity + increment;
    if (newQuantity >= 1 && newQuantity <= (product.isVarient ? product.Varient[selectedVariant].stock_quantity : product.stock)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    
    console.log('Added to cart:', {
      product: product.product_name,
      quantity,
      variant: product.isVarient ? product.Varient[selectedVariant].quantity : null,
    });
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl  overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-3 md:p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg">
                <img
                  src={product?.ProductMainImage?.url}
                  alt={product.product_name}
                  className="h-96 w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {[product?.SecondImage?.url, product?.ThirdImage?.url].map((image, index) => (
                  image && (
                    <img
                      key={index}
                      src={image}
                      alt={`Product view ${index + 2}`}
                      className="h-24 w-full object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                    />
                  )
                ))}
              </div>
            </div>

            {/* Product Details */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
                <p className="mt-4 text-gray-600">{product.product_description}</p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl font-bold text-gray-900">
                  ₹{product.isVarient 
                      ? product.Varient[selectedVariant].price_after_discount 
                      : product.afterDiscountPrice}
                  </span>
                  {(product.isVarient ? product.Varient[selectedVariant].discount_percentage : product.discount) > 0 && (
                    <>
                      <span className="text-xl text-gray-400 line-through">
                      ₹{product.isVarient ? product.Varient[selectedVariant].price : product.price}
                      </span>
                      <span className="text-sm font-semibold text-green-500">
                        {product.isVarient ? product.Varient[selectedVariant].discount_percentage : product.discount}% OFF
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Variants */}
              {product.isVarient && (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Size Options</h3>
                  <div className="flex space-x-4">
                    {product.Varient.map((variant, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedVariant(index)}
                        className={`px-4 py-2 rounded-lg border ${
                          selectedVariant === index
                            ? 'border-green-600 bg-green-50 text-green-600'
                            : 'border-gray-200 text-gray-600 hover:border-gray-300'
                        }`}
                      >
                        {variant.quantity}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                <div className="flex justify-between border md:border-0 py-2 px-3 rounded-full md:justify-start items-center space-x-4">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    <FiMinus className="w-4 h-4" />
                  </button>
                  <span className="text-lg font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    className="p-2 rounded-full border border-gray-200 hover:bg-gray-50"
                  >
                    <FiPlus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-600 text-white py-3 px-8 rounded-lg flex items-center justify-center space-x-2 hover:bg-green-700 transition-colors"
              >
                <FiShoppingCart className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>

            
            </div>
          </div>
            {/* Additional Information */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
                
                {product.extra_description && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Additional Information</h3>
                    <p className="mt-1 text-sm text-gray-500">{product.extra_description}</p>
                  </div>
                )}
                {/* <div>
                  <h3 className="text-sm font-medium text-gray-900">Stock Status</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.isVarient
                      ? `${product.Varient[selectedVariant].stock_quantity} units available`
                      : `${product.stock} units available`}
                  </p>
                </div> */}
              </div>
        </div>
        <ProductCard bg={false} title={'Related Products'} />
      </div>
    </div>
  );
}

export default ProductPage;
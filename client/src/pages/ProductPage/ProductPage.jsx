import React, { useEffect, useState, useMemo } from 'react';
import { FiMinus, FiPlus, FiShoppingCart, FiAlertCircle } from 'react-icons/fi';
import { useParams } from "react-router-dom";
import axios from 'axios';
import ProductCard from '../../components/ProductCard/ProductCard';
import { useDispatch } from 'react-redux';
import { addProduct } from '../../store/slice/cart.slice';
import toast from 'react-hot-toast';
import { Helmet } from 'react-helmet';

function ProductPage() {
  const { _id } = useParams();
  const dispatch = useDispatch();
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const calculateDiscountPercentage = (originalPrice, discountedPrice) => {
    if (!originalPrice || !discountedPrice) return null;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const handleFetchProduct = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(`https://api.dyfru.com/api/v1/get-product/${_id}`);
      if (data.success) {
        setProduct(data.data);
        setMainImage(data.data?.ProductMainImage?.url);
      } else {
        setError("Unable to fetch product details");
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      setError("Failed to load product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchProduct();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [_id]);

  // Calculate and enhance variant data with memoization
  const enhancedVariants = useMemo(() => {
    if (!product?.Varient) return [];
    
    return product.Varient.map(variant => {
      // If discount_percentage is null, calculate it
      let discountPercentage = variant.discount_percentage;
      let priceAfterDiscount = variant.price_after_discount;
      
      // Calculate price_after_discount if it's null
      if (priceAfterDiscount === null) {
        priceAfterDiscount = variant.price;
      }
      
      // Calculate discount percentage if it's null
      if (discountPercentage === null && variant.price && priceAfterDiscount) {
        discountPercentage = calculateDiscountPercentage(variant.price, priceAfterDiscount);
      }
      
      return {
        ...variant,
        discount_percentage: discountPercentage,
        price_after_discount: priceAfterDiscount
      };
    });
  }, [product]);

  const currentVariant = useMemo(() => {
    return enhancedVariants[selectedVariant] || null;
  }, [enhancedVariants, selectedVariant]);

  const handleQuantityChange = (increment) => {
    const newQuantity = quantity + increment;
    const maxStock = product?.isVarient 
      ? (currentVariant?.stock_quantity || 0) 
      : (product?.stock || 0);
      
    if (newQuantity >= 1 && newQuantity <= maxStock) {
      setQuantity(newQuantity);
    }
  };

  const handleVariantSelect = (index) => {
    setSelectedVariant(index);
    // Reset quantity to 1 when changing variants
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!product) return;

    const selected = {
      product_id: product._id,
      product_name: product.product_name,
      price: product.isVarient ? currentVariant.price : product.price,
      discount_percentage: product.isVarient ? currentVariant.discount_percentage : product.discount,
      price_after_discount: product.isVarient ? currentVariant.price_after_discount : product.afterDiscountPrice,
      isVarient: product.isVarient,
      Qunatity: quantity,
      variantId: product.isVarient ? currentVariant._id : null,
      variant: product.isVarient ? currentVariant.quantity : null,
      image: product?.ProductMainImage?.url,
    };
    
    dispatch(addProduct(selected));
    toast.success('Hooray! Your product has been added to the cart successfully.');
  };

  // Get all available product images
  const productImages = useMemo(() => {
    if (!product) return [];
    
    return [
      product?.ProductMainImage?.url,
      product?.SecondImage?.url,
      product?.ThirdImage?.url,
      product?.FourthImage?.url,
      product?.FifthImage?.url
    ].filter(Boolean); // Remove null/undefined values
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg shadow-sm text-center max-w-lg">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-700 mb-4">{error}</p>
          <button 
            onClick={handleFetchProduct}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-yellow-50 p-6 rounded-lg shadow-sm text-center max-w-lg">
          <FiAlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-yellow-700 mb-2">Product Not Found</h2>
          <p className="text-gray-700">The product you're looking for could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{`${product.product_name} - Dyfru`}</title>
        <meta name="description" content={product.product_description} />
      </Helmet>
      
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl overflow-hidden shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-4 md:p-8">
              {/* Image Gallery */}
              <div className="space-y-4">
                <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-50">
                  <img
                    src={mainImage}
                    alt={product.product_name}
                    className="h-96 w-full object-cover object-center hover:scale-105 transition-transform duration-300"
                  />
                </div>
                {productImages.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setMainImage(image)}
                        className={`relative rounded-lg overflow-hidden h-20 transition-all duration-200 ${
                          mainImage === image
                            ? 'ring-2 ring-green-500 ring-offset-2'
                            : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-2'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`Product view ${index + 1}`}
                          className="h-full w-full object-cover"
                        />
                        {mainImage === image && (
                          <div className="absolute inset-0 bg-green-500 bg-opacity-10" />
                        )}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{product.product_name}</h1>
                  <p className="mt-4 text-gray-600">{product.product_description}</p>
                </div>

                <div className="space-y-2">
                  {product.isVarient && currentVariant ? (
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{currentVariant.price_after_discount}
                      </span>
                      {currentVariant.discount_percentage > 0 && (
                        <>
                          <span className="text-xl text-gray-400 line-through">
                            ₹{currentVariant.price}
                          </span>
                          <span className="text-sm font-semibold text-green-500">
                            {currentVariant.discount_percentage}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="flex items-center space-x-4">
                      <span className="text-3xl font-bold text-gray-900">
                        ₹{product.afterDiscountPrice || product.price}
                      </span>
                      {product.discount > 0 && (
                        <>
                          <span className="text-xl text-gray-400 line-through">
                            ₹{product.price}
                          </span>
                          <span className="text-sm font-semibold text-green-500">
                            {product.discount}% OFF
                          </span>
                        </>
                      )}
                    </div>
                  )}
                </div>

                {/* Variants */}
                {product.isVarient && enhancedVariants.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium text-gray-900">Size Options</h3>
                    <div className="flex flex-wrap gap-3">
                      {enhancedVariants.map((variant, index) => (
                        <button
                          key={variant._id}
                          onClick={() => handleVariantSelect(index)}
                          className={`px-4 py-2 rounded-lg border transition-all duration-200 ${
                            selectedVariant === index
                              ? 'border-green-600 bg-green-50 text-green-600 shadow-sm'
                              : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {variant.quantity}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Stock Status */}
                <div className="text-sm">
                  {currentVariant && (
                    <div className={`font-medium ${currentVariant.stock_quantity > 0 ? 'text-green-600' : 'text-red-500'}`}>
                      {currentVariant.stock_quantity > 0 
                        ? `In Stock (${currentVariant.stock_quantity} available)` 
                        : 'Out of Stock'}
                    </div>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-gray-900">Quantity</h3>
                  <div className="inline-flex items-center border border-gray-200 rounded-full p-1">
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className={`p-2 rounded-full ${
                        quantity <= 1 ? 'text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                      } transition-colors`}
                    >
                      <FiMinus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center text-lg font-medium">{quantity}</span>
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={
                        currentVariant && quantity >= currentVariant.stock_quantity
                      }
                      className={`p-2 rounded-full ${
                        (currentVariant && quantity >= currentVariant.stock_quantity)
                          ? 'text-gray-300'
                          : 'hover:bg-gray-100 text-gray-600'
                      } transition-colors`}
                    >
                      <FiPlus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={handleAddToCart}
                  disabled={currentVariant && currentVariant.stock_quantity <= 0}
                  className={`w-full py-3 px-8 rounded-lg flex items-center justify-center space-x-2 transition-all duration-200 transform ${
                    currentVariant && currentVariant.stock_quantity <= 0
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-green-600 text-white hover:bg-green-700 hover:scale-[1.02]'
                  }`}
                >
                  <FiShoppingCart className="w-5 h-5" />
                  <span>
                    {currentVariant && currentVariant.stock_quantity <= 0
                      ? 'Out of Stock'
                      : 'Add to Cart'}
                  </span>
                </button>
                
                {/* Category Information */}
                {product.category && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {product.category.name}
                    {product.sub_category && (
                      <> | <span className="font-medium">Type:</span> {product.sub_category.name}</>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Information */}
            {product.extra_description && (
              <div className="border-t border-gray-200 p-6 space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Additional Information</h3>
                  <p className="text-gray-600">{product.extra_description}</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Related Products */}
          <div className="mt-12">
            <ProductCard bg={false} title={'Related Products'} />
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductPage;
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { findMyLastOrder, findSettings } from '../../utils/Api';
import axios from 'axios'
const CheckOut = () => {
    const { cart } = useSelector((state) => state.cart);
    const [paymentMethod, setPaymentMethod] = useState('ONLINE');
    const [lastUsedAddress, setLastUsedAddress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [couponCode, setCouponCode] = useState('');
    const [couponApplied, setCouponApplied] = useState(false);
    const [orderNote, setOrderNote] = useState('');
    const [settings, setSettings] = useState(null);
    const [formData, setFormData] = useState({
        addressLine: '',
        city: '',
        state: '',
        postCode: '',
        mobileNumber: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const data = await findMyLastOrder();
                const SiteSettings = await findSettings()
                console.log("Site Settings",SiteSettings)
                setSettings(SiteSettings)
                setLastUsedAddress(data.shipping);
                setLoading(false);
            } catch (err) {
                setError(`Welcome! It looks like you're a new user. Please take a moment to add your address so we can serve you better.`);
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleInputChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const fillLastUsedAddress = () => {
        if (lastUsedAddress) {
            setFormData({
                addressLine: lastUsedAddress.addressLine || '',
                city: lastUsedAddress.city || '',
                state: lastUsedAddress.state || '',
                postCode: lastUsedAddress.postCode || '',
                mobileNumber: lastUsedAddress.mobileNumber || ''
            });
        }
    };

    const calculateTotal = () => {
        console.log(settings)
        const subtotal = cart.reduce((total, item) => total + (item.price_after_discount * item.Qunatity), 0);

        // Calculate shipping
        const shipping = settings?.shippingEnabled
            ? (subtotal >= settings?.freeShippingThreshold ? 0 : settings?.shippingCost)
            : 0;

        // Calculate tax
        const tax = settings?.isTaxEnables
            ? Math.round(subtotal * (settings?.taxRate / 100))
            : 0;

        return {
            subtotal,
            shipping,
            tax,
            total: subtotal + shipping + tax
        };
    };
    const totalDetails = calculateTotal();

    const handleApplyCoupon = () => {
        // Add your coupon logic here
        if (couponCode) {
            setCouponApplied(true);
            // Add discount calculation logic
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        const OrderData = {
            items: cart,
            totalAmount: totalDetails.total || 0,
            payAmt: totalDetails.total || 0,
            paymentType: paymentMethod,
            isVarientInCart: cart.some((item) => item.variant),
            offerId: null,
            shipping: formData,
            status: 'pending',
        };
    
        try {
            const token = sessionStorage.getItem('token_login');
            if (!token) {
                console.log("User is not authenticated.");
                return;
            }
    
            const response = await axios.post('https://www.api.dyfru.com/api/v1/add-order', OrderData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });
    
            if (paymentMethod === 'ONLINE') {
                window.location.href = response.data.url;
            } else {
                if (response.data.order?.orderId) {
                    // window.location.href = `https://www.api.dyfru.com/api/v1/order-confirmation/${response.data.order.orderId}`;
                } else {
                    console.log("Order ID is not available in the response.");
                }
            }
    
            console.log(response.data);
        } catch (error) {
            console.log(error);
        }
    };
    

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-6xl">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Checkout</h1>

                {error && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Side - Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Address */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold">Shipping Address</h2>
                                {lastUsedAddress && (
                                    <button
                                        onClick={fillLastUsedAddress}
                                        className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
                                    >
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                        </svg>
                                        Use Last Address
                                    </button>
                                )}
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Address Line
                                    </label>
                                    <input
                                        type="text"
                                        name="addressLine"
                                        value={formData.addressLine}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            City
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            State
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Post Code
                                        </label>
                                        <input
                                            type="text"
                                            name="postCode"
                                            value={formData.postCode}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Mobile Number
                                        </label>
                                        <input
                                            type="tel"
                                            name="mobileNumber"
                                            value={formData.mobileNumber}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                            required
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-6">Payment Method</h2>
                            <div className="space-y-4">


                                {settings?.onlinePaymentAvailable ? (
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="ONLINE"
                                            checked={paymentMethod === 'ONLINE'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-3">Online Payment</span>
                                    </label>
                                ) : (
                                    <div className="p-4 border rounded-lg bg-gray-50 cursor-not-allowed opacity-60">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    disabled
                                                    className="h-4 w-4 text-gray-400 cursor-not-allowed"
                                                />
                                                <span className="ml-3 text-gray-500">Online Payment</span>
                                            </div>
                                            <span className="text-sm text-red-500">Not available</span>
                                        </div>
                                    </div>
                                )}

                                {settings?.codAvailable ? (
                                    <label className="flex items-center p-4 border rounded-lg cursor-pointer hover:border-green-500 transition-colors">
                                        <input
                                            type="radio"
                                            name="payment"
                                            value="COD"
                                            checked={paymentMethod === 'COD'}
                                            onChange={(e) => setPaymentMethod(e.target.value)}
                                            className="h-4 w-4 text-green-600 focus:ring-green-500"
                                        />
                                        <span className="ml-3">Cash on Delivery</span>
                                    </label>
                                ) : (
                                    <div className="p-4 border rounded-lg bg-gray-50 cursor-not-allowed opacity-60">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center">
                                                <input
                                                    type="radio"
                                                    disabled
                                                    className="h-4 w-4 text-gray-400 cursor-not-allowed"
                                                />
                                                <span className="ml-3 text-gray-500">Cash on Delivery</span>
                                            </div>
                                            <span className="text-sm text-red-500">Not available</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Order Note */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold mb-4">Order Note (Optional)</h2>
                            <textarea
                                value={orderNote}
                                onChange={(e) => setOrderNote(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                rows="3"
                                placeholder="Add any special instructions for your order..."
                            ></textarea>
                        </div>
                    </div>

                    {/* Right Side - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
                            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>

                            {/* Coupon Code */}
                            {settings?.copounEnables && (

                            <div className="mb-6">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                                    />
                                    <button
                                        onClick={handleApplyCoupon}
                                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                                        disabled={!couponCode || couponApplied}
                                    >
                                        Apply
                                    </button>
                                </div>
                                {couponApplied && (
                                    <p className="text-green-600 text-sm mt-2">Coupon applied successfully!</p>
                                )}
                            </div>
                            )}

                            {/* Price Breakdown */}
                            <div className="space-y-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalDetails.subtotal}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Shipping</span>
                                    <span>₹{totalDetails.shipping}</span>
                                </div>
                                {settings.shippingEnabled && totalDetails.subtotal >= settings.freeShippingThreshold && (
                                    <div className="text-sm text-green-600">
                                        🎉 You qualify for free delivery!
                                    </div>
                                )}

                                {settings.isTaxEnables && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Tax ({settings.taxRate}%)</span>
                                        <span>₹{totalDetails.tax}</span>
                                    </div>
                                )}
                                {couponApplied && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-₹100</span>
                                    </div>
                                )}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span className="text-green-600">₹{totalDetails.total}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Place Order Button */}
                            <button
                                onClick={handleSubmit}
                                className="w-full mt-6 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center"
                                disabled={loading}
                            >
                                {loading ? (
                                    <div className="flex items-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></div>
                                        Processing...
                                    </div>
                                ) : (
                                    'Place Order'
                                )}
                            </button>

                            {/* Order Items Preview */}
                            <div className="mt-6">
                                <h3 className="font-semibold text-gray-700 mb-3">Order Items ({cart.length})</h3>
                                <div className="space-y-3">
                                    {cart.map((item) => (
                                        <div key={item.product_id} className="flex items-center space-x-3">
                                            <img
                                                src={item.image}
                                                alt={item.product_name}
                                                className="w-12 h-12 object-cover rounded"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm font-medium">{item.product_name}</p>
                                                <p className="text-sm text-gray-500">Qty: {item.Qunatity}</p>
                                            </div>
                                            <span className="text-sm font-medium">₹{item.price_after_discount * item.Qunatity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckOut;
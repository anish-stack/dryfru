import React from 'react'
import { Star, Quote } from 'lucide-react';

function Testimonial() {
    const testimonials = [
        {
          id: 1,
          name: "Sarah Johnson",
          role: "Health Coach",
          image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&h=200&auto=format&fit=crop",
          content: "The quality of organic nuts and dried fruits is exceptional. I recommend these products to all my clients for their nutritional benefits.",
          rating: 5,
          product: "Mixed Nuts Premium Pack",
          productImage: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
          id: 2,
          name: "Michael Chen",
          role: "Professional Chef",
          image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&h=200&auto=format&fit=crop",
          content: "As a chef, I'm extremely particular about ingredients. These dried fruits have transformed my dessert recipes with their natural sweetness.",
          rating: 5,
          product: "Premium Dried Berries",
          productImage: "https://images.unsplash.com/photo-1543076499-a6133cb932fd?q=80&w=100&h=100&auto=format&fit=crop"
        },
        {
          id: 3,
          name: "Emma Davis",
          role: "Fitness Enthusiast",
          image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&h=200&auto=format&fit=crop",
          content: "Perfect for my post-workout snacks! The portion-controlled packs help me maintain my nutrition goals while enjoying delicious treats.",
          rating: 5,
          product: "Trail Mix Selection",
          productImage: "https://images.unsplash.com/photo-1599707367072-cd6ada2bc375?q=80&w=100&h=100&auto=format&fit=crop"
        }
      ];
    
      return (
        <div className="min-h-screen bg-[#E8F4EC] py-20 px-4 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-black mb-4">
                What Our Customers Say
              </h2>
              <p className="text-[#005D31] max-w-2xl mx-auto">
                Discover why health enthusiasts and food lovers choose our premium dry fruits and nuts for their daily nutrition
              </p>
            </div>
    
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div
                  key={testimonial.id}
                  className="group relative bg-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
                    <div className="relative">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-lg"
                      />
                      <Quote className="absolute -bottom-2 -right-2 w-8 h-8 text-[#005D31] bg-white rounded-full p-1.5 shadow-md" />
                    </div>
                  </div>
    
                  <div className="mt-8 text-center">
                    <h3 className="font-semibold text-lg text-gray-800">{testimonial.name}</h3>
                    <p className="text-[#005D31] text-sm">{testimonial.role}</p>
                    
                    <div className="flex justify-center gap-1 my-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
    
                  <p className="text-gray-600 text-center mt-4 mb-6">
                    "{testimonial.content}"
                  </p>
    
                  <div className="bg-amber-50 rounded-xl p-4 mt-6 flex items-center gap-4">
                    <img
                      src={testimonial.productImage}
                      alt={testimonial.product}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-sm text-[#005D31] font-medium">Purchased</p>
                      <p className="text-gray-700">{testimonial.product}</p>
                    </div>
                  </div>
    
                  <div className="absolute top-4 right-4">
                    <div className="w-20 h-20 bg-amber-100 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                  </div>
                </div>
              ))}
            </div>
    
            <div className="mt-16 text-center">
              <p className="text-black font-medium mb-4">Join our satisfied customers</p>
              <button onClick={()=> window.location.href="/shop"} className="bg-[#005D31] hover:bg-[#005D31] text-white px-8 py-3 rounded-full font-medium transition-colors duration-300 shadow-lg hover:shadow-xl">
                Shop Premium Dry Fruits
              </button>
            </div>
          </div>
        </div>
      );
}

export default Testimonial

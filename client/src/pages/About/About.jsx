import React from 'react';
import { MapPin, Phone, Mail, Instagram, Twitter, Youtube, Linkedin, Facebook, Leaf, Shield, Target, Users, Truck, Award } from 'lucide-react';
import image from './fd.jpg'
const About = () => {
  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Products' },
    { number: '15+', label: 'Countries' },
    { number: '24/7', label: 'Support' },
  ];

  const values = [
    { icon: <Leaf className="w-8 h-8" />, title: 'Natural & Pure', description: 'We source only the finest natural products, ensuring purity in every bite.' },
    { icon: <Shield className="w-8 h-8" />, title: 'Quality Assured', description: 'Rigorous quality checks ensure premium products reach your doorstep.' },
    { icon: <Target className="w-8 h-8" />, title: 'Customer First', description: 'Your satisfaction is our top priority, driving everything we do.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section with Parallax */}
      <div className="relative h-[80vh] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center transform scale-105"
          style={{
            backgroundImage: `url(${image})`,
            backgroundAttachment: 'fixed'
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r backdrop-blur-[1px]"></div>
        </div>
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 animate-fadeIn">
              Nurturing Health Through Nature
            </h1>
            <p className="text-xl md:text-2xl font-bold text-gray-50 animate-slideDown leading-relaxed">
              At DyFru, we're passionate about bringing you nature's finest selection of dry fruits and nuts, carefully chosen for quality and nutrition.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-green-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center transform hover:scale-105 transition-all duration-300"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-green-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">Our Mission & Vision</h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              To revolutionize healthy snacking by providing premium quality dry fruits and nuts while promoting sustainable farming practices and supporting local communities.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="text-green-600 mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scope & Process */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Our Process</h2>
          <div className="relative">
            <div className="grid md:grid-cols-4 gap-8">
              {[
                { icon: <Leaf className="w-8 h-8 text-green-600" />, title: 'Sourcing', description: 'Carefully selected from premium farms' },
                { icon: <Shield className="w-8 h-8 text-green-600" />, title: 'Quality Check', description: 'Rigorous testing and verification' },
                { icon: <Truck className="w-8 h-8 text-green-600" />, title: 'Processing', description: 'State-of-the-art facilities' },
                { icon: <Award className="w-8 h-8 text-green-600" />, title: 'Delivery', description: 'Safe and timely delivery' },
              ].map((step, index) => (
                <div key={index} className="text-center relative">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4 shadow-lg transform transition-all duration-300 hover:scale-110 hover:bg-green-200">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">{step.title}</h3>
                  <p className="text-gray-600">{step.description}</p>
                  {index < 3 && (
                    <div className="hidden md:block absolute top-1/2 right-0 w-full h-0.5 bg-green-100 transform translate-x-1/2">
                      <div className="absolute right-0 w-3 h-3 bg-green-200 rounded-full transform translate-x-1/2 -translate-y-1/2 animate-dot-flow"></div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {/* Flowing Dot Animation */}
            <div className="absolute inset-0 flex justify-between items-center">
              <div className="absolute top-0 left-1/4 transform translate-x-1/2 animate-dot-flow"></div>
              <div className="absolute top-0 left-2/4 transform translate-x-1/2 animate-dot-flow"></div>
              <div className="absolute top-0 right-1/4 transform translate-x-1/2 animate-dot-flow"></div>
            </div>
          </div>
        </div>
      </div>


      {/* Contact Section */}
      <div className="py-20 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-12 bg-green-900 text-white">
                <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <MapPin className="w-6 h-6 flex-shrink-0" />
                    <p>1st Floor, Plot No-158, Chand Nagar, West Delhi, New Delhi-110018</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Phone className="w-6 h-6" />
                    <p>92204 06427, 92204 06428</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Mail className="w-6 h-6" />
                    <p>dyfru.india@gmail.com</p>
                  </div>
                </div>
              </div>
              <div className="p-12">
                <h2 className="text-3xl font-bold mb-8 text-gray-900">Connect With Us</h2>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { icon: <Instagram className="w-8 h-8" />, url: 'https://www.instagram.com/dyfru.india/' },
                    { icon: <Twitter className="w-8 h-8" />, url: 'https://x.com/DyfruIndia' },
                    { icon: <Youtube className="w-8 h-8" />, url: 'https://www.youtube.com/@DyFruIndia' },
                    { icon: <Linkedin className="w-8 h-8" />, url: 'https://www.linkedin.com/in/dyfru-india-a92432344/' },
                    { icon: <Facebook className="w-8 h-8" />, url: 'https://www.facebook.com/profile.php?id=61571373845662' },
                  ].map((social, index) => (
                    <a
                      key={index}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-600 hover:bg-green-100 hover:text-green-700 transform hover:scale-110 transition-all duration-300"
                    >
                      {social.icon}
                    </a>
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

export default About;
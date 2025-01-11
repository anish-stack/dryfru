import React, { useState } from 'react';
import { Lock, Mail, Nut, Phone, User } from 'lucide-react';
import { Link } from 'react-router-dom';

function Register() {
    const [rememberMe, setRememberMe] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        Name: '',
        Email: '',
        Password: '',
        ContactNumber: ''
    });

    const onChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
                {/* Register and Header */}
                <div className="text-center">
                    <div className="mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                        <Nut className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome To Register
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Register to your Nutri Delights account
                    </p>
                </div>

                {/* Login Form */}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="name" className="sr-only">
                                Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{
                                    zIndex: '9999',
                                }}>
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="name"
                                    Fullname="name"
                                    type="text"
                                    autoComplete="name"
                                    required
                                    value={formData.Name}
                                    onChange={onChange}
                                    className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                    placeholder="Full Name"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="email" className="sr-only">
                            Email
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{
                                zIndex: '9999',
                            }}>
                                <Mail className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={formData.Email}
                                onChange={onChange}
                                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Email Address"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="sr-only">
                            Password
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{
                                zIndex: '9999',
                            }}>
                                <Lock className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value={formData.Password}
                                onChange={onChange}
                                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="contactNumber" className="sr-only">
                            Contact Number
                        </label>
                        <div className="relative">
                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" style={{
                                zIndex: '9999',
                                }}>
                                <Phone className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                id="contactNumber"
                                name="contactNumber"
                                type="tel"
                                autoComplete="tel"
                                required
                                value={formData.ContactNumber}
                                onChange={onChange}
                                className="appearance-none relative block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Contact Number"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <input
                                id="remember-me"
                                name="remember-me"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                            />
                            <label
                                htmlFor="privacy-policy"
                                className="ml-2 block text-sm text-gray-900"
                            >
                                I agree to the Privacy Policy
                            </label>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg ${isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                                } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                        >
                            {isSubmitting ? 'Signing in...' : 'Create An Account'}
                        </button>
                    </div>

                    <div className="text-center text-sm">
                        <span className="text-gray-600">Already Have an Account? </span>
                        <Link
                            to={'/login'}
                            className="font-medium text-green-600 hover:text-green-500"
                            >
                            Sign In now
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;

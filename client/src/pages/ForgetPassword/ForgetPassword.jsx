import React, { useState } from 'react';
import { Lock, Mail, Nut } from 'lucide-react';

const ForgetPassword = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    return (
    <div className='min-h-screen bg-gradient-to-br from-green-50 to-orange-100 flex items-center justify-center p-4'>
        <div className='max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl'> 
            <div className='text-center'>
                <div className='mx-auto h-12 w-12 bg-green-100 rounded-full flex items-center justify-center'>
                    <Nut className='h-8 w-8 text-green-600'/>
                </div>
                <h2 className='mt-6 text-3xl font-extrabold text-gray-900'>
                    Forget Password
                </h2>
                <p className='mt-2 text-sm text-gray-600'>
                    Enter your account email to receive a link allowing you to reset your password.
                </p>
            </div>
            
            <form className='mt-8 space-y-6'>
                <div className='space-y-4'>
                    <div>
                        <lable htmlfor="email" className="sr-only">
                            Email address
                        </lable>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Mail className='h-5 w-5 text-green-500'/>
                            </div>
                            <input 
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value=""
                                className="appearance-none realtive block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500
                                text-gray-900 rounded-lg
                                focus:outline-none
                                focus:ring-green-500
                                focu:border-green-500
                                focus:z-10 sm-text-sm"
                                placeholder="Email address"
                            />
                        </div>
                    </div>

                    <div>
                        <lable htmlfor="password" className="sr-only">
                            New Password
                        </lable>
                        <div className='relative'>
                            <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                <Lock className='h-5 w-5 text-gray-500'/>
                            </div>
                            <input 
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                value=""
                                className="appearance-none realtive block w-full pl-10 pr-3 py-2 border border-gray-300 placeholder-gray-500
                                text-gray-900 rounded-lg
                                focus:outline-none
                                focus:ring-green-500
                                focu:border-green-500
                                focus:z-10 sm-text-sm"
                                placeholder="New Password"
                            />
                        </div>
                    </div>
                </div>

                <div>
                    <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg ${
                        isSubmitting ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                    } text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200`}
                    >
                    {isSubmitting ? 'Signing in...' : 'Set Password'}
                    </button>
                </div>
            </form>
        </div>
    </div>
  )
}

export default ForgetPassword;

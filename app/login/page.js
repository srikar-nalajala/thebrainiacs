'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
    const router = useRouter();
    const { loginWithPhone, registerUser, user, loading: authLoading } = useAuth();

    useEffect(() => {
        if (!authLoading && user) {
            router.push('/dashboard');
        }
    }, [user, authLoading, router]);

    const [step, setStep] = useState('PHONE'); // PHONE | OTP | REGISTER
    const [loading, setLoading] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [otp, setOtp] = useState('');

    // Registration Form State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        dob: '',
        upi_id: ''
    });

    const [agreedTerms, setAgreedTerms] = useState(false);
    const [agreedPrivacy, setAgreedPrivacy] = useState(false);

    const handleGetOTP = async (e) => {
        e.preventDefault();

        // Debugging/Validation Alerts
        if (phoneNumber.length !== 10) {
            alert("Please enter a valid 10-digit phone number.");
            return;
        }
        if (!agreedTerms) {
            alert("Please accept the Terms & Conditions.");
            return;
        }
        if (!agreedPrivacy) {
            alert("Please accept the Privacy Policy.");
            return;
        }

        setLoading(true);
        // Simulate OTP sending delay
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
        setStep('OTP');
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        if (otp.length !== 4) {
            alert("Please enter a 4-digit OTP");
            return;
        }

        setLoading(true);

        try {
            // Attempt Login
            console.log("Attempting login with:", phoneNumber);
            const result = await loginWithPhone(phoneNumber);
            console.log("Login result:", result);

            if (result.success) {
                // User exists, redirect
                router.push('/dashboard');
            } else if (result.status === 'USER_NOT_FOUND') {
                // User doesn't exist, go to Registration
                alert("New user detected! Redirecting to create profile...");
                setStep('REGISTER');
            } else {
                alert("Login Error: " + (result.error?.message || "Unknown error"));
            }
        } catch (err) {
            alert("System Error: " + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);

        const newUser = {
            ...profileData,
            phone_number: phoneNumber,
            role: 'User',
            user_level: 'Level 1'
        };

        const result = await registerUser(newUser);

        setLoading(false);
        if (result.success) {
            router.push('/dashboard');
        } else {
            alert("Registration failed: " + result.error?.message);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header Section */}
                <div className="p-8 text-center bg-white border-b border-gray-100 relative">
                    <Link href="/" className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 text-red-500 mb-4 absolute top-6 left-6">
                        <i className="fa-solid fa-arrow-left"></i>
                    </Link>
                    <h2 className="text-2xl font-bold text-gray-800 mt-2">
                        {step === 'REGISTER' ? 'Create Profile' : 'Welcome'}
                    </h2>
                    <p className="text-gray-500 mt-2 text-sm italic">"Because every deal deserves a second chance."</p>
                </div>

                {/* Form Section */}
                <div className="p-8 pt-6">
                    {step === 'PHONE' && (
                        <form onSubmit={handleGetOTP} className="space-y-6">
                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center">
                                <span className="text-gray-900 font-bold text-lg mr-3">+91</span>
                                <input
                                    type="tel"
                                    placeholder="Enter phone number"
                                    className="bg-transparent border-none outline-none text-lg w-full text-gray-700 placeholder-gray-400"
                                    value={phoneNumber}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                        setPhoneNumber(val);
                                    }}
                                    maxLength={10}
                                    required
                                />
                                <i className="fa-solid fa-mobile-screen text-gray-400 ml-2"></i>
                            </div>

                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-[#E50914] cursor-pointer"
                                        checked={agreedTerms}
                                        onChange={(e) => setAgreedTerms(e.target.checked)}
                                    />
                                    <span className="text-gray-600 text-sm select-none">
                                        I agree to the <a href="#" className="text-red-500 font-semibold hover:underline">Terms & Conditions</a>
                                    </span>
                                </label>

                                <label className="flex items-center space-x-3 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        className="w-5 h-5 accent-[#E50914] cursor-pointer"
                                        checked={agreedPrivacy}
                                        onChange={(e) => setAgreedPrivacy(e.target.checked)}
                                    />
                                    <span className="text-gray-600 text-sm select-none">
                                        I agree to the <a href="#" className="text-red-500 font-semibold hover:underline">Privacy Policy</a>
                                    </span>
                                </label>
                            </div>

                            <button
                                type="button"
                                onClick={handleGetOTP}
                                disabled={loading}
                                className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-200 transform active:scale-95 ${loading
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#E50914] text-white shadow-lg shadow-red-200 hover:bg-red-700'
                                    }`}
                            >
                                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Get OTP'}
                            </button>
                        </form>
                    )}

                    {step === 'OTP' && (
                        <form onSubmit={handleVerifyOTP} className="space-y-6">
                            <div className="text-center mb-6">
                                <div className="text-gray-600 mb-2">OTP sent to +91 {phoneNumber}</div>
                                <button type="button" onClick={() => setStep('PHONE')} className="text-red-500 text-sm font-semibold hover:underline">Change Number</button>
                            </div>

                            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex items-center">
                                <input
                                    type="text"
                                    placeholder="Enter 4-digit OTP"
                                    className="bg-transparent border-none outline-none text-lg w-full text-center text-gray-700 tracking-[0.5em] font-bold placeholder-gray-400"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                    maxLength="4"
                                    required
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={otp.length !== 4 || loading}
                                className={`w-full py-4 rounded-xl text-lg font-bold transition-all duration-200 transform active:scale-95 ${(otp.length !== 4 || loading)
                                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                    : 'bg-[#E50914] text-white shadow-lg shadow-red-200 hover:bg-red-700'
                                    }`}
                            >
                                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Verify & Login'}
                            </button>
                        </form>
                    )}

                    {step === 'REGISTER' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Full Name</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                                    placeholder="John Doe"
                                    value={profileData.name}
                                    onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                                <input
                                    type="email"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                                    placeholder="john@example.com"
                                    value={profileData.email}
                                    onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Date of Birth</label>
                                <input
                                    type="date"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                                    value={profileData.dob}
                                    onChange={e => setProfileData({ ...profileData, dob: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">UPI ID (For Payments)</label>
                                <input
                                    type="text"
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500"
                                    placeholder="username@upi"
                                    value={profileData.upi_id}
                                    onChange={e => setProfileData({ ...profileData, upi_id: e.target.value })}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 mt-2 rounded-xl text-lg font-bold bg-[#E50914] text-white shadow-lg shadow-red-200 hover:bg-red-700 transition-all duration-200"
                            >
                                {loading ? <i className="fa-solid fa-spinner fa-spin"></i> : 'Complete Profile'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CouponActions({ coupon }) {
    const { user } = useAuth();
    const router = useRouter();
    const [isPurchased, setIsPurchased] = useState(coupon.status === 'sold' && coupon.buyer_id === user?.id);
    const [buying, setBuying] = useState(false);
    const [validationStatus, setValidationStatus] = useState(null); // 'valid', 'invalid', null
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    // Regex to Validate Coupon Code Format
    // Example: Alphanumeric, 4-20 characters (Adjust as needed)
    const couponRegex = /^[A-Za-z0-9-]{4,20}$/;

    // Effect to check if already purchased (in case of revisit)
    useEffect(() => {
        if (coupon.status === 'sold' && user && coupon.buyer_id === user.id) {
            setIsPurchased(true);
        }
    }, [coupon, user]);

    const handlePurchase = async () => {
        if (!user) {
            alert("Please login to purchase coupons.");
            router.push('/login');
            return;
        }

        setBuying(true);

        try {
            const { error } = await supabase
                .from('coupons')
                .update({
                    status: 'sold',
                    buyer_id: user.id
                })
                .eq('id', coupon.id);

            if (error) throw error;

            setIsPurchased(true);
            alert("Purchase successful! You can now see the code.");

            // Validate the code immediately after "unlocking"
            if (couponRegex.test(coupon.code)) {
                setValidationStatus('valid');
            } else {
                setValidationStatus('invalid');
            }
        } catch (error) {
            console.error("Purchase failed:", error);
            alert("Failed to purchase coupon. It might already be sold.");
        } finally {
            setBuying(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsVerifying(true);
        setVerificationResult(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('expectedCode', coupon.code);

        try {
            const response = await fetch('/api/verify-coupon', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            setVerificationResult({
                success: data.success,
                message: data.message,
                data: data.data
            });
        } catch (error) {
            console.error('Verification failed', error);
            setVerificationResult({
                success: false,
                message: 'Network error during verification.',
            });
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Verified Badge */}
            <div className="flex items-center space-x-2 mb-6">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-200">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    Verified by AI
                </span>
                {/* Expiry logic could be passed as prop or calculated here if needed */}
                <span className={`text-sm ${new Date(coupon.expiry_date) < new Date() ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                    Expires: {coupon.expiry_date ? coupon.expiry_date.split('-').reverse().join('/') : 'N/A'}
                </span>
            </div>

            {/* Title and Discount */}
            <div className="mb-6">
                <h2 className="text-xl text-gray-500 uppercase font-medium tracking-wide">
                    {coupon.brand_name}
                </h2>
                <h1 className="mt-2 text-4xl font-extrabold text-[#E50914] sm:text-5xl">
                    {coupon.discount_value || 'Discount'}
                </h1>
                <p className="mt-4 text-gray-600 text-lg leading-relaxed">
                    {coupon.description}
                </p>
            </div>

            {/* Masked/Unmasked Code Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-8 text-center relative overflow-hidden group transition-all duration-300">
                {!isPurchased ? (
                    <>
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-opacity duration-300">
                            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <span className="text-sm font-semibold text-gray-600 uppercase tracking-wider">
                                Purchase to Unlock
                            </span>
                        </div>
                        <span className="text-2xl font-mono font-bold text-gray-300 select-none blur-sm">
                            XXXX-XXXX-XXXX
                        </span>
                    </>
                ) : (
                    <div className="animate-fade-in">
                        <p className="text-sm text-gray-500 mb-2">Your Coupon Code:</p>
                        <div className="text-3xl font-mono font-bold text-[#222] tracking-wider select-all bg-white p-2 rounded border border-dashed border-gray-300">
                            {coupon.code}
                        </div>

                        {/* Validation Feedback */}
                        <div className="mt-3">
                            {validationStatus === 'valid' && (
                                <span className="text-green-600 text-sm flex items-center justify-center">
                                    <i className="fa-solid fa-check-circle mr-1"></i> Format Validated
                                </span>
                            )}
                            {validationStatus === 'invalid' && (
                                <span className="text-red-500 text-sm flex items-center justify-center">
                                    <i className="fa-solid fa-triangle-exclamation mr-1"></i> Invalid Format Detected
                                </span>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Buy Now / OCR Placeholder */}
            <div className="mt-auto">
                {!isPurchased ? (
                    <>
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-500 text-sm">Unlock Price</span>
                            <span className="text-2xl font-bold text-gray-900">{coupon.price || 'FREE'}</span>
                        </div>
                        <button
                            onClick={handlePurchase}
                            className="w-full bg-[#E50914] text-white py-4 px-6 rounded-lg font-bold text-lg shadow-lg hover:bg-red-700 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200"
                            disabled={buying}
                        >
                            {buying ? 'Processing...' : 'Buy Now'}
                        </button>
                    </>
                ) : null}


                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-400">
                        Secure transaction • Instant delivery • 100% Verified
                    </p>
                </div>
            </div>
        </div>
    );
}

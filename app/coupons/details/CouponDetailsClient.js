'use client';

import { supabase } from '../../../lib/supabase';
import Link from 'next/link';
import CouponActions from './CouponActions';
import Header from '../../components/Header';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function CouponDetailsClient() {
    const searchParams = useSearchParams();
    const id = searchParams.get('id');

    const [coupon, setCoupon] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCoupon = async () => {
            const { data, error } = await supabase
                .from('coupons')
                .select('*')
                .eq('id', id)
                .single();
            if (!error && data) {
                setCoupon(data);
            }
            setLoading(false);
        };
        fetchCoupon();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                <p>Loading...</p>
            </div>
        );
    }

    if (!coupon) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                <p>Coupon not found or has expired.</p>
                <Link href="/marketplace" className="ml-4 text-[#E50914] hover:underline">
                    Back to Marketplace
                </Link>
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

                    <div className="md:flex">
                        {/* Left Column: Brand Image */}
                        <div className="md:flex-shrink-0 md:w-1/2 bg-gray-100 flex items-center justify-center min-h-[400px]">
                            {/* Visual Placeholder for Brand Image */}
                            <div className="text-center p-8">
                                <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                                    <span className="text-4xl font-bold text-gray-400">
                                        {coupon.brand_name?.charAt(0).toUpperCase() || 'B'}
                                    </span>
                                </div>
                                <p className="text-gray-500 text-sm">Brand Image Placeholder</p>
                            </div>
                        </div>

                        {/* Right Column: Details (Interactive) */}
                        <div className="p-8 md:p-12 md:w-1/2 flex flex-col justify-center">
                            <CouponActions coupon={coupon} />
                        </div>
                    </div>
                </div>

                <div className="max-w-5xl mx-auto mt-8 text-center">
                    <Link href="/marketplace" className="text-gray-500 hover:text-[#E50914] transition-colors">
                        ← Back to all coupons
                    </Link>
                </div>

            </div>
        </>
    );
}

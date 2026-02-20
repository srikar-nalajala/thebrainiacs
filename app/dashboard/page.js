'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header';
import UserInfo from './UserInfo';
import UserLevel from './UserLevel';
import CouponStats from './CouponStats';
import CouponList from './CouponList';

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('uploads'); // 'uploads' | 'purchases'
    const [stats, setStats] = useState({ uploaded: 0, sold: 0, purchased: 0 });
    const { user } = useAuth(); // Assuming useAuth is available here, need to import it if not

    useEffect(() => {
        if (!user) return;

        async function fetchStats() {
            // Count uploads
            const { count: uploadedCount } = await supabase
                .from('coupons')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id);

            // Count sold
            const { count: soldCount } = await supabase
                .from('coupons')
                .select('*', { count: 'exact', head: true })
                .eq('seller_id', user.id)
                .eq('status', 'sold');

            // Count purchased
            const { count: purchasedCount } = await supabase
                .from('coupons')
                .select('*', { count: 'exact', head: true })
                .eq('buyer_id', user.id)
                .eq('status', 'sold');

            setStats({
                uploaded: uploadedCount || 0,
                sold: soldCount || 0,
                purchased: purchasedCount || 0
            });
        }

        fetchStats();
    }, [user]);

    return (
        <>
            <Header />

            <main className="min-h-screen bg-gray-50 py-8">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Left Column: User Profile & Level */}
                        <div className="w-full lg:w-1/3 space-y-8">
                            <UserInfo />
                            <UserLevel stats={stats} />
                        </div>

                        {/* Right Column: Stats & Lists */}
                        <div className="w-full lg:w-2/3 space-y-8">
                            <CouponStats />

                            {/* Tabs for Coupons */}
                            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                                <div className="flex border-b border-gray-100">
                                    <button
                                        className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'uploads' ? 'text-[#E50914] border-b-2 border-[#E50914] bg-red-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                                        onClick={() => setActiveTab('uploads')}
                                    >
                                        Uploaded Coupons
                                    </button>
                                    <button
                                        className={`flex-1 py-4 text-center font-semibold transition-colors ${activeTab === 'purchases' ? 'text-[#E50914] border-b-2 border-[#E50914] bg-red-50/50' : 'text-gray-500 hover:bg-gray-50'}`}
                                        onClick={() => setActiveTab('purchases')}
                                    >
                                        Purchased Coupons
                                    </button>
                                </div>
                                <div className="p-6">
                                    <CouponList type={activeTab} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="main-footer">
                <div className="container footer-container">
                    <div className="footer-left">
                        <h4>The Brainiacs - Coupon Marketplace</h4>
                        <p>Save money on your favorite brands</p>
                        <p className="phone">© 2026 The Brainiacs. All rights reserved.</p>
                    </div>
                    <div className="footer-right">
                        <a href="#">Terms</a>
                        <a href="#">Privacy</a>
                        <a href="#">Contact Us</a>
                    </div>
                </div>
            </footer>
        </>
    );
}

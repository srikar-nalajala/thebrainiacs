'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function CouponStats() {
    const { user } = useAuth();
    const [stats, setStats] = useState({
        uploaded: 0,
        sold: 0,
        purchased: 0
    });

    useEffect(() => {
        if (user) {
            fetchStats();
        }
    }, [user]);

    const fetchStats = async () => {
        // Count Uploaded
        const { count: uploaded } = await supabase
            .from('coupons')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', user.id);

        // Count Sold
        const { count: sold } = await supabase
            .from('coupons')
            .select('*', { count: 'exact', head: true })
            .eq('seller_id', user.id)
            .eq('status', 'sold');

        // Count Purchased
        const { count: purchased } = await supabase
            .from('coupons')
            .select('*', { count: 'exact', head: true })
            .eq('buyer_id', user.id);

        setStats({ uploaded: uploaded || 0, sold: sold || 0, purchased: purchased || 0 });
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
                <h3 className="text-xl font-bold text-gray-800">Coupon Statistics</h3>
            </div>
            <div className="p-8">
                <div className="flex justify-between items-center text-center divide-x divide-gray-100">
                    <div className="flex-1 px-4">
                        <div className="text-3xl font-bold text-gray-900">{stats.uploaded}</div>
                        <div className="text-sm text-gray-500 mt-2">Total Uploaded</div>
                    </div>
                    <div className="flex-1 px-4">
                        <div className="text-3xl font-bold text-gray-900">{stats.uploaded}</div>
                        <div className="text-sm text-gray-500 mt-2">Approved</div>
                    </div>
                    <div className="flex-1 px-4">
                        <div className="text-3xl font-bold text-gray-900">0</div>
                        <div className="text-sm text-gray-500 mt-2">Pending Review</div>
                    </div>
                </div>
                <div className="flex justify-between items-center text-center divide-x divide-gray-100 mt-8 pt-8 border-t border-gray-50">
                    <div className="flex-1 px-4">
                        <div className="text-3xl font-bold text-gray-900">{stats.sold}</div>
                        <div className="text-sm text-gray-500 mt-2">Sold</div>
                    </div>
                    <div className="flex-1 px-4">
                        <div className="text-3xl font-bold text-gray-900">{stats.purchased}</div>
                        <div className="text-sm text-gray-500 mt-2">Purchased</div>
                    </div>
                    <div className="flex-1 px-4">
                        <div className="text-3xl font-bold text-gray-900">{stats.sold + stats.purchased}</div>
                        <div className="text-sm text-gray-500 mt-2">Total Verified</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

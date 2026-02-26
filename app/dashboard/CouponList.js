'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabase';

export default function CouponList({ type }) {
    const { user } = useAuth();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusColor = (status) => {
        switch (status) {
            case 'sold': return 'bg-green-500';
            case 'escrow': return 'bg-blue-500';
            case 'disputed': return 'bg-orange-500';
            default: return 'bg-yellow-500';
        }
    };

    useEffect(() => {
        if (user) {
            fetchCoupons();
        }
    }, [user, type]);

    const fetchCoupons = async () => {
        setLoading(true);
        let query = supabase.from('coupons').select('id, brand_name, category, status, description, expiry_date, code');

        if (type === 'uploads') {
            query = query.eq('seller_id', user.id);
        } else if (type === 'purchases') {
            query = query.eq('buyer_id', user.id);
        }

        const { data, error } = await query;
        if (data) {
            setCoupons(data);
        }
        setLoading(false);
    };

    if (loading) return <div>Loading coupons...</div>;

    if (type === 'purchases' && coupons.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4">No Purchased Coupons</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You haven't purchased any coupons yet. Browse through available coupons and start saving money!
                </p>
                <a
                    href="/marketplace"
                    className="inline-block px-8 py-3 bg-[#E50914] text-white font-bold rounded-lg shadow-lg shadow-red-200 hover:bg-red-700 transition-colors"
                >
                    Browse Available Coupons
                </a>
            </div>
        );
    }

    if (coupons.length === 0) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-bold text-gray-800 mb-4">No Uploaded Coupons</h3>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    You haven't uploaded any coupons yet. Upload now to earn cash!
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
            {coupons.map((coupon) => (
                <div key={coupon.id} className="border border-gray-100 rounded-xl p-6 bg-white hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <span className="text-gray-900 font-bold">{coupon.brand_name}</span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium text-white uppercase tracking-wider ${getStatusColor(coupon.status)}`}>
                                    {coupon.status || 'Active'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-500">Category:</span>
                            <span className="font-semibold text-gray-900">{coupon.category}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-500 w-1/3">Description:</span>
                            <span className="font-semibold text-gray-900 w-2/3 text-right">{coupon.description}</span>
                        </div>
                        <div className="flex justify-between pt-2 border-t border-gray-50">
                            <span className="text-gray-500">Expiry Date:</span>
                            <span className="font-semibold text-gray-900">{coupon.expiry_date}</span>
                        </div>

                        {type === 'purchases' && (
                            <div className="mt-3 pt-3 border-t border-gray-100">
                                <p className="text-xs text-gray-500 mb-1">Coupon Code:</p>
                                <div className="bg-gray-50 p-2 rounded border border-dashed border-gray-300 text-center flex flex-col sm:flex-row justify-between items-center sm:px-4 gap-3">
                                    <span className="font-mono font-bold text-lg text-[#E50914] select-all">
                                        {coupon.code}
                                    </span>
                                    {['escrow', 'disputed'].includes(coupon.status) && (
                                        <a href={`/coupons/details?id=${coupon.id}`} className="text-xs font-bold bg-[#E50914] text-white px-3 py-1.5 rounded hover:bg-red-700 transition shadow-sm">
                                            Resolve Escrow
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

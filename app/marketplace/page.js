import { supabase } from '../../lib/supabase';
import Link from 'next/link';
import Header from '../components/Header';

// Revalidate data every 60 seconds
export const revalidate = 60;

export default async function MarketplacePage() {
    // Fetch coupons from Supabase
    const { data: coupons, error } = await supabase
        .from('coupons')
        .select('*')
        .neq('status', 'sold') // Filter out sold coupons
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching coupons:', error);
        return (
            <div className="flex justify-center items-center min-h-screen text-red-600">
                Failed to load coupons. Please try again later.
            </div>
        );
    }

    return (
        <>
            <Header />
            <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="text-4xl font-extrabold text-[#E50914] sm:text-5xl sm:tracking-tight lg:text-6xl">
                            Coupon Marketplace
                        </h1>
                        <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                            Find the best deals on your favorite brands.
                        </p>
                    </div>

                    {/* 12-Column Grid Layout (Responsive) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {coupons?.map((coupon) => (
                            <div
                                key={coupon.id}
                                className="bg-white overflow-hidden shadow-lg rounded-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-4">
                                        <h3 className="text-lg font-bold text-gray-900 truncate">
                                            {coupon.brand_name}
                                        </h3>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-[#E50914]">
                                            {coupon.category}
                                        </span>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-3xl font-bold text-[#E50914]">
                                            {coupon.discount_value}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Price: <span className="font-semibold text-gray-900">{coupon.price}</span>
                                        </p>
                                    </div>

                                    <p className="text-gray-600 text-sm line-clamp-3 mb-4">
                                        {coupon.description}
                                    </p>
                                </div>

                                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                                    <Link
                                        href={`/coupons/${coupon.id}`}
                                        className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#E50914] hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                                    >
                                        View Deal
                                    </Link>
                                    {coupon.expiry_date && (
                                        <p className="text-xs text-center text-gray-400 mt-2">
                                            Expires: {new Date(coupon.expiry_date).toLocaleDateString()}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {coupons?.length === 0 && (
                        <div className="text-center text-gray-500 py-12">
                            No coupons available at the moment. Check back later!
                        </div>
                    )}

                </div>
            </div>
        </>
    );
}

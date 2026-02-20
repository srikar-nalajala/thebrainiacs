import { Suspense } from 'react';
import CouponDetailsClient from './CouponDetailsClient';

export default function CouponDetailsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-gray-500"><p>Loading...</p></div>}>
            <CouponDetailsClient />
        </Suspense>
    );
}

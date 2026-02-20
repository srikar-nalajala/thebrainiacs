'use client';

import { useAuth } from '../../context/AuthContext';

export default function UserInfo() {
    const { user } = useAuth();

    if (!user) return <div className="p-6 bg-white rounded-2xl">Loading...</div>;

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-xl font-bold text-gray-800">Your Information</h3>
                <button className="text-[#E50914] font-semibold text-sm hover:underline">Edit</button>
            </div>

            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Personal Information</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm w-1/3">Name:</span>
                            <span className="text-gray-900 font-semibold w-2/3 text-right">{user.name}</span>
                        </div>
                        <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm w-1/3">Email:</span>
                            <span className="text-gray-900 font-semibold w-2/3 text-right break-all">{user.email}</span>
                        </div>
                        <div className="flex justify-between items-start border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm w-1/3">Date of Birth:</span>
                            <span className="text-gray-900 font-semibold w-2/3 text-right">{user.dob}</span>
                        </div>
                        <div className="flex justify-between items-start pb-1">
                            <span className="text-gray-500 text-sm w-1/3">UPI ID:</span>
                            <span className="text-gray-900 font-semibold w-2/3 text-right">{user.upi_id}</span>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <h4 className="text-lg font-bold text-gray-800 mb-4">Account Information</h4>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm">ID:</span>
                            <span className="text-gray-900 font-semibold text-xs">{user.id}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm">Role:</span>
                            <span className="text-gray-900 font-semibold">{user.role}</span>
                        </div>
                        <div className="flex justify-between items-center border-b border-gray-50 pb-3">
                            <span className="text-gray-500 text-sm">User Level:</span>
                            <span className="text-gray-900 font-semibold">{user.user_level}</span>
                        </div>
                        <div className="flex justify-between items-center pb-1">
                            <span className="text-gray-500 text-sm">Joined:</span>
                            <span className="text-gray-900 font-semibold">{new Date(user.created_at).toLocaleDateString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

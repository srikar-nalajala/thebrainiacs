'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
    const { user, logout } = useAuth();
    const router = useRouter();

    return (
        <header className="main-header">
            <div className="container header-container">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => router.back()}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 transition-colors"
                        title="Go Back"
                    >
                        <i className="fa-solid fa-arrow-left"></i>
                    </button>
                    <Link href="/" className="logo">
                        <i className="fa-solid fa-brain"></i>
                        <div className="logo-text">
                            <span>The</span>
                            <strong>Brainiacs</strong>
                        </div>
                    </Link>
                </div>
                <div className="search-bar">
                    <i className="fa-solid fa-magnifying-glass"></i>
                    <input type="text" placeholder="Search coupons, brands..." />
                </div>
                <div className="nav-icons">
                    <Link href={user ? "/dashboard" : "/login"} className="icon-btn highlight" title={user ? "Dashboard" : "Login"}>
                        <i className={`fa-regular ${user ? 'fa-id-badge' : 'fa-user'}`}></i>
                    </Link>
                    <Link href="/dashboard" className="icon-btn"><i className="fa-solid fa-cart-shopping"></i></Link>
                    <Link href="/dashboard" className="icon-btn"><i className="fa-regular fa-bell"></i></Link>
                    {user && (
                        <button onClick={logout} className="icon-btn text-red-500" title="Logout">
                            <i className="fa-solid fa-right-from-bracket"></i>
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}

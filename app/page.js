'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from './components/Header';
import { supabase } from '../lib/supabase';

const brandIcons = {
    'Amazon': <><i className="fa-brands fa-amazon"></i> <span>Amazon</span></>,
    'Flipkart': <><i className="fa-brands fa-flipboard"></i> <span>Flipkart</span></>,
    'Myntra': <span className="brand-text">Myntra</span>,
    'Zomato': <span className="brand-text" style={{ color: '#CB202D' }}>Zomato</span>,
    'Swiggy': <span className="brand-text" style={{ color: '#FC8019' }}>Swiggy</span>,
    'Swiggy Instamart': <span className="brand-text" style={{ color: '#FC8019' }}>Swiggy Instamart</span>,
    'TATA': <span className="brand-text" style={{ color: '#008ECC' }}>TATA</span>,
    'BookMyShow': <><i className="fa-solid fa-film"></i> <span>BookMyShow</span></>,
    'Giva': <span className="brand-text" style={{ color: '#FF7043' }}>Giva</span>,
    'Lenskart': <span className="brand-text" style={{ color: '#11A5B8' }}>Lenskart</span>,
    'Uber': <><i className="fa-brands fa-uber"></i> <span>Uber</span></>,
};

const categoryIcons = {
    'Food': <i className="fa-solid fa-utensils"></i>,
    'Fashion': <i className="fa-solid fa-shirt"></i>,
    'Travel': <i className="fa-solid fa-plane"></i>,
    'Games': <i className="fa-solid fa-gamepad"></i>,
    'Groceries': <i className="fa-solid fa-basket-shopping"></i>,
    'Grocery': <i className="fa-solid fa-basket-shopping"></i>,
    'Electronics': <i className="fa-solid fa-laptop"></i>,
    'Automotive': <i className="fa-solid fa-car"></i>,
};

export default function Home() {
    const [brands, setBrands] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        async function fetchActiveFilters() {
            const { data, error } = await supabase
                .from('coupons')
                .select('brand_name, category')
                .neq('status', 'sold');

            if (!error && data) {
                // Deduplicate sets essentially simulating a SELECT DISTINCT
                const uniqueBrands = [...new Set(data.map(item => item.brand_name).filter(Boolean))];
                const uniqueCategories = [...new Set(data.map(item => item.category).filter(Boolean))];

                setBrands(uniqueBrands);
                setCategories(uniqueCategories);
            }
        }

        fetchActiveFilters();
    }, []);
    return (
        <>
            <Header />
            <section className="hero-section">
                <div className="container hero-container">
                    <div className="hero-content">
                        <p className="breadcrumbs">Popular &nbsp;|&nbsp; Electronics &nbsp;|&nbsp; Food &nbsp;|&nbsp; Travel</p>
                        <h1>Turn Your Unused <br /> <span className="highlight-text">Coupons into Cash</span></h1>
                        <p className="tagline">'Indie's First Coupon Marketplace'</p>
                        <div className="cta-buttons">
                            <Link href="/upload" className="btn btn-primary">Upload Coupon</Link>
                            <Link href="/marketplace" className="btn btn-outline">Browse All Deals</Link>
                        </div>
                    </div>
                    <div className="hero-image">
                        <div className="image-placeholder">
                            <i className="fa-solid fa-wallet fa-5x"></i>
                            <div className="floating-coupon c-1"><i className="fa-solid fa-ticket"></i></div>
                            <div className="floating-coupon c-2"><i className="fa-solid fa-percent"></i></div>
                            <div className="floating-coupon c-3"><i className="fa-solid fa-gift"></i></div>
                        </div>
                    </div>
                </div>
            </section>
            <section className="brands-section">
                <div className="container">
                    <div className="brands-header">
                        <h3>Popular Brands</h3>
                        <div className="trust-badges">
                            <span className="badge"><i className="fa-solid fa-shield-halved"></i> 100% Verified Sellers</span>
                            <span className="badge"><i className="fa-regular fa-clock"></i> Real-Time Expiry Alerts</span>
                        </div>
                    </div>
                    <div className="brands-grid">
                        {brands.length > 0 ? brands.map((brand, idx) => (
                            <Link key={idx} href={`/marketplace?brand=${encodeURIComponent(brand)}`} className="brand-card">
                                {brandIcons[brand] || <span>{brand}</span>}
                            </Link>
                        )) : (
                            <div className="col-span-full py-4 text-center text-gray-500">
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading Active Brands...
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <section className="categories-section">
                <div className="container">
                    <div className="section-header">
                        <h3>Browse by Category</h3>
                        <Link href="/marketplace" className="see-all">See All <i className="fa-solid fa-arrow-right"></i></Link>
                    </div>
                    <div className="categories-grid">
                        {categories.length > 0 ? categories.map((cat, idx) => (
                            <Link key={idx} href={`/marketplace?category=${encodeURIComponent(cat)}`} className="category-card">
                                <div className="icon-box">
                                    {categoryIcons[cat] || <i className="fa-solid fa-tag"></i>}
                                </div>
                                <span>{cat}</span>
                            </Link>
                        )) : (
                            <div className="col-span-full py-4 text-center text-gray-500">
                                <i className="fa-solid fa-spinner fa-spin mr-2"></i> Loading Active Categories...
                            </div>
                        )}
                    </div>
                </div>
            </section>
            <footer className="main-footer">
                <div className="container footer-container">
                    <div className="footer-left">
                        <h4>The Brainiacs - Coupon Marketplace</h4>
                        <p>Save money on your favorite brands</p>
                        <p className="phone">© 2026 The Brainiacs. All rights reserved.</p>
                    </div>
                    <div className="footer-right">
                        <Link href="/">Terms</Link>
                        <Link href="/">Privacy</Link>
                        <Link href="/">Contact Us</Link>
                        <Link href="/" className="footer-icon"><i className="fa-brands fa-instagram"></i></Link>
                        <Link href="/download" className="footer-btn">Get App</Link>
                    </div>
                </div>
            </footer>
        </>
    );
}

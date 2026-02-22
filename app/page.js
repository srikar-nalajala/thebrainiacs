import Link from 'next/link';
import Header from './components/Header';

export default function Home() {
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
                        <Link href="/marketplace" className="brand-card"><i className="fa-brands fa-amazon"></i> <span>Amazon</span></Link>
                        <Link href="/marketplace" className="brand-card"><i className="fa-brands fa-flipboard"></i> <span>Flipkart</span></Link>
                        <Link href="/marketplace" className="brand-card"><span className="brand-text">Myntra</span></Link>
                        <Link href="/marketplace" className="brand-card"><span className="brand-text" style={{ color: '#CB202D' }}>Zomato</span></Link>
                        <Link href="/marketplace" className="brand-card"><span className="brand-text" style={{ color: '#FC8019' }}>Swiggy</span></Link>
                        <Link href="/marketplace" className="brand-card"><span className="brand-text" style={{ color: '#008ECC' }}>TATA</span></Link>
                        <Link href="/marketplace" className="brand-card"><i className="fa-solid fa-film"></i> <span>BookMyShow</span></Link>
                        <Link href="/marketplace" className="brand-card"><span>Appliances</span></Link>
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
                        <Link href="/marketplace" className="category-card">
                            <div className="icon-box"><i className="fa-solid fa-utensils"></i></div>
                            <span>Food</span>
                        </Link>
                        <Link href="/marketplace" className="category-card">
                            <div className="icon-box"><i className="fa-solid fa-shirt"></i></div>
                            <span>Fashion</span>
                        </Link>
                        <Link href="/marketplace" className="category-card">
                            <div className="icon-box"><i className="fa-solid fa-plane"></i></div>
                            <span>Travel</span>
                        </Link>
                        <Link href="/marketplace" className="category-card">
                            <div className="icon-box"><i className="fa-solid fa-gamepad"></i></div>
                            <span>Games</span>
                        </Link>
                        <Link href="/marketplace" className="category-card">
                            <div className="icon-box"><i className="fa-solid fa-house"></i></div>
                            <span>Groceries</span>
                        </Link>
                        <Link href="/marketplace" className="category-card">
                            <div className="icon-box"><i className="fa-solid fa-car"></i></div>
                            <span>Automotive</span>
                        </Link>
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
                        <div className="footer-btn">Don't!</div>
                    </div>
                </div>
            </footer>
        </>
    );
}

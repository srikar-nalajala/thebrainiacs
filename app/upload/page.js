'use client';

import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Header from '../components/Header';
import Link from 'next/link';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function UploadPage() {
    const router = useRouter();
    const { user } = useAuth();

    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [verificationResult, setVerificationResult] = useState(null);

    const [formData, setFormData] = useState({
        brand_name: '',
        category: '',
        code: '',
        description: '',
        expiry_date: new Date().toISOString().split('T')[0],
    });
    const [file, setFile] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Reset verification if code changes
        if (e.target.name === 'code') setVerificationResult(null);
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            setVerificationResult(null); // Reset when new file is chosen
        }
    };

    const verifyCoupon = async () => {
        if (!file || !formData.code) return;
        setVerifying(true);
        setVerificationResult(null);

        const expectedCode = formData.code;
        const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            setVerificationResult({
                success: false,
                message: 'Server Configuration Error: API Key missing in environment settings.'
            });
            setVerifying(false);
            return;
        }

        try {
            // Convert file to base64 for Gemini
            const fileToBase64 = (file) => new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.onerror = error => reject(error);
            });

            const base64Image = await fileToBase64(file);
            const genAI = new GoogleGenerativeAI(apiKey);

            const prompt = `
            Analyze this image:
            1. Extract all text from this coupon screenshot.
            2. I am looking for the specific code: "${expectedCode}".
            3. IMPORTANT: Many apps (like Ajio, Swiggy, etc.) hide the full code and show a truncated version ending in "..." (e.g., "INSEG3QNGKQD..."). 
            If you find a partial code in the image that exactly matches the BEGINNING of "${expectedCode}", you MUST consider it found and set "found": true.
            4. CRITICAL: If the expected code is exactly "NOCODE", look for the literal visible text "NOCODE" in the image. If "NOCODE" is printed on the screen, then set "found": true.
            5. Respond ONLY with a valid JSON object in this format (no markdown tags):
            {
                "found": boolean,
                "extractedText": "string",
                "confidence": "high" | "medium" | "low"
            }
            `;

            const imagePart = {
                inlineData: {
                    data: base64Image,
                    mimeType: file.type || 'image/jpeg',
                },
            };

            const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
            const result = await model.generateContent([prompt, imagePart]);
            const text = result.response.text();

            const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
            const analysis = JSON.parse(cleanedText);

            if (analysis.found) {
                setVerificationResult({
                    success: true,
                    message: 'Coupon Verified Successfully!'
                });
            } else {
                setVerificationResult({
                    success: false,
                    message: 'Coupon code not found in image.'
                });
            }
        } catch (error) {
            console.error('Verification failed', error);
            setVerificationResult({
                success: false,
                message: 'Verification failed: ' + error.message
            });
        } finally {
            setVerifying(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert("You must be logged in to upload a coupon.");
            router.push('/login');
            return;
        }

        if (!verificationResult || !verificationResult.success) {
            alert("Please verify the coupon with AI before uploading.");
            return;
        }

        setLoading(true);

        try {
            // 1. Upload Image (Optional - skipping for now if no bucket configured, but logic is here)
            let imageUrl = null;
            if (file) {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { data: uploadData, error: uploadError } = await supabase.storage
                    .from('coupons')
                    .upload(fileName, file);

                if (!uploadError && uploadData) {
                    imageUrl = uploadData.path;
                } else {
                    console.warn('Image upload failed or bucket missing, proceeding without image:', uploadError);
                }
            }

            // 2. Insert Data into Supabase
            const { error: insertError } = await supabase
                .from('coupons')
                .insert([
                    {
                        brand_name: formData.brand_name,
                        category: formData.category,
                        code: formData.code,
                        description: formData.description,
                        expiry_date: formData.expiry_date,
                        image_url: imageUrl,
                        seller_id: user.id, // Link to seller
                        status: 'available'
                    },
                ]);

            if (insertError) throw insertError;

            alert('Coupon uploaded successfully!');
            router.push('/marketplace'); // Redirect to marketplace
        } catch (error) {
            console.error('Error uploading coupon:', error);
            alert('Failed to upload coupon: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Header />

            <section className="upload-section">
                <div className="container">
                    <div className="form-container">
                        <h2>Upload Coupon</h2>
                        <form onSubmit={handleSubmit}>
                            {/* ... previous fields ... */}
                            <div className="form-group">
                                <label>Brand Name *</label>
                                <select
                                    name="brand_name"
                                    className="form-control red-outline"
                                    value={formData.brand_name}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Brand</option>
                                    <option value="Amazon">Amazon</option>
                                    <option value="Flipkart">Flipkart</option>
                                    <option value="Zomato">Zomato</option>
                                    <option value="Swiggy">Swiggy</option>
                                    <option value="Swiggy Instamart">Swiggy Instamart</option>
                                    <option value="Myntra">Myntra</option>
                                    <option value="Ajio">Ajio</option>
                                    <option value="Giva">Giva</option>
                                    <option value="Lenskart">Lenskart</option>
                                    <option value="Uber">Uber</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Category *</label>
                                <select
                                    name="category"
                                    className="form-control red-outline"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">Select Category</option>
                                    <option value="Food">Food</option>
                                    <option value="Fashion">Fashion</option>
                                    <option value="Travel">Travel</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Grocery">Grocery</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Coupon Code *</label>
                                <input
                                    type="text"
                                    name="code"
                                    className="form-control"
                                    placeholder="Enter coupon code"
                                    value={formData.code}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Description *</label>
                                <textarea
                                    name="description"
                                    className="form-control"
                                    rows="3"
                                    placeholder="e.g., 15% off on ₹3000 cart value"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                ></textarea>
                            </div>

                            <div className="form-group">
                                <label>Expiry Date *</label>
                                <input
                                    type="date"
                                    name="expiry_date"
                                    className="form-control red-outline text-center"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label>Coupon Screenshot (Required for Verification) *</label>
                                <div className={`file-upload-box red-outline ${verificationResult?.success ? 'bg-green-50 border-green-500' : ''}`}>
                                    <input type="file" id="file-upload" hidden onChange={handleFileChange} required />
                                    <label htmlFor="file-upload" className="cursor-pointer block text-center">
                                        <i className={`fa-solid ${verificationResult?.success ? 'fa-check-circle text-green-600' : 'fa-camera'}`}></i>
                                        {file ? file.name : " Upload Image"}
                                    </label>
                                </div>

                                {/* Verification Status/Action */}
                                {file && formData.code && !verificationResult?.success && (
                                    <div className="mt-2 text-center">
                                        <button
                                            type="button"
                                            onClick={verifyCoupon}
                                            disabled={verifying}
                                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
                                        >
                                            {verifying ? <><i className="fa-solid fa-spinner fa-spin"></i> Verifying...</> : 'Verify with AI'}
                                        </button>
                                    </div>
                                )}

                                {verificationResult && (
                                    <div className={`mt-2 p-2 rounded text-sm text-center ${verificationResult.success ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                                        {verificationResult.message}
                                        {!verificationResult.success && <p className="text-xs mt-1">Please ensure the code in the image matches the code entered.</p>}
                                    </div>
                                )}
                            </div>

                            <div className="form-submit">
                                <button
                                    type="submit"
                                    className={`btn btn-primary full-width ${!verificationResult?.success ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={loading || !verificationResult?.success}
                                >
                                    {loading ? 'Uploading...' : 'Upload Verified Coupon'}
                                </button>
                                {!verificationResult?.success && <p className="text-xs text-center text-gray-500 mt-2">AI Verification is required before upload.</p>}
                            </div>
                        </form>
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


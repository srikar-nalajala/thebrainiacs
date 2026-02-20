'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check local storage for session on load (simulation for prototype)
        const storedUserId = localStorage.getItem('user_id');
        if (storedUserId) {
            fetchUser(storedUserId);
        } else {
            setLoading(false);
        }
    }, []);

    const fetchUser = async (userId) => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single();

            if (error) throw error;
            if (data) {
                setUser(data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            localStorage.removeItem('user_id');
        } finally {
            setLoading(false);
        }
    };

    const loginWithPhone = async (phoneNumber) => {
        setLoading(true);
        try {
            // Check if user exists
            let { data: existingUser, error } = await supabase
                .from('users')
                .select('*')
                .eq('phone_number', phoneNumber)
                .single();

            if (!existingUser) {
                // Determine if we need to Register (User doesn't exist)
                // For this prototype, we will auto-register if not found, 
                // OR we could throw an error to trigger a registration flow.
                // Let's RETURN null to let the UI handle "Registration Required"
                setLoading(false);
                return { success: false, status: 'USER_NOT_FOUND' };
            }

            // User exists, simulate OTP success
            // In a real app, verify OTP here.

            setUser(existingUser);
            localStorage.setItem('user_id', existingUser.id);
            return { success: true, user: existingUser };

        } catch (error) {
            console.error("Login Error:", error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const registerUser = async (profileData) => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([profileData])
                .select()
                .single();

            if (error) throw error;

            setUser(data);
            localStorage.setItem('user_id', data.id);
            return { success: true, user: data };
        } catch (error) {
            console.error("Registration Error:", error);
            return { success: false, error };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user_id');
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithPhone, registerUser, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);

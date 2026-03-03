import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(false);

    // Restore demo session from localStorage on mount
    useEffect(() => {
        const savedUser = localStorage.getItem('demo_user');
        if (savedUser) {
            const parsed = JSON.parse(savedUser);
            setUser(parsed);
            setSession({ access_token: 'demo-token', user: parsed });
        }
    }, []);

    // Demo mode: skip Supabase, just move to OTP step
    const signInWithOtp = async (email) => {
        // In demo mode, we don't actually send an email
        // Just pretend it was sent successfully
        return { success: true };
    };

    // Demo mode: accept any 6-digit code
    const verifyOtp = async (email, token) => {
        if (token.length < 6) {
            throw new Error('Please enter a 6-digit code');
        }

        // Create a mock user session
        const mockUser = {
            id: 'demo-' + Date.now(),
            email: email,
            role: 'authenticated',
        };

        const mockSession = {
            access_token: 'demo-token',
            user: mockUser,
        };

        // Save to localStorage so it persists on refresh
        localStorage.setItem('demo_user', JSON.stringify(mockUser));

        setUser(mockUser);
        setSession(mockSession);
        return { user: mockUser, session: mockSession };
    };

    // Sign out
    const signOut = async () => {
        localStorage.removeItem('demo_user');
        setUser(null);
        setSession(null);
    };

    const value = {
        user,
        session,
        loading,
        signInWithOtp,
        verifyOtp,
        signOut,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

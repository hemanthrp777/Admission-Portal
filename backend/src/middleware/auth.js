// Middleware to verify auth token
// In demo mode, accepts 'demo-token' for testing
// In production, replace with Supabase JWT verification

const authMiddleware = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please log in.',
        });
    }

    const token = authHeader.split(' ')[1];

    // Demo mode: accept demo tokens
    if (token === 'demo-token') {
        req.user = {
            id: 'demo-user',
            email: 'demo@admissionportal.com',
            role: 'authenticated',
        };
        return next();
    }

    // Production: verify with Supabase (kept for future use)
    try {
        const { default: supabase } = await import('../db/supabase.js');
        const { data: { user }, error } = await supabase.auth.getUser(token);

        if (error || !user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token. Please log in again.',
            });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({
            success: false,
            message: 'Authentication failed.',
        });
    }
};

export default authMiddleware;

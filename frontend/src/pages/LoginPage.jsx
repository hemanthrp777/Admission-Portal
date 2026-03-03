import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const OTP_LENGTH = 6;

const boxStyle = {
    width: '40px',
    height: '48px',
    border: '2px solid #d1d5db',
    borderRadius: '10px',
    fontSize: '1.5rem',
    fontWeight: '700',
    textAlign: 'center',
    color: '#1f2937',
    background: '#fff',
    outline: 'none',
};

const boxFocusColor = '#4f46e5';

const OtpBoxes = ({ value, onChange }) => {
    const inputsRef = useRef([]);
    const digits = Array.from({ length: OTP_LENGTH }, (_, i) => value[i] || '');

    const handleChange = (idx, val) => {
        const char = val.replace(/\D/g, '').slice(-1);
        const arr = [...digits];
        arr[idx] = char;
        onChange(arr.join(''));
        if (char && idx < OTP_LENGTH - 1) {
            inputsRef.current[idx + 1]?.focus();
        }
    };

    const handleKeyDown = (idx, e) => {
        if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
            inputsRef.current[idx - 1]?.focus();
        }
    };

    const handlePaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, OTP_LENGTH);
        onChange(pasted);
        const focusIdx = Math.min(pasted.length, OTP_LENGTH - 1);
        inputsRef.current[focusIdx]?.focus();
    };

    const handleFocus = (e) => {
        e.target.style.borderColor = boxFocusColor;
        e.target.style.boxShadow = '0 0 0 3px rgba(79,70,229,.15)';
    };

    const handleBlur = (e) => {
        e.target.style.borderColor = e.target.value ? boxFocusColor : '#d1d5db';
        e.target.style.boxShadow = 'none';
    };

    return (
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '8px' }}>
            {digits.map((d, i) => (
                <input
                    key={i}
                    ref={(el) => (inputsRef.current[i] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={d}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    onPaste={i === 0 ? handlePaste : undefined}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={{ ...boxStyle, borderColor: d ? boxFocusColor : '#d1d5db' }}
                    autoFocus={i === 0}
                />
            ))}
        </div>
    );
};

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState('email'); // 'email' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { signInWithOtp, verifyOtp } = useAuth();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        if (!email.trim()) return setError('Please enter your email');

        setLoading(true);
        setError('');
        try {
            await signInWithOtp(email.trim());
            setStep('otp');
            setMessage(`Demo mode — enter any 6-digit code to continue`);
        } catch (err) {
            setError(err.message || 'Failed to send OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length < OTP_LENGTH) return setError('Please enter a 6-digit code');

        setLoading(true);
        setError('');
        try {
            await verifyOtp(email.trim(), otp.trim());
            navigate('/', { replace: true });
        } catch (err) {
            setError(err.message || 'Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setLoading(true);
        setError('');
        try {
            await signInWithOtp(email.trim());
            setMessage('Demo mode — enter any 6-digit code');
            setOtp('');
        } catch (err) {
            setError(err.message || 'Failed to resend OTP.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-icon">🎓</div>
                <h1 className="login-title">Admission Portal</h1>
                <p className="login-subtitle">
                    {step === 'email'
                        ? 'Enter your email to get started'
                        : 'Enter any 6-digit code to proceed (demo mode)'}
                </p>

                {error && <div className="login-error" role="alert">⚠ {error}</div>}
                {message && !error && <div className="login-success">{message}</div>}

                {step === 'email' ? (
                    <form onSubmit={handleSendOtp} className="login-form">
                        <div className="field-group">
                            <label htmlFor="login-email" className="field-label">Email Address</label>
                            <input
                                id="login-email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="field-input"
                                autoFocus
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                            {loading ? 'Sending...' : 'Send OTP →'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="login-form">
                        <div className="field-group" style={{ alignItems: 'center' }}>
                            <label className="field-label" style={{ textAlign: 'center', width: '100%' }}>Verification Code</label>
                            <OtpBoxes value={otp} onChange={setOtp} />
                        </div>
                        <button type="submit" className="btn btn-primary login-btn" disabled={loading || otp.length < OTP_LENGTH}>
                            {loading ? 'Verifying...' : '✓ Verify & Continue'}
                        </button>
                        <div className="login-footer">
                            <button type="button" className="btn-link" onClick={() => { setStep('email'); setError(''); setMessage(''); setOtp(''); }}>
                                ← Change email
                            </button>
                            <button type="button" className="btn-link" onClick={handleResend} disabled={loading}>
                                Resend code
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default LoginPage;

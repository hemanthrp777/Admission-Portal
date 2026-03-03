import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5Qrcode } from 'html5-qrcode';

const ScannerPage = () => {
    const navigate = useNavigate();
    const [scanning, setScanning] = useState(false);
    const [error, setError] = useState('');
    const [lastResult, setLastResult] = useState('');
    const scannerRef = useRef(null);
    const scannerInstanceRef = useRef(null);

    const startScanner = async () => {
        setError('');
        setLastResult('');

        try {
            const scanner = new Html5Qrcode('qr-reader');
            scannerInstanceRef.current = scanner;

            await scanner.start(
                { facingMode: 'environment' }, // Use back camera
                {
                    fps: 10,
                    qrbox: { width: 250, height: 250 },
                    aspectRatio: 1.0,
                },
                (decodedText) => {
                    // QR code scanned successfully
                    handleScanResult(decodedText);
                },
                () => {
                    // QR code not found in frame — ignore
                }
            );

            setScanning(true);
        } catch (err) {
            console.error('Scanner error:', err);
            if (err.toString().includes('NotAllowedError')) {
                setError('Camera permission denied. Please allow camera access and try again.');
            } else if (err.toString().includes('NotFoundError')) {
                setError('No camera found. Please use a device with a camera.');
            } else {
                setError(`Could not start camera: ${err.message || err}`);
            }
        }
    };

    const stopScanner = async () => {
        try {
            if (scannerInstanceRef.current?.isScanning) {
                await scannerInstanceRef.current.stop();
            }
            scannerInstanceRef.current = null;
            setScanning(false);
        } catch (err) {
            console.error('Stop scanner error:', err);
        }
    };

    const handleScanResult = async (decodedText) => {
        // Stop scanner immediately to prevent multiple reads
        await stopScanner();
        setLastResult(decodedText);

        // Check if the scanned URL is a valid scan URL from this app
        try {
            const url = new URL(decodedText);
            const scanMatch = url.pathname.match(/^\/scan\/(.+)$/);

            if (scanMatch) {
                // Navigate to the scan/attendance page
                navigate(`/scan/${scanMatch[1]}`);
            } else {
                setError('This QR code is not a valid student QR. Please scan a student admission QR code.');
            }
        } catch {
            // Not a URL — try to extract an ID directly
            if (decodedText.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
                navigate(`/scan/${decodedText}`);
            } else {
                setError('Invalid QR code. Please scan a student admission QR code.');
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (scannerInstanceRef.current?.isScanning) {
                scannerInstanceRef.current.stop().catch(() => { });
            }
        };
    }, []);

    return (
        <div className="scanner-container">
            <div className="scanner-card">
                <div className="scanner-header">
                    <h2 className="scanner-title">📷 QR Scanner</h2>
                    <p className="scanner-subtitle">Scan a student's QR code to mark attendance</p>
                </div>

                {/* Camera Viewport */}
                <div className="scanner-viewport-wrapper">
                    <div id="qr-reader" className="scanner-viewport" ref={scannerRef} />

                    {!scanning && !lastResult && (
                        <div className="scanner-placeholder">
                            <div className="scanner-placeholder-icon">📸</div>
                            <p>Tap below to start camera</p>
                        </div>
                    )}
                </div>

                {/* Controls */}
                <div className="scanner-controls">
                    {!scanning ? (
                        <button className="btn btn-primary scanner-btn" onClick={startScanner}>
                            {lastResult ? '🔄 Scan Another' : '📷 Start Camera'}
                        </button>
                    ) : (
                        <button className="btn btn-secondary scanner-btn" onClick={stopScanner}>
                            ⏹ Stop Camera
                        </button>
                    )}
                </div>

                {/* Scan Result */}
                {lastResult && !error && (
                    <div className="scanner-result success">
                        <span className="scanner-result-icon">✅</span>
                        <span>QR detected! Redirecting...</span>
                    </div>
                )}

                {/* Error */}
                {error && (
                    <div className="scanner-result error">
                        <span className="scanner-result-icon">⚠️</span>
                        <span>{error}</span>
                    </div>
                )}

                {/* Instructions */}
                <div className="scanner-instructions">
                    <h4>How it works</h4>
                    <ol>
                        <li>Tap <strong>"Start Camera"</strong> and allow camera access</li>
                        <li>Point your camera at the student's QR code</li>
                        <li>The system will auto-detect and show student details</li>
                        <li>Tap <strong>"Check IN"</strong> or <strong>"Check OUT"</strong> to mark attendance</li>
                    </ol>
                </div>
            </div>
        </div>
    );
};

export default ScannerPage;

import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getApplicationById, toggleAttendance, getAttendanceLogs } from '../services/api';

const ScanPage = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [status, setStatus] = useState(null); // 'IN' | 'OUT' | null
    const [lastScan, setLastScan] = useState(null);
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [scanning, setScanning] = useState(false);
    const [scanResult, setScanResult] = useState(null); // { type, time }
    const [error, setError] = useState('');

    const fetchData = useCallback(async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch student details
            const appRes = await getApplicationById(id);
            setStudent(appRes.data);

            // Fetch attendance logs
            const logsRes = await getAttendanceLogs(id);
            setLogs(logsRes.data || []);

            // Determine current status from latest log
            if (logsRes.data && logsRes.data.length > 0) {
                setStatus(logsRes.data[0].type);
                setLastScan(logsRes.data[0].scanned_at);
            }
        } catch (err) {
            setError(err.message || 'Failed to load student data.');
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { fetchData(); }, [fetchData]);

    const handleToggle = async () => {
        setScanning(true);
        setScanResult(null);
        try {
            const res = await toggleAttendance(id);
            const { type, scanned_at } = res.data;
            setStatus(type);
            setLastScan(scanned_at);
            setScanResult({ type, time: scanned_at });

            // Refresh logs
            const logsRes = await getAttendanceLogs(id);
            setLogs(logsRes.data || []);
        } catch (err) {
            setError(err.message || 'Scan failed. Try again.');
        } finally {
            setScanning(false);
        }
    };

    const formatTime = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short',
        });
    };

    const formatTimeOnly = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleTimeString('en-IN', {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const formatDate = (iso) => {
        if (!iso) return '';
        return new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="scan-container">
                <div className="scan-loading">Loading student data...</div>
            </div>
        );
    }

    if (error && !student) {
        return (
            <div className="scan-container">
                <div className="scan-error-card">
                    <div className="scan-error-icon">❌</div>
                    <h2>Student Not Found</h2>
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="scan-container">
            <div className="scan-card">
                {/* Student Info */}
                <div className="scan-student-info">
                    <div className="scan-avatar">
                        {student.first_name?.[0]}{student.last_name?.[0]}
                    </div>
                    <div className="scan-student-details">
                        <h2 className="scan-student-name">
                            {student.first_name} {student.last_name}
                        </h2>
                        <p className="scan-student-meta">{student.program} • {student.intake_year}</p>
                        <p className="scan-student-email">{student.email}</p>
                    </div>
                </div>

                {/* Current Status Badge */}
                <div className={`scan-status-badge ${status === 'IN' ? 'status-in' : status === 'OUT' ? 'status-out' : 'status-none'}`}>
                    <span className="scan-status-icon">
                        {status === 'IN' ? '🟢' : status === 'OUT' ? '🔴' : '⚪'}
                    </span>
                    <span className="scan-status-text">
                        {status === 'IN' ? 'Currently IN' : status === 'OUT' ? 'Currently OUT' : 'No scans yet'}
                    </span>
                    {lastScan && (
                        <span className="scan-status-time">Last: {formatTime(lastScan)}</span>
                    )}
                </div>

                {/* Scan Result Animation */}
                {scanResult && (
                    <div className={`scan-result ${scanResult.type === 'IN' ? 'result-in' : 'result-out'}`}>
                        <div className="scan-result-icon">
                            {scanResult.type === 'IN' ? '✅' : '👋'}
                        </div>
                        <div className="scan-result-text">
                            Checked {scanResult.type} at {formatTimeOnly(scanResult.time)}
                        </div>
                    </div>
                )}

                {/* Toggle Button */}
                <button
                    className={`scan-toggle-btn ${status === 'IN' ? 'toggle-out' : 'toggle-in'}`}
                    onClick={handleToggle}
                    disabled={scanning}
                >
                    {scanning ? (
                        'Scanning...'
                    ) : status === 'IN' ? (
                        '👋 Check OUT'
                    ) : (
                        '✅ Check IN'
                    )}
                </button>

                {/* Attendance History */}
                {logs.length > 0 && (
                    <div className="scan-history">
                        <h3 className="scan-history-title">Recent Activity</h3>
                        <div className="scan-history-list">
                            {logs.slice(0, 10).map((log) => (
                                <div key={log.id} className={`scan-history-item ${log.type === 'IN' ? 'history-in' : 'history-out'}`}>
                                    <span className="history-type-badge">
                                        {log.type === 'IN' ? '🟢 IN' : '🔴 OUT'}
                                    </span>
                                    <span className="history-time">
                                        {formatDate(log.scanned_at)} at {formatTimeOnly(log.scanned_at)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {error && <div className="api-error" style={{ marginTop: '1rem' }}>⚠ {error}</div>}
            </div>
        </div>
    );
};

export default ScanPage;

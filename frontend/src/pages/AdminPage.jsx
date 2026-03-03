import { useState, useEffect, useCallback } from 'react';
import FilterPanel from '../components/FilterPanel';
import QRCodeCard from '../components/ui/QRCodeCard';
import { getApplications, updateStatus } from '../services/api';

const STATUS_COLORS = {
    'Pending': '#f59e0b',
    'Under Review': '#3b82f6',
    'Accepted': '#10b981',
    'Rejected': '#ef4444',
};

/* ─── Password Gate ─── */
const AdminLoginGate = ({ onUnlock }) => {
    const [password, setPassword] = useState('');
    const [shake, setShake] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (password.trim().length === 0) {
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return;
        }
        // Any non-empty password grants access
        sessionStorage.setItem('admin_auth', 'true');
        onUnlock();
    };

    return (
        <div className="admin-login-overlay">
            <form className={`admin-login-card ${shake ? 'shake' : ''}`} onSubmit={handleSubmit}>
                <div className="admin-login-icon">🔒</div>
                <h2 className="admin-login-title">Admin Access</h2>
                <p className="admin-login-subtitle">Enter the admin password to continue</p>
                <input
                    id="admin-password"
                    type="password"
                    className="admin-login-input"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoFocus
                />
                <button type="submit" className="btn btn-primary admin-login-btn">
                    Unlock Dashboard
                </button>
            </form>
        </div>
    );
};

/* ─── Admin Dashboard ─── */
const AdminPage = () => {
    const [isAuthed, setIsAuthed] = useState(() => sessionStorage.getItem('admin_auth') === 'true');
    const [applications, setApplications] = useState([]);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({});
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [qrModal, setQrModal] = useState(null); // { id, name }

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const res = await getApplications({ ...filters, page, limit: 10 });
            setApplications(res.data || []);
            setPagination(res.pagination || {});
        } catch (err) {
            setError(err.message || 'Failed to load applications.');
        } finally {
            setLoading(false);
        }
    }, [filters, page]);

    useEffect(() => { if (isAuthed) fetchData(); }, [fetchData, isAuthed]);

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        setPage(1);
    };

    const handleStatusChange = async (id, status) => {
        try {
            await updateStatus(id, status);
            fetchData();
        } catch (err) {
            alert(`Failed to update status: ${err.message}`);
        }
    };

    const handleLogout = () => {
        sessionStorage.removeItem('admin_auth');
        setIsAuthed(false);
    };

    /* Show password gate if not authenticated */
    if (!isAuthed) {
        return <AdminLoginGate onUnlock={() => setIsAuthed(true)} />;
    }

    return (
        <div className="admin-container">
            <div className="admin-header-row">
                <h1 className="admin-title">Admin — Applications Dashboard</h1>
                <button className="btn btn-secondary admin-logout-btn" onClick={handleLogout}>
                    🔓 Lock Dashboard
                </button>
            </div>

            <FilterPanel onFilterChange={handleFilterChange} />

            {error && <div className="api-error">{error}</div>}

            {loading ? (
                <div className="loading-state">Loading applications...</div>
            ) : (
                <>
                    <div className="table-wrapper">
                        <table className="apps-table">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Program</th>
                                    <th>Intake</th>
                                    <th>%</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.length === 0 ? (
                                    <tr><td colSpan={7} className="empty-state">No applications found.</td></tr>
                                ) : applications.map(app => (
                                    <tr key={app.id}>
                                        <td>{app.first_name} {app.last_name}</td>
                                        <td>{app.email}</td>
                                        <td>{app.program}</td>
                                        <td>{app.intake_year}</td>
                                        <td>{app.percentage}%</td>
                                        <td>
                                            <span className="status-badge" style={{ background: STATUS_COLORS[app.status] }}>
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="actions-cell">
                                            <select
                                                value={app.status}
                                                onChange={(e) => handleStatusChange(app.id, e.target.value)}
                                                className="status-select"
                                            >
                                                <option value="Pending">Pending</option>
                                                <option value="Under Review">Under Review</option>
                                                <option value="Accepted">Accepted</option>
                                                <option value="Rejected">Rejected</option>
                                            </select>
                                            <button
                                                className="qr-view-btn"
                                                title="View QR Code"
                                                onClick={() => setQrModal({ id: app.id, name: `${app.first_name} ${app.last_name}` })}
                                            >
                                                📱
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {pagination.total_pages > 1 && (
                        <div className="pagination">
                            <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="btn btn-secondary">
                                ← Prev
                            </button>
                            <span>Page {page} of {pagination.total_pages} ({pagination.total} total)</span>
                            <button disabled={page === pagination.total_pages} onClick={() => setPage(p => p + 1)} className="btn btn-secondary">
                                Next →
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* QR Code Modal */}
            {qrModal && (
                <div className="qr-modal-overlay" onClick={() => setQrModal(null)}>
                    <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
                        <button className="qr-modal-close" onClick={() => setQrModal(null)}>✕</button>
                        <QRCodeCard
                            value={`${import.meta.env.VITE_PUBLIC_URL || window.location.origin}/scan/${qrModal.id}`}
                            title={qrModal.name}
                            subtitle="Scan for attendance check-in / check-out"
                            studentName={qrModal.name}
                            size={200}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminPage;

import { useState } from 'react';

const programOptions = [
    'B.Tech Computer Science', 'B.Tech Electronics', 'B.Sc Data Science',
    'BBA', 'MBA', 'M.Tech',
];
const statusOptions = ['Pending', 'Under Review', 'Accepted', 'Rejected'];
const modeOptions = ['Full-Time', 'Part-Time', 'Online'];
const currentYear = new Date().getFullYear();

const FilterPanel = ({ onFilterChange }) => {
    const [filters, setFilters] = useState({
        status: '', program: '', intake_year: '', study_mode: '', search: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        const updated = { ...filters, [name]: value };
        setFilters(updated);
        onFilterChange(updated); // bubble up immediately
    };

    const handleReset = () => {
        const empty = { status: '', program: '', intake_year: '', study_mode: '', search: '' };
        setFilters(empty);
        onFilterChange(empty);
    };

    return (
        <div className="filter-panel">
            <div className="filter-header">
                <h3>🔍 Filter Applications</h3>
                <button className="btn-reset" onClick={handleReset}>Reset All</button>
            </div>

            <div className="filter-grid">
                <div className="filter-group">
                    <label>Search</label>
                    <input
                        name="search" value={filters.search} onChange={handleChange}
                        placeholder="Name or email..." className="filter-input"
                    />
                </div>

                <div className="filter-group">
                    <label>Status</label>
                    <select name="status" value={filters.status} onChange={handleChange} className="filter-input">
                        <option value="">All Statuses</option>
                        {statusOptions.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Program</label>
                    <select name="program" value={filters.program} onChange={handleChange} className="filter-input">
                        <option value="">All Programs</option>
                        {programOptions.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Intake Year</label>
                    <select name="intake_year" value={filters.intake_year} onChange={handleChange} className="filter-input">
                        <option value="">All Years</option>
                        {[0, 1, 2, 3].map(i => (
                            <option key={i} value={currentYear + i}>{currentYear + i}</option>
                        ))}
                    </select>
                </div>

                <div className="filter-group">
                    <label>Study Mode</label>
                    <select name="study_mode" value={filters.study_mode} onChange={handleChange} className="filter-input">
                        <option value="">All Modes</option>
                        {modeOptions.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterPanel;

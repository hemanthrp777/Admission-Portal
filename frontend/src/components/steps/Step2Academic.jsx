import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

const boardOptions = [
    { value: 'CBSE', label: 'CBSE' },
    { value: 'ICSE', label: 'ICSE' },
    { value: 'State Board', label: 'State Board' },
    { value: 'IB', label: 'IB (International Baccalaureate)' },
    { value: 'Other', label: 'Other' },
];

const streamOptions = [
    { value: 'Science (PCM)', label: 'Science (PCM)' },
    { value: 'Science (PCB)', label: 'Science (PCB)' },
    { value: 'Commerce', label: 'Commerce' },
    { value: 'Arts / Humanities', label: 'Arts / Humanities' },
    { value: 'Vocational', label: 'Vocational' },
    { value: 'Other', label: 'Other' },
];

const currentYear = new Date().getFullYear();

const Step2Academic = ({ data, errors, onChange }) => {
    const tenthPct = parseFloat(data.tenth_percentage) || 0;
    const twelfthPct = parseFloat(data.twelfth_percentage) || 0;
    const meritScore = (tenthPct * 0.4 + twelfthPct * 0.6).toFixed(2);
    const showMerit = tenthPct > 0 && twelfthPct > 0;

    return (
        <div className="step-content">
            <h2 className="step-title">Academic History</h2>
            <p className="step-subtitle">Enter your 10th and 12th / PUC qualification details.</p>

            {/* 10th / SSLC */}
            <div className="academic-section">
                <h3 className="academic-section-title">📘 10th / SSLC</h3>
                <div className="form-grid">
                    <InputField
                        label="School Name" name="tenth_school"
                        value={data.tenth_school} onChange={onChange}
                        error={errors.tenth_school} required placeholder="e.g. Delhi Public School"
                    />
                    <SelectField
                        label="Board" name="tenth_board" value={data.tenth_board}
                        onChange={onChange} error={errors.tenth_board} required options={boardOptions}
                    />
                    <InputField
                        label="Year of Passing" name="tenth_year" type="number"
                        value={data.tenth_year} onChange={onChange} error={errors.tenth_year}
                        required placeholder={`${currentYear}`} min="1990" max={currentYear}
                    />
                    <InputField
                        label="Percentage / CGPA" name="tenth_percentage" type="number"
                        value={data.tenth_percentage} onChange={onChange} error={errors.tenth_percentage}
                        required placeholder="85.5" min="0" max="100" step="0.01"
                    />
                </div>
                <InputField
                    label="Subjects (optional)" name="tenth_subjects"
                    value={data.tenth_subjects} onChange={onChange}
                    placeholder="e.g. Maths, Science, English, Social"
                />
            </div>

            {/* 12th / PUC */}
            <div className="academic-section">
                <h3 className="academic-section-title">📗 12th / PUC</h3>
                <div className="form-grid">
                    <InputField
                        label="School / College Name" name="twelfth_school"
                        value={data.twelfth_school} onChange={onChange}
                        error={errors.twelfth_school} required placeholder="e.g. St. Joseph's PU College"
                    />
                    <SelectField
                        label="Board" name="twelfth_board" value={data.twelfth_board}
                        onChange={onChange} error={errors.twelfth_board} required options={boardOptions}
                    />
                    <InputField
                        label="Year of Passing" name="twelfth_year" type="number"
                        value={data.twelfth_year} onChange={onChange} error={errors.twelfth_year}
                        required placeholder={`${currentYear}`} min="1990" max={currentYear}
                    />
                    <InputField
                        label="Percentage / CGPA" name="twelfth_percentage" type="number"
                        value={data.twelfth_percentage} onChange={onChange} error={errors.twelfth_percentage}
                        required placeholder="82.0" min="0" max="100" step="0.01"
                    />
                    <SelectField
                        label="Stream" name="twelfth_stream" value={data.twelfth_stream}
                        onChange={onChange} error={errors.twelfth_stream} required options={streamOptions}
                        placeholder="Select stream"
                    />
                </div>
                <InputField
                    label="Subjects (optional)" name="twelfth_subjects"
                    value={data.twelfth_subjects} onChange={onChange}
                    placeholder="e.g. Physics, Chemistry, Mathematics"
                />
            </div>

            {/* Merit Score */}
            {showMerit && (
                <div className="merit-badge">
                    <span className="merit-label">📊 Calculated Merit Score</span>
                    <span className="merit-value">{meritScore}%</span>
                    <span className="merit-formula">( 40% × 10th + 60% × 12th )</span>
                </div>
            )}
        </div>
    );
};

export default Step2Academic;

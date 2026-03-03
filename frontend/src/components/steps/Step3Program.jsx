import SelectField from '../ui/SelectField';

// Programs mapped by 12th stream
const programsByStream = {
    'Science (PCM)': [
        { value: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
        { value: 'B.Tech Electronics', label: 'B.Tech Electronics' },
        { value: 'B.Tech Mechanical', label: 'B.Tech Mechanical' },
        { value: 'B.Tech Civil', label: 'B.Tech Civil' },
        { value: 'B.Sc Mathematics', label: 'B.Sc Mathematics' },
        { value: 'B.Sc Physics', label: 'B.Sc Physics' },
        { value: 'B.Sc Data Science', label: 'B.Sc Data Science' },
    ],
    'Science (PCB)': [
        { value: 'MBBS', label: 'MBBS' },
        { value: 'BDS', label: 'BDS' },
        { value: 'B.Sc Nursing', label: 'B.Sc Nursing' },
        { value: 'B.Sc Biotechnology', label: 'B.Sc Biotechnology' },
        { value: 'B.Pharm', label: 'B.Pharm' },
    ],
    'Commerce': [
        { value: 'B.Com', label: 'B.Com' },
        { value: 'BBA', label: 'BBA' },
        { value: 'B.Com Accounting & Finance', label: 'B.Com Accounting & Finance' },
        { value: 'BCA', label: 'BCA' },
    ],
    'Arts / Humanities': [
        { value: 'BA English', label: 'BA English' },
        { value: 'BA Psychology', label: 'BA Psychology' },
        { value: 'BA Political Science', label: 'BA Political Science' },
        { value: 'BA Journalism', label: 'BA Journalism' },
        { value: 'BFA', label: 'BFA (Fine Arts)' },
    ],
    'Vocational': [
        { value: 'B.Voc IT', label: 'B.Voc IT' },
        { value: 'B.Voc Healthcare', label: 'B.Voc Healthcare' },
        { value: 'Diploma Engineering', label: 'Diploma Engineering' },
    ],
    'Other': [
        { value: 'B.Tech Computer Science', label: 'B.Tech Computer Science' },
        { value: 'BBA', label: 'BBA' },
        { value: 'BCA', label: 'BCA' },
        { value: 'B.Com', label: 'B.Com' },
        { value: 'BA English', label: 'BA English' },
    ],
};

const modeOptions = [
    { value: 'Full-Time', label: 'Full-Time' },
    { value: 'Part-Time', label: 'Part-Time' },
    { value: 'Online', label: 'Online' },
];

const currentYear = new Date().getFullYear();
const yearOptions = [0, 1, 2, 3].map(i => ({
    value: `${currentYear + i}`, label: `${currentYear + i}`,
}));

const Step3Program = ({ data, errors, onChange }) => {
    const stream = data.twelfth_stream || '';
    const availablePrograms = programsByStream[stream] || [];
    const meritScore = data.tenth_percentage && data.twelfth_percentage
        ? (parseFloat(data.tenth_percentage) * 0.4 + parseFloat(data.twelfth_percentage) * 0.6).toFixed(2)
        : null;

    return (
        <div className="step-content">
            <h2 className="step-title">Programme Preferences</h2>
            <p className="step-subtitle">Choose the program you're applying for based on your academic stream.</p>

            {stream && (
                <div className="stream-info">
                    <span>🎯 Your stream: <strong>{stream}</strong></span>
                    {meritScore && <span> · Merit: <strong>{meritScore}%</strong></span>}
                </div>
            )}

            <div className="form-grid">
                <SelectField
                    label="Program" name="program" value={data.program}
                    onChange={onChange} error={errors.program} required
                    options={availablePrograms}
                    placeholder={stream ? 'Select a program' : 'Select stream in Step 2 first'}
                    disabled={!stream}
                />
                <SelectField
                    label="Intake Year" name="intake_year" value={data.intake_year}
                    onChange={onChange} error={errors.intake_year} required options={yearOptions}
                    placeholder="Select year"
                />
                <SelectField
                    label="Study Mode" name="study_mode" value={data.study_mode}
                    onChange={onChange} error={errors.study_mode} required options={modeOptions}
                />
            </div>

            {!stream && (
                <div className="info-notice">
                    ℹ️ Please select your 12th stream in the Academic History step to see available programs.
                </div>
            )}
        </div>
    );
};

export default Step3Program;

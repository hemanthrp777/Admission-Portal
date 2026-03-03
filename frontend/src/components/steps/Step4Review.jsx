const ReviewRow = ({ label, value }) => (
    <div className="review-row">
        <span className="review-label">{label}</span>
        <span className="review-value">{value || '—'}</span>
    </div>
);

const Step6Review = ({ data }) => {
    const meritScore = data.tenth_percentage && data.twelfth_percentage
        ? (parseFloat(data.tenth_percentage) * 0.4 + parseFloat(data.twelfth_percentage) * 0.6).toFixed(2)
        : '—';

    return (
        <div className="step-content">
            <h2 className="step-title">Review Your Application</h2>
            <p className="step-subtitle">Please confirm all details before submitting.</p>

            {/* Personal Info */}
            <div className="review-section">
                <h3 className="review-section-title">👤 Personal Information</h3>
                <ReviewRow label="Full Name" value={`${data.first_name} ${data.last_name}`} />
                <ReviewRow label="Email" value={data.email} />
                <ReviewRow label="Phone" value={data.phone} />
                <ReviewRow label="Date of Birth" value={data.date_of_birth} />
                <ReviewRow label="Gender" value={data.gender} />
                <ReviewRow label="Address" value={data.address} />
            </div>

            {/* 10th */}
            <div className="review-section">
                <h3 className="review-section-title">📘 10th / SSLC</h3>
                <ReviewRow label="School" value={data.tenth_school} />
                <ReviewRow label="Board" value={data.tenth_board} />
                <ReviewRow label="Year" value={data.tenth_year} />
                <ReviewRow label="Percentage" value={data.tenth_percentage ? `${data.tenth_percentage}%` : '—'} />
                <ReviewRow label="Subjects" value={data.tenth_subjects} />
            </div>

            {/* 12th */}
            <div className="review-section">
                <h3 className="review-section-title">📗 12th / PUC</h3>
                <ReviewRow label="School / College" value={data.twelfth_school} />
                <ReviewRow label="Board" value={data.twelfth_board} />
                <ReviewRow label="Year" value={data.twelfth_year} />
                <ReviewRow label="Percentage" value={data.twelfth_percentage ? `${data.twelfth_percentage}%` : '—'} />
                <ReviewRow label="Stream" value={data.twelfth_stream} />
                <ReviewRow label="Subjects" value={data.twelfth_subjects} />
            </div>

            {/* Merit */}
            <div className="review-section">
                <h3 className="review-section-title">📊 Merit Score</h3>
                <ReviewRow label="Merit Score" value={`${meritScore}%`} />
                <ReviewRow label="Formula" value="40% × 10th + 60% × 12th" />
            </div>

            {/* Program */}
            <div className="review-section">
                <h3 className="review-section-title">🎓 Programme Details</h3>
                <ReviewRow label="Program" value={data.program} />
                <ReviewRow label="Intake Year" value={data.intake_year} />
                <ReviewRow label="Study Mode" value={data.study_mode} />
            </div>

            {/* Documents & Payment */}
            <div className="review-section">
                <h3 className="review-section-title">📄 Documents & Payment</h3>
                <ReviewRow label="Declaration" value={data.declaration_agreed ? '✅ Agreed' : '⏳ Not agreed'} />
                <ReviewRow label="Payment Status" value={data.payment_status || 'Pending'} />
                <ReviewRow label="Payment Reference" value={data.payment_reference} />
            </div>

            <p className="review-notice">
                ✅ By submitting, you confirm all information is accurate and complete.
            </p>
        </div>
    );
};

export default Step6Review;

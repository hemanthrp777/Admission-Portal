const StepIndicator = ({ current, total = 6, labels = [] }) => {
    const defaultLabels = ['Personal Info', 'Academics', 'Program', 'Documents', 'Payment', 'Review'];
    const stepLabels = labels.length ? labels : defaultLabels;

    return (
        <div className="step-indicator">
            {Array.from({ length: total }, (_, i) => i + 1).map((id, idx) => (
                <div key={id} className="step-item">
                    <div className={`step-circle ${current > id ? 'step-done' :
                        current === id ? 'step-active' : 'step-idle'
                        }`}>
                        {current > id ? '✓' : id}
                    </div>
                    <span className={`step-label ${current === id ? 'step-label--active' : ''}`}>
                        {stepLabels[idx] || `Step ${id}`}
                    </span>
                    {idx < total - 1 && (
                        <div className={`step-line ${current > id ? 'step-line--done' : ''}`} />
                    )}
                </div>
            ))}
        </div>
    );
};

export default StepIndicator;

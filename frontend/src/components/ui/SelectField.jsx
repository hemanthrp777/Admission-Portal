const SelectField = ({ label, name, value, onChange, error, required, options = [], placeholder }) => {
    return (
        <div className="field-group">
            <label htmlFor={name} className="field-label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            <select
                id={name}
                name={name}
                value={value}
                onChange={onChange}
                className={`field-input field-select ${error ? 'field-input--error' : ''}`}
                aria-invalid={!!error}
            >
                <option value="">{placeholder || `Select ${label}`}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            {error && <span className="field-error" role="alert">⚠ {error}</span>}
        </div>
    );
};

export default SelectField;

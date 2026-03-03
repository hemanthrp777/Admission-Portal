const InputField = ({
    label, name, type = 'text', value, onChange, error, required, placeholder, ...rest
}) => {
    return (
        <div className="field-group">
            <label htmlFor={name} className="field-label">
                {label} {required && <span className="required-star">*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className={`field-input ${error ? 'field-input--error' : ''}`}
                aria-describedby={error ? `${name}-error` : undefined}
                aria-invalid={!!error}
                {...rest}
            />
            {error && (
                <span id={`${name}-error`} className="field-error" role="alert">
                    ⚠ {error}
                </span>
            )}
        </div>
    );
};

export default InputField;

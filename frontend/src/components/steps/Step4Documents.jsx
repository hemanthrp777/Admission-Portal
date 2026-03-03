const Step4Documents = ({ data, onChange }) => {
    return (
        <div className="step-content">
            <h2 className="step-title">Documents & Declarations</h2>
            <p className="step-subtitle">Upload your documents and accept the declaration. <span className="optional-tag">Optional — you can upload later</span></p>

            <div className="docs-section">
                <h3 className="docs-section-title">📄 Document Uploads</h3>
                <div className="docs-grid">
                    <div className="doc-item">
                        <div className="doc-icon">📋</div>
                        <span>10th Marks Card</span>
                        <span className="doc-status">Not uploaded</span>
                    </div>
                    <div className="doc-item">
                        <div className="doc-icon">📋</div>
                        <span>12th / PUC Marks Card</span>
                        <span className="doc-status">Not uploaded</span>
                    </div>
                    <div className="doc-item">
                        <div className="doc-icon">📷</div>
                        <span>Passport Photo</span>
                        <span className="doc-status">Not uploaded</span>
                    </div>
                    <div className="doc-item">
                        <div className="doc-icon">🆔</div>
                        <span>ID Proof (Aadhaar / PAN)</span>
                        <span className="doc-status">Not uploaded</span>
                    </div>
                </div>
                <p className="docs-note">📌 File upload functionality will be available soon. You can continue without uploading.</p>
            </div>

            <div className="declaration-section">
                <h3 className="docs-section-title">✅ Declaration</h3>
                <label className="declaration-checkbox">
                    <input
                        type="checkbox"
                        name="declaration_agreed"
                        checked={data.declaration_agreed || false}
                        onChange={(e) => onChange({ target: { name: 'declaration_agreed', value: e.target.checked } })}
                    />
                    <span>I hereby declare that the information provided is true and correct to the best of my knowledge. I understand that any false information may result in cancellation of my admission.</span>
                </label>
            </div>
        </div>
    );
};

export default Step4Documents;

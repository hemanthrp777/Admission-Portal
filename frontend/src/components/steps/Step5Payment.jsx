const Step5Payment = ({ data, onChange }) => {
    return (
        <div className="step-content">
            <h2 className="step-title">Payment</h2>
            <p className="step-subtitle">Complete your application fee payment. <span className="optional-tag">Optional — can be completed later</span></p>

            <div className="payment-card">
                <div className="payment-header">
                    <span className="payment-icon">💳</span>
                    <div>
                        <h3 className="payment-title">Application Fee</h3>
                        <p className="payment-amount">₹ 500.00</p>
                    </div>
                </div>

                <div className="payment-options">
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="payment_status"
                            value="Pending"
                            checked={!data.payment_status || data.payment_status === 'Pending'}
                            onChange={onChange}
                        />
                        <div className="payment-option-content">
                            <strong>🕐 Pay Later</strong>
                            <span>Complete payment after submission</span>
                        </div>
                    </label>
                    <label className="payment-option">
                        <input
                            type="radio"
                            name="payment_status"
                            value="Paid"
                            checked={data.payment_status === 'Paid'}
                            onChange={onChange}
                        />
                        <div className="payment-option-content">
                            <strong>✅ Already Paid</strong>
                            <span>Enter your payment reference below</span>
                        </div>
                    </label>
                </div>

                {data.payment_status === 'Paid' && (
                    <div className="payment-ref">
                        <label className="field-label">Payment Reference / Transaction ID</label>
                        <input
                            type="text"
                            name="payment_reference"
                            value={data.payment_reference || ''}
                            onChange={onChange}
                            placeholder="e.g. TXN123456789"
                            className="field-input"
                        />
                    </div>
                )}

                <p className="payment-note">🔒 Online payment gateway integration coming soon. For now, you can mark as paid if you've completed payment through other means.</p>
            </div>
        </div>
    );
};

export default Step5Payment;

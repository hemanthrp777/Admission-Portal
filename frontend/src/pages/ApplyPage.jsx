import { useState } from 'react';
import StepIndicator from '../components/ui/StepIndicator';
import Step1Personal from '../components/steps/Step1Personal';
import Step2Academic from '../components/steps/Step2Academic';
import Step3Program from '../components/steps/Step3Program';
import Step4Documents from '../components/steps/Step4Documents';
import Step5Payment from '../components/steps/Step5Payment';
import Step6Review from '../components/steps/Step4Review';
import QRCodeCard from '../components/ui/QRCodeCard';
import { validateStep } from '../utils/validators';
import { submitApplication } from '../services/api';

const TOTAL_STEPS = 6;

const STEP_LABELS = [
    'Personal Info',
    'Academics',
    'Program',
    'Documents',
    'Payment',
    'Review',
];

const INITIAL_FORM_DATA = {
    first_name: '', last_name: '', email: '', phone: '',
    date_of_birth: '', gender: '', address: '',

    tenth_school: '', tenth_board: '', tenth_year: '', tenth_percentage: '', tenth_subjects: '',
    twelfth_school: '', twelfth_board: '', twelfth_year: '', twelfth_percentage: '', twelfth_stream: '', twelfth_subjects: '',

    program: '', intake_year: '', study_mode: 'Full-Time',

    documents_submitted: false, declaration_agreed: false,

    payment_status: 'Pending', payment_reference: '',
};

const ApplyPage = () => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState(INITIAL_FORM_DATA);
    const [errors, setErrors] = useState({});
    const [apiError, setApiError] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submittedData, setSubmittedData] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
    };

    const handleNext = () => {
        const stepErrors = validateStep(step, formData);
        if (Object.keys(stepErrors).length > 0) {
            setErrors(stepErrors);
            return;
        }
        setErrors({});
        if (step === 2) {
            setFormData(prev => ({ ...prev, program: '' }));
        }
        setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    };

    const handleBack = () => setStep((s) => Math.max(s - 1, 1));

    const handleSubmit = async () => {
        setLoading(true);
        setApiError('');
        try {
            const result = await submitApplication(formData);
            setSubmittedData(result.data);
            setSubmitted(true);
        } catch (err) {
            setApiError(err.message || 'Submission failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (submitted && submittedData) {
        const baseUrl = import.meta.env.VITE_PUBLIC_URL || window.location.origin;
        const scanUrl = `${baseUrl}/scan/${submittedData.id}`;
        const studentName = `${formData.first_name} ${formData.last_name}`;

        return (
            <div className="success-container">
                <div className="success-card success-card-with-qr">
                    <div className="success-icon">🎉</div>
                    <h2>Application Submitted!</h2>
                    <p>Your application has been received successfully.</p>
                    <p>We'll notify you at <strong>{formData.email}</strong> once it's reviewed.</p>

                    <div className="success-divider" />

                    <QRCodeCard
                        value={scanUrl}
                        title="Your Student QR Code"
                        subtitle="Use this QR for attendance check-in & check-out"
                        studentName={studentName}
                        size={180}
                    />

                    <button className="btn btn-primary" onClick={() => { setFormData(INITIAL_FORM_DATA); setStep(1); setSubmitted(false); setSubmittedData(null); }}>
                        Submit Another
                    </button>
                </div>
            </div>
        );
    }

    const renderStep = () => {
        switch (step) {
            case 1: return <Step1Personal data={formData} errors={errors} onChange={handleChange} />;
            case 2: return <Step2Academic data={formData} errors={errors} onChange={handleChange} />;
            case 3: return <Step3Program data={formData} errors={errors} onChange={handleChange} />;
            case 4: return <Step4Documents data={formData} onChange={handleChange} />;
            case 5: return <Step5Payment data={formData} onChange={handleChange} />;
            case 6: return <Step6Review data={formData} />;
            default: return null;
        }
    };

    return (
        <div className="apply-container">
            <div className="apply-card">
                <h1 className="portal-title">📝 Application Form</h1>
                <StepIndicator current={step} total={TOTAL_STEPS} labels={STEP_LABELS} />
                {renderStep()}

                {apiError && <div className="api-error">⚠ {apiError}</div>}

                <div className="form-nav">
                    {step > 1 && (
                        <button className="btn btn-secondary" onClick={handleBack}>← Back</button>
                    )}
                    {step < TOTAL_STEPS ? (
                        <button className="btn btn-primary" onClick={handleNext}>Next →</button>
                    ) : (
                        <button className="btn btn-success" onClick={handleSubmit} disabled={loading}>
                            {loading ? 'Submitting...' : '✓ Submit Application'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplyPage;

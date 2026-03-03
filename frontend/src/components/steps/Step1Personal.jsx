import InputField from '../ui/InputField';
import SelectField from '../ui/SelectField';

const genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' },
    { value: 'Prefer not to say', label: 'Prefer not to say' },
];

const Step1Personal = ({ data, errors, onChange }) => (
    <div className="step-content">
        <h2 className="step-title">Personal Information</h2>
        <p className="step-subtitle">Let's start with your basic details.</p>

        <div className="form-grid">
            <InputField
                label="First Name" name="first_name" value={data.first_name}
                onChange={onChange} error={errors.first_name} required placeholder="John"
            />
            <InputField
                label="Last Name" name="last_name" value={data.last_name}
                onChange={onChange} error={errors.last_name} required placeholder="Doe"
            />
            <InputField
                label="Email Address" name="email" type="email" value={data.email}
                onChange={onChange} error={errors.email} required placeholder="john@example.com"
            />
            <InputField
                label="Phone Number" name="phone" type="tel" value={data.phone}
                onChange={onChange} error={errors.phone} required placeholder="+91 98765 43210"
            />
            <InputField
                label="Date of Birth" name="date_of_birth" type="date" value={data.date_of_birth}
                onChange={onChange} error={errors.date_of_birth} required
            />
            <SelectField
                label="Gender" name="gender" value={data.gender}
                onChange={onChange} error={errors.gender} required options={genderOptions}
            />
        </div>

        <InputField
            label="Full Address" name="address" value={data.address}
            onChange={onChange} error={errors.address} required
            placeholder="Street, City, State, PIN"
        />
    </div>
);

export default Step1Personal;

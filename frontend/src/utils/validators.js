export const validators = {
    required: (val) => (val?.toString().trim() ? null : 'This field is required'),

    email: (val) => {
        if (!val) return 'Email is required';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) ? null : 'Enter a valid email address';
    },

    phone: (val) => {
        if (!val) return 'Phone is required';
        return /^\+?[\d\s\-()]{7,20}$/.test(val) ? null : 'Enter a valid phone number';
    },

    dob: (val) => {
        if (!val) return 'Date of birth is required';
        const age = new Date().getFullYear() - new Date(val).getFullYear();
        if (age < 15) return 'Applicant must be at least 15 years old';
        if (age > 60) return 'Please enter a valid date of birth';
        return null;
    },

    percentage: (val) => {
        if (val === '' || val === null || val === undefined) return 'Percentage is required';
        const num = parseFloat(val);
        if (isNaN(num)) return 'Must be a number';
        if (num < 0 || num > 100) return 'Percentage must be between 0 and 100';
        return null;
    },

    year: (min, max) => (val) => {
        if (!val) return 'Year is required';
        const y = parseInt(val);
        if (y < min || y > max) return `Year must be between ${min} and ${max}`;
        return null;
    },
};

export const validateStep = (step, formData) => {
    const errors = {};
    const currentYear = new Date().getFullYear();

    // Step 1: Personal Info
    if (step === 1) {
        const checks = {
            first_name: validators.required(formData.first_name),
            last_name: validators.required(formData.last_name),
            email: validators.email(formData.email),
            phone: validators.phone(formData.phone),
            date_of_birth: validators.dob(formData.date_of_birth),
            gender: validators.required(formData.gender),
            address: validators.required(formData.address),
        };
        Object.entries(checks).forEach(([k, v]) => { if (v) errors[k] = v; });
    }

    // Step 2: Academic History (10th + 12th)
    if (step === 2) {
        const checks = {
            // 10th
            tenth_school: validators.required(formData.tenth_school),
            tenth_board: validators.required(formData.tenth_board),
            tenth_year: validators.year(1990, currentYear)(formData.tenth_year),
            tenth_percentage: validators.percentage(formData.tenth_percentage),
            // 12th
            twelfth_school: validators.required(formData.twelfth_school),
            twelfth_board: validators.required(formData.twelfth_board),
            twelfth_year: validators.year(1990, currentYear)(formData.twelfth_year),
            twelfth_percentage: validators.percentage(formData.twelfth_percentage),
            twelfth_stream: validators.required(formData.twelfth_stream),
        };
        Object.entries(checks).forEach(([k, v]) => { if (v) errors[k] = v; });
    }

    // Step 3: Programme Preferences
    if (step === 3) {
        const checks = {
            program: validators.required(formData.program),
            intake_year: validators.year(currentYear, currentYear + 3)(formData.intake_year),
            study_mode: validators.required(formData.study_mode),
        };
        Object.entries(checks).forEach(([k, v]) => { if (v) errors[k] = v; });
    }

    // Steps 4 & 5: Documents & Payment — no required validation (optional)

    return errors;
};

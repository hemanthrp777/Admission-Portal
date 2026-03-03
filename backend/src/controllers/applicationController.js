import supabase from '../db/supabase.js';

// POST /api/applications — Submit new application
export const createApplication = async (req, res, next) => {
    try {
        const {
            first_name, last_name, email, phone, date_of_birth, gender, address,
            tenth_school, tenth_board, tenth_year, tenth_percentage, tenth_subjects,
            twelfth_school, twelfth_board, twelfth_year, twelfth_percentage, twelfth_stream, twelfth_subjects,
            program, intake_year, study_mode,
            documents_submitted, declaration_agreed,
            payment_status, payment_reference,
        } = req.body;

        // Check for duplicate email
        const { data: existing } = await supabase
            .from('applications')
            .select('id')
            .eq('email', email.toLowerCase().trim())
            .single();

        if (existing) {
            return res.status(409).json({
                success: false,
                message: 'An application with this email already exists.',
                errors: [{ field: 'email', message: 'Email already registered' }],
            });
        }

        const { data, error } = await supabase
            .from('applications')
            .insert([{
                first_name: first_name.trim(),
                last_name: last_name.trim(),
                email: email.toLowerCase().trim(),
                phone: phone.trim(),
                date_of_birth,
                gender,
                address: address.trim(),

                tenth_school: tenth_school.trim(),
                tenth_board,
                tenth_year: parseInt(tenth_year),
                tenth_percentage: parseFloat(tenth_percentage),
                tenth_subjects: tenth_subjects?.trim() || null,

                twelfth_school: twelfth_school.trim(),
                twelfth_board,
                twelfth_year: parseInt(twelfth_year),
                twelfth_percentage: parseFloat(twelfth_percentage),
                twelfth_stream,
                twelfth_subjects: twelfth_subjects?.trim() || null,

                program,
                intake_year: parseInt(intake_year),
                study_mode,

                documents_submitted: documents_submitted || false,
                declaration_agreed: declaration_agreed || false,
                payment_status: payment_status || 'Pending',
                payment_reference: payment_reference?.trim() || null,

                status: 'Pending',
            }])
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json({
            success: true,
            message: 'Application submitted successfully!',
            data,
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/applications — Fetch all with filters + pagination
export const getApplications = async (req, res, next) => {
    try {
        const {
            status, program, intake_year, study_mode,
            search, page = 1, limit = 10,
            sort_by = 'created_at', order = 'desc',
        } = req.query;

        const pageNum = Math.max(1, parseInt(page));
        const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
        const from = (pageNum - 1) * limitNum;
        const to = from + limitNum - 1;

        const allowedSorts = ['created_at', 'first_name', 'last_name', 'program', 'merit_score', 'status'];
        const safeSort = allowedSorts.includes(sort_by) ? sort_by : 'created_at';
        const safeOrder = order === 'asc';

        let query = supabase
            .from('applications')
            .select('*', { count: 'exact' })
            .order(safeSort, { ascending: safeOrder })
            .range(from, to);

        if (status) query = query.eq('status', status);
        if (program) query = query.eq('program', program);
        if (intake_year) query = query.eq('intake_year', parseInt(intake_year));
        if (study_mode) query = query.eq('study_mode', study_mode);

        if (search && search.trim()) {
            const term = search.trim();
            query = query.or(
                `first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%`
            );
        }

        const { data, error, count } = await query;
        if (error) throw error;

        return res.status(200).json({
            success: true,
            data,
            pagination: {
                total: count,
                page: pageNum,
                limit: limitNum,
                total_pages: Math.ceil(count / limitNum),
            },
        });
    } catch (err) {
        next(err);
    }
};

// GET /api/applications/:id
export const getApplicationById = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { data, error } = await supabase
            .from('applications')
            .select('*')
            .eq('id', id)
            .single();

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        return res.status(200).json({ success: true, data });
    } catch (err) {
        next(err);
    }
};

// PATCH /api/applications/:id/status
export const updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Pending', 'Under Review', 'Accepted', 'Rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ success: false, message: 'Invalid status value' });
        }

        const { data, error } = await supabase
            .from('applications')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error || !data) {
            return res.status(404).json({ success: false, message: 'Application not found' });
        }

        return res.status(200).json({ success: true, message: 'Status updated', data });
    } catch (err) {
        next(err);
    }
};

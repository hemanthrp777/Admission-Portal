import supabase from '../db/supabase.js';

/**
 * POST /api/attendance/toggle/:id
 * Toggle attendance: checks last log, inserts opposite type.
 * First scan = IN, subsequent scans alternate IN/OUT.
 */
export const toggleAttendance = async (req, res, next) => {
    try {
        const { id } = req.params; // application_id

        // Verify the application exists
        const { data: app, error: appError } = await supabase
            .from('applications')
            .select('id, first_name, last_name, email, program')
            .eq('id', id)
            .single();

        if (appError || !app) {
            return res.status(404).json({
                success: false,
                message: 'Student not found.',
            });
        }

        // Get the most recent attendance log for this student
        const { data: lastLog } = await supabase
            .from('attendance_logs')
            .select('type, scanned_at')
            .eq('application_id', id)
            .order('scanned_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        // Determine next type: if no log or last was OUT → IN, else → OUT
        const nextType = (!lastLog || lastLog.type === 'OUT') ? 'IN' : 'OUT';

        // Insert the new attendance log
        const { data: newLog, error: insertError } = await supabase
            .from('attendance_logs')
            .insert([{
                application_id: id,
                type: nextType,
            }])
            .select()
            .single();

        if (insertError) throw insertError;

        return res.status(200).json({
            success: true,
            message: `Checked ${nextType} successfully`,
            data: {
                log: newLog,
                student: {
                    name: `${app.first_name} ${app.last_name}`,
                    email: app.email,
                    program: app.program,
                },
                type: nextType,
                scanned_at: newLog.scanned_at,
            },
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/attendance/:id/logs
 * Get attendance history for a student.
 */
export const getAttendanceLogs = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { limit = 20 } = req.query;

        const { data, error, count } = await supabase
            .from('attendance_logs')
            .select('*', { count: 'exact' })
            .eq('application_id', id)
            .order('scanned_at', { ascending: false })
            .limit(Math.min(50, parseInt(limit)));

        if (error) throw error;

        return res.status(200).json({
            success: true,
            data,
            total: count,
        });
    } catch (err) {
        next(err);
    }
};

/**
 * GET /api/attendance/:id/status
 * Get current attendance status (is student currently IN or OUT?).
 */
export const getAttendanceStatus = async (req, res, next) => {
    try {
        const { id } = req.params;

        const { data: lastLog } = await supabase
            .from('attendance_logs')
            .select('type, scanned_at')
            .eq('application_id', id)
            .order('scanned_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        return res.status(200).json({
            success: true,
            data: {
                current_status: lastLog ? lastLog.type : null,
                last_scan: lastLog?.scanned_at || null,
            },
        });
    } catch (err) {
        next(err);
    }
};

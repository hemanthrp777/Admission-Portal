import { Router } from 'express';
import { param } from 'express-validator';
import { handleValidation } from '../middleware/validate.js';
import {
    toggleAttendance,
    getAttendanceLogs,
    getAttendanceStatus,
} from '../controllers/attendanceController.js';

const router = Router();

// POST /api/attendance/toggle/:id — Toggle In/Out
router.post('/toggle/:id',
    param('id').isUUID().withMessage('Invalid application ID'),
    handleValidation,
    toggleAttendance
);

// GET /api/attendance/:id/logs — Attendance history
router.get('/:id/logs',
    param('id').isUUID().withMessage('Invalid application ID'),
    handleValidation,
    getAttendanceLogs
);

// GET /api/attendance/:id/status — Current status
router.get('/:id/status',
    param('id').isUUID().withMessage('Invalid application ID'),
    handleValidation,
    getAttendanceStatus
);

export default router;

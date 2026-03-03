import { Router } from 'express';
import { body, param } from 'express-validator';
import { handleValidation } from '../middleware/validate.js';
import authMiddleware from '../middleware/auth.js';
import {
    createApplication,
    getApplications,
    getApplicationById,
    updateStatus,
} from '../controllers/applicationController.js';

const router = Router();

const currentYear = new Date().getFullYear();

// Validation rules for creating application
const createRules = [
    // Step 1: Personal Info
    body('first_name').trim().notEmpty().withMessage('First name is required').isLength({ max: 100 }),
    body('last_name').trim().notEmpty().withMessage('Last name is required').isLength({ max: 100 }),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('phone').trim().notEmpty().withMessage('Phone is required')
        .matches(/^\+?[\d\s\-()]{7,20}$/).withMessage('Invalid phone number'),
    body('date_of_birth').isDate().withMessage('Valid date of birth is required'),
    body('gender').isIn(['Male', 'Female', 'Other', 'Prefer not to say']).withMessage('Invalid gender'),
    body('address').trim().notEmpty().withMessage('Address is required'),

    // Step 2: Academic History — 10th
    body('tenth_school').trim().notEmpty().withMessage('10th school is required'),
    body('tenth_board').trim().notEmpty().withMessage('10th board is required'),
    body('tenth_year').isInt({ min: 1990, max: currentYear }).withMessage('Valid 10th passing year required'),
    body('tenth_percentage').isFloat({ min: 0, max: 100 }).withMessage('10th percentage must be 0-100'),

    // Step 2: Academic History — 12th / PUC
    body('twelfth_school').trim().notEmpty().withMessage('12th school is required'),
    body('twelfth_board').trim().notEmpty().withMessage('12th board is required'),
    body('twelfth_year').isInt({ min: 1990, max: currentYear }).withMessage('Valid 12th passing year required'),
    body('twelfth_percentage').isFloat({ min: 0, max: 100 }).withMessage('12th percentage must be 0-100'),
    body('twelfth_stream').trim().notEmpty().withMessage('12th stream is required'),

    // Step 3: Program
    body('program').trim().notEmpty().withMessage('Program selection is required'),
    body('intake_year').isInt({ min: currentYear, max: currentYear + 3 }).withMessage('Valid intake year required'),
    body('study_mode').isIn(['Full-Time', 'Part-Time', 'Online']).withMessage('Invalid study mode'),

    // Steps 4 & 5 are optional — no required validation
    body('documents_submitted').optional().isBoolean(),
    body('declaration_agreed').optional().isBoolean(),
    body('payment_status').optional().isIn(['Pending', 'Paid']),
    body('payment_reference').optional().trim(),
];

router.post('/', authMiddleware, createRules, handleValidation, createApplication);
router.get('/', getApplications);
router.get('/:id', param('id').isUUID(), handleValidation, getApplicationById);
router.patch('/:id/status',
    param('id').isUUID(),
    body('status').notEmpty().withMessage('Status is required'),
    handleValidation,
    updateStatus
);

export default router;

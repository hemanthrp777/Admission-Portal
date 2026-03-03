import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import applicationRoutes from './routes/applications.js';
import attendanceRoutes from './routes/attendance.js';
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security & utility middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '10kb' })); // Prevent oversized payloads
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/applications', applicationRoutes);
app.use('/api/attendance', attendanceRoutes);

// 404 fallback
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

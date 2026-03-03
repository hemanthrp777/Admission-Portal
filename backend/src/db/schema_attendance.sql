-- Attendance tracking table for QR-based check-in/check-out
CREATE TABLE IF NOT EXISTS attendance_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
  type VARCHAR(10) NOT NULL CHECK (type IN ('IN', 'OUT')),
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX idx_attendance_app_id ON attendance_logs(application_id);
CREATE INDEX idx_attendance_scanned_at ON attendance_logs(scanned_at DESC);
CREATE INDEX idx_attendance_app_type ON attendance_logs(application_id, scanned_at DESC);
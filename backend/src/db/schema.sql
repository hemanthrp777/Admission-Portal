-- Migration: Expanded application form
-- Run this in Supabase SQL Editor to drop and recreate the table

DROP TABLE IF EXISTS applications;

CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,

  -- Stage 1: Personal Info
  first_name         VARCHAR(100) NOT NULL,
  last_name          VARCHAR(100) NOT NULL,
  email              VARCHAR(255) NOT NULL UNIQUE,
  phone              VARCHAR(20) NOT NULL,
  date_of_birth      DATE NOT NULL,
  gender             VARCHAR(20) NOT NULL,
  address            TEXT NOT NULL,

  -- Stage 2: Academic History — 10th / SSLC
  tenth_school       VARCHAR(255) NOT NULL,
  tenth_board        VARCHAR(100) NOT NULL,
  tenth_year         INT NOT NULL,
  tenth_percentage   NUMERIC(5, 2) NOT NULL CHECK (tenth_percentage >= 0 AND tenth_percentage <= 100),
  tenth_subjects     TEXT,

  -- Stage 2: Academic History — 12th / PUC
  twelfth_school     VARCHAR(255) NOT NULL,
  twelfth_board      VARCHAR(100) NOT NULL,
  twelfth_year       INT NOT NULL,
  twelfth_percentage NUMERIC(5, 2) NOT NULL CHECK (twelfth_percentage >= 0 AND twelfth_percentage <= 100),
  twelfth_stream     VARCHAR(100) NOT NULL,
  twelfth_subjects   TEXT,

  -- Merit score: 40% of 10th + 60% of 12th
  merit_score        NUMERIC(5, 2) GENERATED ALWAYS AS
                     (ROUND((tenth_percentage * 0.4 + twelfth_percentage * 0.6), 2)) STORED,

  -- Stage 3: Program Info
  program            VARCHAR(100) NOT NULL,
  intake_year        INT NOT NULL,
  study_mode         VARCHAR(50) NOT NULL DEFAULT 'Full-Time',

  -- Stage 4: Documents & Declarations (optional)
  documents_submitted BOOLEAN DEFAULT FALSE,
  declaration_agreed  BOOLEAN DEFAULT FALSE,

  -- Stage 5: Payment (optional)
  payment_status     VARCHAR(50) DEFAULT 'Pending',
  payment_reference  VARCHAR(100),

  -- Meta
  status             VARCHAR(50) NOT NULL DEFAULT 'Pending',
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_applications_status   ON applications(status);
CREATE INDEX idx_applications_program  ON applications(program);
CREATE INDEX idx_applications_year     ON applications(intake_year);
CREATE INDEX idx_applications_email    ON applications(email);
CREATE INDEX idx_applications_merit    ON applications(merit_score);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at
  BEFORE UPDATE ON applications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

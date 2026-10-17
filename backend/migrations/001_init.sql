CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- User accounts and authentication details.
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Resumes uploaded by users.
CREATE TABLE IF NOT EXISTS resumes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded'
    CHECK (status IN ('uploaded', 'parsing', 'parsed', 'failed', 'analyzed', 'archived')),
  version INTEGER NOT NULL DEFAULT 1,
  original_filename TEXT,
  storage_path TEXT,
  parsed_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_resumes_id_user UNIQUE (id, user_id),
  UNIQUE (user_id, title)
);

-- Job descriptions saved by users.
CREATE TABLE IF NOT EXISTS job_descriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  job_title TEXT,
  company_name TEXT,
  raw_text TEXT NOT NULL,
  parsed_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_job_descriptions_id_user UNIQUE (id, user_id)
);

-- Resume-to-job match analyses, constrained to records owned by the same user.
CREATE TABLE IF NOT EXISTS match_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  resume_id UUID NOT NULL,
  job_description_id UUID NOT NULL,
  overall_score NUMERIC(5, 2),
  result JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  FOREIGN KEY (resume_id, user_id)
    REFERENCES resumes (id, user_id) ON DELETE CASCADE,
  FOREIGN KEY (job_description_id, user_id)
    REFERENCES job_descriptions (id, user_id) ON DELETE CASCADE
);

-- ATS reports generated for match analyses.
CREATE TABLE IF NOT EXISTS ats_reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  analysis_id UUID NOT NULL UNIQUE REFERENCES match_analyses(id) ON DELETE CASCADE,
  overall_score NUMERIC(5, 2),
  missing_keywords TEXT[],
  details JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_resumes_user_id ON resumes(user_id);
CREATE INDEX IF NOT EXISTS idx_job_descriptions_user_id ON job_descriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_match_resume_id ON match_analyses(resume_id);
CREATE INDEX IF NOT EXISTS idx_match_job_id ON match_analyses(job_description_id);
CREATE INDEX IF NOT EXISTS idx_match_user_id ON match_analyses(user_id);

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

CREATE TRIGGER users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER resumes_set_updated_at
BEFORE UPDATE ON resumes
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER job_descriptions_set_updated_at
BEFORE UPDATE ON job_descriptions
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

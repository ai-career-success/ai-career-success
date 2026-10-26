-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "ats_reports" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "analysis_id" UUID NOT NULL,
    "overall_score" DECIMAL(5,2),
    "missing_keywords" TEXT[],
    "details" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ats_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "job_descriptions" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "job_title" TEXT,
    "company_name" TEXT,
    "raw_text" TEXT NOT NULL,
    "parsed_data" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "job_descriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "match_analyses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "resume_id" UUID NOT NULL,
    "job_description_id" UUID NOT NULL,
    "overall_score" DECIMAL(5,2),
    "result" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "match_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "resumes" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'uploaded',
    "version" INTEGER NOT NULL DEFAULT 1,
    "original_filename" TEXT,
    "storage_path" TEXT,
    "parsed_data" JSONB,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "resumes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'user',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMPTZ(6),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ats_reports_analysis_id_key" ON "ats_reports"("analysis_id");

-- CreateIndex
CREATE INDEX "idx_job_descriptions_user_id" ON "job_descriptions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_job_descriptions_id_user" ON "job_descriptions"("id", "user_id");

-- CreateIndex
CREATE INDEX "idx_match_job_id" ON "match_analyses"("job_description_id");

-- CreateIndex
CREATE INDEX "idx_match_resume_id" ON "match_analyses"("resume_id");

-- CreateIndex
CREATE INDEX "idx_match_user_id" ON "match_analyses"("user_id");

-- CreateIndex
CREATE INDEX "idx_resumes_user_id" ON "resumes"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "resumes_user_id_title_key" ON "resumes"("user_id", "title");

-- CreateIndex
CREATE UNIQUE INDEX "uq_resumes_id_user" ON "resumes"("id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "ats_reports" ADD CONSTRAINT "ats_reports_analysis_id_fkey" FOREIGN KEY ("analysis_id") REFERENCES "match_analyses"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "job_descriptions" ADD CONSTRAINT "job_descriptions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_analyses" ADD CONSTRAINT "match_analyses_job_description_id_user_id_fkey" FOREIGN KEY ("job_description_id", "user_id") REFERENCES "job_descriptions"("id", "user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_analyses" ADD CONSTRAINT "match_analyses_resume_id_user_id_fkey" FOREIGN KEY ("resume_id", "user_id") REFERENCES "resumes"("id", "user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "match_analyses" ADD CONSTRAINT "match_analyses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "resumes" ADD CONSTRAINT "resumes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

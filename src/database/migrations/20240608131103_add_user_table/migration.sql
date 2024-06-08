-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ROLE_STUDENT', 'ROLE_LECTURER');

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "student_id" TEXT,
    "lecturer_id" TEXT,
    "profile_picture_url" TEXT,
    "role" "Role" DEFAULT 'ROLE_STUDENT',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

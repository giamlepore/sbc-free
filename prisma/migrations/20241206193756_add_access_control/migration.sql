-- CreateEnum
CREATE TYPE "AccessLevel" AS ENUM ('LEAD', 'LEAD_PLUS', 'STUDENT', 'ADMIN');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessLevel" "AccessLevel" NOT NULL DEFAULT 'LEAD';

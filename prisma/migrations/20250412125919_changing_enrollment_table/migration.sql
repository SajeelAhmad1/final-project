/*
  Warnings:

  - A unique constraint covering the columns `[studentId,courseId,semester]` on the table `Enrollment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Enrollment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Enrollment_courseId_idx";

-- DropIndex
DROP INDEX "Enrollment_studentId_idx";

-- AlterTable
ALTER TABLE "Enrollment" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Enrollment_studentId_courseId_semester_key" ON "Enrollment"("studentId", "courseId", "semester");

-- CreateIndex
CREATE INDEX "Enrollment_courseId_idx" ON "Enrollment"("courseId");

-- CreateIndex
CREATE INDEX "Enrollment_studentId_idx" ON "Enrollment"("studentId");

-- CreateIndex
CREATE INDEX "Student_rollNumber_idx" ON "Student"("rollNumber");

-- CreateIndex
CREATE INDEX "Student_department_batch_idx" ON "Student"("department", "batch");

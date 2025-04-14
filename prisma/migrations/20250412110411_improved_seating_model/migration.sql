/*
  Warnings:

  - Added the required column `batch` to the `Seating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Seating` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merit` to the `Seating` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seating" ADD COLUMN     "batch" TEXT NOT NULL,
ADD COLUMN     "department" TEXT NOT NULL,
ADD COLUMN     "merit" INTEGER NOT NULL;

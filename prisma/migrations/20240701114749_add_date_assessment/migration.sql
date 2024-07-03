/*
  Warnings:

  - Added the required column `date` to the `AssessmentEmployee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AssessmentEmployee" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;

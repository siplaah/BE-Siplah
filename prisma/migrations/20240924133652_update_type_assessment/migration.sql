/*
  Warnings:

  - The values [should_stay_above,shoud_stay_below,should_increase_to,shoud_decrease_to,achieve_or_not] on the enum `typeAssessment` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typeAssessment_new" AS ENUM ('status_achieved', 'status_good', 'status_need_improvement', 'status_inadequate');
ALTER TABLE "AssessmentEmployee" ALTER COLUMN "type" TYPE "typeAssessment_new" USING ("type"::text::"typeAssessment_new");
ALTER TYPE "typeAssessment" RENAME TO "typeAssessment_old";
ALTER TYPE "typeAssessment_new" RENAME TO "typeAssessment";
DROP TYPE "typeAssessment_old";
COMMIT;

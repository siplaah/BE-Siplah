/*
  Warnings:

  - The values [menikah,melahirkan] on the enum `typeTimeOff` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "typeTimeOff_new" AS ENUM ('tahunan', 'khusus');
ALTER TABLE "TimeOff" ALTER COLUMN "type" TYPE "typeTimeOff_new" USING ("type"::text::"typeTimeOff_new");
ALTER TYPE "typeTimeOff" RENAME TO "typeTimeOff_old";
ALTER TYPE "typeTimeOff_new" RENAME TO "typeTimeOff";
DROP TYPE "typeTimeOff_old";
COMMIT;

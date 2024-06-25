/*
  Warnings:

  - The values [OnGoing,Pending] on the enum `Progres` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Progres_new" AS ENUM ('Done', 'Doing', 'Todo');
ALTER TABLE "DailyReport" ALTER COLUMN "status" TYPE "Progres_new" USING ("status"::text::"Progres_new");
ALTER TYPE "Progres" RENAME TO "Progres_old";
ALTER TYPE "Progres_new" RENAME TO "Progres";
DROP TYPE "Progres_old";
COMMIT;

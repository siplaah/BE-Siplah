/*
  Warnings:

  - Added the required column `id_employee` to the `Overtimes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Overtimes" ADD COLUMN     "id_employee" INTEGER NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'pending';

-- AddForeignKey
ALTER TABLE "Overtimes" ADD CONSTRAINT "Overtimes_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

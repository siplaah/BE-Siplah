/*
  Warnings:

  - Added the required column `id_employee` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "id_employee" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

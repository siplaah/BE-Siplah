/*
  Warnings:

  - You are about to drop the column `nama` on the `DailyReport` table. All the data in the column will be lost.
  - Added the required column `id_employee` to the `DailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `id_employee` to the `Presensi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReport" DROP COLUMN "nama",
ADD COLUMN     "id_employee" INTEGER NOT NULL,
ADD COLUMN     "id_project" INTEGER;

-- AlterTable
ALTER TABLE "Presensi" ADD COLUMN     "id_employee" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_id_project_fkey" FOREIGN KEY ("id_project") REFERENCES "Project"("id_project") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Presensi" ADD CONSTRAINT "Presensi_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

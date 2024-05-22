/*
  Warnings:

  - Added the required column `id_jabatan` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "id_jabatan" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_id_jabatan_fkey" FOREIGN KEY ("id_jabatan") REFERENCES "Jabatan"("id_jabatan") ON DELETE RESTRICT ON UPDATE CASCADE;

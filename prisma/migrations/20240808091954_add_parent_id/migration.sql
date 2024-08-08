/*
  Warnings:

  - You are about to drop the `SubJabatan` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubJabatan" DROP CONSTRAINT "SubJabatan_jabatanId_jabatan_fkey";

-- AlterTable
ALTER TABLE "Jabatan" ADD COLUMN     "parentId" INTEGER;

-- DropTable
DROP TABLE "SubJabatan";

-- AddForeignKey
ALTER TABLE "Jabatan" ADD CONSTRAINT "Jabatan_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Jabatan"("id_jabatan") ON DELETE SET NULL ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `date` to the `DailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `DailyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nama` to the `Presensi` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReport" ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "nama" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Presensi" ADD COLUMN     "nama" TEXT NOT NULL;

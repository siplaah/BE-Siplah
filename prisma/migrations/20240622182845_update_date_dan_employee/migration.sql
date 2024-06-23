/*
  Warnings:

  - Added the required column `deskripsi` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `tanggal_lahir` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `start_working` on the `Employee` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "StatusKaryawan" AS ENUM ('Aktif', 'NonAktif');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "deskripsi" "StatusKaryawan" NOT NULL,
DROP COLUMN "tanggal_lahir",
ADD COLUMN     "tanggal_lahir" TIMESTAMP(3) NOT NULL,
DROP COLUMN "start_working",
ADD COLUMN     "start_working" TIMESTAMP(3) NOT NULL;

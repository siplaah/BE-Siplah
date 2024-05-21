/*
  Warnings:

  - Added the required column `alamat` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `keterangan` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pendidikan` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tanggal_lahir` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tempat_lahir` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Pendidikan" AS ENUM ('SMA', 'D3', 'S1', 'S2', 'S3');

-- CreateEnum
CREATE TYPE "Keterangan" AS ENUM ('Karyawan', 'Freelance', 'Partime', 'Probation');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "alamat" TEXT NOT NULL,
ADD COLUMN     "keterangan" "Keterangan" NOT NULL,
ADD COLUMN     "pendidikan" "Pendidikan" NOT NULL,
ADD COLUMN     "tanggal_lahir" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "tempat_lahir" TEXT NOT NULL;

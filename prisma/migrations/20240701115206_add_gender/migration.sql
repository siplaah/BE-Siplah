/*
  Warnings:

  - Added the required column `gender` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "JenisKelamin" AS ENUM ('pria', 'wanita');

-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "gender" "JenisKelamin" NOT NULL;

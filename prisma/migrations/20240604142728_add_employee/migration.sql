/*
  Warnings:

  - Added the required column `start_working` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Employee" ADD COLUMN     "start_working" TIMESTAMP(3) NOT NULL;

/*
  Warnings:

  - Added the required column `feedback` to the `DailyReport` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DailyReport" ADD COLUMN     "feedback" TEXT NOT NULL;

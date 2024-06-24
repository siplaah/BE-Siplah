/*
  Warnings:

  - You are about to drop the column `id_employee` on the `Meeting` table. All the data in the column will be lost.
  - Added the required column `update_at` to the `Meeting` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "typeAssessment" AS ENUM ('should_stay_above', 'shoud_stay_below', 'should_increase_to', 'shoud_decrease_to', 'achieve_or_not');

-- DropForeignKey
ALTER TABLE "Meeting" DROP CONSTRAINT "Meeting_id_employee_fkey";

-- AlterTable
ALTER TABLE "Meeting" DROP COLUMN "id_employee",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "update_at" TIMESTAMP(3) NOT NULL;

-- CreateTable
CREATE TABLE "AssessmentEmployee" (
    "id_assessment" SERIAL NOT NULL,
    "id_key_result" INTEGER NOT NULL,
    "id_employee" INTEGER NOT NULL,
    "type" "typeAssessment" NOT NULL,
    "target" DOUBLE PRECISION NOT NULL,
    "realisasi" DOUBLE PRECISION NOT NULL,
    "nilai_akhir" DOUBLE PRECISION NOT NULL,
    "total_nilai" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AssessmentEmployee_pkey" PRIMARY KEY ("id_assessment")
);

-- AddForeignKey
ALTER TABLE "AssessmentEmployee" ADD CONSTRAINT "AssessmentEmployee_id_key_result_fkey" FOREIGN KEY ("id_key_result") REFERENCES "KeyResult"("id_key_result") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AssessmentEmployee" ADD CONSTRAINT "AssessmentEmployee_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

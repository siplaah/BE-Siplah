/*
  Warnings:

  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id_employee]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_id_jabatan_fkey";

-- DropIndex
DROP INDEX "Employee_id_key";

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "id",
ADD COLUMN     "id_employee" SERIAL NOT NULL,
ALTER COLUMN "id_jabatan" DROP NOT NULL,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("id_employee");

-- CreateIndex
CREATE UNIQUE INDEX "Employee_id_employee_key" ON "Employee"("id_employee");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_id_jabatan_fkey" FOREIGN KEY ("id_jabatan") REFERENCES "Jabatan"("id_jabatan") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "typeTimeOff" AS ENUM ('tahunan', 'menikah', 'melahirkan');

-- CreateTable
CREATE TABLE "TimeOff" (
    "id_time_off" SERIAL NOT NULL,
    "id_employee" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "attachment" TEXT NOT NULL,
    "type" "typeTimeOff" NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'pending',
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeOff_pkey" PRIMARY KEY ("id_time_off")
);

-- AddForeignKey
ALTER TABLE "TimeOff" ADD CONSTRAINT "TimeOff_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

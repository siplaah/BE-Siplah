-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'approved', 'rejected');

-- CreateTable
CREATE TABLE "Overtimes" (
    "id_overtime" SERIAL NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "attachment" TEXT NOT NULL,
    "status" "Status" NOT NULL,

    CONSTRAINT "Overtimes_pkey" PRIMARY KEY ("id_overtime")
);

-- CreateEnum
CREATE TYPE "Progres" AS ENUM ('Done', 'OnGoing', 'Pending');

-- CreateTable
CREATE TABLE "DailyReport" (
    "id_daily_report" SERIAL NOT NULL,
    "task" TEXT NOT NULL,
    "status" "Progres" NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id_daily_report")
);

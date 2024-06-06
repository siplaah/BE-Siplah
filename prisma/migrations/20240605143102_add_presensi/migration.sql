-- CreateTable
CREATE TABLE "Presensi" (
    "id_presensi" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Presensi_pkey" PRIMARY KEY ("id_presensi")
);

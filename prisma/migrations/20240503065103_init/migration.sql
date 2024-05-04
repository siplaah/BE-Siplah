-- CreateTable
CREATE TABLE "Jabatan" (
    "id_jabatan" SERIAL NOT NULL,
    "name_jabatan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jabatan_pkey" PRIMARY KEY ("id_jabatan")
);

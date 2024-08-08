-- AlterTable
ALTER TABLE "Jabatan" ALTER COLUMN "name_jabatan" DROP NOT NULL;

-- CreateTable
CREATE TABLE "SubJabatan" (
    "id_subjabatan" SERIAL NOT NULL,
    "name_subjabatan" TEXT,
    "jabatan_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "jabatanId_jabatan" INTEGER,

    CONSTRAINT "SubJabatan_pkey" PRIMARY KEY ("id_subjabatan")
);

-- AddForeignKey
ALTER TABLE "SubJabatan" ADD CONSTRAINT "SubJabatan_jabatanId_jabatan_fkey" FOREIGN KEY ("jabatanId_jabatan") REFERENCES "Jabatan"("id_jabatan") ON DELETE SET NULL ON UPDATE CASCADE;

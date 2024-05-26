-- CreateTable
CREATE TABLE "KeyResult" (
    "id_key_result" SERIAL NOT NULL,
    "key_result" TEXT NOT NULL,
    "target" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KeyResult_pkey" PRIMARY KEY ("id_key_result")
);

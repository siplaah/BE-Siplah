-- CreateTable
CREATE TABLE "Project" (
    "id_project" SERIAL NOT NULL,
    "name_project" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id_project")
);

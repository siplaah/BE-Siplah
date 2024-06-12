-- CreateTable
CREATE TABLE "Meeting" (
    "id_meeting" SERIAL NOT NULL,
    "id_employee" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "link_meeting" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Meeting_pkey" PRIMARY KEY ("id_meeting")
);

-- AddForeignKey
ALTER TABLE "Meeting" ADD CONSTRAINT "Meeting_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

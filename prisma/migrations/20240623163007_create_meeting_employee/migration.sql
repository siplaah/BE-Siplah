-- CreateTable
CREATE TABLE "MeetingEmployee" (
    "id_meeting_employee" SERIAL NOT NULL,
    "id_meeting" INTEGER NOT NULL,
    "id_employee" INTEGER NOT NULL,

    CONSTRAINT "MeetingEmployee_pkey" PRIMARY KEY ("id_meeting_employee")
);

-- AddForeignKey
ALTER TABLE "MeetingEmployee" ADD CONSTRAINT "MeetingEmployee_id_meeting_fkey" FOREIGN KEY ("id_meeting") REFERENCES "Meeting"("id_meeting") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MeetingEmployee" ADD CONSTRAINT "MeetingEmployee_id_employee_fkey" FOREIGN KEY ("id_employee") REFERENCES "Employee"("id_employee") ON DELETE RESTRICT ON UPDATE CASCADE;

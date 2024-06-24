/*
  Warnings:

  - A unique constraint covering the columns `[id_employee,id_meeting]` on the table `MeetingEmployee` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MeetingEmployee_id_employee_id_meeting_key" ON "MeetingEmployee"("id_employee", "id_meeting");

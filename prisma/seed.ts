/* eslint-disable prettier/prettier */

import { PrismaClient } from '@prisma/client';
import { jabatanData } from './data/jabatan';
import { employeeData } from './data/employee';
import { projectData } from './data/project';

import { hashSync } from '@node-rs/bcrypt';

import { keyResultData } from './data/keyResult';
import { meetingData } from './data/meeting';
import { meetingEmployeeData } from './data/meetingEmployee';

const prisma = new PrismaClient();

async function main() {
  // Seeding data for Jabatan model
  // for (const jabatan of jabatanData) {
  //   await prisma.jabatan.create({
  //     data: jabatan,
  //   });
  // }

  const jabatanMap: { [key: string]: number } = {};
  for (const jabatan of jabatanData) {
    const createdJabatan = await prisma.jabatan.create({
      data: jabatan,
    });
    jabatanMap[jabatan.name_jabatan] = createdJabatan.id_jabatan;
  }

  // Seeding data for Employee model
  for (const employee of employeeData) {
    const hashedPassword = hashSync(employee.password, 10);
    await prisma.employee.create({
      data: {
        ...employee,
        password: hashedPassword,
      },
    });
  }

  for (const meeting of meetingData) {
    await prisma.meeting.create({
      data: {
        ...meeting,
      },
    });
  }

  for (const key_result of keyResultData) {
    await prisma.keyResult.create({
      data: {
        ...key_result,
      },
    });
  }

  // for (const meetingEmployee of meetingEmployeeData) {
  //   await prisma.meetingEmployee.create({
  //     data: {
  //       ...meetingEmployee,
  //     },
  //   });
  // }

  // Fetch all employees to get their ids
  const employees = await prisma.employee.findMany();
  const meetings = await prisma.meeting.findMany();

  const updatedMeetingEmployeeData = meetingEmployeeData
    .map((meetingEmployee) => {
      const meeting = meetings.find(
        (m) => m.id_meeting === meetingEmployee.id_meeting,
      );
      const employee = employees.find(
        (e) => e.id_employee === meetingEmployee.id_employee,
      );

      return {
        id_meeting: meeting ? meeting.id_meeting : null,
        id_employee: employee ? employee.id_employee : null,
      };
    })
    .filter(
      (meetingEmployee) =>
        meetingEmployee.id_meeting !== null &&
        meetingEmployee.id_employee !== null,
    );

  for (const meetingEmployee of updatedMeetingEmployeeData) {
    await prisma.meetingEmployee.create({
      data: {
        ...meetingEmployee,
      },
    });
  }

  // Update projectData with actual employee ids
  const updatedProjectData = projectData.map((project, index) => ({
    ...project,
    id_employee: employees[index].id_employee,
  }));

  // Seeding data for Project model
  for (const project of updatedProjectData) {
    await prisma.project.create({
      data: project,
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

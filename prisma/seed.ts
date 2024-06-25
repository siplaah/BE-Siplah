import { PrismaClient } from "@prisma/client";
import { jabatanData } from './data/jabatan';
import { employeeData } from "./data/employee";
import { projectData } from "./data/project";


const prisma = new PrismaClient()

async function main() {
    // Seeding data for Jabatan model
    for (const jabatan of jabatanData) {
      await prisma.jabatan.create({
        data: jabatan,
      });
    }
  
    // Seeding data for Employee model
    for (const employee of employeeData) {
      await prisma.employee.create({
        data: {
          ...employee,
        },
      });
    }
  
    // Fetch all employees to get their ids
    const employees = await prisma.employee.findMany();
    
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
    await prisma.$disconnect()
})
.catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
})
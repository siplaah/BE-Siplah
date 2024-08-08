/* eslint-disable prettier/prettier */
export const jabatanData = [
    { 
        name_jabatan: "CTO" 
    },
    { 
        name_jabatan: "PM" 
    },
    { 
        name_jabatan: "Karyawan" 
    },
    { 
        name_jabatan: "HRD" 
    },
    { 
        name_jabatan: "Front End", // Subjabatan
        parentId: 3 // ID dari jabatan "Karyawan"
    },
    { 
        name_jabatan: "Back End", // Subjabatan
        parentId: 3 // ID dari jabatan "Karyawan"
    },
    { 
        name_jabatan: "QA", // Subjabatan
        parentId: 3 // ID dari jabatan "Karyawan"
    },
];  
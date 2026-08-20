// src/data/files.js

let filesData = [
  {
    id: "1",
    title: "Cifrados y Guías de Teclado 2026",
    category: "Cifrados",
    fileType: "PDF",
    url: "https://drive.google.com",
    uploadedBy: "Carlos Pérez",
    date: "2026-08-10",
  },
  {
    id: "2",
    title: "Secuencia - Generación Que Danza (Multitrack)",
    category: "Secuencias",
    fileType: "ZIP / MP3",
    url: "https://drive.google.com",
    uploadedBy: "María Gómez",
    date: "2026-08-12",
  },
  {
    id: "3",
    title: "Manual de Servicio de Alabanza",
    category: "Documentos",
    fileType: "PDF",
    url: "https://drive.google.com",
    uploadedBy: "Pastor Andrés",
    date: "2026-08-01",
  },
];

export function getFiles() {
  return filesData;
}

export function addFile(newFile) {
  const fileWithId = {
    ...newFile,
    id: Date.now().toString(),
    date: new Date().toISOString().split("T")[0],
  };
  filesData.push(fileWithId);
  return fileWithId;
}

export function deleteFile(id) {
  filesData = filesData.filter((item) => String(item.id) !== String(id));
}
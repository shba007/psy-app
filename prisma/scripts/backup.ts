import { PrismaClient } from "@prisma/client";
import fs from "node:fs";

const prisma = new PrismaClient();

function dumpIntoFile(label: string, data: any) {
  console.log("label", data)

  const jsonString = JSON.stringify(data, null, 2)

  const dirPath = `./prisma/data`;
  const filePath = `${dirPath}/${label}_${new Date().getTime()}.json`;

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  fs.writeFileSync(filePath, jsonString);
}

async function backupReports() {
  const reports = await prisma.report.findMany({})
  dumpIntoFile('reports', reports)
}

async function backupUsers() {
  const users = await prisma.user.findMany({})
  dumpIntoFile('users', users)
}

async function main() {
  // Users
  backupUsers()

  backupReports()
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

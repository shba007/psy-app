import { PrismaClient, ScaleName, ScaleType } from "@prisma/client";
import { dataScales } from "./data";
import { capitalize } from "../../utils/helpers";
import { ScaleNameToDBScaleName } from "../../utils/models";

const prisma = new PrismaClient();

async function createOrUpdateScales() {
  for (const scale of dataScales) {
    await prisma.scale.upsert({
      where: {
        name: ScaleNameToDBScaleName[scale.name] as ScaleName,
      },
      create: {
        name: ScaleNameToDBScaleName[scale.name] as ScaleName,
        type: capitalize(scale.type) as ScaleType,
        count: scale.count,
        monthlyPrice: scale.monthlyPrice,
        subScales: scale.subScales,
        labels: {
          createMany: {
            data: scale.labels.map(({ name, value }) => ({
              name,
              value
            }))
          }
        }
      },
      update: {
        monthlyPrice: scale.monthlyPrice,
      }
    })
  }
}

function createUsers() {

}

async function main() {
  // Products
  await createOrUpdateScales()

  // Users
  // await createUsers()
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

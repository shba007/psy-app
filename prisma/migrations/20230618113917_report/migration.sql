/*
  Warnings:

  - You are about to drop the column `type` on the `Report` table. All the data in the column will be lost.
  - Added the required column `scale` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_patientId_fkey";

-- AlterTable
ALTER TABLE "Report" DROP COLUMN "type";
ALTER TABLE "Report" ADD COLUMN     "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Report" ADD COLUMN     "modifiedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Report" ADD COLUMN     "scale" "ScaleName" NOT NULL;
ALTER TABLE "Report" ALTER COLUMN "patientId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE SET NULL ON UPDATE CASCADE;

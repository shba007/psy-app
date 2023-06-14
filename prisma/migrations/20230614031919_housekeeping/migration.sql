/*
  Warnings:

  - The values [JEPQ,DSMD] on the enum `ScaleName` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `unitPrice` on the `PurchaseScale` table. All the data in the column will be lost.
  - You are about to drop the column `itemCount` on the `Scale` table. All the data in the column will be lost.
  - You are about to drop the column `unitPrice` on the `Scale` table. All the data in the column will be lost.
  - Added the required column `monthlyPrice` to the `PurchaseScale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `count` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyPrice` to the `Scale` table without a default value. This is not possible if the table is not empty.
  - Made the column `publishedAt` on table `Scale` required. This step will fail if there are existing NULL values in that column.
  - Made the column `updatedAt` on table `Scale` required. This step will fail if there are existing NULL values in that column.
  - Made the column `phone` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
ALTER TYPE "ScaleName" ADD VALUE 'SCL_90R';
ALTER TYPE "ScaleName"DROP VALUE 'JEPQ';
ALTER TYPE "ScaleName"DROP VALUE 'DSMD';

-- AlterTable
ALTER TABLE "PurchaseScale" DROP COLUMN "unitPrice";
ALTER TABLE "PurchaseScale" ADD COLUMN     "monthlyPrice" INT4 NOT NULL;

-- AlterTable
ALTER TABLE "Scale" DROP COLUMN "itemCount";
ALTER TABLE "Scale" DROP COLUMN "unitPrice";
ALTER TABLE "Scale" ADD COLUMN     "count" INT4 NOT NULL;
ALTER TABLE "Scale" ADD COLUMN     "monthlyPrice" INT4 NOT NULL;
ALTER TABLE "Scale" ADD COLUMN     "subScales" STRING[];
ALTER TABLE "Scale" ALTER COLUMN "publishedAt" SET NOT NULL;
ALTER TABLE "Scale" ALTER COLUMN "updatedAt" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "phone" SET NOT NULL;

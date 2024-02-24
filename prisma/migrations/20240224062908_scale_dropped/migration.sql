/*
  Warnings:

  - You are about to drop the column `scaleName` on the `Option` table. All the data in the column will be lost.
  - You are about to drop the `Scale` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,scale]` on the table `Option` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `scale` to the `Option` table without a default value. This is not possible if the table is not empty.
  - Added the required column `scale` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Option" DROP CONSTRAINT "Option_scaleName_fkey";

-- DropForeignKey
ALTER TABLE "PurchaseScale" DROP CONSTRAINT "PurchaseScale_name_fkey";

-- DropForeignKey
ALTER TABLE "Subscription" DROP CONSTRAINT "Subscription_name_fkey";

-- DropIndex
DROP INDEX "Option_name_scaleName_key";

-- AlterTable
ALTER TABLE "Option" DROP COLUMN "scaleName";
ALTER TABLE "Option" ADD COLUMN     "scale" "ScaleName" NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "scale" "ScaleName" NOT NULL;
ALTER TABLE "Subscription" DROP COLUMN "scale";

-- DropTable
DROP TABLE "Scale";

-- CreateIndex
CREATE UNIQUE INDEX "Option_name_scale_key" ON "Option"("name", "scale");

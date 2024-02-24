/*
  Warnings:

  - You are about to drop the column `scale` on the `Subscription` table. All the data in the column will be lost.
  - The required column `id` was added to the `Subscription` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Changed the type of `name` on the `Subscription` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Plan" AS ENUM ('Free', 'Basic', 'Pro');

-- DropIndex
DROP INDEX "Subscription_name_userId_key";

-- AlterTable
ALTER TABLE "Subscription" ADD COLUMN     "id" STRING NOT NULL;
ALTER TABLE "Subscription" DROP COLUMN "name";
ALTER TABLE "Subscription" ADD COLUMN     "name" "Plan" NOT NULL;
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id");

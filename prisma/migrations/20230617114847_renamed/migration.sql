/*
  Warnings:

  - You are about to drop the `Item` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Item" DROP CONSTRAINT "Item_scaleName_fkey";

-- DropTable
DROP TABLE "Item";

-- CreateTable
CREATE TABLE "Label" (
    "name" STRING NOT NULL,
    "value" INT4 NOT NULL,
    "scaleName" "ScaleName" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_scaleName_key" ON "Label"("name", "scaleName");

-- AddForeignKey
ALTER TABLE "Label" ADD CONSTRAINT "Label_scaleName_fkey" FOREIGN KEY ("scaleName") REFERENCES "Scale"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

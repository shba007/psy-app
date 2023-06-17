-- CreateTable
CREATE TABLE "Item" (
    "name" STRING NOT NULL,
    "value" INT4 NOT NULL,
    "scaleName" "ScaleName" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Item_name_scaleName_key" ON "Item"("name", "scaleName");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_scaleName_fkey" FOREIGN KEY ("scaleName") REFERENCES "Scale"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

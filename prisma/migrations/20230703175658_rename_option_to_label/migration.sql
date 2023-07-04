-- RenameTable
ALTER TABLE "Label" RENAME TO "Option";

-- RenamePrimaryKey
ALTER TABLE "Option" RENAME CONSTRAINT "Label_pkey" TO "Option_pkey";

-- RenameForeignKey
ALTER TABLE "Option" RENAME CONSTRAINT "Label_scaleName_fkey" TO "Option_scaleName_fkey";
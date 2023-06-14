-- CreateEnum
CREATE TYPE "ScaleName" AS ENUM ('MACI', 'MCMI', 'MMPI_RF', 'TCI', 'MPQ', 'EPQ', 'EPQ_R', 'JTCI', 'JEPQ', 'DSMD');

-- CreateEnum
CREATE TYPE "ScaleType" AS ENUM ('Binary', 'Pentanary');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "PaymentInstrument" AS ENUM ('UPI', 'NetBanking', 'Card');

-- CreateEnum
CREATE TYPE "PurchaseStatus" AS ENUM ('Pending', 'Success', 'Failed');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Draft', 'Complete');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('Compilant', 'Feedback');

-- CreateTable
CREATE TABLE "Scale" (
    "name" "ScaleName" NOT NULL,
    "type" "ScaleType" NOT NULL,
    "itemCount" INT4 NOT NULL,
    "unitPrice" INT4 NOT NULL,
    "publishedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Scale_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "Preference" (
    "isModeLight" BOOL NOT NULL,
    "payment" "PaymentInstrument" NOT NULL,
    "userId" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "email" STRING,
    "phone" STRING,
    "dob" TIMESTAMP(3) NOT NULL,
    "gender" "Gender" NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
    "name" "ScaleName" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "userId" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "Purchase" (
    "id" STRING NOT NULL,
    "purchasedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "PurchaseStatus" NOT NULL DEFAULT 'Pending',
    "userId" STRING NOT NULL,

    CONSTRAINT "Purchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PurchaseScale" (
    "name" "ScaleName" NOT NULL,
    "unitPrice" INT4 NOT NULL,
    "duration" INT4 NOT NULL,
    "purchaseId" STRING NOT NULL
);

-- CreateTable
CREATE TABLE "Patient" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,

    CONSTRAINT "Patient_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" STRING NOT NULL,
    "type" "ScaleName" NOT NULL,
    "status" "ReportStatus" NOT NULL,
    "data" JSONB NOT NULL,
    "value" JSONB NOT NULL,
    "userId" STRING NOT NULL,
    "patientId" STRING NOT NULL,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" STRING NOT NULL,
    "type" "FeedbackType" NOT NULL,
    "comment" STRING NOT NULL,
    "userId" STRING,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Preference_userId_key" ON "Preference"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_name_userId_key" ON "Subscription"("name", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "Purchase_id_userId_key" ON "Purchase"("id", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "PurchaseScale_name_purchaseId_key" ON "PurchaseScale"("name", "purchaseId");

-- AddForeignKey
ALTER TABLE "Preference" ADD CONSTRAINT "Preference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_name_fkey" FOREIGN KEY ("name") REFERENCES "Scale"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseScale" ADD CONSTRAINT "PurchaseScale_name_fkey" FOREIGN KEY ("name") REFERENCES "Scale"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PurchaseScale" ADD CONSTRAINT "PurchaseScale_purchaseId_fkey" FOREIGN KEY ("purchaseId") REFERENCES "Purchase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "Patient"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

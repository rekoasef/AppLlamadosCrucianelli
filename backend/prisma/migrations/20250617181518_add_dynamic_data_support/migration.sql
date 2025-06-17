/*
  Warnings:

  - Added the required column `businessUnitId` to the `CallRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallRecord" ADD COLUMN     "businessUnitId" TEXT NOT NULL,
ADD COLUMN     "specificData" JSONB;

-- CreateTable
CREATE TABLE "BusinessUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusinessUnit_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUnit_name_key" ON "BusinessUnit"("name");

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

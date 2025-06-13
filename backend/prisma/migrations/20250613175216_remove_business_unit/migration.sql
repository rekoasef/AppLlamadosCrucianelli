/*
  Warnings:

  - You are about to drop the column `businessUnitId` on the `CallRecord` table. All the data in the column will be lost.
  - You are about to drop the `BusinessUnit` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CallRecord" DROP CONSTRAINT "CallRecord_businessUnitId_fkey";

-- AlterTable
ALTER TABLE "CallRecord" DROP COLUMN "businessUnitId";

-- DropTable
DROP TABLE "BusinessUnit";

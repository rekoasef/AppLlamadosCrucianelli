/*
  Warnings:

  - Added the required column `createdById` to the `CallRecord` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CallRecord" ADD COLUMN     "createdById" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

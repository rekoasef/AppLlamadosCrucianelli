-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "CallStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'CLOSED', 'PENDING_CLIENT');

-- CreateTable
CREATE TABLE "CallRecord" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "contactName" TEXT NOT NULL,
    "machineSerialNumber" TEXT,
    "observations" TEXT,
    "status" "CallStatus" NOT NULL DEFAULT 'OPEN',
    "specificData" JSONB,
    "businessUnitId" TEXT NOT NULL,
    "handledById" TEXT,
    "createdById" TEXT NOT NULL,
    "callerTypeId" TEXT NOT NULL,
    "machineTypeId" TEXT,
    "billedClient" TEXT,
    "dealershipId" TEXT,
    "inquiryAreaId" TEXT NOT NULL,
    "responseReasonId" TEXT,
    "contactChannelId" TEXT NOT NULL,
    "durationRangeId" TEXT NOT NULL,
    "urgencyLevelId" TEXT NOT NULL,

    CONSTRAINT "CallRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessUnit" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "BusinessUnit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CallerType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "CallerType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MachineType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "MachineType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Dealership" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Dealership_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InquiryArea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "InquiryArea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseReason" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ResponseReason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactChannel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ContactChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DurationRange" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "DurationRange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UrgencyLevel" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "UrgencyLevel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeafProductType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "LeafProductType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComplaintLocation" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ComplaintLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FertecMachineType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FertecMachineType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BusinessUnitCallerTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitCallerTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitMachineTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitMachineTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitDealerships" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitDealerships_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitInquiryAreas" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitInquiryAreas_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitResponseReasons" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitResponseReasons_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitContactChannels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitContactChannels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitDurationRanges" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitDurationRanges_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitUrgencyLevels" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitUrgencyLevels_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitLeafProductTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitLeafProductTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_BusinessUnitFertecMachineTypes" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BusinessUnitFertecMachineTypes_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "BusinessUnit_name_key" ON "BusinessUnit"("name");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "CallerType_name_key" ON "CallerType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "MachineType_name_key" ON "MachineType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Dealership_name_key" ON "Dealership"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InquiryArea_name_key" ON "InquiryArea"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ResponseReason_name_key" ON "ResponseReason"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ContactChannel_name_key" ON "ContactChannel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "DurationRange_name_key" ON "DurationRange"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UrgencyLevel_name_key" ON "UrgencyLevel"("name");

-- CreateIndex
CREATE UNIQUE INDEX "LeafProductType_name_key" ON "LeafProductType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintLocation_name_key" ON "ComplaintLocation"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FertecMachineType_name_key" ON "FertecMachineType"("name");

-- CreateIndex
CREATE INDEX "_BusinessUnitCallerTypes_B_index" ON "_BusinessUnitCallerTypes"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitMachineTypes_B_index" ON "_BusinessUnitMachineTypes"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitDealerships_B_index" ON "_BusinessUnitDealerships"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitInquiryAreas_B_index" ON "_BusinessUnitInquiryAreas"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitResponseReasons_B_index" ON "_BusinessUnitResponseReasons"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitContactChannels_B_index" ON "_BusinessUnitContactChannels"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitDurationRanges_B_index" ON "_BusinessUnitDurationRanges"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitUrgencyLevels_B_index" ON "_BusinessUnitUrgencyLevels"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitLeafProductTypes_B_index" ON "_BusinessUnitLeafProductTypes"("B");

-- CreateIndex
CREATE INDEX "_BusinessUnitFertecMachineTypes_B_index" ON "_BusinessUnitFertecMachineTypes"("B");

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_businessUnitId_fkey" FOREIGN KEY ("businessUnitId") REFERENCES "BusinessUnit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_handledById_fkey" FOREIGN KEY ("handledById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_callerTypeId_fkey" FOREIGN KEY ("callerTypeId") REFERENCES "CallerType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_machineTypeId_fkey" FOREIGN KEY ("machineTypeId") REFERENCES "MachineType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_dealershipId_fkey" FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_inquiryAreaId_fkey" FOREIGN KEY ("inquiryAreaId") REFERENCES "InquiryArea"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_responseReasonId_fkey" FOREIGN KEY ("responseReasonId") REFERENCES "ResponseReason"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_contactChannelId_fkey" FOREIGN KEY ("contactChannelId") REFERENCES "ContactChannel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_durationRangeId_fkey" FOREIGN KEY ("durationRangeId") REFERENCES "DurationRange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallRecord" ADD CONSTRAINT "CallRecord_urgencyLevelId_fkey" FOREIGN KEY ("urgencyLevelId") REFERENCES "UrgencyLevel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitCallerTypes" ADD CONSTRAINT "_BusinessUnitCallerTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitCallerTypes" ADD CONSTRAINT "_BusinessUnitCallerTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "CallerType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitMachineTypes" ADD CONSTRAINT "_BusinessUnitMachineTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitMachineTypes" ADD CONSTRAINT "_BusinessUnitMachineTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "MachineType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitDealerships" ADD CONSTRAINT "_BusinessUnitDealerships_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitDealerships" ADD CONSTRAINT "_BusinessUnitDealerships_B_fkey" FOREIGN KEY ("B") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitInquiryAreas" ADD CONSTRAINT "_BusinessUnitInquiryAreas_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitInquiryAreas" ADD CONSTRAINT "_BusinessUnitInquiryAreas_B_fkey" FOREIGN KEY ("B") REFERENCES "InquiryArea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitResponseReasons" ADD CONSTRAINT "_BusinessUnitResponseReasons_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitResponseReasons" ADD CONSTRAINT "_BusinessUnitResponseReasons_B_fkey" FOREIGN KEY ("B") REFERENCES "ResponseReason"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitContactChannels" ADD CONSTRAINT "_BusinessUnitContactChannels_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitContactChannels" ADD CONSTRAINT "_BusinessUnitContactChannels_B_fkey" FOREIGN KEY ("B") REFERENCES "ContactChannel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitDurationRanges" ADD CONSTRAINT "_BusinessUnitDurationRanges_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitDurationRanges" ADD CONSTRAINT "_BusinessUnitDurationRanges_B_fkey" FOREIGN KEY ("B") REFERENCES "DurationRange"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitUrgencyLevels" ADD CONSTRAINT "_BusinessUnitUrgencyLevels_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitUrgencyLevels" ADD CONSTRAINT "_BusinessUnitUrgencyLevels_B_fkey" FOREIGN KEY ("B") REFERENCES "UrgencyLevel"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitLeafProductTypes" ADD CONSTRAINT "_BusinessUnitLeafProductTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitLeafProductTypes" ADD CONSTRAINT "_BusinessUnitLeafProductTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "LeafProductType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitFertecMachineTypes" ADD CONSTRAINT "_BusinessUnitFertecMachineTypes_A_fkey" FOREIGN KEY ("A") REFERENCES "BusinessUnit"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BusinessUnitFertecMachineTypes" ADD CONSTRAINT "_BusinessUnitFertecMachineTypes_B_fkey" FOREIGN KEY ("B") REFERENCES "FertecMachineType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "FertecMachineType" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FertecMachineType_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FertecMachineType_name_key" ON "FertecMachineType"("name");

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

-- CreateIndex
CREATE UNIQUE INDEX "LeafProductType_name_key" ON "LeafProductType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "ComplaintLocation_name_key" ON "ComplaintLocation"("name");

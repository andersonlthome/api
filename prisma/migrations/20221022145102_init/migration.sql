-- CreateTable
CREATE TABLE "Pool" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "address" VARCHAR(255) NOT NULL,
    "token0Id" INTEGER NOT NULL,
    "token1Id" INTEGER NOT NULL,

    CONSTRAINT "Pool_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "symbol" TEXT,
    "logoURL" TEXT,
    "address" VARCHAR(255) NOT NULL,
    "network" INTEGER NOT NULL,
    "standard" TEXT NOT NULL DEFAULT 'ERC20',
    "projectId" INTEGER NOT NULL,

    CONSTRAINT "Token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Price" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "priceToken1" DOUBLE PRECISION NOT NULL,
    "priceToken2" DOUBLE PRECISION NOT NULL,
    "poolId" INTEGER NOT NULL,

    CONSTRAINT "Price_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Pool_token0Id_idx" ON "Pool"("token0Id");

-- CreateIndex
CREATE INDEX "Pool_token1Id_idx" ON "Pool"("token1Id");

-- CreateIndex
CREATE UNIQUE INDEX "Token_address_key" ON "Token"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Token_projectId_key" ON "Token"("projectId");

-- CreateIndex
CREATE INDEX "Token_projectId_idx" ON "Token"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "Price_poolId_key" ON "Price"("poolId");

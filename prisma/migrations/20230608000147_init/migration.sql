-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('PENDING', 'APPROVED', 'REFUSED');

-- CreateTable
CREATE TABLE "credentials" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user" VARCHAR(255) NOT NULL,
    "hash" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credentials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "holders" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "document" VARCHAR(30) NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "holders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "holder_id" UUID NOT NULL,
    "number" VARCHAR(21) NOT NULL,
    "branch" VARCHAR(6) NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL,
    "active" BOOLEAN NOT NULL,
    "blocked" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transfers" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "account_id" UUID NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "credit" BOOLEAN NOT NULL,
    "status" "TransferStatus" NOT NULL,
    "message" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "transfers_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "holders_document_key" ON "holders"("document");

-- AddForeignKey
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_holder_id_fkey" FOREIGN KEY ("holder_id") REFERENCES "holders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transfers" ADD CONSTRAINT "transfers_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

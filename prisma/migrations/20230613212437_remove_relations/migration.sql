-- DropForeignKey
ALTER TABLE "accounts" DROP CONSTRAINT "accounts_holder_id_fkey";

-- DropForeignKey
ALTER TABLE "transfers" DROP CONSTRAINT "transfers_account_id_fkey";

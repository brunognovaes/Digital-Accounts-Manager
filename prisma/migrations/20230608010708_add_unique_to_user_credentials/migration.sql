/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `credentials` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "credentials_user_key" ON "credentials"("user");

/*
  Warnings:

  - You are about to drop the column `feelings` on the `Post` table. All the data in the column will be lost.
  - You are about to drop the column `twoFactor` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Post" DROP COLUMN "feelings",
ADD COLUMN     "feelingsEmoji" TEXT,
ADD COLUMN     "feelingsText" TEXT,
ADD COLUMN     "feelingsType" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "twoFactor",
ADD COLUMN     "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "twoFactorSecret" TEXT DEFAULT '';

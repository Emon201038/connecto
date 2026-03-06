/*
  Warnings:

  - Changed the type of `type` on the `Entity` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EntityType" AS ENUM ('HASHTAG', 'MENTION');

-- AlterTable
ALTER TABLE "Entity" DROP COLUMN "type",
ADD COLUMN     "type" "EntityType" NOT NULL;

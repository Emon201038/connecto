/*
  Warnings:

  - A unique constraint covering the columns `[userId,reactionFor,targetId,type]` on the table `Reaction` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Reaction_userId_targetId_reactionFor_type_idx";

-- AlterTable
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Reaction_id_key";

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_userId_reactionFor_targetId_type_key" ON "Reaction"("userId", "reactionFor", "targetId", "type");

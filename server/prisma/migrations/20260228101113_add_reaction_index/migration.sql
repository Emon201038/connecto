/*
  Warnings:

  - Added the required column `reactionFor` to the `Reaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetId` to the `Reaction` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ReactionFor" AS ENUM ('POST', 'MESSAGE', 'COMMENT');

-- AlterTable
ALTER TABLE "Reaction" ADD COLUMN     "reactionFor" "ReactionFor" NOT NULL,
ADD COLUMN     "targetId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Reaction_userId_targetId_reactionFor_type_idx" ON "Reaction"("userId", "targetId", "reactionFor", "type");

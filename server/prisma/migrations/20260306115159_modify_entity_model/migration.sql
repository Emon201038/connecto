/*
  Warnings:

  - You are about to drop the `CommentEntity` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `PostEntity` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CommentEntity" DROP CONSTRAINT "CommentEntity_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostEntity" DROP CONSTRAINT "PostEntity_hashtagId_fkey";

-- DropForeignKey
ALTER TABLE "PostEntity" DROP CONSTRAINT "PostEntity_postId_fkey";

-- DropForeignKey
ALTER TABLE "PostEntity" DROP CONSTRAINT "PostEntity_userId_fkey";

-- DropTable
DROP TABLE "CommentEntity";

-- DropTable
DROP TABLE "PostEntity";

-- DropEnum
DROP TYPE "EntityModel";

-- CreateTable
CREATE TABLE "Entity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "offset" INTEGER NOT NULL,
    "end" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "userId" TEXT,
    "hashtagId" TEXT,
    "postId" TEXT,
    "commentId" TEXT,

    CONSTRAINT "Entity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_hashtagId_fkey" FOREIGN KEY ("hashtagId") REFERENCES "Hashtag"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entity" ADD CONSTRAINT "Entity_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

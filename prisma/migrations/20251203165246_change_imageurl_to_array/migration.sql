/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `PostBlock` table. All the data in the column will be lost.
  - You are about to drop the `PostImage` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."PostImage" DROP CONSTRAINT "PostImage_postId_fkey";

-- AlterTable
ALTER TABLE "PostBlock" DROP COLUMN "imageUrl",
ADD COLUMN     "imageUrls" TEXT[];

-- DropTable
DROP TABLE "public"."PostImage";

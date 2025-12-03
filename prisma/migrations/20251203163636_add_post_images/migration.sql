-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "fechaEfemeride" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "PostImage" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "caption" TEXT,

    CONSTRAINT "PostImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PostImage_postId_order_idx" ON "PostImage"("postId", "order");

-- AddForeignKey
ALTER TABLE "PostImage" ADD CONSTRAINT "PostImage_postId_fkey" FOREIGN KEY ("postId") REFERENCES "Post"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AlterTable
ALTER TABLE "public"."articles" ADD COLUMN     "category_id" TEXT;

-- CreateIndex
CREATE INDEX "articles_category_id_idx" ON "public"."articles"("category_id");

-- AddForeignKey
ALTER TABLE "public"."articles" ADD CONSTRAINT "articles_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

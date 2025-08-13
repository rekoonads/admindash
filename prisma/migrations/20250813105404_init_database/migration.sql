-- CreateEnum
CREATE TYPE "public"."article_status" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'SCHEDULED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "public"."article_type" AS ENUM ('NEWS', 'REVIEW', 'GUIDE', 'FEATURE', 'INTERVIEW', 'OPINION', 'VIDEO', 'WIKI', 'LIST', 'ANIME', 'COMICS', 'COSPLAY', 'ESPORTS', 'TECH', 'SCIENCE');

-- CreateEnum
CREATE TYPE "public"."banner_position" AS ENUM ('TOP', 'BOTTOM', 'SIDEBAR', 'HERO', 'INLINE');

-- CreateEnum
CREATE TYPE "public"."genre" AS ENUM ('ACTION', 'ADVENTURE', 'RPG', 'STRATEGY', 'SIMULATION', 'SPORTS', 'RACING', 'FIGHTING', 'PUZZLE', 'HORROR', 'SHOOTER', 'PLATFORMER', 'MMO', 'INDIE', 'CASUAL');

-- CreateEnum
CREATE TYPE "public"."media_type" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "public"."platform" AS ENUM ('PC', 'PS5', 'PS4', 'XBOX_SERIES', 'XBOX_ONE', 'NINTENDO_SWITCH', 'MOBILE_IOS', 'MOBILE_ANDROID', 'VR', 'STEAM_DECK');

-- CreateEnum
CREATE TYPE "public"."reaction_type" AS ENUM ('LIKE', 'LOVE', 'LAUGH', 'ANGRY', 'SAD');

-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "first_name" TEXT,
    "last_name" TEXT,
    "username" TEXT,
    "avatar" TEXT,
    "role" "public"."user_role" NOT NULL DEFAULT 'EDITOR',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "icon" TEXT,
    "parent_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "author" TEXT NOT NULL DEFAULT 'Admin',
    "status" "public"."article_status" NOT NULL DEFAULT 'DRAFT',
    "type" "public"."article_type" NOT NULL DEFAULT 'NEWS',
    "category" TEXT NOT NULL DEFAULT 'latest-news',
    "views" INTEGER NOT NULL DEFAULT 0,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "featured_image" TEXT,
    "slug" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "game_title" TEXT,
    "release_date" TIMESTAMP(3),
    "review_score" DOUBLE PRECISION,
    "is_breaking" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "read_time" INTEGER,
    "published_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "video_url" TEXT,
    "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "developer" TEXT,
    "is_sponsored" BOOLEAN NOT NULL DEFAULT false,
    "meta_description" TEXT,
    "meta_title" TEXT,
    "meta_keywords" TEXT,
    "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "publisher" TEXT,
    "shares" INTEGER NOT NULL DEFAULT 0,
    "subcategory" TEXT,
    "verdict" TEXT,
    "purchase_link" TEXT,
    "price" TEXT,
    "platform" "public"."platform"[] DEFAULT ARRAY[]::"public"."platform"[],
    "genre" "public"."genre"[] DEFAULT ARRAY[]::"public"."genre"[],

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."article_categories" (
    "id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "color" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "email" TEXT,
    "website" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "article_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "type" "public"."media_type" NOT NULL,
    "size" INTEGER,
    "alt" TEXT,
    "caption" TEXT,
    "article_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."banners" (
    "id" TEXT NOT NULL,
    "page" TEXT NOT NULL DEFAULT 'home',
    "title" TEXT,
    "content" TEXT,
    "image_url" TEXT,
    "link_url" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "position" "public"."banner_position" NOT NULL,
    "end_date" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3),

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."games" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "developer" TEXT,
    "publisher" TEXT,
    "release_date" TIMESTAMP(3),
    "rating" TEXT,
    "metacritic" INTEGER,
    "cover_image" TEXT,
    "screenshots" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "trailer" TEXT,
    "website" TEXT,
    "steam_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "platforms" "public"."platform"[] DEFAULT ARRAY[]::"public"."platform"[],
    "genres" "public"."genre"[] DEFAULT ARRAY[]::"public"."genre"[],

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reactions" (
    "id" TEXT NOT NULL,
    "type" "public"."reaction_type" NOT NULL,
    "user_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reactions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerk_id_key" ON "public"."users"("clerk_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_clerk_id_idx" ON "public"."users"("clerk_id");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "public"."users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "public"."categories"("name");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_is_active_idx" ON "public"."categories"("is_active");

-- CreateIndex
CREATE INDEX "categories_parent_id_idx" ON "public"."categories"("parent_id");

-- CreateIndex
CREATE INDEX "categories_slug_idx" ON "public"."categories"("slug");

-- CreateIndex
CREATE INDEX "categories_sort_order_idx" ON "public"."categories"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "public"."articles"("slug");

-- CreateIndex
CREATE INDEX "articles_category_idx" ON "public"."articles"("category");

-- CreateIndex
CREATE INDEX "articles_created_at_idx" ON "public"."articles"("created_at" DESC);

-- CreateIndex
CREATE INDEX "articles_game_title_idx" ON "public"."articles"("game_title");

-- CreateIndex
CREATE INDEX "articles_genre_idx" ON "public"."articles"("genre");

-- CreateIndex
CREATE INDEX "articles_is_breaking_idx" ON "public"."articles"("is_breaking");

-- CreateIndex
CREATE INDEX "articles_is_featured_idx" ON "public"."articles"("is_featured");

-- CreateIndex
CREATE INDEX "articles_platform_idx" ON "public"."articles"("platform");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "public"."articles"("published_at" DESC);

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "public"."articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "public"."articles"("status");

-- CreateIndex
CREATE INDEX "articles_type_idx" ON "public"."articles"("type");

-- CreateIndex
CREATE INDEX "articles_views_idx" ON "public"."articles"("views" DESC);

-- CreateIndex
CREATE INDEX "article_categories_article_id_idx" ON "public"."article_categories"("article_id");

-- CreateIndex
CREATE INDEX "article_categories_category_idx" ON "public"."article_categories"("category");

-- CreateIndex
CREATE UNIQUE INDEX "article_categories_article_id_category_key" ON "public"."article_categories"("article_id", "category");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "tags_usage_count_idx" ON "public"."tags"("usage_count" DESC);

-- CreateIndex
CREATE INDEX "comments_article_id_idx" ON "public"."comments"("article_id");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "public"."comments"("created_at" DESC);

-- CreateIndex
CREATE INDEX "comments_is_approved_idx" ON "public"."comments"("is_approved");

-- CreateIndex
CREATE INDEX "comments_user_id_idx" ON "public"."comments"("user_id");

-- CreateIndex
CREATE INDEX "media_article_id_idx" ON "public"."media"("article_id");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "public"."media"("type");

-- CreateIndex
CREATE INDEX "banners_is_active_idx" ON "public"."banners"("is_active");

-- CreateIndex
CREATE INDEX "banners_page_idx" ON "public"."banners"("page");

-- CreateIndex
CREATE INDEX "banners_position_idx" ON "public"."banners"("position");

-- CreateIndex
CREATE INDEX "banners_sort_order_idx" ON "public"."banners"("sort_order");

-- CreateIndex
CREATE UNIQUE INDEX "games_slug_key" ON "public"."games"("slug");

-- CreateIndex
CREATE INDEX "games_genres_idx" ON "public"."games"("genres");

-- CreateIndex
CREATE INDEX "games_is_active_idx" ON "public"."games"("is_active");

-- CreateIndex
CREATE INDEX "games_platforms_idx" ON "public"."games"("platforms");

-- CreateIndex
CREATE INDEX "games_release_date_idx" ON "public"."games"("release_date");

-- CreateIndex
CREATE INDEX "games_slug_idx" ON "public"."games"("slug");

-- CreateIndex
CREATE INDEX "reactions_article_id_idx" ON "public"."reactions"("article_id");

-- CreateIndex
CREATE INDEX "reactions_user_id_idx" ON "public"."reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_user_id_article_id_type_key" ON "public"."reactions"("user_id", "article_id", "type");

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."article_categories" ADD CONSTRAINT "article_categories_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

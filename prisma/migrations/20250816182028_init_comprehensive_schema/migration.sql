-- CreateEnum
CREATE TYPE "public"."user_role" AS ENUM ('ADMIN', 'EDITOR', 'AUTHOR', 'CONTRIBUTOR', 'MODERATOR', 'USER');

-- CreateEnum
CREATE TYPE "public"."article_status" AS ENUM ('DRAFT', 'PUBLISHED', 'HIDDEN', 'SCHEDULED', 'ARCHIVED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "public"."article_type" AS ENUM ('NEWS', 'REVIEW', 'GUIDE', 'FEATURE', 'INTERVIEW', 'OPINION', 'VIDEO', 'WIKI', 'LIST', 'SPOTLIGHT', 'ANIME', 'MANGA', 'COMICS', 'COSPLAY', 'ESPORTS', 'TECH', 'SCIENCE', 'MOVIE_REVIEW', 'TV_REVIEW', 'GAME_REVIEW', 'TECH_REVIEW', 'COMIC_REVIEW');

-- CreateEnum
CREATE TYPE "public"."reaction_type" AS ENUM ('LIKE', 'LOVE', 'LAUGH', 'ANGRY', 'SAD', 'FIRE', 'HEART_EYES');

-- CreateEnum
CREATE TYPE "public"."comment_reaction_type" AS ENUM ('LIKE', 'DISLIKE', 'LOVE', 'LAUGH');

-- CreateEnum
CREATE TYPE "public"."notification_type" AS ENUM ('COMMENT', 'LIKE', 'FOLLOW', 'MENTION', 'ARTICLE_PUBLISHED', 'COMMENT_REPLY', 'SYSTEM', 'PROMOTION');

-- CreateEnum
CREATE TYPE "public"."activity_type" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'VIEW', 'LIKE', 'SHARE', 'COMMENT', 'FOLLOW', 'UNFOLLOW', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "public"."report_type" AS ENUM ('SPAM', 'HARASSMENT', 'INAPPROPRIATE_CONTENT', 'COPYRIGHT', 'MISINFORMATION', 'OTHER');

-- CreateEnum
CREATE TYPE "public"."report_status" AS ENUM ('PENDING', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "public"."share_platform" AS ENUM ('FACEBOOK', 'TWITTER', 'LINKEDIN', 'REDDIT', 'WHATSAPP', 'TELEGRAM', 'EMAIL', 'COPY_LINK');

-- CreateEnum
CREATE TYPE "public"."media_type" AS ENUM ('IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'GIF');

-- CreateEnum
CREATE TYPE "public"."banner_position" AS ENUM ('TOP', 'BOTTOM', 'SIDEBAR', 'HERO', 'INLINE', 'POPUP');

-- CreateEnum
CREATE TYPE "public"."platform" AS ENUM ('PC', 'PS5', 'PS4', 'XBOX_SERIES', 'XBOX_ONE', 'NINTENDO_SWITCH', 'MOBILE_IOS', 'MOBILE_ANDROID', 'VR', 'STEAM_DECK', 'WEB');

-- CreateEnum
CREATE TYPE "public"."genre" AS ENUM ('ACTION', 'ADVENTURE', 'RPG', 'STRATEGY', 'SIMULATION', 'SPORTS', 'RACING', 'FIGHTING', 'PUZZLE', 'HORROR', 'SHOOTER', 'PLATFORMER', 'MMO', 'INDIE', 'CASUAL', 'SURVIVAL', 'SANDBOX');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerk_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT,
    "first_name" TEXT,
    "last_name" TEXT,
    "display_name" TEXT,
    "avatar" TEXT,
    "bio" TEXT,
    "website" TEXT,
    "location" TEXT,
    "birth_date" TIMESTAMP(3),
    "phone" TEXT,
    "role" "public"."user_role" NOT NULL DEFAULT 'USER',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "last_login" TIMESTAMP(3),
    "login_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "social_links" JSONB,
    "privacy_settings" JSONB,
    "notification_prefs" JSONB,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."articles" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "excerpt" TEXT,
    "slug" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "status" "public"."article_status" NOT NULL DEFAULT 'DRAFT',
    "type" "public"."article_type" NOT NULL DEFAULT 'NEWS',
    "content_type" TEXT NOT NULL DEFAULT 'latest-updates',
    "meta_title" TEXT,
    "meta_description" TEXT,
    "meta_keywords" TEXT,
    "featured_image" TEXT,
    "gallery_images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "video_url" TEXT,
    "audio_url" TEXT,
    "game_title" TEXT,
    "developer" TEXT,
    "publisher" TEXT,
    "release_date" TIMESTAMP(3),
    "review_score" DOUBLE PRECISION,
    "pros" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cons" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "verdict" TEXT,
    "purchase_link" TEXT,
    "price" TEXT,
    "platforms" "public"."platform"[] DEFAULT ARRAY[]::"public"."platform"[],
    "genres" "public"."genre"[] DEFAULT ARRAY[]::"public"."genre"[],
    "views_count" INTEGER NOT NULL DEFAULT 0,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "shares_count" INTEGER NOT NULL DEFAULT 0,
    "comments_count" INTEGER NOT NULL DEFAULT 0,
    "bookmarks_count" INTEGER NOT NULL DEFAULT 0,
    "is_breaking" BOOLEAN NOT NULL DEFAULT false,
    "is_featured" BOOLEAN NOT NULL DEFAULT false,
    "show_on_homepage" BOOLEAN NOT NULL DEFAULT false,
    "is_sponsored" BOOLEAN NOT NULL DEFAULT false,
    "is_premium" BOOLEAN NOT NULL DEFAULT false,
    "published_at" TIMESTAMP(3),
    "scheduled_at" TIMESTAMP(3),
    "read_time" INTEGER,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "category_tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."comments" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "author_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "parent_id" TEXT,
    "is_approved" BOOLEAN NOT NULL DEFAULT true,
    "is_pinned" BOOLEAN NOT NULL DEFAULT false,
    "is_edited" BOOLEAN NOT NULL DEFAULT false,
    "likes_count" INTEGER NOT NULL DEFAULT 0,
    "replies_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "public"."comment_reactions" (
    "id" TEXT NOT NULL,
    "type" "public"."comment_reaction_type" NOT NULL,
    "user_id" TEXT NOT NULL,
    "comment_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comment_reactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."bookmarks" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "article_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."follows" (
    "id" TEXT NOT NULL,
    "follower_id" TEXT NOT NULL,
    "following_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "follows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."shares" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "article_id" TEXT NOT NULL,
    "platform" "public"."share_platform" NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "shares_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."views" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "article_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "duration" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "type" "public"."notification_type" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "article_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "duration" INTEGER,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."activity_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "action" "public"."activity_type" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "metadata" JSONB,
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_preferences" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_preferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."reports" (
    "id" TEXT NOT NULL,
    "reporter_id" TEXT NOT NULL,
    "reported_user_id" TEXT,
    "article_id" TEXT,
    "comment_id" TEXT,
    "type" "public"."report_type" NOT NULL,
    "reason" TEXT NOT NULL,
    "description" TEXT,
    "status" "public"."report_status" NOT NULL DEFAULT 'PENDING',
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."media" (
    "id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_name" TEXT,
    "url" TEXT NOT NULL,
    "type" "public"."media_type" NOT NULL,
    "size" INTEGER,
    "width" INTEGER,
    "height" INTEGER,
    "duration" INTEGER,
    "alt_text" TEXT,
    "caption" TEXT,
    "article_id" TEXT,
    "user_id" TEXT,
    "is_public" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."tags" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "color" TEXT,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "is_trending" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "public"."banners" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "image_url" TEXT,
    "link_url" TEXT,
    "position" "public"."banner_position" NOT NULL,
    "page" TEXT NOT NULL DEFAULT 'home',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "start_date" TIMESTAMP(3),
    "end_date" TIMESTAMP(3),
    "sort_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

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
    "trailer_url" TEXT,
    "website_url" TEXT,
    "steam_id" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "platforms" "public"."platform"[] DEFAULT ARRAY[]::"public"."platform"[],
    "genres" "public"."genre"[] DEFAULT ARRAY[]::"public"."genre"[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "games_pkey" PRIMARY KEY ("id")
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
CREATE INDEX "users_username_idx" ON "public"."users"("username");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "public"."users"("role");

-- CreateIndex
CREATE INDEX "users_is_active_idx" ON "public"."users"("is_active");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "public"."users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "public"."articles"("slug");

-- CreateIndex
CREATE INDEX "articles_author_id_idx" ON "public"."articles"("author_id");

-- CreateIndex
CREATE INDEX "articles_slug_idx" ON "public"."articles"("slug");

-- CreateIndex
CREATE INDEX "articles_status_idx" ON "public"."articles"("status");

-- CreateIndex
CREATE INDEX "articles_type_idx" ON "public"."articles"("type");

-- CreateIndex
CREATE INDEX "articles_content_type_idx" ON "public"."articles"("content_type");

-- CreateIndex
CREATE INDEX "articles_published_at_idx" ON "public"."articles"("published_at");

-- CreateIndex
CREATE INDEX "articles_created_at_idx" ON "public"."articles"("created_at");

-- CreateIndex
CREATE INDEX "articles_is_featured_idx" ON "public"."articles"("is_featured");

-- CreateIndex
CREATE INDEX "articles_show_on_homepage_idx" ON "public"."articles"("show_on_homepage");

-- CreateIndex
CREATE INDEX "articles_tags_idx" ON "public"."articles"("tags");

-- CreateIndex
CREATE INDEX "articles_views_count_idx" ON "public"."articles"("views_count");

-- CreateIndex
CREATE INDEX "articles_likes_count_idx" ON "public"."articles"("likes_count");

-- CreateIndex
CREATE INDEX "comments_author_id_idx" ON "public"."comments"("author_id");

-- CreateIndex
CREATE INDEX "comments_article_id_idx" ON "public"."comments"("article_id");

-- CreateIndex
CREATE INDEX "comments_parent_id_idx" ON "public"."comments"("parent_id");

-- CreateIndex
CREATE INDEX "comments_created_at_idx" ON "public"."comments"("created_at");

-- CreateIndex
CREATE INDEX "comments_is_approved_idx" ON "public"."comments"("is_approved");

-- CreateIndex
CREATE INDEX "reactions_article_id_idx" ON "public"."reactions"("article_id");

-- CreateIndex
CREATE INDEX "reactions_user_id_idx" ON "public"."reactions"("user_id");

-- CreateIndex
CREATE INDEX "reactions_type_idx" ON "public"."reactions"("type");

-- CreateIndex
CREATE UNIQUE INDEX "reactions_user_id_article_id_key" ON "public"."reactions"("user_id", "article_id");

-- CreateIndex
CREATE INDEX "comment_reactions_comment_id_idx" ON "public"."comment_reactions"("comment_id");

-- CreateIndex
CREATE INDEX "comment_reactions_user_id_idx" ON "public"."comment_reactions"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "comment_reactions_user_id_comment_id_key" ON "public"."comment_reactions"("user_id", "comment_id");

-- CreateIndex
CREATE INDEX "bookmarks_user_id_idx" ON "public"."bookmarks"("user_id");

-- CreateIndex
CREATE INDEX "bookmarks_article_id_idx" ON "public"."bookmarks"("article_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmarks_user_id_article_id_key" ON "public"."bookmarks"("user_id", "article_id");

-- CreateIndex
CREATE INDEX "follows_follower_id_idx" ON "public"."follows"("follower_id");

-- CreateIndex
CREATE INDEX "follows_following_id_idx" ON "public"."follows"("following_id");

-- CreateIndex
CREATE UNIQUE INDEX "follows_follower_id_following_id_key" ON "public"."follows"("follower_id", "following_id");

-- CreateIndex
CREATE INDEX "shares_user_id_idx" ON "public"."shares"("user_id");

-- CreateIndex
CREATE INDEX "shares_article_id_idx" ON "public"."shares"("article_id");

-- CreateIndex
CREATE INDEX "shares_platform_idx" ON "public"."shares"("platform");

-- CreateIndex
CREATE INDEX "shares_created_at_idx" ON "public"."shares"("created_at");

-- CreateIndex
CREATE INDEX "views_user_id_idx" ON "public"."views"("user_id");

-- CreateIndex
CREATE INDEX "views_article_id_idx" ON "public"."views"("article_id");

-- CreateIndex
CREATE INDEX "views_created_at_idx" ON "public"."views"("created_at");

-- CreateIndex
CREATE INDEX "notifications_user_id_idx" ON "public"."notifications"("user_id");

-- CreateIndex
CREATE INDEX "notifications_is_read_idx" ON "public"."notifications"("is_read");

-- CreateIndex
CREATE INDEX "notifications_created_at_idx" ON "public"."notifications"("created_at");

-- CreateIndex
CREATE INDEX "notifications_type_idx" ON "public"."notifications"("type");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_session_id_key" ON "public"."user_sessions"("session_id");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_idx" ON "public"."user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_sessions_started_at_idx" ON "public"."user_sessions"("started_at");

-- CreateIndex
CREATE INDEX "activity_logs_user_id_idx" ON "public"."activity_logs"("user_id");

-- CreateIndex
CREATE INDEX "activity_logs_action_idx" ON "public"."activity_logs"("action");

-- CreateIndex
CREATE INDEX "activity_logs_entity_type_idx" ON "public"."activity_logs"("entity_type");

-- CreateIndex
CREATE INDEX "activity_logs_created_at_idx" ON "public"."activity_logs"("created_at");

-- CreateIndex
CREATE INDEX "user_preferences_user_id_idx" ON "public"."user_preferences"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_preferences_user_id_key_key" ON "public"."user_preferences"("user_id", "key");

-- CreateIndex
CREATE INDEX "reports_reporter_id_idx" ON "public"."reports"("reporter_id");

-- CreateIndex
CREATE INDEX "reports_status_idx" ON "public"."reports"("status");

-- CreateIndex
CREATE INDEX "reports_created_at_idx" ON "public"."reports"("created_at");

-- CreateIndex
CREATE INDEX "media_article_id_idx" ON "public"."media"("article_id");

-- CreateIndex
CREATE INDEX "media_type_idx" ON "public"."media"("type");

-- CreateIndex
CREATE INDEX "media_created_at_idx" ON "public"."media"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "public"."tags"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tags_slug_key" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "tags_slug_idx" ON "public"."tags"("slug");

-- CreateIndex
CREATE INDEX "tags_usage_count_idx" ON "public"."tags"("usage_count");

-- CreateIndex
CREATE INDEX "tags_is_trending_idx" ON "public"."tags"("is_trending");

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
CREATE INDEX "games_slug_idx" ON "public"."games"("slug");

-- CreateIndex
CREATE INDEX "games_is_active_idx" ON "public"."games"("is_active");

-- CreateIndex
CREATE INDEX "games_platforms_idx" ON "public"."games"("platforms");

-- CreateIndex
CREATE INDEX "games_genres_idx" ON "public"."games"("genres");

-- CreateIndex
CREATE INDEX "games_release_date_idx" ON "public"."games"("release_date");

-- AddForeignKey
ALTER TABLE "public"."articles" ADD CONSTRAINT "articles_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comments" ADD CONSTRAINT "comments_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reactions" ADD CONSTRAINT "reactions_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_reactions" ADD CONSTRAINT "comment_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."comment_reactions" ADD CONSTRAINT "comment_reactions_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookmarks" ADD CONSTRAINT "bookmarks_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."bookmarks" ADD CONSTRAINT "bookmarks_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_follower_id_fkey" FOREIGN KEY ("follower_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."follows" ADD CONSTRAINT "follows_following_id_fkey" FOREIGN KEY ("following_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shares" ADD CONSTRAINT "shares_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."shares" ADD CONSTRAINT "shares_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."views" ADD CONSTRAINT "views_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."views" ADD CONSTRAINT "views_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."notifications" ADD CONSTRAINT "notifications_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."activity_logs" ADD CONSTRAINT "activity_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_preferences" ADD CONSTRAINT "user_preferences_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reporter_id_fkey" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_reported_user_id_fkey" FOREIGN KEY ("reported_user_id") REFERENCES "public"."users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."reports" ADD CONSTRAINT "reports_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."comments"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."media" ADD CONSTRAINT "media_article_id_fkey" FOREIGN KEY ("article_id") REFERENCES "public"."articles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."categories" ADD CONSTRAINT "categories_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

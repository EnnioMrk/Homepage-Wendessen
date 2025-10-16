# has_article Field Removal

**Date:** October 16, 2025

## Overview

Successfully removed the `has_article` / `hasArticle` field from the news system. This field is no longer needed because all news articles now store their content in JSON format (Slate.js Descendant[]) in the `content` column.

## Changes Made

### 1. Database Migration

**Script:** `scripts/remove-has-article.ts`

- Dropped the `has_article` column from the `news` table
- Migration completed successfully

### 2. TypeScript Interfaces Updated

**Files Modified:**
- `lib/database.ts` - Removed `hasArticle` from `NewsItem` interface and `convertToNewsItem` function
- `app/admin/news/AdminNews.tsx` - Removed `hasArticle` from `NewsItem` interface
- `app/admin/news/bearbeiten/[id]/page.tsx` - Removed `hasArticle` from `NewsArticle` interface and state
- `app/neuigkeiten/[id]/page.tsx` - Removed `has_article` from `NewsArticle` interface
- `app/components/NewsCard.tsx` - Removed `hasArticle` prop from `NewsCardProps`
- `app/components/NewsModal.tsx` - Removed `hasArticle` state variable

### 3. API Routes Updated

**Files Modified:**
- `app/api/admin/news/route.ts`
  - Removed `has_article` from SELECT queries
  - Removed `hasArticle` from request body parsing
  - Removed `has_article` from INSERT statements
  
- `app/api/admin/news/[id]/route.ts`
  - Removed `has_article` from SELECT queries
  - Removed `hasArticle` from request body parsing
  - Removed `has_article` from UPDATE statements

### 4. Component Logic Simplified

**Files Modified:**
- `app/components/NewsCard.tsx` - Always shows "Artikel lesen" link if articleId exists
- `app/components/NewsSection.tsx` - Removed `hasArticle` prop from `NewsCard` usage
- `app/components/NewsModal.tsx` - Always includes rich text editor (removed checkbox)
- `app/admin/news/AdminNews.tsx` - Removed "Vollständiger Artikel" badge display
- `app/admin/news/bearbeiten/[id]/page.tsx` - Removed hasArticle checkbox and conditional editor display
- `app/admin/news/erstellen/page.tsx` - Removed `hasArticle` from API request payload

### 5. Edit Page Simplification

The news edit page now:
- Always shows the rich text editor (no conditional display)
- Always shows the preview button
- Always saves the `contentJson` (no conditional logic)
- Removed the "Vollständiger Artikel mit eigenem Inhalt" checkbox

## Rationale

Since all news articles now use JSON content storage (after the `content_json` → `content` migration), the distinction between articles with and without full content is obsolete. Every news item is effectively a "full article" with rich text content.

This simplification:
- Reduces database complexity
- Removes unnecessary conditional logic throughout the codebase
- Provides a consistent user experience
- Makes the admin interface cleaner

## Verification

- ✅ Database migration completed
- ✅ All TypeScript interfaces updated
- ✅ All API routes updated
- ✅ All components updated
- ✅ No TypeScript compilation errors
- ✅ No remaining references to `has_article` or `hasArticle` in app code

## Notes

- Migration scripts (in `/scripts` folder) still contain historical references to `has_article` but these are not used in the application code
- Documentation files may contain references but these are historical records

# Al Irshad (alirshad.in)

A modern digital publication platform for Malayalam literature, essays, cultural critique, and philosophy. Built with **Next.js 16+ (App Router)**, **TypeScript**, **Tailwind CSS**, **Supabase**, **Cloudinary**, and **Tiptap**.

---

## 🌟 Key Features

### 📰 Public Publication Experience
- **Editorial Homepage (`/`)**:
  - Hero carousel with auto-sliding transitions, category badges, author attribution, and reading times.
  - Latest stories section, categorized blocks (Religion & Ethics, Culture & Heritage, Politics, Philosophy, Reviews).
  - Editorial newsletter subscription card with Midnight Surge gradient.
- **Article Detail View (`/post/[slug]`)**:
  - High-end Malayalam typography using **Noto Serif Malayalam**, blockquotes, headers, images, and embeds.
  - Sticky/interactive sidebar with **Like counter**, **Share buttons** (WhatsApp, X/Twitter, Facebook, Copy link), and **Font Resizer** (A, A+, A++).
  - Smooth **Reading Progress Bar** (Futurewave gradient) and automated **View Tracker** (`/api/track-view/:id`).
  - Author bio card with quick link to author index.
  - Interactive **Comments System** (Guest / Anonymous / Authenticated comments, edit, delete, and report).
- **Taxonomy & Discovery**:
  - **Category Archives (`/category/[slug]`)** covering desks: Feature, Article, Religion, Culture, Philosophy, Politics, Review, Book, Cinema, Interview, etc.
  - **Chronological Archive (`/archive`)** grouping publications by Year and Month.
  - **Authors Directory (`/authors`)** and **Author Profiles (`/author/[slug]`)**.
  - **Full-Text Live Search (`/search?q=...`)**.
- **Institutional Pages**:
  - **About Page (`/about`)**: Editorial mission statement.
  - **Contact & Submission Page (`/contact`)**: Pitch ideas and article proposals (`info@alirshad.in`).
  - **Auth Suite**: `/login` (with Admin CMS Access), `/signup`, `/forgot-password`.

### ✍️ Editorial CMS Backstage (`/dashboard`)
- **Dashboard Overview (`/dashboard`)**: Total views, likes, articles published, subscribers, and recent publication activity.
- **Tiptap Rich-Text Editor (`/dashboard/posts/new` & `/dashboard/posts/[id]/edit`)**:
  - Headings (H1, H2, H3), bold, italic, strikethrough, blockquotes, bullet & ordered lists, alignments.
  - Cloudinary image uploads & direct image embeds.
  - Reading time auto-calculator.
  - Slug generator and taxonomy tagging.
  - Featured in hero carousel toggle.
- **Article Catalog (`/dashboard/posts`)**: Manage publication states (`published`, `draft`, `archived`), edit, and delete.
- **Categories Manager (`/dashboard/categories`)**.
- **Comments Moderation (`/dashboard/comments`)**.
- **Newsletter Subscribers (`/dashboard/subscribers`)**.

---

## 🛠️ Stack & Architecture

| Layer | Technology | Purpose |
|---|---|---|
| **Frontend Framework** | **Next.js 16+ (App Router)** | Static rendering, dynamic routes, SEO metadata |
| **Language** | **TypeScript** | Strict type safety and data models |
| **Typography** | **Noto Serif Malayalam** | Editorial typography |
| **Styling & Theme** | **Tailwind CSS** | Royal Blue (`#0056FF`) & Soft Lavender design tokens |
| **Backend & Database** | **Supabase (PostgreSQL)** | Row-Level Security, relational schema, auth, triggers |
| **Image CDN** | **Cloudinary** | Responsive transformations, optimization, uploads |
| **Rich-Text Editor** | **Tiptap** | Editorial article authoring with custom formatting |
| **Deployment** | **Vercel** | Edge network and serverless functions |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Configure Environment
Copy `.env.example` to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-key

NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 3. Run Database Schema
Execute the SQL in `src/supabase/schema.sql` in your Supabase SQL Editor.

### 4. Run Locally
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000).

# Jannah Chic — Production eCommerce Platform

[![Live Site](https://img.shields.io/badge/Production-Live-success.svg?style=flat-square)](https://jannahchic.com)
[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014-black.svg?style=flat-square)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green.svg?style=flat-square)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20Atlas-darkgreen.svg?style=flat-square)](https://www.mongodb.com/)

**Jannah Chic** is a fully production-ready, high-performance, premium eCommerce platform designed for modern clothing brands. It features a stunning customer-facing storefront and a comprehensive, private administrative management panel.

🔗 **Production Live Storefront:** [https://jannahchic.com](https://jannahchic.com)

---

## ✨ Features & Architecture

### 🛍️ Premium Storefront
*   **Aesthetic Responsive Layouts:** Optimized for high-end styling with micro-animations, glassmorphism elements, and responsive grids.
*   **Intuitive Customer Experience:** Multi-option product filtering (categories, fabric materials, sizing, color swatches), wishlist favorites, and dynamic add-to-cart operations.
*   **Blazing-Fast Page Transitions:** Enabled with Next.js App Router static/dynamic optimization.

### 🛡️ Administrative Dashboard
*   **Store Metrics:** At-a-glance order statistics, sales, review logs, and customer overview.
*   **Dynamic Inventory Management:** Full CRUD capabilities for products (multiple image uploads, pricing, sale percentages, tag labels) and categories.
*   **Review Moderation:** Approve, filter, or moderate customer ratings and written reviews.
*   **CMS Controller:** Modify terms, policies, return rules, and homepage promotional sliders in real-time.

### ⚡ Enterprise-Grade Performance & SEO
*   **Incremental Static Regeneration (ISR):** Storefront items, homepage sliders, static pages, and product pages are cached at **Vercel's CDN Edge**. Clicks transition instantly (**~50ms loads**) while updating dynamically in the background every 10–30 seconds when changed.
*   **Google Search Console Integration:** Pushed dynamically compiled `<meta>` site ownership verification tags.
*   **Dynamic Sitemaps & Crawler Policies:** Auto-generates standard XML sitemaps at `/sitemap.xml` and custom rules via `/robots.txt` for organic Google search indexing.
*   **Express Trust Proxy Rate-Limiting:** Configured using secure proxy headers behind Vercel's edge hosting environment to prevent DDOS attempts without blocking legitimate users.

---

## 🛠️ Technology Stack

*   **Frontend:** Next.js 14 (App Router), React, Tailwind CSS, Lucide icons, Zustand (state management)
*   **Backend:** Node.js, Express.js (RESTful API), Mongoose ODM
*   **Database:** MongoDB Atlas (Cloud Cluster)
*   **Assets & Media:** Cloudinary API for high-resolution, responsive image optimization.
*   **Hosting & CI/CD:** Vercel (both frontend and API backend auto-deployed from GitHub)

---

## 📂 Project Structure

```bash
├── backend/                  # REST API server
│   ├── src/
│   │   ├── app.js            # Express app setup & route mapping
│   │   └── db.js             # Mongoose MongoDB connection
│   ├── clear_and_admin.js    # Utility script to clean DB and seed default admin
│   └── .env                  # Local backend configuration (secured)
│
├── frontend/                 # Customer storefront and Admin panel
│   ├── app/                  # Next.js App Router (pages & endpoints)
│   │   ├── sitemap.js        # Dynamic sitemap.xml generator
│   │   └── robots.js         # Dynamic robots.txt configuration
│   ├── components/           # Reusable UI & modular layout components
│   └── .env.local            # Local frontend configuration
```

---

## 🚀 Getting Started (Local Development)

### 1. Set Up the Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy the environment template and configure:
   ```bash
   cp .env.example .env
   ```
4. Start the development server (runs on `http://localhost:5000`):
   ```bash
   npm run dev
   ```

### 2. Set Up the Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set the backend API URL inside `.env.local`:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
   ```
4. Start the development server (runs on `http://localhost:3000`):
   ```bash
   npm run dev
   ```

---

## 🔒 Security & Deployment Notes

*   Ensure that all production secrets (MongoDB URIs, Cloudinary keys, JWT Secrets) are loaded directly into Vercel's environment variables dashboard and NEVER committed to GitHub.
*   The production MongoDB database connection uses strict URL-encoding for security credentials.

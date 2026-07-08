# Migration Log: From Local JSON to Neon Database

## Context
Originally, the portfolio project (`portfolio_v1`) stored project data in a local JSON file (`backend/projects.json`).  
The frontend “Work” page rendered projects by reading directly from this JSON file.  

This approach worked locally but had limitations:
- No centralized database for dynamic queries.
- Harder to scale or update projects without editing JSON.
- No persistence layer for future features (like messages/contact form).

---

## What Changed
We migrated project data from JSON into a **PostgreSQL database hosted on Neon**, integrated with Railway for deployment.

### Steps Completed
1. **Database Setup**
   - Created a Neon PostgreSQL instance in the Virginia region (to match Railway’s servers).
   - Added the connection string to `.env` as `DATABASE_URL`.

2. **Alembic & SQLAlchemy Integration**
   - Configured `alembic.ini` at the repo root.
   - Created migrations folder and linked `env.py` to `backend/app/db.py`.
   - Ran `alembic upgrade head` to generate the `projects` table.

3. **Seeding Data**
   - Built a one-time `seed_projects.py` script.
   - Loaded `projects.json` and inserted 4 projects into the Neon DB.
   - Verified row count matched JSON source.
   - Confirmed Flask service layer (`projects_service.py`) queries DB successfully.

4. **Environment Variables**
   - Added `DATABASE_URL` to Railway Variables tab.
   - Redeploy will connect the app to Neon DB in production.

---

## Current Status
- **Projects table exists in Neon DB.**
- **4 projects inserted successfully.**
- **Flask app now queries DB instead of JSON.**
- **Frontend “Work” page renders identically, but data is DB-backed.**

---

## File Cleanup
- Removed `projects.json` (no longer needed).
- Kept translation JSON files in `backend/app/translations` for localized frontend text.
- DB stores metadata (slug, stack, URLs, image paths).
- Translation files store actual text strings (titles, descriptions, UI labels).

---

## Summary
Successfully migrated from a **local JSON-based portfolio** to a **Neon-hosted PostgreSQL database**.  
The app now has a proper persistence layer, ready for scaling and new features, while keeping translations lightweight and separate.
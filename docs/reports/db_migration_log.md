# Migration Log: From Local JSON to Neon Database

## Context
Originally, the portfolio project (`portfolio_v1`) stored project metadata in a local JSON file inside `backend/app/repositories/projects.json`.  
The backend service read that JSON directly and the frontend rendered project cards from the resulting object list.

This setup worked for a static portfolio, but it was not ideal for a deployed backend with a database-backed persistence layer.

---

## What Changed
The project was refactored to use SQLAlchemy and Alembic with a PostgreSQL database on Neon, while keeping Railway deployment compatibility.

### Steps Completed
1. **SQLAlchemy setup**
   - Added `backend/app/config.py` to load `.env` and resolve `DATABASE_URL`.
   - Added `backend/app/db.py` to create `engine`, `SessionLocal`, and `Base`.
   - Added `backend/app/models/project.py` with a `Project` ORM model matching project fields.

2. **Repository and service refactor**
   - Updated `backend/app/repositories/projects_repository.py` to query the `Project` table.
   - Updated `backend/app/services/projects_service.py` to accept a DB session and return localized project payloads.
   - Updated `backend/main.py` to open `SessionLocal()` in the home route and pass the session to services.

3. **Alembic migration**
   - Added `alembic.ini` at the repo root.
   - Added migration scripts under `backend/migrations/`.
   - Updated `backend/migrations/env.py` to import `engine` and `Base` from `backend/app/db.py`.
   - Ran `alembic upgrade head` successfully, creating the `projects` table in Neon.

4. **Seed migration**
   - Created `seed_projects.py` as a one-time import utility.
   - Seeded 4 project entries from the old JSON source into Neon.
   - Verified the DB row count and confirmed the app service layer returned the same projects.

5. **Railway runtime fix**
   - Added `runtime.txt` for Railway runtime pinning.
   - Initially pinned to `python-3.11.9`, but Railway build failed on that artifact.
   - Updated `runtime.txt` to `python-3.13.14` and upgraded `SQLAlchemy` to `2.0.51` for Python 3.13 compatibility.
   - Kept `requirements.txt` as the single dependency source for Railway.

---

## Current Status
- **Projects table created in Neon DB.**
- **4 projects migrated and verified.**
- **Backend now queries Neon DB instead of JSON.**
- **Railway deployment is configured for Python 3.13.14 with compatible SQLAlchemy.**
- **`requirements.txt` and `runtime.txt` are the deployment configuration sources.**

---

## File Cleanup
- Removed `projects.json` from the repository.
- Removed `pyproject.toml` because Poetry is not being used for this deployment setup.
- Kept `runtime.txt` and `requirements.txt` only.

---

## Summary
The portfolio backend now uses a real PostgreSQL persistence layer on Neon, with a clean Railway deployment setup.  
The application is stable for Python 3.13 on Railway, with SQLAlchemy upgraded to a compatible version and the old JSON persistence removed.

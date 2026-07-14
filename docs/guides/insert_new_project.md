# Guide: Inserting a New Project into the Portfolio Site

This guide explains how to add a new project to the portfolio site based on the current architecture.

## 1. Database Insertion

Projects are stored in the `projects` table. The backend reads this table with SQLAlchemy and converts rows into project objects for the frontend.

### SQL INSERT example

Use the real column names from the `projects` table:

```sql
INSERT INTO projects (
  slug,
  title_key,
  description_key,
  stack,
  github_url,
  website_url,
  image_urls,
  readme_path,
  created_at,
  updated_at
) VALUES (
  'mock_project_v1',
  'work.projects.mock.title',
  'work.projects.mock.description',
  '["Python", "Flask"]',
  'https://github.com/example/mock_project_v1',
  'https://example.com/mock-project',
  '["mock_project_v1/hero.png"]',
  'mock_project_v1/README.md',
  NOW(),
  NOW()
);
```

Notes:
- `stack` and `image_urls` are stored as JSON arrays.
- `website_url` may be an empty string if there is no live demo yet.
- `readme_path` may be empty if no README is available.
- `slug` must be unique.

### Updating or renaming a project

If you need to rename a project or change translation keys, use `UPDATE`.

```sql
UPDATE projects
SET
  slug = 'mock_project_v1',
  title_key = 'work.projects.mock.title',
  description_key = 'work.projects.mock.description',
  image_urls = '["mock_project_v1/hero.png"]',
  readme_path = 'mock_project_v1/README.md',
  updated_at = NOW()
WHERE slug = 'mock_project_old';
```

## 2. Translations (JSON)

Project titles and descriptions are stored as i18n keys in `backend/app/translations/en.json` and `backend/app/translations/pt.json`.

### Expected format

The `work.projects` section should be a JSON object keyed by a stable project identifier.

```json
"work": {
  "projects": {
    "mock": {
      "title": "Mock Project v1",
      "description": "A fictitious project description used as an example."
    }
  }
}
```

The Portuguese file should use the same keys:

```json
"work": {
  "projects": {
    "mock": {
      "title": "Mock Project v1",
      "description": "Uma descrição fictícia do projeto usada como exemplo."
    }
  }
}
```

### Adding a new project entry

- Use a stable JSON key such as `mock` or `mock_project`.
- Do not duplicate the same project under both a numeric key and a string key.
- Keep the same key in both `en.json` and `pt.json`.

Example to add a new project:

```json
"work": {
  "projects": {
    "mock_project": {
      "title": "Mock Project v1",
      "description": "A concise project description for the portfolio."
    }
  }
}
```

### Avoiding duplication

- Only one entry should exist for each project key.
- The backend uses `title_key` and `description_key` from the database, so duplicate entries in JSON can cause inconsistent lookups.
- Prefer key-based lookup (e.g. `work.projects.mock.title`) instead of numeric indexes.

## 3. Assets (Images and README)

### Images

Image files live under `frontend/static/images/`.

For each project, create a dedicated folder and save images there:

```
frontend/static/images/mock_project_v1/hero.png
frontend/static/images/mock_project_v1/thumbnail.png
```

Then reference them in `image_urls` as JSON:

```sql
image_urls = '["mock_project_v1/hero.png"]'
```

The frontend template will use these values as image URLs via `url_for('static', filename='images/' + image)`.

### README

If a project has a README, place it in the repository and set `readme_path` to its relative path from the backend repository root.

Example:

```
backend/app/repositories/mock_project_v1/README.md
```

Then store:

```sql
readme_path = 'mock_project_v1/README.md'
```

The service layer reads this file and converts it from Markdown to HTML.

## 4. Full Cycle Summary

The insertion flow is:

1. Database: add or update a row in `projects`
2. Repository: the backend repository layer fetches project rows
3. Service: the service layer localizes titles/descriptions with i18n and converts README Markdown to HTML
4. Route: `backend/main.py` loads projects and passes them to the `home.html` template
5. Template: `frontend/templates/work.html` loops over `projects` and renders cards
6. Browser: the final rendered HTML appears in the portfolio site

### Key point
No route or template code changes are required for a new project. The system is designed so that updating the database row, translation JSON entries, and assets is enough.

## 5. Verification Checklist

1. Confirm the database row exists:
   - `slug` is unique and stable
   - `title_key` and `description_key` match JSON keys
   - `stack`, `github_url`, `website_url`, `image_urls`, and `readme_path` are correct

2. Confirm translations:
   - `backend/app/translations/en.json` has the new project key under `work.projects`
   - `backend/app/translations/pt.json` has the same key
   - no duplicate keys exist for the same project

3. Confirm assets:
   - images are saved under `frontend/static/images/<project-folder>/`
   - `image_urls` references the correct filenames
   - README exists if `readme_path` is set

4. Confirm frontend rendering:
   - run the app and open the homepage
   - the new project appears in the `work` modal or projects section
   - titles/descriptions show in both English and Portuguese
   - images load when provided
   - README content appears if `readme_path` is set

## Tips and Best Practices

- Use stable project keys such as `mock`, `mock_project`, or `example_project`.
- Keep translation keys consistent between DB and JSON.
- Avoid numeric-only translation keys for projects because they are harder to maintain.
- If a project does not have a live demo, use an empty `website_url`.
- Keep images inside a dedicated project folder under `frontend/static/images/`.
- Always verify the rendered home page after insertion.

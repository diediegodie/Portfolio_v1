# Frontend Modal Architecture (2025 Refactor)

## Shared Modal Utility
- All modal logic (open, close, overlay, ESC, focus trap) is centralized in `frontend/static/js/modal.js`.
- Modals are initialized in `work.js`, `about.js`, and `contact.js` by calling `initModal` with the appropriate selectors.
- Example usage:
   ```js
   window.initModal && window.initModal({
      modalId: 'contact-modal',
      triggerAttr: 'data-contact-trigger',
      overlayAttr: 'data-contact-overlay',
      closeAttr: 'data-contact-close'
   });
   ```
- This ensures all modals share identical accessibility, animation, and focus management logic.

## Button Class Consolidation
- All modal and card action buttons now use a single class: `.work-modal__btn`.
- Deprecated classes (e.g., `.work-card__link`) have been removed from CSS and templates.
- Button hover/focus color is unified to `#bd93f9` for consistency and accessibility.

## CSS Architecture

### File Responsibilities
- `styles.css` - Base styles, resets, typography, layout foundations
- `theme.css` - Theming, card system, modal styles, responsive overrides, semantic tokens

### Load Order
styles.css loads before theme.css (defined in base.html).
theme.css is authoritative for any overlapping declarations.

### Card System
See CONTENT.md for complete card component documentation.
The card system provides:
- Base `.card` class with canonical tokens
- Modifier classes (`.card--work`, `.card--about`, `.card--contact`)
- Utility classes (`.modal-close--absolute`, `.center-text`, `.stacked-links`, `.card__btn`)
- Theme-aware CSS tokens for responsive, maintainable styling

## Cleanup Note
- Unused files and scripts (legacy modal logic, duplicate button styles) have been removed.
- Only active templates remain in `/frontend/templates`.
- Backend blueprints for About/Work/Contact are placeholders and not registered.
- Inline styles have been replaced with CSS utility classes and semantic tokens.
# System Architecture

## Concept
The portfolio is not a static website.
It is a web application with a real backend,
public APIs, and an administrative area.

---

## Overview
[Browser]
   ↓
[HTML + CSS + JS]
   ↓
[Flask API]
   ↓
[Service Layer]
   ↓
[Repository]
   ↓
[PostgreSQL]

---

## Folder Structure (Backend)
backend/
├─ app/
│  ├─ blueprints/
│  │  ├─ public/
│  │  ├─ admin/
│  │  └─ api/
│  ├─ services/
│  ├─ repositories/
│  ├─ models/
│  ├─ schemas/
│  ├─ utils/
│  └─ config.py
├─ migrations/
├─ tests/
└─ main.py

---

## Layers
### Blueprint
- Routing
- Authentication
- Permissions

### Service
- Business rules
- Orchestration
- Validations

### Repository
- Database access
- Queries
- ORM abstraction

---

## Public APIs
- GET /api/projects
- GET /api/blog
- GET /api/metrics
- GET /api/status

---

## Private APIs (Admin)
- POST /admin/login
- POST /admin/projects
- POST /admin/blog
- GET /admin/messages
- PATCH /admin/messages/{id}

---

## Admin Dashboard
- Protected login
- Message list
- System status
- Simple metrics

---

## Visible Metrics
- Total visits
- Messages received
- Published projects
- Average response time

---

## Security
- Password hash
- Session token
- Rate limit on forms
- Server-side validation

---

## Docker
- Flask container
- PostgreSQL container
- Persistent volume

---

## Internationalization (i18n)

### Default Language
- English (en)

### Alternative Language
- Portuguese (pt-BR)

### Strategy
- Server-side rendering
- Language defined by:
  - URL prefix (/pt)
  - Or user preference (cookie)
- Fallback to English if translation is missing


### Implementation (2025)
- Translation files stored as JSON: one per language (en.json, pt.json)
- All user-facing text uses hierarchical keys (e.g., about.summary_title)
- Backend loads all translations at startup and injects a translation function _() into Jinja context
- Language is determined by session, cookie, or Accept-Language header; fallback to English
- Route /set_language/<lang> allows runtime language switching (updates session and cookie)
- Language toggle button in base.html header, styled like theme toggle, submits POST to /set_language
- All templates use {{ _('key') }} for text; no hardcoded user-facing strings remain
- Translation files are kept consistent and cleaned of unused keys
- Frontend JS enhances the language toggle with AJAX for seamless UX

#### Example Usage
```html
<h3>{{ _('about.summary_title') }}</h3>
<button>{{ _('button.contact') }}</button>
```

#### Adding a New Language
- Add a new JSON file in translations/
- Add the language code to SUPPORTED_LANGUAGES in backend/app/utils/i18n.py
- Provide translations for all keys

#### Testing
- Switch language at runtime using the toggle; all text updates instantly after reload
- Fallback to English for missing keys


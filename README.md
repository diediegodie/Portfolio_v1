# Fullstack Developer Portfolio
**Production-grade portfolio for a fullstack developer with a strong backend focus and a professional background in graphic design.**

---

## Overview
A real product, not just a static site. This portfolio demonstrates:
- Backend engineering excellence (Flask, Clean Architecture, PostgreSQL)
- Professional, minimal, and intentional UI/UX
- Responsive, accessible, and internationalized design
- Codebase quality suitable for senior-level roles

**Vision:**
> Showcase technical depth, design sensibility, and architectural rigor in a single, maintainable product.

---

## Features
- **Modular, Clean Architecture:** Blueprints, service layer, repositories, and models
- **Centralized Modal Logic:** All modals use a shared `modal.js` utility for accessibility, animation, and focus management
- **Unified Button Styling:** `.work-modal__btn` is the single source for modal/card actions (hover color: #bd93f9)
- **Internationalization (i18n):** English (default) and Portuguese (pt-BR) with server-side rendering and shared translation keys
- **Responsive UI:** Mobile-first, accessible, and visually consistent
- **No inline styles or duplicated logic**

---

## Technology Stack

### Frontend
- HTML5, CSS, JavaScript (Vanilla)
- Native dark mode
- No SPA complexity; full control of UI/UX

### Backend
- Python 3, Flask
- Flask Blueprints for routing
- Service Layer for business logic
- Repository Pattern for data access
- Strict separation of concerns

### Database
- PostgreSQL
- Alembic for migrations

### Infrastructure
- Docker, Docker Compose (placeholders for future deployment)
- Git + GitHub
- (Planned) GitHub Actions for CI/CD

---

## Architecture Principles
- **Clean Architecture** and **Layered Design**
- Blueprints handle routing only
- Services encapsulate business logic
- Repositories manage data access
- Models define data structure
- Utils are stateless and reusable

---

## Internationalization Strategy
- **Default language:** English (en)
- **Alternative:** Portuguese (pt-BR)
- **Approach:**
	- Server-side rendering
	- Shared translation keys in JSON files
	- Fallback to English if translation is missing

---

## Development Workflow
- **Linting & Formatting:**
	- Python: [Black](https://black.readthedocs.io/)
	- Frontend: [Prettier](https://prettier.io/), [Stylelint](https://stylelint.io/)
	- Recommended: `black backend/`, `prettier --write frontend/static/js/*.js frontend/static/css/*.css`, `stylelint "frontend/static/css/*.css" --fix`
- **CI/CD:**
	- No pipeline yet; recommended to add GitHub Actions for linting, testing, and deployment
- **Docker:**
	- `Dockerfile` and `docker-compose.yml` exist for future use (currently empty)

---

## Future Work
- Populate real project and blog data
- Implement admin dashboard and authentication
- Complete Docker deployment and CI/CD pipeline
- Add automated tests and coverage reporting
- Polish i18n and accessibility for all content

---

## How to Run (Local Development)
1. Clone the repository
2. Set up a Python 3.11+ environment
3. Install backend dependencies: `pip install -r requirements.txt`
4. Run Flask app: `python backend/main.py`
5. Open `http://localhost:5000` in your browser

*Note: Frontend assets are served via Flask static folder. Docker and CI/CD setup are planned for future releases.*

---

## License
MIT License. See [LICENSE](LICENSE) for details.

## Credits
- Designed and developed by Diego Rodriguez
- Inspired by best practices in fullstack engineering and UI/UX design
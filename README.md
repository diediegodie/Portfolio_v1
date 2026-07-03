# Backend Developer Portfolio
**Production-grade portfolio for a backend developer.**

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

*Note: Frontend assets are served via Flask static folder. Docker and CI/CD setup are planned for future releases.*

---

## Credits
- Designed and developed by Diego Rodriguez
- Inspired by best practices in fullstack engineering and UI/UX design
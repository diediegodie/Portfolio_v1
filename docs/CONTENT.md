# Portfolio Content

## Principle
Frontend grabs attention.
Backend convinces.

---

## Page: Home
### Hero
- Name
- Professional title
- CTA: Projects | Contact | GitHub

### Introduction
- Short and direct text
- Focus on product, backend, and design

---

## Page: About
### Content
- Professional bio
- Experience
- Main stack
- Approach to system design

---

## Page: Projects
### List
- Clean cards
- Name
- Problem solved
- Stack
- Link to case study

---

## Page: Project (Case Study)
### Sections
1. Context
2. Problem
3. Solution
4. Architecture
5. Stack and decisions
6. Demonstration
7. Learnings

---

## Page: Backend in Action
### Dynamic content
- System metrics
- API status
- Recent logs
- Data from the API

---

## Page: Blog (Optional)
### Technical content
- Architecture
- Decisions
- Trade-offs
- Experiments

---

## Page: Contact
### Form
- Name
- Email
- Message

### Backend
- Validation
- Rate limiting
- Database persistence

---

## Page: Admin (hidden)
### Features
- Login
- View messages
- Mark as read
- Manage projects
- Publish articles

---

## Page: How It Was Built
### Content
- Stack
- Architecture
- Diagram
- Pipeline
- Technical decisions

---

## Language Support

### Primary Language
- English

### Secondary Language
- Portuguese (Brazil)

### Translated Pages
- Home
- About
- Projects
- Project Details
- Backend in Action
- Blog
- Contact

### Notes
- Technical terms may remain in English
- Content meaning must be preserved, not literal translation

---

## Internationalization (i18n) Structure

- **All translatable text is now consolidated in:**
  - backend/app/translations/en.json (English)
  - backend/app/translations/pt.json (Portuguese)
- **Translation keys follow a hierarchical namespace:**
  - Example: work.projects.0.title, header.nav.home, footer.contact
- **No other JSON files store translatable text.**
  - Example: backend/app/repositories/projects.json now stores only translation keys and non-textual data (e.g., stack, github_url).
- **Backend and templates reference only translation keys, never raw text.**
- **To add or update translations:**
  1. Add the key and value to both en.json and pt.json.
  2. Reference the key in backend data or templates.

---

## Card & Modal Layout Guidelines

- **Unified Card Component:**
  - Use .work-card and .about-card for all cards in work/about sections.
  - Card dimensions set via CSS variables: --card-width, --card-height, --card-radius.
  - Default: 320x420px; Tablet: 90vw x 340px; Mobile: 98vw x 260px.
  - No inline styles; all sizing via CSS classes and variables.

- **Grid Container:**
  - Use .work-modal__grid and .about-modal__grid for card containers.
  - CSS Grid: grid-template-columns: repeat(auto-fit, minmax(var(--card-width), 1fr));
  - gap: 1.5rem; cards wrap and never overlap.

- **Modal Panel:**
  - Use .work-modal__panel and .about-modal__panel for modal content.
  - max-width: 1200px; width: 100%; max-height: 80vh; overflow-y: auto.
  - Responsive padding per breakpoint.

- **Overflow Handling:**
  - Card images: aspect-ratio: 16/9, object-fit: cover, overflow: hidden.
  - Card content: overflow-y: auto for long text.
  - Modal panels: scrollable if content exceeds viewport.

- **Accessibility:**
  - Sufficient color contrast, readable font sizes, and spacing.
  - No absolute positioning or negative margins for cards.
  - Modals trap focus and prevent background scroll.

- **Breakpoints:**
  - Mobile-first, scaling up to tablet/desktop.
  - Card and modal sizes adapt via media queries.

- **Component Usage:**
  - Reference .work-card/.about-card and .work-modal__panel/.about-modal__panel in templates.
  - No inline CSS or JS for layout.

---

## Modal Trigger & Card Rendering Flow

- **Modal Triggers:**
  - 'Work' modal: button with data-work-trigger, aria-controls="work-modal"
  - 'About' modal: button with data-about-trigger, aria-controls="about-modal"
  - 'Contact' modal: button with data-contact-trigger, aria-controls="contact-modal"
  - All of them use shared JS (modal.js) with initModal({ modalId, triggerAttr, overlayAttr, closeAttr })

- **Card Rendering:**
  - Cards in work.html loop through backend-provided projects, rendering localized title/description
  - Cards use .work-card/.about-card classes for unified sizing and responsiveness
  - Grid containers (.work-modal__grid, .about-modal__grid) use CSS Grid for wrapping and spacing

- **Modal Functionality:**
  - Modals open/close via JS event listeners on trigger, overlay, and close button
  - Modal panels use .work-modal__panel/.about-modal__panel for max-width, scroll, and z-index

- **Regression Testing:**
  - Test at multiple viewport sizes (360px, 414px, 768px, 1024px, 1280px, 1440px)
  - Confirm cards display localized content and remain responsive
  - Validate modal opens/closes, overlays correctly, and traps focus

---

## Card Component System

The card system provides a unified styling approach for modal content cards.

### Base Class
- `.card` - Base card styles with canonical tokens (height, padding, border-radius, shadow)

### Modifiers
- `.card--work` - Work project cards
- `.card--about` - About section cards  
- `.card--contact` - Contact section cards

### Utility Classes
- `.modal-close--absolute` - Positions close buttons in modal corners (top: 16px, right: 16px)
- `.center-text` - Centers text content (text-align: center)
- `.stacked-links` - Vertical flex layout for link groups (flex-direction: column, center alignment)
- `.card__btn` - Base button styling for card actions (flex layout, transitions)

### CSS Tokens (theme.css)
- `--card-height` - Card height (maps to work card size)
- `--card-padding` - Card internal padding (uses spacing-md)
- `--card-radius` - Card border radius (uses radius-lg: 12px)
- `--card-shadow` - Card box shadow (uses shadow-md)
- `--card-btn-text` - Button text color (theme-aware: #111 light theme, #fff dark theme)

### Class Aliases
For backward compatibility and gradual refactoring:
- `.work-card` aliases `.card` styles
- `.about-card` aliases `.card` styles
- `.contact-card` aliases `.card` styles
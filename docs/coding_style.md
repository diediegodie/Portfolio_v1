# Coding Style & Engineering Guidelines

This document defines **mandatory rules** for code generation, refactoring, and maintenance.
All human and AI contributors must strictly follow these guidelines.
The goal is a **clean, modular, scalable, and professional codebase** suitable for a senior-level fullstack portfolio.

---

## Core Principles (Non-Negotiable)

```json
{
  "philosophy": [
    "Clean Code over clever code",
    "Explicit is better than implicit",
    "Readability > optimization (until needed)",
    "Architecture before features",
    "Consistency across the entire codebase"
  ]
}

Architecture & Structure

{
  "architecture": {
    "pattern": "Clean Architecture / Layered Architecture",
    "rules": [
      "Strict separation of concerns",
      "Blueprints handle routing only",
      "Services handle business logic",
      "Repositories handle data access",
      "Models define data structure only",
      "Utils must be stateless and reusable"
    ],
    "file_size_limit": {
      "max_lines": 500,
      "action_if_exceeded": "Split into semantic, smaller modules"
    },
    "imports": {
      "python": "Use relative imports inside the project",
      "validation": "Never reference a file, function, or library that does not exist"
    }
  }
}

Backend (Python / Flask)

{
  "backend": {
    "language": "Python",
    "framework": "Flask",
    "style": [
      "Follow PEP8",
      "Auto-format using Black",
      "Function-oriented, modular code",
      "Avoid global state",
      "Explicit error handling"
    ],
    "security": [
      "Never use eval() or exec()",
      "Never perform unsafe system operations",
      "Always validate paths before file operations",
      "Never delete data without prior validation",
      "Always prevent potential data loss"
    ],
    "dependencies": {
      "rule": "Only Python standard libraries or well-established third-party libraries",
      "condition": "Only if they provide real, measurable value"
    }
  }
}

Frontend (HTML / Tailwind / HTMX)

{
  "frontend": {
    "ui_principles": [
      "Material Design fundamentals",
      "Clean, minimal, and intentional UI",
      "Accessibility first",
      "Mobile-first and responsive"
    ],
    "rules": [
      "No inline CSS",
      "No inline JavaScript",
      "Avoid hardcoded styles",
      "Use shared styles or theme variables",
      "Prefer semantic HTML"
    ],
    "behavior": [
      "Progressive enhancement",
      "Graceful error handling",
      "Clear loading and empty states"
    ]
  }
}

Modularity & Reusability

{
  "modularity": {
    "rules": [
      "Never duplicate logic",
      "Reuse existing components and services",
      "Refactor common logic into shared modules",
      "Keep components small and focused"
    ],
    "consistency": [
      "Apply improvements to similar components when relevant",
      "Maintain consistent naming conventions",
      "Follow existing patterns already established in the project"
    ]
  }
}

Roadmap & Scope Control

{
  "scope_control": {
    "rules": [
      "Do not invent endpoints, models, or features",
      "Do not remove or override existing code unless explicitly instructed",
      "Follow the defined roadmap, phases, and sprints",
      "When uncertain, ask for clarification instead of assuming"
    ]
  }
}

AI Behavior & Collaboration Rules

{
  "ai_guidelines": {
    "behavior": [
      "Be direct and precise",
      "Briefly explain why a solution was chosen",
      "Avoid verbosity, repetition, or overthinking",
      "Never hallucinate code or features",
      "Ask for clarification if requirements are unclear"
    ],
    "tools": {
      "fetch": "Use to search official documentation or best practices when needed",
      "sequentialthinking": "Use for complex, multi-step reasoning",
      "codeanalysis": "Use to analyze existing code for improvements or debugging",
      "terminal": "Prefer terminal commands for checks and manipulations"
    },
    "consistency": "These rules must be followed across all sessions and conversations"
  }
}

Performance & Scalability (When Justified)

{
  "scalability": {
    "rule": "Suggest improvements only when necessary",
    "allowed_suggestions": [
      "Caching (Redis)",
      "Background jobs (Celery)",
      "External services (SendGrid, Twilio)"
    ],
    "condition": "Only if the current task requires it or clearly aligns with long-term goals"
  }
}

Documentation Discipline
json

{
  "documentation": {
    "rules": [
      "All documentation lives in /docs",
      "Docs must reflect the actual codebase",
      "Update docs when architecture or behavior changes",
      "Never let documentation drift from reality"
    ]
  }
}

Final Rule
json

{
  "final_rule": "When in doubt, stop and ask. Never assume missing context."
}

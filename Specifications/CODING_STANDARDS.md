# Coding Standards and Best Practices

This document outlines the coding standards and conventions to be followed for the Wentworth Computer Science College: Sign-In/Sign-Out (SISO) system. Consistency is key to maintainable and high-quality code.

---

## General Principles

- **Clarity over cleverness:** Write code that is easy to understand.
- **DRY (Don't Repeat Yourself):** Avoid duplicating code by using functions, classes, and components.

---

## Backend (Python / Flask)

- **Style Guide:** Follow **PEP 8**. Use a linter like `flake8` to enforce it.
- **Naming Conventions:**
    - `snake_case` for variables, functions, and modules.
    - `PascalCase` for classes.
    - `_` prefix for internal/private attributes or methods.
- **Imports:**
    - Order imports as follows: standard library, third-party libraries, then application-specific imports.
    - Use absolute imports (`from app.models import User`) over relative imports.
- **Database:**
    - All database interactions **must** go through the SQLAlchemy ORM. Do not write raw SQL queries.
    - Define all models in the `app/models/` directory.
    - Use Flask-Migrate for all schema changes. Never alter the database schema manually.
- **Error Handling:**
    - Use `try...except` blocks for operations that can fail (e.g., database access, file I/O).
    - Return meaningful JSON error responses from API endpoints.
- **Configuration:**
    - Store all secrets and environment-specific settings in `.env` files. Access them via `os.environ`.
    - **Never** commit secrets to version control.

---

## Frontend (React / TypeScript)

- **Style Guide:** Follow the standard **React/JSX coding conventions**. Use a linter like ESLint.
- **Naming Conventions:**
    - `PascalCase` for components (`RegisterForm.tsx`).
    - `camelCase` for variables, functions, and props.
- **Component Structure:**
    - Keep components small and focused on a single responsibility.
    - Use functional components with Hooks (`useState`, `useEffect`, etc.).
    - Separate presentational components (UI) from container components (logic).
- **State Management:**
    - For simple state, use `useState`.
    - For complex or shared state, consider `useContext` or a state management library if needed.
- **Styling:**
    - Use CSS modules or a consistent CSS-in-JS approach to avoid global style conflicts.
    - Define a consistent design system (colors, fonts, spacing) in `BRAND.md`.
- **API Interaction:**
    - Centralize API calls in a dedicated service or utility module.
    - Handle loading, success, and error states gracefully in the UI.

---

## Version Control (Git)

- **Branching:**
    - `main`: Represents the stable, production-ready code.
    - `develop`: Integration branch for features.
    - `feature/<name>`: For new features or bugfixes.
- **Commits:**
    - Write clear, concise commit messages.
    - Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification (e.g., `feat: Add client registration form`).
- **Pull Requests (PRs):**
    - All code must be reviewed via a PR before being merged into `develop` or `main`.
    - A PR should address a single issue or feature.
    - Ensure all tests pass before requesting a review.

# Contributing to FixMyArea 🤝

We are thrilled that you want to contribute to FixMyArea! Below are the guidelines to ensure a smooth contribution process.

## 🛠️ Development Workflow

1. **Fork and Clone**: Fork this repository and clone it to your local machine.
2. **Create a Branch**: Create a descriptive feature branch from `main`.
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Set Up Environments**: Set up `.env` files for both Backend and Frontend using `.env.example` templates.
4. **Follow Coding Standards**:
   - Ensure all code is cleanly linted and formatted before proposing changes.
   - Run backend tests to verify functionality.
5. **Commit Changes**: Use clean, semantic commit messages (e.g., `feat: add dark mode toggle`, `fix: sanitize user inputs on auth`).
6. **Push and PR**: Push changes to your branch and open a Pull Request.

---

## 🎨 Coding Guidelines

### Backend (Node.js & Express)
- **ES Modules**: Use ES Modules syntax (`import` / `export`) instead of CommonJS (`require`).
- **Security**:
  - Always sanitize and validate client inputs using `express-validator` chains in route files.
  - Avoid leaking database details or internal stack traces in response payloads.
- **Error Handling**: Use the centralized `errorHandler` and throw meaningful exceptions rather than sending raw server status 500 error responses directly from controllers.
- **Database Optimization**: When adding new queries, check if the fields are indexed in schemas (e.g. `Issue.js`).

### Frontend (React & CSS)
- **CSS Styles**: Follow the **Liquid Glass** system defined in `index.css`. Use CSS variables for color values and avoid hardcoding Hex codes.
- **Accessibility**: Make sure forms have appropriate `<label>` elements, focus states are visible, and elements use proper ARIA attributes.
- **Responsive Layouts**: Design for all screen sizes using CSS Grid/Flexbox and responsive media queries.

---

## 🧪 Testing Requirements

- Any backend logic adjustments must include integration test suites in `Backend/tests`.
- Run tests locally before pushing:
  ```bash
  npm test
  ```
- Make sure that linter runs cleanly:
  ```bash
  npm run lint
  ```

Thank you for helping make our city cleaner and better! 🗺️

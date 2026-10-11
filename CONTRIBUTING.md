# Contributing to MindMirror AI

Thank you for your interest in contributing to **MindMirror AI**! We welcome bug fixes, documentation improvements, cognitive reasoning templates, and speech coaching exercises.

---

## Code of Conduct
We are committed to providing a friendly, safe, and welcoming environment for everyone, regardless of experience level, gender identity, or background. Please communicate with respect, patience, and empathy.

---

## Development Workflow

### 1. Fork & Clone
```bash
git clone https://github.com/your-username/MindMirror-AI-.git
cd MindMirror-AI-
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Local Environment
```bash
cp .env.example .env
```
Add your local Gemini API key to `.env`. *(Never commit this file).*

### 4. Branch Naming Conventions
- `feat/feature-name`: New features or practice modes.
- `fix/bug-description`: Bug fixes and defect corrections.
- `docs/doc-update`: Documentation, screenshots, or guides.
- `refactor/component-name`: Code cleanup and performance improvements.

### 5. Running the Test Suite
Before opening a pull request, run all automated checks:
```bash
# Type check and production build
npm run build

# AI infrastructure and schema validation
npm run test:ai

# Speech metrics and Thinking Gym tests
npx tsx server/test-speech.ts
```

---

## Submitting Pull Requests
1. Ensure all tests pass with zero warnings.
2. Provide a clear PR description explaining the problem and your solution.
3. If changing user-facing UI, include genuine before/after screenshots.
4. Maintain our privacy-first principles: never store audio on remote clouds without explicit user consent.

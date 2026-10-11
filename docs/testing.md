# MindMirror AI — Testing & Quality Assurance Guide

This document describes the testing suites, validation procedures, and QA verification results for MindMirror AI.

---

## 1. Test Suite Overview

MindMirror AI utilizes automated test suites covering:
1. **AI Provider & Deduplication Infrastructure:** Tests rate limits, budget ceilings, deduplication locks, and Gemini generation schemas.
2. **Deterministic Speech Metrics & Tokenizer:** Tests WPM algorithms, filler word boundary regex, and silence interval calculations.
3. **TypeScript Type Safety & Production Build:** Strict type compilation via TypeScript 5.7 and Vite production bundle compilation.
4. **Browser UI & Screenshot Automation:** Playwright headless Chrome automation verifying all 22 views, navigation states, and responsive layouts.

---

## 2. How to Run the Tests

### 2.1 AI Provider & Budget Test Suite
Runs budget tracking, deduplication locks, and strict Zod schema validation:
```bash
npm run test:ai
```
**Expected Output:**
```text
✓ Deduplication lock successfully prevents duplicate simultaneous runs.
✓ Budget permission granted.
✓ Analysis completed using provider: [gemini]
✓ Schema validation passed with 100% strict compliance.
ALL AI & INFRASTRUCTURE TESTS PASSED ✓
```

### 2.2 Speech Metrics & Thinking Gym Test Suite
Tests physical delivery algorithms and pedagogical schemas:
```bash
npx tsx server/test-speech.ts
```
**Expected Output:**
```text
✓ Deterministic speech metrics calculation succeeded.
✓ Speech Coaching Schema validation passed with 100% strict compliance.
✓ Thinking Gym Schema validation passed with 100% strict compliance.
ALL SPEECH & THINKING REASONING TESTS PASSED ✓
```

### 2.3 TypeScript Compilation & Production Build
Verifies that all TypeScript files conform to strict types and builds production bundle:
```bash
npm run build
```

---

## 3. Verified QA Results Matrix

| Test Suite | Target | Execution Method | Status |
|---|---|---|---|
| **AI Infrastructure** | `server/ai/` | `npm run test:ai` | ✅ PASSED (100% schema match) |
| **Speech Analytics** | `src/services/` | `npx tsx server/test-speech.ts` | ✅ PASSED (Deterministic WPM & fillers) |
| **Type Checking** | Entire Codebase | `npx tsc --noEmit` | ✅ PASSED (0 errors) |
| **Bundle Compilation** | Frontend Assets | `npm run build` | ✅ PASSED (Vite 6.4 build in <10s) |
| **Browser Navigation** | 22 UI Views | Playwright Chrome | ✅ PASSED (22 genuine screenshots captured) |
| **Network Redundancy** | Overview Reflection | Unit check | ✅ PASSED (Eliminated duplicate fetch) |

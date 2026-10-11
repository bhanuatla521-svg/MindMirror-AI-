# Security & Privacy Policy

## 🔒 Security Principles

MindMirror AI is engineered with a strict **local-first, privacy-prioritized architecture**:

1. **Zero Cloud Audio Retention:** Spoken audio recordings are buffered locally in the browser memory (`Blob`). They are never permanently stored on external servers or used to train third-party AI models.
2. **Server-Side API Key Isolation:** External AI keys (`GEMINI_API_KEY`, `GROQ_API_KEY`, etc.) are confined to the Node.js backend environment in `.env`. They are never exposed to client-side bundles or sent over the network to browsers.
3. **Budget & Rate Safeguards:** In-flight request deduplication locks and daily request caps prevent accidental API quota exhaustion or denial-of-wallet attacks.
4. **Compassionate Crisis Safeguard:** Real-time client-side interceptors immediately display free, 24/7 crisis resources (988 in US/Canada, 111 in UK, 13 11 14 in Australia) whenever acute distress language is detected, without logging personal data.

---

## Reporting a Vulnerability

If you discover a security vulnerability or sensitive key exposure, please report it privately:

- **Email:** `bhanuatla521@gmail.com`
- **Subject:** `[SECURITY] MindMirror AI Vulnerability Report`

Please include:
- A description of the vulnerability.
- Steps or a minimal script to reproduce the issue.
- Potential impact and affected components.

We will acknowledge receipt within 48 hours and work with you on a coordinated disclosure timeline.

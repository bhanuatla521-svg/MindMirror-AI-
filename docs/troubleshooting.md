# MindMirror AI — Troubleshooting Guide

This guide provides practical solutions to common issues when installing, running, and using MindMirror AI.

---

## 🛠️ Common Issues & Resolutions

### 1. Port Conflict (`EADDRINUSE: address already in use :::3000` or `:::3001`)

**Symptom:** The console outputs an error stating that port 3000 or 3001 is already occupied when starting the dev server or backend server.

**Cause:** A previous Node.js process or another local service is still running on that port.

**Resolution:**
- **On Windows (PowerShell):**
  ```powershell
  # Find processes using port 3000 or 3001
  Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in 3000, 3001 } | Select-Object LocalPort, OwningProcess

  # Terminate the process (replace PID with actual OwningProcess ID)
  Stop-Process -Id <PID> -Force
  ```
- **On macOS / Linux:**
  ```bash
  lsof -ti :3000,3001 | xargs kill -9
  ```

---

### 2. Microphone Access Denied in Voice Studio

**Symptom:** Clicking **Start Recording** displays "Microphone permission denied" or the volume meter stays at 0.

**Cause:** The browser blocked microphone access for `http://localhost:3000`.

**Resolution:**
1. In your browser's address bar, click the **tune / padlock icon** to the left of `localhost:3000`.
2. Locate **Microphone** and switch the permission to **Allow**.
3. Refresh the page (`Ctrl + F5` or `Cmd + Shift + R`).
4. *Fallback:* If your computer has no working microphone, use the **Insert Sample Answer** button or paste your spoken transcript directly into the editable text box.

---

### 3. Speech Recognition Not Streaming Live (Web Speech API)

**Symptom:** Audio records, but live transcription does not appear in real-time.

**Cause:** The Web Speech API (`webkitSpeechRecognition`) is natively supported in Google Chrome, Microsoft Edge, and Safari, but may be disabled in Firefox or privacy-hardened browsers (like Brave with shields up).

**Resolution:**
- Use **Google Chrome** or **Microsoft Edge** for real-time speech streaming.
- If using another browser, simply type or paste your spoken words into the **Transcript Correction Box** before clicking **Generate Evidence Coaching Report**.

---

### 4. AI Coaching Report Generation Fails or Times Out

**Symptom:** Clicking **Generate Evidence Coaching Report** takes a long time or displays an API error.

**Cause:** The `GEMINI_API_KEY` in `.env` is either missing, expired, or rate-limited.

**Resolution:**
1. Verify that your `.env` file exists in the project root:
   ```env
   PORT=3001
   PRIMARY_AI_PROVIDER=gemini
   GEMINI_API_KEY=your_actual_key_here
   GEMINI_MODEL=gemini-2.5-flash
   ```
2. Test your key using the built-in diagnostic test:
   ```bash
   npx tsx server/check-key.ts
   ```
3. **Resilient Local Fallback:** MindMirror has a built-in deterministic heuristic engine. If external API calls fail or offline mode is triggered, the system automatically falls back to local algorithms without crashing.

---

### 5. Git Push Rejected: `Push cannot contain secrets`

**Symptom:** GitHub rejects a commit with error `GH013: Repository rule violations found (Push cannot contain secrets)`.

**Cause:** An API key was accidentally typed directly into source code files instead of `.env`.

**Resolution:**
1. Always store keys in `.env`, never in `.ts` or `.tsx` files.
2. Confirm `.env` is listed inside `.gitignore`.
3. Amend the commit before pushing:
   ```bash
   git add -u
   git commit --amend -m "fix: remove sensitive keys from source"
   git push -u origin main
   ```

---

### 6. Resetting Application Data to Default State

**Symptom:** You want to clear corrupted test entries or reload the clean initial state.

**Resolution:**
1. Open the application at `http://localhost:3000`.
2. Click **Settings & Privacy** in the left sidebar.
3. Click **Reset to Sample Data** to reload realistic demonstration records, or click **Wipe All Data** for a completely clean slate.

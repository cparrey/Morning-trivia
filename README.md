# Morning Trivia — v1.0.0

A personal trivia host for Chris’s morning meetings at Burwood.

- 2,000 easy questions: 100 in each of 20 categories.
- Three choices per question: one correct answer and two alternatives.
- Choose one or several categories, or mix everything.
- Rounds of 5, 10 or 15 questions, or keep going.
- Reveal the answer, then explicitly mark the question as asked.
- Asked questions are excluded from all future new rounds.
- Pause/resume, skip, undo, search history, hide/flag questions.
- Backup export/import; imports merge existing history.
- Responsive read-aloud layout, extra-large text and offline cache.
- No account, database, package installation, build process or API keys.

## Put it on GitHub Pages

1. Create a repository called `Morning-trivia` in your GitHub account.
2. Upload the **contents** of this folder into the repository. `index.html` must be at the top level; do not upload only the ZIP or place everything inside an extra folder.
3. Commit the uploaded files to `main`.
4. Open **Settings → Pages**. Under **Build and deployment**, choose **Deploy from a branch**. Choose `main` and `/(root)`, then **Save**.
5. GitHub will show the published address when deployment completes. Open that address on your iPhone in Safari.
6. Optionally tap **Share → Add to Home Screen**. Use one consistent browser/Home Screen version for your history.

Official setup reference: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

If you use the repository name above in the `cparrey` account, the expected address is `https://cparrey.github.io/Morning-trivia/`. This address becomes available after GitHub Pages is enabled for main / (root).

The website contains no private workplace material. Your question history stays in your browser; it is not committed to GitHub. Do not upload exported personal backup files to your repository.

## Use it in a meeting

Choose **Mix it up**, or tap a category (and optionally add others). Choose the round length and tap **Start**. Read the question and A/B/C choices. Tap **Reveal answer**. Once you have asked it, tap **Mark as asked & next**. Revealing on its own never uses a question.

**Skip** moves past a question for this round only. **Pause round** returns home with the round saved. **History** lets you undo a mark. **Hide / flag** keeps a question out of future rounds until you restore it; notes are local and are not sent to anyone.

If fewer unused questions remain than your chosen round size, the round uses the remaining questions. Nothing is silently repeated.

## Protect your history

In **Settings**, export a backup regularly. Keep the downloaded JSON file in Files/iCloud Drive. Import it when changing phones or browsers. Import keeps existing asked/hidden records and merges the incoming ones, then ends any unfinished round.

Browser storage can be removed by clearing website data, private browsing, device resets or browser storage management. Safari and a Home Screen app may have separate history. Different website addresses have separate storage. Export/import is the supported transfer method. If saving fails, the app displays a warning and still lets you export the in-memory history.

Offline use requires one successful load over HTTPS and a service-worker-capable browser. External reference links need internet access. The app attempts to keep the screen awake during a round where supported; otherwise use your phone’s screen timeout controls.

## Source and content notes

See `CONTENT-NOTES.md` for the review scope and limitations. Every question includes a reference URL, exposed after answer reveal. These links are references, not endorsements. Wording is original; no brand logos or copyrighted images are embedded.

## Files and maintenance

`index.html`, `styles.css`, `app.js`, `core.js`, `questions.js`, `manifest.webmanifest`, `sw.js` and icon files make up the app. Keep question IDs stable when correcting wording, so history remains valid. Increment the app and service-worker cache versions when publishing updates. After updating, close all open app tabs/windows and reopen to activate the new offline cache.

`checks.cjs` runs data and state checks with `node checks.cjs` (Node is for development only). No installation needed to host or use the app.

This delivery was checked with JavaScript syntax and automated data/state checks. A browser UI or actual iPhone test was not available in the build environment; test a short round and backup on your phone after publication.

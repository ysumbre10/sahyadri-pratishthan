# Unlisted GitHub Pages letter editor

The deployed route is `/patra-kaksha/`. It is deliberately absent from navigation, sitemap and robots exclusions (which would advertise the path). The page uses noindex/nofollow/noarchive. An unlisted URL is not an access-control mechanism: the letterhead is protected by encryption.

`../letter-editor.html` is the self-contained encrypted page copied by the normal site build. It contains only the login shell, decryption code, random salt/IV and encrypted editor/template. The original PDF, rendered template and password stay in ignored `private/` files, never deployed. Only the rendered template is included inside the encrypted payload; the original 11 MB PDF remains local.

## Protection and limits

AES-256-GCM with a random 96-bit IV encrypts the editor and letterhead. PBKDF2-SHA256 (600,000 iterations, random 128-bit salt) derives the key from a randomly generated 32-character password. The password is not embedded or compared with a browser-side string. Decryption must authenticate successfully before the editor opens. Browser memory holds the decrypted contents in an opaque-origin sandboxed iframe with no network access. Lock/reload removes the editor from the page. Nothing is saved in localStorage or sessionStorage.

GitHub Pages cannot provide server sessions, login rate limits, individual revocation or a private password-change API. Offline guessing is possible against any downloaded encrypted page, so use a high-entropy generated password, not a memorable short phrase. Anyone with the password can share it or keep an unlocked copy. Publishing a new password protects the newly encrypted version but cannot revoke downloaded old copies. These are encryption limits, not server authentication.

## Owner-only password changes

Only people with repository write access can replace the deployed encrypted page. There is no password-changing control in the editor. Keep repository access to the owner.

Private source files:

- `private/letterhead.png`: supplied blank letterhead rendered at 3000 px.
- `private/letterhead.pdf`: supplied source PDF, not published.
- `private/access.txt`: current randomly generated access password (mode 0600), ignored by Git.

To rotate, back up the ignored private files securely, generate a fresh random password into `private/access.txt`, then run from the project root:

```sh
node letter-editor/seal.mjs < letter-editor/private/access.txt
npm run verify
node --test letter-editor/encryption.test.mjs
git add letter-editor.html
git commit -m "Rotate letter editor access"
git push origin main
```

Share the editor link and password privately. Do not put the password in commit messages, repository secrets that get printed, source files, URLs or the website. `seal.mjs` reads the password from stdin and never logs it. Never copy the `private/` directory to a public host.

## Editor

Date, incoming/outgoing reference, recipient, subject, salutation, body, closing, signature, name, designation and contact details are editable. Text continues across pages using the supplied letterhead. Page breaks use fixed print dimensions, independent of the phone preview scale. Long tokens split at grapheme boundaries; blank paragraphs remain in the letter. Mobile users have sticky Write/Preview shortcuts and fit-to-screen or full-size previews. The closing/signature stay together. PNG/JPEG signatures remain in browser memory. JSON drafts contain text and signature: keep downloaded drafts private.

Print / PDF uses the browser print dialog: A4, no margins, browser headers/footers off, Save as PDF. Choose from the bundled Unicode Devanagari fonts. No external script, font or upload services are contacted.

## Validation

`node --test letter-editor/pagination.test.mjs` covers overflow, exact page boundaries, long unbroken strings, Marathi grapheme boundaries and blank paragraphs with a deterministic layout adapter. It does not replace browser layout QA.

`npm run verify` validates the public site build. `node --test letter-editor/encryption.test.mjs` verifies browser-compatible Web Crypto decryption, wrong-password rejection, and exclusion of the password, plain template and sitemap link from deployed files. The tests require ignored owner assets locally; normal GitHub Pages builds need only the already encrypted standalone page.

Local desktop/mobile previews have been inspected. Full cross-browser printed PDF verification remains pending.

The editor uses only the encrypted GitHub Pages implementation. The unused server-authentication implementation and its login page, password-hashing helper and tests have been removed.

## Approved 2027 letterhead

The local version uses `Downloads/sp_letterHead2027.pdf`. The prior source and PNG are backed up inside ignored `private/`. At a 794 × 1123 CSS-pixel A4 layout, the safe writing rectangle is x=56, y=346, width=682, height=704: below the orange header, with a clear bottom margin. The same rectangle is used on every page and in print. A final horizontal/vertical overflow check disables printing if layout cannot fit. All editor fields are single-column, including on phones.

Run `npm run build`, then `node letter-editor/preview.mjs` to prepare an additional local 390px phone-width preview. The regular build deletes this preview-only route before packaging. Preview URLs are printed by the helper. The desktop preview was opened and unlocked successfully in Chrome. Further browser input QA was interrupted when the user switched to another Chrome window; do not claim long-letter visual or print QA is complete. The owner reviewed the preview and authorized commit, push and deployment on 27 November 2026.

## Typography and font controls

Ten bundled Unicode families: Noto Sans Devanagari, Noto Serif Devanagari, Mukta, Hind, Karma, Martel, Sarala, Tiro Devanagari Marathi, Arya and Gotu. Fontsource packages supply the original WOFF2 subsets and OFL licenses retained under `fonts/`; metadata records upstream identity. `fonts.css` defines the locally stored faces, and `seal.mjs` embeds them with license notices inside the encrypted editor. No third-party font requests are made. Font-size controls use points (pt), not screen pixels.

Each of the ten text sections supports font family, bold, italic, size (9–24 pt), line height (1.2–2.4), paragraph spacing (0–24 pt), extra word spacing (0–4 px), and alignment. Missing bold/italic variants use browser synthesis. Global controls apply family, size and line height while preserving section bold/italic styling. Formatting panels collapse independently; mobile controls remain single-column. Each font load is awaited before measuring page breaks or printing, and obsolete async renders are discarded.

ISM is a typing/desktop font system, not one interchangeable font. Unicode text from ISM can be pasted directly. A licensed local Unicode Devanagari TTF/OTF can be loaded by the user (2 MB maximum); it stays in the tab and is included in the downloaded draft. A Unicode cmap check rejects legacy-encoded or non-Devanagari fonts. This editor does not convert legacy ISM text. No proprietary ISM font is bundled.

Draft format v2 includes typography and the optional custom font. Earlier v1 drafts import with equivalent point sizes. All imported fields and formatting are validated before application. Custom-font parsing and typography bounds are checked by `node --test letter-editor/typography.test.mjs`. Rebuild the sealed page after changes using the unchanged ignored `private/access.txt` password. The mobile layout and font rendering have been inspected in the local Chrome preview. Full cross-browser print verification remains pending.

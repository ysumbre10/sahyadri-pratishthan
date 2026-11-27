# Unlisted GitHub Pages letter editor

The deployed route is `/patra-kaksha/`. It is deliberately absent from navigation, sitemap and robots exclusions (which would advertise the path). The page uses noindex/nofollow/noarchive. An unlisted URL is not an access-control mechanism: the letterhead is protected by encryption.

`../letter-editor.html` is the self-contained encrypted page copied by the normal site build. It contains only the login shell, decryption code, random salt/IV and encrypted editor/template. The original PDF, rendered template and password stay in ignored `private/` files, never deployed. Only the rendered template is included inside the encrypted payload; the original 11 MB PDF remains local.

## Protection and limits

AES-256-GCM with a random 96-bit IV encrypts the editor and letterhead. PBKDF2-SHA256 (600,000 iterations, random 128-bit salt) derives the key from a randomly generated 32-character password. The password is not embedded or compared with a browser-side string. Decryption must authenticate successfully before the editor opens. Browser memory holds the decrypted contents in an opaque-origin sandboxed iframe with no network access. Lock/reload removes the editor from the page. Nothing is saved in localStorage or sessionStorage.

GitHub Pages cannot provide server sessions, login rate limits, individual revocation or a private password-change API. Offline guessing is possible against any downloaded encrypted page, so use a high-entropy generated password, not a memorable short phrase. Anyone with the password can share it or keep an unlocked copy. Publishing a new password protects the newly encrypted version but cannot revoke downloaded old copies. These are encryption limits, not server authentication.

## Owner-only password changes

Only people with repository write access can replace the deployed encrypted page. There is no password-changing control in the editor. Keep repository access to the owner.

Private source files:

- `private/letterhead.png`: supplied blank letterhead rendered at 2600 px.
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

Date, incoming/outgoing reference, recipient, subject, salutation, body, closing, signature, name, designation and contact details are editable. Text continues across pages using the supplied letterhead. The closing/signature stay together. PNG/JPEG signatures remain in browser memory. JSON drafts contain text and signature: keep downloaded drafts private.

Print / PDF uses the browser print dialog: A4, no margins, browser headers/footers off, Save as PDF. Use a system Devanagari font (Kohinoor Devanagari, Noto Sans Devanagari or Mangal). No third-party scripts, fonts or upload services are used.

## Validation

`npm run verify` validates the public site build. `node --test letter-editor/encryption.test.mjs` verifies browser-compatible Web Crypto decryption, wrong-password rejection, and exclusion of the password, plain template and sitemap link from deployed files. The tests require ignored owner assets locally; normal GitHub Pages builds need only the already encrypted standalone page.

Browser checks and printed PDF visual review remain pending: local listeners were blocked by the sandbox, file URLs were blocked by browser policy, and the Chrome connector required an app update. Do not describe visual QA as passed.

The earlier `server.mjs`, `password.mjs` and `auth.test.mjs` are an unused alternative server implementation; GitHub Pages does not run them.

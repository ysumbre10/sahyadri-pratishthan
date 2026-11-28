# Official Instagram work archive

The November 2026 six-part owner export was scanned locally. Only public posts, reels and IGTV metadata are considered. Stories, archived/deleted content, messages, account details, device metadata and coordinates are not published.

The website contains 962 selected captioned work records and 1,093 image selections. A record is a source publication, **not necessarily a distinct completed event**. Exact repeated captions are grouped and repeated photographs are suppressed. Keyword classification assigns work categories; historical invitations are labelled separately where identifiable. Uncaptioned and unclassified material remains in the original ZIP backups.

Original Marathi captions are retained (social tags, URLs and phone-like numbers removed). Hindi and English pages provide translated category context and explicitly identify the Marathi source account. The post date is labelled as publication date; it is not inferred to be the event date. The account link goes to the official profile because the export does not supply reliable public permalinks.

Image selection ranks usable resolution and sharpness and removes matching perceptual hashes. One to three selections are kept per record. Video-only records use a still labelled as such; no video files are deployed. Existing editorial archive photographs lead the work directory. Representative category images were visually spot-checked; this is not a manual review of every image.

## Regeneration

Requires Python 3, ffmpeg, Node and `sharp` (or its module path in `SHARP_MODULE`).

1. `python3 scripts/import-instagram.py --prepare`
2. `node scripts/prepare-instagram.mjs`
3. `python3 scripts/refine-instagram.py`
4. `npm run verify`

Local extraction and reports live in ignored `output/instagram/`. ZIP originals stay in Downloads. Only selected metadata in `instagram-records.json`, `instagram-images.json` and WebP derivatives in `assets/instagram/` belong in source control. The build copies derivatives, never raw exports.

Thumbnails are at most 600px and full images at most 1280px. Categories paginate 12 records, with source attributes for later-page thumbnails assigned only when displayed. Full images load through the existing gallery on demand. All 20 categories retain at least one photograph.

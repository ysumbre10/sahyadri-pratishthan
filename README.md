# Sahyadri Pratishthan

A static, multilingual, multipage website with Marathi at `/`, Hindi at `/hi/`, and English at `/en/`. Fifteen pages per language, 45 public pages total.

## Run locally

Requires Node.js 22 or later. No dependency installation is required.

```sh
npm run dev
```

Open http://localhost:4173. Run `npm run build` after editing source files; refresh the browser to see changes. `PORT=4200 npm run dev` changes the port.

## Build and hosting

```sh
npm run check
npm run build
```

Deploy the generated `dist/` directory to a static host. The production canonical domain is already set to `https://sahyadripratishthan.com`. GitHub Pages deployment is configured in `.github/workflows/pages.yml`: pushes to `main` verify the site and publish only `dist/`. Enable Pages with **GitHub Actions** as the source in repository settings. The build includes the custom-domain `CNAME` and `.nojekyll` files. Remote publication and DNS configuration must be completed separately.

## Editing

- `content.mjs`: complete Marathi, Hindi and English copy, official social links, article sources.
- `pages.mjs`: page definitions, route names and translated page metadata.
- `components.mjs`: reusable content sections.
- `layout.mjs`: shared header, footer, language switcher, metadata and structured data.
- `build.mjs`: composes pages and writes the sitemap and public assets.
- `styles.css`: responsive design.
- `app.js`: mobile navigation, story filters and photography credits dialog.
- `assets/sp_logo_reg_no.webp`: owner-supplied logo, resized to 1024px and stored as lossless WebP. Its whitespace is framed using CSS.

The site links to official channels for campaign participation and the supplied Google Form for registration. It has no registration database, donation processing, invented fundraising targets, unverified contact numbers or automatic social-feed synchronisation.

## Content sources and launch review

Reviewed 26 November 2026. The social URLs were supplied by the owner. Instagram and Facebook content could not be fully read through available tools. Historical programme descriptions are supported by https://sahyadrifort.blogspot.com/ and the linked press reports, not presented as upcoming events.

- Jivdhan: https://www.loksatta.com/trending/gadpati-gajashwapati-bhupathi-little-girls-shivgarjna-video-viral-ttg-97-2747576/lite/
- Hadsar: https://www.esakal.com/pune/mahadarvaja-was-installed-hudsar-fort-388087
- Sindhudurg: https://sanwadmedia.com/11072/
- Official archive film: https://www.youtube.com/watch?v=TvDfkTxJqw4

The supplied presentation could not be accessed by the connected Drive account. Incorporate its verified organisational details and campaign photos once accessible. Owner review is still needed for preferred legal name, current team/contact information and translated wording before public launch.

## Image credits

The two Wikimedia photographs below illustrate heritage sites. The project galleries separately display the NGO’s own supplied work photographs. Credits are also available in the website footer.

- `lohagad.webp`: Roadtripper876, CC BY 4.0. https://commons.wikimedia.org/wiki/File:Lohagad_Fort,_near_Pune,_Maharashtra.jpg
- `raigad.webp`: Aatakke, CC BY-SA 3.0. https://commons.wikimedia.org/wiki/File:Raigad_Fort.jpg
- These images are resized Wikimedia thumbnails, displayed using responsive crops and overlays. The Raigad image remains under CC BY-SA 3.0.
- `film.webp`: official YouTube video thumbnail, linked to the original video.

Google Fonts are loaded externally with local system font fallbacks. Main content, navigation and FAQs work without JavaScript. Story filtering and the credits dialog use JavaScript.

## Official document reader

Seven supplied PDFs (20 pages) are displayed at `/documents/` in all three language versions. Original document text is not translated. The reader supports page navigation and zoom; without JavaScript, expandable sections show the pages.

Original PDFs were removed at the owner’s request after confirming that all 20 pages are retained as WebP images. The build copies only an explicit list of website assets and rendered document pages, removing the old generated asset directory first so stale PDFs cannot remain in a rebuilt deployment. Host only `dist/`, never the project root.

To import a replacement PDF, first provide the source again (the originals were deleted), then install Poppler and run:

```sh
python3 scripts/render-documents.py
npm run build
```

`documents.json` lists rendered pages. `documents.mjs` contains the reader and its translated labels. The first two trust-registration scans are displayed rotated 180 degrees to correct their original orientation, without modifying the PDFs.

The viewer provides no download or print buttons and hides the section in print styles. Rendered page images can still be saved or captured by visitors; this is not DRM or a guarantee against copying. Dates and validity are shown as supplied rather than asserted as current.


## Multipage routes

| Page | Marathi | Hindi | English |
| --- | --- | --- | --- |
| Home | `/` | `/hi/` | `/en/` |
| About | `/about/` | `/hi/about/` | `/en/about/` |
| Our work | `/work/` | `/hi/work/` | `/en/work/` |
| Stories | `/stories/` | `/hi/stories/` | `/en/stories/` |
| Documents | `/documents/` | `/hi/documents/` | `/en/documents/` |
| Get involved | `/join/` | `/hi/join/` | `/en/join/` |

Language switching retains the page. Shared navigation and breadcrumbs link to real routes. The official tagline is stored once in `content.mjs` as **घेतला वसा दुर्गसंवर्धन चळवळीचा** and retains its Marathi wording across languages.

To add a new page, add its slug/section list in `pages.mjs`, provide metadata in each `pageText` locale, add new sections in `components.mjs` if needed, and include its navigation link in `layout.mjs`. Build and run `npm run verify`.

`npm run verify` checks syntax, builds all pages, and validates one primary heading per page, canonical/language URLs, internal links and assets, tagline consistency, document page completeness, sitemap entries, and exclusion of PDF originals.

Mobile QA: Safari Responsive Design Mode at 375px and 320px; checked navigation, document selection, pagination, zoom selection and matching-page language switching. Responsive layouts also include tablet and desktop breakpoints. No physical-device test was performed.

## Project photograph collections

Eight owner-supplied ZIP archives were reviewed: Pratapgad foundations, Vasantgad bastion, fort gateways, cannon carriages, Murarbaji memorial, Rajgad finds, Janjira national flag, and Padmadurg saffron flag. Their 98 image entries contain 94 unique images after exact SHA-256 deduplication. The unrelated PAN PDF nested in the Vasantgad archive is excluded from the project gallery. Originals and archives were deleted after verification at the owner’s request; source filenames are retained only in the local provenance manifest.

The homepage features a selection carousel. Each language’s Work page has eight chapters, a sticky collection index with scroll progress, horizontal photo rails, thumbnail navigation and a keyboard-accessible full-screen viewer. Portraits and comparison panels remain uncropped in project galleries. Motion respects the reduced-motion preference; there is no autoplay. Images use lazy loading and WebP variants up to 180, 800 and 1600 pixels on the long edge.

- `projects-manifest.json`: source mapping, dimensions and image variant paths.
- `projects.mjs`: Marathi/Hindi/English descriptions, curated order and rendering.
- `projects.css` and `projects.js`: gallery layout and interactions.
- `assets/projects/`: generated public images, about 18 MB for all variants combined.

Captions use the supplied collection and fort names. Dates, object dating and quantified conservation results are not inferred from photographs. Original text within photographs is preserved.

Image preparation is optional for normal builds. To regenerate, first supply the source ZIP archives again, then run `python3 scripts/extract-projects.py`, then `node scripts/prepare-projects.mjs`. Preparation requires FFmpeg/ffprobe for HEIC tile decoding and the Sharp Node package (resolve from the project or supply its module path through `SHARP_MODULE`). Extraction uses a temporary directory under `/tmp/`; the preparation script also creates review contact sheets there. To add a collection, extend the extraction mapping and translated project copy, regenerate, and run `npm run verify`.

Project gallery QA: reviewed all eight image contact-sheet collections; checked desktop full-screen opening and keyboard next-image navigation in Safari, and the gallery layout at 320px in Responsive Design Mode. Automated verification covers every collection and image variant in all three languages. No physical touch-device test was performed.

## Heritage identity and expanded homepage

`heritage.mjs` contains the translated homepage narrative, royal portrait panel, rajmudra inscriptions and meanings, conservation stories, Rajgad research introduction and visitor-care guidance. `heritage.css` applies a basalt/saffron/brass visual language, gateway-shaped portrait frames, sword details and wagh-nakh ornaments. The weapon shapes are decorative SVGs, not claims to reproduce any particular historical artefact.

The hero portraits are AI-generated contemporary artistic interpretations, labelled in Marathi, Hindi and English. Built-in image generation was used; the exact prompts are saved under `output/imagegen/`. Large PNG originals were subsequently deleted at the owner’s request. Optimized 800px WebP versions are served locally from `assets/heritage/`.

The rajmudras now use the owner’s supplied images. Built-in image editing removed the backgrounds (and the small unrelated badge on the Sambhaji source). Transparent WebP cutouts are stored in `assets/heritage/shivaji-rajmudra.webp` and `assets/heritage/sambhaji-rajmudra.webp`. Previous externally sourced seal photographs have been replaced. Click a seal to see the full-size cutout; readable Sanskrit transcriptions and translated meanings remain available in expandable panels.

`media.mjs` contains the official social destinations and two archive videos: `TvDfkTxJqw4` (14-year archive film) and `ooSdL1IV9KA` (Sahyadricha Ransangram 2021, found through the official channel's indexed video). `media.js` creates a YouTube privacy-enhanced iframe only after the visitor clicks Play. Direct YouTube links remain available if embedding is restricted or JavaScript is disabled. YouTube availability and embedding permissions remain under the channel's control. The second video thumbnail is hosted by YouTube. The social emblems use crossed swords around recognisable platform symbols and retain visible text labels.

## Storage optimization and source cleanup

The photo collections use WebP; the approved ID-card template uses PNG. Project variants use maximum long edges of 1600px (quality 78), 800px (76), and 180px (68). The logo uses lossless WebP at 1024px. Document pages retain their full rendered dimensions and use quality 86. Portraits use 800px WebP; seal cutouts preserve full alpha transparency. Images were decoded and responsive dimensions verified during the completed migration.

The owner requested deletion of originals after compression. Source ZIPs, PDFs, JPEG/PNG images, redundant rendered pages, research images and large AI PNGs were removed after validating replacements. All 94 unique project photographs and 20 document pages remain. Temporary extracted project images and review sheets were also removed. `output/optimization/report.json` records migration sizes and deleted files. The obsolete one-time migration and report-based verification scripts have been removed; their original extracted inputs are no longer retained. Normal builds need neither Sharp nor the originals.

Future document imports initially produce JPEG pages; convert them to WebP and update `documents.json` before publishing. Future photo imports require resupplying originals. Do not recompress the retained WebP files repeatedly. Deploy only `dist/`; its local copy duplicates assets for preview and hosting.

## GitHub Pages custom domain

In repository Settings → Pages, choose GitHub Actions and set the custom domain to `sahyadripratishthan.com` before updating DNS. At GoDaddy, set four apex (`@`) A records to `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, and `185.199.111.153`. Set `www` CNAME to `<github-owner>.github.io` (replace with the actual repository owner, without a repository path). Replace conflicting web-hosting records only; preserve email MX/TXT records. After DNS validation and certificate issuance, enable Enforce HTTPS. Check apex and www redirects, all language homepages, and a nested work/document page.

Reference: https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site/managing-a-custom-domain-for-your-github-pages-site

## Registration and ID cards

The Join page is available in Marathi, Hindi and English. It presents registration, the ID workspace and campaign participation as distinct sections. Disclosure controls use a single CSS chevron, keyboard focus stays visible, and the layout stacks on narrow screens.

`registration.mjs` owns the Google Form URL. The form is linked to the private master Sheet; the deployed Apps Script processes submissions and provides a mobile-plus-DOB lookup. `registration-config.mjs` contains only its public endpoint. See `apps-script/README.md` for installation, verified state and review rules. No member dataset or credentials are included in the website.

`id-card.js` renders the approved orange card at 994 × 1584. Card details come from the lookup result, and photo selection unlocks only after an approved match. The website is typeset in Georgia and Marathi fields in Noto Serif Devanagari. The role is fixed to सभासद. JPG, PNG and WebP photos up to 10 MB and 40 megapixels are downsampled in memory; zoom and position controls crop the portrait. Photos are never uploaded or placed in browser storage. Reset and page exit clear the local data.

`npm run verify` builds and validates all 45 public pages. `node --test tests/*.test.mjs` checks lookup gates, ID rendering, photo privacy, registration allocation and retry behavior. These tests simulate Apps Script and the DOM; live browser checks separately verified successful and nonexistent lookup responses. Publish only `dist/` using the existing GitHub Pages workflow.


## Search visibility

`seo.mjs` generates Organization, WebSite, page and visible-breadcrumb structured data, multilingual social metadata, and a sitemap with reciprocal Marathi/Hindi/English alternates. `content.mjs` and `pages.mjs` supply factual, language-specific titles and descriptions. Public pages are indexable; the encrypted letter editor remains unlisted and noindex, and is excluded from the sitemap. Only pages from `pageDefinitions` enter the sitemap.

`npm run verify` checks all public routes, unique metadata within each language, structured data identities, language alternates, internal links, the sitemap and private-editor exclusion. `node --test tests/*.test.mjs letter-editor/*.test.mjs` retains functional and security regression coverage. The obsolete alternate editor server and one-time image migration scripts have been removed; the root development server and current tests remain supported.

Search Console ownership and sitemap submission are separate from hosting. GoDaddy manages the domain; GitHub Pages serves the site. Use the owner's chosen Google account to verify the HTTPS URL-prefix property, submit `https://sahyadripratishthan.com/sitemap.xml`, then inspect the three language homepages and request indexing. Keep the Google-provided verification file deployed after successful verification. Do not fabricate a verification token or publish one for a different account.

Monitor Search Console's Page indexing and Performance reports for branded queries (Sahyadri Pratishthan / सह्याद्री प्रतिष्ठान) and fort-conservation queries. The organisation's own social profiles should link to the canonical website where appropriate. Rankings and indexing cannot be guaranteed; do not add hidden keyword lists, invented endorsements or mass-generated doorway pages. Reference: https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl

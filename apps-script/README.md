# Registration service

## Current state — 27 November 2026

The new registration form is connected to the private master workbook. Google Forms writes original submissions to `Form responses 1` (gid 1935660291). `Form processing`, `Incoming review`, and `ID service` have been created and their values verified.

The service is deployed as version 1. Owner authorization is complete. `verifyConfiguration` confirmed the linked form, 19,558 master records, and both `onMemberSubmit_` and `retrySubmissions_` triggers. `registration-config.mjs` contains the deployed public endpoint.

A real Chrome test from `http://localhost:4173/en/join/` verified a nonexistent match and a successful existing-member lookup (including the Google redirect/CORS path). Photo selection becomes available only after a match. Nine local tests and the 18-page site verification pass. No fake member was submitted to the production form. The public website release has not been verified.

Project: https://script.google.com/u/0/home/projects/1ZuQEChAsDXCa34MBJbcEKIXvbg2mI4PeIaiFBEQRMArYaQI4ZyuKU9xE/edit

## Reinstallation / future deployment

1. Under `info.sahyadripratishthan@gmail.com`, replace Code.gs with the local file and save. Verify the full source, including its beginning and end.
2. Run `installWorkflow`. Review Google authorization scopes with the owner. This installs an on-form-submit trigger and hourly retry trigger, preserving existing records and registration numbers.
3. Run `verifyConfiguration`; require `formLinked: true` and both handlers. Review the trigger list.
4. Deploy a web app executing as the owner, available to website visitors. Confirm the access change before granting it. Keep the underlying Sheet private.
5. Put the resulting `/exec` URL into `registration-config.mjs`. Test a real browser POST from the website origin, including Google redirects/CORS, successful lookup, failed lookup, and review-required lookup. Do not claim live readiness based on unit tests alone.
6. Update the `ID service` status rows only after those checks pass. Build and verify the site before publishing.

## Behavior

Lookup requires mobile and DOB and returns only card fields for a single approved match. Photos remain exclusively in browser memory. Basic cache-based throttling limits requests; mobile plus DOB is not strong identity verification.

Unique new submissions receive an unused number above 5000. Exact existing submissions preserve the record and numbers. Shared contacts, ambiguous identities and conflicting blood groups go to Incoming review. Response IDs make processing retry-safe. The hourly recovery scan covers the last 48 hours; longer outages require an owner-reviewed recovery.

Existing Master contains 19,558 records. 2,311 have a card-data review marker and 185 have an identity review marker (these categories can overlap). Do not clear these markers without supporting evidence.

Run `node --test tests/member-service.test.mjs tests/id-card.test.mjs` and `npm run verify` for local validation. No production test registration is inserted by these tests.

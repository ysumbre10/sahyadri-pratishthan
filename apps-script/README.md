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


## Member corrections v2 — prepared 28 November 2026

Local implementation adds `contactLookup` (registered mobile or email), `requestCode`, `verifyCode`, `requestNewEmailCode`, and `saveProfile`. The old mobile+DOB lookup remains for compatibility during rollout. Only corrections send email. Email OTP expires after 10 minutes and five attempts; member-bound sessions expire after 15 minutes. New email addresses require separate verification. No photos are transmitted.

Editable fields: full and component names, DOB, mobile, email, gender, blood group, village, taluka, district, residence, state, occupation, marital status and education. Numbers, member IDs, source data and review markers are not editable. A changed phone removes old login aliases; their values stay in the private audit. Shared/duplicate contacts require organiser review.

`Master!AH:AN` holds correction count, last correction, next eligibility, changed fields, old values, new values and transaction ID. `Member corrections` records history. One save is permitted every 12 calendar months per stable member ID; February 29 anniversaries use February 28. No-op requests do not consume the allowance. A script lock serializes writes, an audit entry is written before the master change, and retrying the same verified transaction repairs an interrupted audit completion without another edit. A pending write without a matching master transaction requires organiser review. Original registration numbers remain unchanged.

Email delivery is capped at 80 requests per day globally and five per destination, with a 60-second resend gap, plus Google's remaining email quota. Support: info.sahyadripratishthan@gmail.com.

Before release: update the existing Apps Script project with Code.gs, run `authorizeMemberEmail` under the owner account (Google will require the new send-email permission), update the existing deployment to a new version, verify `/exec` version 2 and a controlled email flow. Publish the frontend only after the backend is updated. Do not change live member details for testing. Do not claim live rollout until authorization and deployment are verified.

Local verification: 19 member-service/editor/card tests and 153 generated pages passed. The final preservation fix is synced to Apps Script. Version 2 was deployed to the existing endpoint on 28 November 2026 at 20:20 IST. `authorizeMemberEmail` returned 100 remaining recipients. A real Chrome POST from the local English registration page verified contact lookup and the nonexistent-record response through Google's redirect/CORS path. Successful member lookup and OTP delivery verification are in progress; frontend publication is pending.

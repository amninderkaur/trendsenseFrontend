# Changes Made

- Added splash screen with TrendSense logo that redirects to register.
- Added dashboard MP4 video in place of slideshow placeholder.
- Removed overview card, dashboard title text, and time text from dashboard.
- Replaced Trends navigation with Budgeting.
- Added Budgeting screen connected to POST /api/shopping/suggest.
- Added profile onboarding save connected to POST /api/profile.
- Removed top, bottom, and shoe size questions from questionnaire.
- Added image upload for outfit inspiration.
- Added searchable brand multi-selects.
- Added register phone number field and SMS placeholder comment for future phone OTP endpoint.
- Added Reviews screen and API file.
- Added Admin dashboard, users management, and review history pages.
- Added dark mode toggle context and profile toggle.
- Added API helper files for profile, shopping, reviews, and admin.

## Important

Do not put email passwords in frontend code. Store secrets only in backend environment variables.

## Install/update dependencies

Run:

```bash
npm install
npx expo install expo-av
npx expo start -c
```

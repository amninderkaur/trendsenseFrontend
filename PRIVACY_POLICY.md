# Privacy Policy — TrendSense

**Effective Date:** [INSERT DATE]
**Last Updated:** [INSERT DATE]
**App Version:** 1.0.0
**Platform:** iOS · Android · Web

---

## 1. Introduction

TrendSense ("we", "us", or "our") is an AI-powered personal styling application. This Privacy Policy explains what information we collect from users of the TrendSense mobile and web application, how we use it, with whom we share it, and what rights you have over it.

By using TrendSense you agree to the practices described in this policy. If you do not agree, please stop using the app.

---

## 2. What Data We Collect and How

### 2.1 Account & Identity Data
Collected when you register or update your profile:
- **Full name** and **display name**
- **Email address**
- **Password** (transmitted over HTTPS; stored on our servers in hashed, salted form — we never store your plaintext password)
- **Phone number** (optional; only if you choose SMS as your OTP delivery method)
- **Profile photo** (optional; uploaded by you from your camera or photo library)
- **Authentication token** (JWT issued on login, stored locally on your device to maintain your session)

### 2.2 Style Preferences & Personalization Data
Collected once during onboarding via the Personalization Questionnaire, and editable at any time:
- Age group, gender identity
- Style preferences (e.g. minimalist, streetwear, classic)
- Favourite and avoided colours
- Shopping categories, preferred fit and fabrics, fit concerns
- Lifestyle occasions you dress for (e.g. work, date night, casual)
- Climate setting, budget range per item, shopping frequency
- Favourite and avoided brands
- Recommendation preferences and notification opt-in (boolean only; no push tokens are collected — see §2.7)

### 2.3 Body & Biometric-Adjacent Data
Provided voluntarily for AI analysis features:
- **Full-body photographs** uploaded from your camera or photo library for body-shape analysis
- **Optional measurements**: height, weight, chest, waist, and hip circumference (entered as text; all optional)

These inputs are sent to our backend, processed by an AI model to classify body shape, and the result is stored in your profile. The original images are not stored permanently beyond what is necessary for processing.

### 2.4 Facial / Appearance Data
Provided voluntarily for the Colour Analysis feature:
- **Selfie photograph(s)** of your face
- **Self-reported appearance attributes**: natural hair colour, current hair colour, eye colour, jewellery undertone preference, vein colour, sun reaction

This data is sent to our backend for AI colour-season classification. Results are stored in your profile.

> **Note:** Photos containing your face or body are **biometric-adjacent sensitive data**. You are never required to provide them; all features that request them can be declined without affecting core app functionality.

### 2.5 Wardrobe & Clothing Images
- Clothing item photos you upload from your camera or photo library
- AI-detected clothing tags and categories attached to each item
- Upload timestamps

### 2.6 Location Data (City-Level, User-Typed Only)
- City names you type into search fields for outfit suggestions, outfit reviews, shopping suggestions, and trip-packing lists
- Partial city-name keystrokes sent to a location autocomplete endpoint (debounced at 300 ms) to show suggestions

**We do not collect GPS coordinates, precise device location, or any location data that you have not explicitly typed yourself.**

### 2.7 Behavioural & Usage Data
- Outfit generation history (occasion, city, weather summary, selected wardrobe items, AI reasoning)
- Outfit ratings you submit (thumbs up / thumbs down)
- Free-text chat messages sent to the AI fashion assistant, including conversation history
- Moodboard names, descriptions, and inspiration images
- Shopping items you save (store name, estimated price, category, links)
- Trip packing list inputs (destination, length, activities, season, packing preference)
- Budget and shopping preference inputs
- App review messages and ratings you submit
- Login timestamps (used to enforce a 24-hour session expiry)

### 2.8 User-Generated Content
Any free-text content you create in the app — chat messages, moodboard names and descriptions, review messages — is stored on our servers and associated with your account.

### 2.9 Data We Do NOT Collect
- GPS or precise device location
- Contacts
- Microphone audio
- Push notification tokens (the app does not request notification permissions)
- Advertising identifiers (IDFA / GAID)
- Any data via third-party analytics, advertising, or crash-reporting SDKs (none are installed)

---

## 3. Why We Collect This Data (Legal Basis & Purpose)

| Data Category | Purpose | Legal Basis (GDPR) |
|---|---|---|
| Account & identity data | Create and manage your account; authenticate you; recover your account | Performance of a contract (Art. 6(1)(b)) |
| Style preferences | Personalise AI outfit and shopping recommendations | Performance of a contract; legitimate interest |
| Body & facial data | AI body-shape and colour-season analysis you explicitly request | Explicit consent (Art. 9(2)(a)); you initiate each upload |
| Wardrobe images | Build your digital wardrobe for outfit generation | Performance of a contract |
| Location (city-level) | Provide weather-appropriate outfit and packing suggestions | Performance of a contract |
| Behavioural & usage data | Improve recommendation quality; maintain outfit history; calculate AI taste profile | Legitimate interest; performance of a contract |
| Chat messages | Provide AI fashion assistant responses | Performance of a contract |
| Reviews and ratings | Improve the service; display aggregate feedback | Legitimate interest |
| Login timestamps | Enforce session expiry and account security | Legitimate interest |

---

## 4. Third Parties and SDKs We Share Data With

TrendSense does **not** use any third-party analytics, advertising, or crash-reporting SDKs. We do **not** sell, rent, or trade your personal data with any third party for commercial purposes.

The only external party your data touches is our infrastructure provider:

| Party | Role | Data Involved | Location |
|---|---|---|---|
| **Microsoft Azure** | Cloud hosting for our backend API and database | All data you send to the app (stored and processed on Azure servers in the Canada Central region) | Canada |

Azure is a data processor acting on our behalf under a Data Processing Agreement. Their privacy practices are governed by the [Microsoft Privacy Statement](https://privacy.microsoft.com/en-us/privacystatement).

**No other third party receives your data.** In particular:
- No analytics vendors (no Firebase Analytics, Mixpanel, Amplitude, Segment, PostHog, etc.)
- No advertising networks (no AdMob, Facebook Audience Network, etc.)
- No crash-reporting services (no Sentry, Crashlytics, Bugsnag, etc.)
- No social sign-in providers (no Google, Apple, or Facebook login)

We may disclose your information if required by law, court order, or to protect the rights, property, or safety of TrendSense, our users, or the public.

---

## 5. Local Storage on Your Device

The app stores a small amount of data locally on your device:

| Data | Storage Mechanism | Purpose | Expiry |
|---|---|---|---|
| JWT authentication token | Browser `localStorage` (web) / in-memory (native) | Maintain your login session | Cleared after 24 hours of inactivity, or on logout |
| User ID, email, name, role | Browser `localStorage` (web) | Populate UI without repeated API calls | Cleared on logout |
| Trends cache (fashion trends data) | Browser `localStorage` (web) / device file system (native) | Avoid redundant network requests | Cleared automatically when cache expires or you log out |
| Temporary upload images | Device cache directory (native) | Stage images before upload | Deleted immediately after upload completes |

No biometric or sensitive data is stored permanently on your device. The app does not use AsyncStorage, SQLite, MMKV, or any encrypted local database.

---

## 6. Data Retention

| Data Category | Retention Period |
|---|---|
| Account data (name, email, password hash) | Until you delete your account |
| Style profile and preferences | Until you delete your account or reset your profile |
| Wardrobe images and clothing items | Until you delete individual items or your account |
| Body analysis and colour analysis results | Until you clear them in-app or delete your account |
| Outfit history | Until you delete individual entries or your account |
| Chat conversation history | Until you clear chat history or delete your account |
| Moodboards | Until you delete individual boards or your account |
| Login timestamps and session tokens | 24 hours from creation |
| Anonymised/aggregated data | May be retained indefinitely (cannot identify you) |

When you delete your account via the app's **Settings → Delete Account** option, we will delete or anonymise all personal data associated with your account within **30 days**, except where retention is required by law.

---

## 7. Data Security

We take the following measures to protect your data:
- All data is transmitted over **HTTPS (TLS 1.2+)** between the app and our servers.
- Passwords are **hashed and salted** before storage; we cannot recover your plaintext password.
- Access to our backend and database is restricted to authorised personnel using role-based access controls.
- Our backend is hosted on **Microsoft Azure** with industry-standard physical and network security controls.
- Authentication tokens expire after 24 hours of inactivity.

No method of transmission or storage is 100% secure. If you believe your account has been compromised, please contact us immediately at [PRIVACY_EMAIL].

---

## 8. Your Rights

### 8.1 All Users
Regardless of where you live, you may at any time:
- **Access** your data — view your profile, preferences, wardrobe, outfit history, moodboards, and saved items from within the app
- **Correct** your data — edit your name, email, phone number, profile photo, and all preferences from within the app
- **Delete your account** — go to **Profile → Settings → Delete Account**; this removes your personal data from our active systems within 30 days
- **Export / portability** — contact us at [PRIVACY_EMAIL] to request a copy of your data in a portable format
- **Withdraw consent** for body/facial analysis — simply do not use those features; any previously submitted images can be cleared in-app

### 8.2 GDPR Rights (EEA, UK, Switzerland)
If you are located in the European Economic Area, United Kingdom, or Switzerland, you additionally have the right to:
- **Object** to processing based on legitimate interest (Art. 21 GDPR)
- **Restrict** processing while a dispute is resolved (Art. 18 GDPR)
- **Lodge a complaint** with your national data protection authority

Our legal bases for processing are set out in §3. Where we rely on **legitimate interest**, you may object at any time by contacting us at [PRIVACY_EMAIL]. Where we rely on **consent** (body and facial image uploads), you may withdraw consent at any time without affecting the lawfulness of prior processing.

**Data Controller:** [COMPANY/DEVELOPER NAME], [COMPANY ADDRESS]
Contact for GDPR requests: [PRIVACY_EMAIL]

We will respond to verifiable GDPR data-subject requests within **30 days**.

### 8.3 CCPA/CPRA Rights (California Residents)
If you are a California resident, you have the right to:
- **Know** what personal information we collect, use, and disclose
- **Delete** your personal information (submit via the in-app delete-account flow or email [PRIVACY_EMAIL])
- **Correct** inaccurate personal information
- **Opt out of sale or sharing** of personal information — **we do not sell or share personal information** with third parties for commercial purposes, so no opt-out mechanism is required
- **Non-discrimination** — we will not discriminate against you for exercising your privacy rights

**Categories of personal information collected** (CCPA categories): Identifiers (A); Customer records information (B); Characteristics of protected classifications — age group, gender (C); Internet or other electronic network activity — chat history, outfit history (F); Geolocation data — city level, user-typed (G); Inferences — AI style profile and taste profile (K); Sensitive personal information — body images, facial images, health-adjacent measurements (§1798.140(ae)).

To submit a CCPA request, contact us at [PRIVACY_EMAIL] with the subject line "California Privacy Request".

We will respond within **45 days** (extendable by an additional 45 days where necessary).

---

## 9. Children's Privacy (COPPA)

TrendSense is **not directed at children under the age of 13**, and we do not knowingly collect personal information from children under 13. The personalization questionnaire asks users to select an age group; users who select an age group indicating they are under 13 are not permitted to complete account registration.

If you believe we have inadvertently collected information from a child under 13, please contact us immediately at [PRIVACY_EMAIL] and we will delete it promptly.

For users between 13 and 17 (or the applicable age of digital consent in their jurisdiction), we recommend that a parent or guardian review this policy. Parental consent may be required in certain jurisdictions.

---

## 10. International Data Transfers

Our servers are located in **Canada Central** (Microsoft Azure). If you access TrendSense from outside Canada, your data will be transferred to and processed in Canada. Canada is recognised by the European Commission as providing an adequate level of data protection for commercial organisations under PIPEDA.

For EEA/UK users, where we process data outside an adequate-protection country, we rely on Standard Contractual Clauses (SCCs) as the transfer mechanism with our sub-processors.

---

## 11. Changes to This Policy

We may update this Privacy Policy from time to time. If we make material changes — particularly to how we collect or use sensitive data — we will notify you via an in-app notice and/or email before the changes take effect. The "Last Updated" date at the top of this policy will always reflect the most recent revision. Continued use of the app after changes take effect constitutes acceptance of the revised policy.

---

## 12. Contact Us

If you have any questions, concerns, or requests about this Privacy Policy or your personal data, please contact:

**TrendSense Privacy Team**
📧 [PRIVACY_EMAIL]
📬 [COMPANY ADDRESS]
🌐 [PRIVACY_PAGE_URL] *(if applicable)*

For GDPR-specific inquiries or to reach our Data Protection Officer (if applicable):
📧 [DPO_EMAIL]

We aim to respond to all privacy-related inquiries within **5 business days**.

---

*This Privacy Policy was last generated based on a full audit of TrendSense v1.0.0 (Expo SDK 54, React Native 0.81.5).*

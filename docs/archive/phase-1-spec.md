# Trip Journal App — Phase 1 Spec (MVP journal)

Companion to `trip-journal-plan-v7.md`. This spec defines exactly what Phase 1 includes, how each part should behave, and what "done" means.

**Phase 1 goal:** people can log trips quickly (live or past), add optional details and photos, save places, and see where their friends went and what they loved.

**Phase 1 does not include:** planning interface, booking status, nearby search, location permission, camera roll access, tags, AI.

---

## 1. Decisions to make before building

These are expensive to change later. Recommendations are marked ✅.

| # | Decision | Options | Recommendation |
|---|---|---|---|
| D1 | **Place data provider** | Google Places (New) · Foursquare Places | ✅ **Google Places**, called through our own backend function (never directly from the app). Google's terms allow storing **place IDs permanently**, caching **coordinates for up to 30 days**, and require fetching **other details (name, address, etc.) fresh**. Design: store place ID plus our own user data permanently; cache coordinates with a 30-day expiry and refresh them in a background job. |
| D2 | **Maps library** | `react-native-maps` · Mapbox (`@rnmapbox/maps`) | ✅ **`react-native-maps` set to the Google Maps provider on both iOS and Android.** Google's terms don't allow showing Places data on a non-Google map, so the iOS default (Apple Maps) can't be used. Phase 1 only needs pins and straight lines. |
| D3 | **Sign-in methods** | Apple · Google · email (magic link or password) | ✅ **Apple + Google + email magic link.** Apple sign-in is required by the App Store if you offer other social sign-ins. |
| D4 | **Platforms at launch** | iOS · Android · both | ✅ **Both** via Expo, but test mainly on whichever phone you own, and beta on that platform first if time is tight. |
| D5 | **Friend model** | Mutual friends (request + accept) · one-way follow | ✅ **Mutual friends.** Fits a private, friends-only app and keeps privacy rules simple. |
| D6 | **Offline logging** | Online only · queue changes while offline | ✅ **Online only, with clear errors and retry** for Phase 1. Travelers do lose signal, so treat full offline support as an early Phase 2 candidate. Unsent photo uploads should still retry automatically. |

---

## 2. Screens

| # | Screen | Purpose |
|---|---|---|
| S1 | Welcome / sign in | Sign in with Apple, Google or email |
| S2 | Onboarding | Set name and photo → invite friends → "Add favorites from a past trip" prompt |
| S3 | Home (feed) | Friends' new trips, highlights and photos; entry to My Trips |
| S4 | My trips | List of your trips (active, past), "New trip" button |
| S5 | New trip | Live or past, city (or cities), optional dates, visibility |
| S6 | Trip page (mine) | Day-by-day list of stops, trip map, cover photo, edit and privacy settings |
| S7 | Add stop (search) | City-focused place search, recents, "Add stops to today" |
| S8 | Stop details | Optional time, rating, highlight, note, photos; category edit; delete |
| S9 | Past trip quick-add | Search and mark ❤️ Favorite / ✓ Been, no days required |
| S10 | Trip page (friend's) | Read-only view of a friend's trip with map and days |
| S11 | City page | "Your friends in [city]": friends' stops by highlights and ratings, category filter, photo grid |
| S12 | Place page | Place info, which friends went, ratings, notes, photos, typical time spent, Save |
| S13 | Saved | Lists and Want to go |
| S14 | Friends | Friend list, requests, invite link, search by username |
| S15 | Profile and settings | Your profile, trips count, default privacy, notifications, account deletion |

**Navigation (tab bar):** Home · Trips · ➕ (quick add stop) · Saved · Profile.
City and place pages open from search, feed items, trip pages and saved places.

---

## 3. User stories and done criteria

### Epic A — Account and onboarding
- **A1. Sign in.** As a new user, I can sign in with Apple, Google or an email link.
  - Done when: all three work; a profile is created on first sign-in; sign-out works.
- **A2. Profile.** I can set a display name, unique username and optional photo.
  - Done when: usernames are unique and case-insensitive; the profile photo is compressed before upload.
- **A3. Onboarding.** After sign-in, I'm guided to invite friends and add a past trip, and can skip either.
  - Done when: both steps are skippable; the past-trip step opens S9.
- **A4. Delete account.** I can delete my account and all my data.
  - Done when: trips, stops, photos, lists and friendships are deleted (required by both app stores).

### Epic B — Friends
- **B1. Invite.** I can share an invite link; anyone who signs up through it gets a friend request from me.
- **B2. Find and request.** I can search by username and send a friend request.
- **B3. Accept or decline.** I can accept or decline requests, and remove friends.
  - Done when: removing a friend immediately hides each person's Friends-only content from the other.

### Epic C — Trips
- **C1. Create a trip.** I can create a trip with a title, city (or several cities), optional start and end dates, and visibility.
  - Done when: city is chosen from place search (not free text) so search can focus on it; title defaults to the city name.
- **C2. Live vs. past.** A trip with dates including today, or no end date yet, is active; a trip with an end date in the past is completed. Past trips can be created without dates.
- **C3. Edit and delete.** I can edit trip details, change the cover photo, and delete a trip (with confirmation).

### Epic D — Logging stops (live trips)
- **D1. Search.** On S7, typing shows autocomplete results focused on the trip's city.
  - Done when: results appear within about 300 ms of typing pausing; requests are debounced; nothing asks for location permission.
- **D2. Recents.** Before I type, S7 shows my recently logged and saved places in this city.
- **D3. Add a stop in 3 taps.** Tap ➕ → tap a result (or type, then tap) → the stop is added to today.
  - Done when: the category is filled in from the place type; the stop appears in today's list immediately.
- **D4. Add several stops.** "Add stops to today" keeps search open after each add, showing a running count.
- **D5. Choose the day.** Stops go to today by default; I can pick another day of the trip.
- **D6. Reorder.** I can drag stops to reorder within a day.
- **D7. Evening reminder.** An optional local notification at a time I choose (default 9pm) during active trips: "Want to log today's stops?" Can be turned off.

### Epic E — Stop details (all optional)
- **E1. Collapsed by default.** S8 shows the place and category; "Add details" expands the optional fields.
- **E2. Times.** I can set a start and end time. "Now" sets the start; quick buttons (30 min · 1 hr · 2 hr) set the end from the start.
  - Done when: times are stored in the place's local time zone and always display in that time zone; end before start is not allowed.
- **E3. Order by time.** Stops with times sort by start time within a day; stops without times keep their manual position.
- **E4. Rating, highlight, note.** I can set 1–5 stars, mark ❤️ Highlight, and write a note.
- **E5. Category.** I can change the category.
- **E6. Delete.** I can delete a stop.

### Epic F — Past trips
- **F1. Quick-add.** On S9 I can search places in the trip's city and mark each ❤️ Favorite or ✓ Been, staying on the search screen.
  - Done when: adding 5 places takes under 1 minute in testing; no day or time is required.
- **F2. Optional days.** If I want, I can assign past-trip stops to days and add any stop details.

### Epic G — Photos
- **G1. Add photos.** From S8 I can add photos using the system photo picker.
  - Done when: the app never requests full photo library access.
- **G2. Compress and clean.** Photos are resized to about 1600 px, compressed, and have location data removed before upload.
- **G3. Background upload.** Uploads continue if I leave the screen; Wi-Fi only by default (setting to allow mobile data); failed uploads retry; pending photos show a small indicator.
- **G4. Visibility.** Each photo is Friends (default, following the trip) or Private.
- **G5. Cover photo.** I can choose a cover photo for a stop and for a trip.

### Epic H — Maps
- **H1. Day map.** On S6 and S10, a map shows the day's stops as numbered pins with straight lines in order.
- **H2. Trip map.** An overview map shows all stops in the trip, colored by day.
  - Done when: the map fits all pins; no "you are here" dot; no location permission.

### Epic I — Saving
- **I1. Save a place.** From a place page, friend's trip or search, I can save a place to a list or to Want to go.
- **I2. Lists.** I can create, rename and delete lists, and remove places from them.
- **I3. Want to go cities.** I can add a city to Want to go.

### Epic J — Discovery
- **J1. Feed.** S3 shows friends' recent activity: new trips, highlighted stops and new photos, newest first.
  - Done when: only content I'm allowed to see appears; tapping opens the trip or place.
- **J2. City page.** S11 lists all stops my friends logged in that city, sorted by highlights, then rating, then number of friends; filter by category; photo grid.
- **J3. Place page.** S12 shows which friends went (with rating, highlight, note and photos), and typical time spent if at least 2 friends logged times.
- **J4. Friend's trip.** S10 shows a friend's trip day by day with the map, respecting their privacy settings.

### Epic K — Privacy
- **K1. Trip visibility.** Each trip is Private, Friends, or a specific group of friends. Default is set in settings (default: Friends).
- **K2. Hide details.** For non-private trips, I can hide exact dates, times and the route map while places stay visible.
- **K3. Enforced on the server.** Privacy rules are enforced by database access rules, not only hidden in the app.
  - Done when: automated tests confirm a non-friend, a removed friend and a friend outside the chosen group cannot read restricted trips, stops or photos.

---

## 4. Who can see what

| Content | Owner | Friend (allowed by trip visibility) | Anyone else |
|---|---|---|---|
| Trip title, city, places | ✅ | ✅ | ❌ |
| Exact dates | ✅ | ✅ unless hidden | ❌ |
| Times | ✅ | ✅ unless hidden | ❌ |
| Route map | ✅ | ✅ unless hidden | ❌ |
| Rating, highlight, note | ✅ | ✅ | ❌ |
| Photos (Friends) | ✅ | ✅ | ❌ |
| Photos (Private) | ✅ | ❌ | ❌ |
| Private trip (anything) | ✅ | ❌ | ❌ |
| Lists and Want to go | ✅ | ❌ (shared lists in Phase 2) | ❌ |

---

## 5. Quality requirements

- **Speed:** logging a stop without extras in under 10 seconds; search results in about 300 ms after typing pauses.
- **Time zones:** every stop time is stored with the place's time zone; test with a trip that crosses time zones and a viewer in a different time zone.
- **Costs:** debounce autocomplete, use session tokens if the place provider supports them, cache place details within the provider's rules.
- **Accessibility:** readable text sizes, supports system font scaling, color is never the only signal.
- **Crash and error reporting:** included from the first beta (e.g. Sentry).
- **App store requirements:** account deletion, privacy policy, Sign in with Apple.

---

## 6. Build order and milestones

| Milestone | Includes | Check |
|---|---|---|
| **M0 — Setup** (week 1) | Expo app, Supabase project, full database schema, access rules skeleton, sign-in | You can sign in on your phone |
| **M1 — Core flow** (weeks 1–2) | Create trip → search place → log stop → stop details (time, rating, highlight, note) → day map | You can log a real day out in your own city in under a minute |
| **M2 — Friends and privacy** (week 3) | Profiles, invites, requests, trip visibility, access rule tests | A test friend sees your Friends trip but not your Private one |
| **M3 — Discovery** (weeks 4–5) | Friend's trip page, city page, place page | City page shows a friend's stops correctly |
| **M4 — Past trips and saving** (week 5) | Quick-add, lists, Want to go | Add 5 past favorites in under a minute |
| **M5 — Photos** (week 6) | Picker, compression, location removal, background upload, cover photos | Photos upload reliably on Wi-Fi with location data removed |
| **M6 — Feed and polish** (weeks 7–8) | Feed, evening reminder, onboarding, empty states, error handling, account deletion | Ready for beta |
| **Beta** | 10–20 friends who travel | Measure logging speed, activation, past-trip favorites |

Timeline assumes roughly full-time work; part-time will take proportionally longer.

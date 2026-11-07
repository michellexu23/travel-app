# Outings & Travel App — Phase 1 Spec (v2)

*Companion to `product-plan-v8.md`. Supersedes `phase-1-spec.md`.*

**Phase 1 goal:** people can log places quickly, build outings and trips, share them with friends, save and copy friends' outings, and build a personal profile of everywhere they've loved.

**Not in Phase 1:** planning map, booking status, collaborators, nearby search, location permission, camera roll access, evening reminder, hiding dates/times/route separately, typical time spent, city category filters, tags, AI.

**Phase 1 is split into three parts** (details in section 6):
- **1A — Interview-ready core:** the smallest version that covers the system design topics worth discussing, shipped to 5–10 friends.
- **1B — Scale and depth:** synthetic data at scale, benchmarks, a feed design experiment and a scaling write-up. This is where most of the system design material comes from.
- **1C — Complete MVP:** the remaining stories in section 3, built if the app is getting real use.

Stories marked **[1C]** in section 3 are deferred from the core.

---

## 1. Decisions

| # | Decision | Choice |
|---|---|---|
| D1 | Place data | **Google Places (New), called through a Supabase Edge Function.** Store place IDs permanently; cache coordinates up to 30 days with a scheduled refresh; fetch names and other details fresh, cached briefly. |
| D2 | Maps | **`react-native-maps` with the Google Maps provider on both platforms.** Pins and straight lines only. |
| D3 | Sign-in | **1A: email magic link only.** 1C: add Apple + Google (Apple is required by the App Store once Google is offered). |
| D4 | Platforms | **1A: iOS only** (Expo keeps the code cross-platform). Develop in Expo Go for M0–M1; from M2, use a development build from EAS Build (cloud builds, no Mac needed) so Google Maps works on iOS. Requires the Apple Developer Program ($99/year) for device builds and TestFlight. 1C: ship Android. |
| D8 | Outings vs. trips | **One `Itinerary` structure for both.** Every stop has a `day_number` (default 1); an outing is just a one-day itinerary. `kind` is a user-editable label (suggested from the number of days) that changes the UI and discovery, not the structure. Users see "outing" and "trip," never "itinerary." |
| D5 | Friends | **Mutual friends** (request + accept). Friend groups in 1C. |
| D6 | Offline | **Online only, with clear errors and retry.** Photo uploads retry automatically. Offline support is early Phase 2. |
| D7 | Data model | **Three core concepts:** PlaceOpinion (overall relationship with a place), Itinerary (outing or trip: the route), Visit (what actually happened). Copies instead of live links. |

---

## 2. Screens

**Tab bar:** Home · Explore · ➕ · Saved · Profile

| # | Screen | Purpose |
|---|---|---|
| S1 | Welcome / sign in | Apple, Google or email |
| S2 | Onboarding | Name, username, photo → home base city → mark a few ❤️ Loved places → invite friends (each step skippable except username) |
| S3 | Home (feed) | Friends' published and completed outings and trips, loved places, highlights |
| S4 | Explore | Search a city → City page; recent cities; your Want to go cities |
| S5 | Add (➕) | Choose: **Log a place** · **New outing** · **New trip**; shows any active itinerary first ("Add to Saturday in Greenpoint") |
| S6 | Place search | City-focused autocomplete, recents, "add several in a row" mode |
| S7 | Visit details | Optional time, rating, highlight, note, photos; category; visibility; delete |
| S8 | Place page | Friends' opinions, visit notes and photos; outings containing it; your opinion (Want to go · Been · ❤️ Loved · rating); Save |
| S9 | New / edit itinerary | Kind (outing or trip), title, city, dates (optional), description, cover, status, visibility |
| S10 | Itinerary page (mine) | Stops in order (by day for trips), map, add / reorder / remove stops, log visits, publish |
| S11 | Itinerary page (friend's) | Read-only route with the creator's ratings and notes, map, 💡 Idea / ✓ Done it label, Save, Copy |
| S12 | City page | "Your friends in [city]": places ranked by loved, rating, number of friends; friends' outings and trips; photo grid |
| S13 | Saved | Lists (places and itineraries), Want to go places and cities |
| S14 | Profile (mine and friends') | Header and stats; tabs: Favorites · Map · Diary · Outings & trips |
| S15 | Friends | Friend list, requests, invite link, username search, friend groups |
| S16 | Settings | Default visibility, photo upload on mobile data, account deletion, sign out |

---

## 3. User stories and done criteria

### Epic A — Account and onboarding
- **A1. Sign in** with an email link. *Done when* it works, a profile row is created on first sign-in, and sign-out works. **[1C]** Add Apple and Google.
- **A2. Profile basics:** display name, unique username (case-insensitive), optional photo (compressed) and bio.
- **A3. Home base:** I choose my home city during onboarding; it's the default city for search. Editable in settings.
- **A4. [1C] Quick favorites in onboarding:** I can mark a few places ❤️ Loved in my home base without logging visits. Skippable.
- **A5. Delete account** removes all my data (itineraries, visits, opinions, photos, lists, friendships). Required by both app stores.

### Epic B — Friends
- **B1. Invite link:** anyone who signs up through it gets a friend request from me.
- **B2. Search by username** and send a request.
- **B3. Accept, decline, remove.** *Done when* removing a friend immediately hides each person's Friends content from the other.
- **B4. [1C] Friend groups:** I can create named groups ("College friends") and share an itinerary with just that group.

### Epic C — Places and opinions
- **C1. Search:** autocomplete focused on the chosen city (home base or itinerary city). *Done when* results appear about 300 ms after typing pauses, requests are debounced, they go through the Edge Function, and no location permission is requested.
- **C2. Recents:** before typing, search shows my recently logged and saved places in that city.
- **C3. Opinion:** on any place page I can set Want to go, Been, ❤️ Loved and an overall rating (1–5). *Done when* there is exactly one opinion per user per place (unique constraint).
- **C4. Visits update opinions:** logging a visit sets Been automatically; it never changes Loved or the overall rating by itself.

### Epic D — Logging visits
- **D1. Log a place in about 3 taps:** ➕ → Log a place → search → select. Creates a visit for today. *Done when* the category is suggested from the place type and the visit appears in my diary immediately.
- **D2. Add several in a row:** search stays open after each add, with a running count.
- **D3. Choose the date:** today by default; any past date allowed; date optional when marking past favorites.
- **D4. Optional details** (collapsed by default under "Add details"): start and end time ("Now" button; 30 min · 1 hr · 2 hr), rating for this visit, ❤️ highlight, note, photos. *Done when* times are stored as local time at the place and always displayed in that time zone, and an end before the start is rejected by a database constraint.
- **D5. Edit and delete** a visit.

### Epic E — Itineraries (outings and trips)
- **E1. Create** an outing (title, city, optional description and cover) or a trip (title, one or more cities, optional start and end dates).
- **E2. Status:** 💡 Idea · Planned · Active · ✓ Completed. I can change it any time. Past outings and trips are Completed with optional dates.
- **E3. Add stops** from place search (S6), in order. For trips, choose the day.
- **E4. Reorder** stops by dragging; for trips, move stops between days.
- **E5. Recommendation note** per stop ("must-try"), separate from my visit note.
- **E6. Log as you go:** while an itinerary is Active, adding a stop also logs a visit linked to it. I can also mark an existing stop as visited (creates the visit) or skipped.
- **E7. Log afterward:** on a Completed itinerary, I can add visits to stops at any time.
- **E8. Delete** an itinerary (with confirmation). Linked visits stay in my diary but lose the link.

### Epic F — Sharing, saving and copying
- **F1. Publish:** set visibility to Friends (a group in 1C). The page shows 💡 Idea or ✓ Done it from the status.
- **F2. Friend's itinerary page:** stops in order with the creator's ratings (from their visits) and notes, map, and creator info.
- **F3. Save** a friend's itinerary to my Saved collection (to a named list in 1C).
- **F4. Copy** a friend's itinerary into my own. *Done when* the copy has new rows, `remixed_from_id` set, shows "Based on [name]'s [title]" (if I can still see the original), contains no visits, and the original is unchanged.

### Epic G — Photos
- **G1. Add photos** to a visit, or as an itinerary cover, through the system photo picker. *Done when* the app never requests full photo library access.
- **G2. Before upload:** resized to about 1600 px, compressed, location data removed.
- **G3. Background upload:** continues after leaving the screen; Wi-Fi only by default; retries on failure; pending indicator.
- **G4. Visibility:** follows the visit or itinerary by default, with a per-photo Private option.

### Epic H — Maps
- **H1. Itinerary map:** numbered pins in order, straight lines between them, total estimated distance; trips color each day. Fits all pins on screen.
- **H2. [1C] Personal map** on the profile: every place I've been.
- **H3. No "you are here" dot** and no location permission.

### Epic I — Saving
- **I1. Saved:** one Saved collection holding places and itineraries (implemented as a default list, so named lists need no schema change). **[1C]** Named lists: create, rename, delete, remove items.
- **I2. Want to go:** places (from opinions). **[1C]** Cities (a city is a place).

### Epic J — Discovery
- **J1. Feed** shows, newest first: itineraries friends published or completed, places they ❤️ loved, highlighted visits. *Done when* only content I'm allowed to see appears and pagination works (cursor-based).
- **J2. City page** ranks friends' places with a score combining loves, ratings and number of friends, using a **Bayesian average** so one 5-star rating doesn't outrank twenty 4.5s (document the formula and why); lists friends' outings and trips in that city; shows a photo grid.
- **J3. Place page** shows friends who've been with their opinion, visit notes and photos, and itineraries containing the place that I'm allowed to see.

### Epic K — Profile
- **K1. Header:** name, photo, home base, bio, stats (cities · outings · places).
- **K2. Favorites:** ❤️ Loved places grouped by category.
- **K3. [1C] Map:** places with Been.
- **K4. [1C] Diary:** visits and completed itineraries in date order.
- **K5. Outings & trips:** published ones for friends; all of them on my own profile.
- *Done when* a friend viewing my profile sees only what my visibility settings allow.

### Epic L — Privacy
- **L1. Itinerary visibility:** Private · Friends (· Group in 1C). Default Friends (changeable in settings).
- **L2. Visits and opinions:** default Friends, per-item Private option.
- **L3. Enforced in the database** with Row Level Security. *Done when* automated tests confirm that a non-friend, a removed friend, and a friend outside the chosen group cannot read restricted itineraries, stops, visits, opinions or photos.

---

## 4. Who can see what

| Content | Owner | Friend (allowed) | Anyone else |
|---|---|---|---|
| Profile header and stats | ✅ | ✅ | Username and photo only (for friend requests) |
| Itinerary (Friends or their group) | ✅ | ✅ | ❌ |
| Itinerary (Private) | ✅ | ❌ | ❌ |
| Visit or opinion (Friends) | ✅ | ✅ | ❌ |
| Visit or opinion (Private) | ✅ | ❌ | ❌ |
| Photos | Follow their visit or itinerary; per-photo Private | | ❌ |
| Lists | ✅ | ❌ (shared lists in Phase 1.5) | ❌ |
| Copy credit ("Based on…") | Shown only if the viewer can see the original | | |

---

## 5. Quality requirements

- **Speed:** log a place without extras in under 10 seconds; search results about 300 ms after typing pauses.
- **Time zones:** visit times stored as local time plus the place's time zone; tested with a trip across time zones and a viewer in another time zone.
- **Costs:** debounced autocomplete with session tokens; Edge Function rate limiting per user; caching within Google's terms.
- **Database integrity:** constraints for ratings (1–5), end after start, one opinion per user per place, a list item references exactly one place or itinerary.
- **Accessibility:** system font scaling; color is never the only signal.
- **Error reporting:** Sentry (or similar) from the first beta.
- **App stores:** account deletion, privacy policy, Sign in with Apple.
- **Secrets:** no API keys in the repo or app bundle beyond public, restricted keys.

---

## 6. Milestones

Timelines assume roughly 15–20 hours a week alongside a job and interview prep. Adjust if you have more time.

### Phase 1A — Interview-ready core (about 10–12 weeks)

| Milestone | Includes | Check | Interview topics |
|---|---|---|---|
| **M0 — Setup** (week 1) | Node, Git, GitHub repo, Expo app, Supabase local development, migrations in Git, email sign-in, CI running lint and type checks | Sign in on your phone; CI passes on every push | Client–server, auth tokens (JWT), migrations, CI |
| **M1 — Places and visits** (weeks 2–3) | Places Edge Function (hides the key, session tokens, per-user rate limit, cache table with expiry), search with debouncing, log a visit, optional details, opinions | Log a real afternoon in your city | API gateway/proxy, caching and TTLs, rate limiting, database constraints |
| **M2 — Itineraries and maps** (weeks 3–5) | Outings and trips, stops, ordering and moving between days, log as you go, itinerary map | **Usable for yourself** | Data modeling trade-offs, ordering lists in SQL (integer positions vs. fractional indexing), time zones |
| **M3 — Friends and privacy** (weeks 5–6) | Invites, requests, accept/remove, RLS on every table, privacy tests run in CI | A test friend sees exactly what they should; tests prove a non-friend can't | Authorization, defense in depth, testing security rules |
| **M4 — Sharing** (week 7) | Publish, friend's itinerary page, Save, Copy with credit | Copy a friend's outing without changing theirs | Copy-on-write vs. shared references |
| **M5 — Discovery** (weeks 8–9) | Feed (assembled when read), city page with Bayesian-average ranking, place page, cursor pagination, indexes | City page ranks sensibly; feed pages smoothly | News feed design, ranking, indexes, pagination, N+1 queries |
| **M6 — Photos** (week 10) | Photo picker, compression, location removal, storage with signed URLs, background upload with retries | Photos upload reliably and never contain location data | Object storage, CDNs, signed URLs, retries and idempotency |
| **M7 — Beta** (weeks 11–12) | Simple profile (header, favorites, outings & trips), coordinate refresh job, error monitoring, account deletion, TestFlight or Play internal testing, README with architecture diagram and decision records | **5–10 friends using it** | Scheduled jobs, observability, shipping to real users |

### Phase 1B — Scale and depth (about 3–4 weeks)

The beta won't have real scale, so this phase creates it. This is the strongest material for system design interviews: you'll have measured answers, not just theory.

| Milestone | Includes | Check | Interview topics |
|---|---|---|---|
| **M8 — Synthetic data** | Python script to generate realistic data, e.g. 100k users, a power-law friend graph (a few people with many friends), about 5M visits and 500k itineraries, loaded into a separate database | Data loads repeatably from a seed | Data generation, realistic distributions, bulk loading |
| **M9 — Query performance** | Benchmark the feed, city page and place page with `EXPLAIN ANALYZE`; add and justify indexes; record p50/p95 latency before and after | A table of before/after numbers in the repo | Indexes, query plans, latency percentiles |
| **M10 — Feed design experiment** | Build a second feed: precomputed when content is written (fan-out on write) via a job queue, compared with assembling it when read; measure both, including users with many friends | A written comparison with numbers | Fan-out on read vs. write, queues, the "celebrity" problem, consistency trade-offs |
| **M11 — Load testing and caching** | Load test the API and Places proxy (e.g. with k6); measure cache hit rate and Google API calls saved; tune rate limits | Results and charts in the repo | Throughput, caching effectiveness, rate limiting, cost control |
| **M12 — Scaling write-up** | A design doc: "How this would scale to 10M users": read replicas, a cache like Redis, queues, CDN, partitioning by user, search, what breaks first | A design doc you can walk an interviewer through | End-to-end system design narrative |

### Phase 1C — Complete MVP (about 4–6 weeks, optional for interviews)

Build this if friends are actively using the app: the **[1C]** stories in section 3 (Apple and Google sign-in, friend groups, named lists, Want to go cities, onboarding favorites, profile map and diary) plus the second platform and polish.

### After Phase 1

Phases 1.5, 2 and 3 continue as in the product plan.

---

## 7. Recruiting deliverables

Produced along the way so the project is ready to show at any point:

| Deliverable | When |
|---|---|
| Public GitHub repo with CI badge, clean commit history and no secrets | From M0 |
| `docs/decisions/` with one short decision record per major choice | Ongoing |
| README: what it is, demo GIF, architecture diagram, how privacy is enforced | M7 |
| Benchmark results and the feed design comparison | M9–M10 |
| Scaling design doc | M12 |
| 3–4 resume bullets with numbers (users, latency improvements, test coverage) | After M7, updated after M11 |
| Practiced 2-minute and 10-minute walkthroughs of the architecture | After M7 and M12 |

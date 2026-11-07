# Outings & Travel App — Product Plan (v8)

*Supersedes v7. Adds Outings, a Letterboxd-style profile, standalone place logging, and a simpler data model built on three core concepts.*

> **Discover outings and trips through friends you trust, plan them together, and keep a record of everywhere you've loved.**

---

## 1. What changed from v7

| Change | Why |
|---|---|
| **Outings** are a core concept (a Saturday in Greenpoint, a pizza crawl, a day trip) | People go on outings weekly but travel a few times a year, so outings mean more logging, more friend data and a reason to open the app between trips |
| **Profile becomes a personal identity**: favorites, personal map, diary, published outings and trips | Gives people a reason to keep logging, and makes friends' taste easy to explore |
| **Log a place without creating a trip** | Needed for local exploration and repeat visits |
| **Overall opinion of a place is separate from individual visits** | You can visit a place many times; your rating of it and each visit are different things |
| **Recommended route is separate from what someone actually did** | Copying and repeat visits work without overwriting anyone's data |
| **One "Itinerary" concept covers both outings and trips** | A trip day is structurally an outing, so one model, one map and one ordering system handle both |
| **Outings are labeled 💡 Idea or ✓ Done it** | Keeps the app's edge: friends' *real* experiences rank first |
| **Phase 1 cuts**: evening reminder, hide dates/times/route, typical time spent, city category filters, separate past-trip flow | Makes room for outings and the profile |
| **Realistic timeline for a solo developer learning as they go** | A shipped, polished app beats a bigger unfinished one, especially for recruiting |

---

## 2. Positioning

**One sentence:** *Discover outings and trips through friends you trust, plan them together, and keep a record of everywhere you've loved.*

| App | What it does | What this app does differently |
|---|---|---|
| Wanderlog | Plans trips; public guides | Friends' real experiences, outings as well as trips, journal-first |
| Beli | Ranks restaurants among friends | All kinds of places, plus whole outings and trips |
| Polarsteps | Logs trip routes and photos | Structured ratings, friend recommendations, local outings |
| Mapstr / Corner | Saves favorite places on a map | Ordered outings and trips, visit history, profile |
| Letterboxd (inspiration) | A personal record of films and taste | The same idea for places, outings and trips |

The advantage is the combination: **friend-based trust + whole experiences (outings and trips) + a lasting personal record**, with planning built around friends' data rather than competing on planning features.

---

## 3. Principles

- **Logging is the only required step.** Times, ratings, notes, highlights and photos are optional.
- **Manual first, fast by default.** Logging a place takes about 3 taps and never requires creating an outing or trip.
- **Places are persistent; outings and trips add context.** The same place appears in many outings and trips without being duplicated.
- **Ideas and memories are both welcome, but labeled.** 💡 Idea vs. ✓ Done it; "Done it" ranks higher.
- **The user stays in control.** No automatic logging, background tracking or photo attachment.
- **Friends' data comes first** in recommendations, plans and AI answers.
- **Planning stays light until users need more.**
- **Privacy is enforced on the server**, not just hidden in the app.
- **Ask for as little as possible.** Phase 1 needs no location permission and no camera roll access.
- **Every scale fits**: a three-stop neighborhood walk and a two-week trip abroad.

---

## 4. Core concepts

| Concept | What it is | Examples |
|---|---|---|
| **Person (profile)** | A user's identity: favorites, map, diary, outings and trips | "Maya: 18 cities · 42 outings · 96 places" |
| **Place** | A real location, identified by its Google place ID | A Brooklyn pizzeria |
| **PlaceOpinion** | One person's overall relationship with a place: Want to go · Been · ❤️ Loved · overall rating | "Maya loves this pizzeria, ⭐ 5" |
| **Itinerary** | An ordered set of places. `kind`: **outing** (hours to a day) or **trip** (several days). `status`: idea → planned → active → completed | "Brooklyn pizza crawl" (outing) · "A week in Japan" (trip) |
| **Visit** | One person's record of being at a place on a given day: optional times, rating for that visit, note, photos. May be linked to an itinerary stop or stand alone. | "Went March 3, 12:30–13:15, ⭐ 4, 'go early'" |
| **List** | A saved collection of places and/or itineraries | "Rainy-day ideas," "Ramen to try" |

**How they fit together**
- A **visit** can stand alone (just logging a place) or belong to an itinerary.
- An **itinerary** holds the *recommended or planned* route; **visits** hold *what actually happened*.
- A **trip** is an itinerary with days. Adding a friend's outing to a trip **copies** its stops into a trip day and records where they came from, so the two never need to stay in sync.
- **Copying (remixing)** an outing creates a new itinerary with `remixed_from` pointing at the original, which stays untouched and keeps its credit ("Based on Maya's pizza crawl").
- Your **PlaceOpinion** is updated from your visits (e.g. logging a visit marks the place as Been), but you can set it directly too, e.g. marking past favorites as ❤️ Loved without logging visits.

---

## 5. The loop

**Discover → Save → Plan together → Go → Log & remember → Share & inspire → (friends) Discover...**

It can start anywhere: logging a spontaneous afternoon, saving a friend's outing, or planning a vacation.

- **Social loop:** friends log places and outings → you discover them → you save or copy them → you share your own.
- **Planning loop:** collect ideas → arrange into an outing or trip → follow it while out → it becomes your diary and recommendations.

---

## 6. Categories

| Category | Covers |
|---|---|
| 🏨 Stay | Hotels, rentals, hostels, campsites |
| 🍽️ Food | Restaurants, street food, food markets, bakeries |
| ☕ Drinks | Cafés, bars, wineries, nightlife |
| 📍 Sights | Landmarks, museums, viewpoints, neighborhoods |
| 🌲 Nature | Parks, beaches, trails, lakes |
| 🎟️ Activities | Tours, classes, shows, spas, sports, events |
| 🛍️ Shopping | Shops, markets, boutiques |
| 🚆 Getting around | Airports, stations, ferries, car rentals (hidden from recommendations by default) |
| ➕ Other | Anything else |

Suggested from the place type and editable. Tags come in Phase 3.

---

## 7. Phase 1 — MVP: social journal + outings

### A. Logging places (standalone)
- **Place search with autocomplete**, focused on a chosen city: your **home base** (set in your profile) by default, or the itinerary's city.
- **Recent places** at the top of search.
- **About 3 taps:** ➕ → search → select → logged as a visit today.
- **Optional details,** collapsed under "Add details": 🕐 start and end time ("Now" button, quick durations) · ⭐ rating for this visit · ❤️ highlight · note · 📷 photos.
- **Overall opinion** on any place: Want to go · Been · ❤️ Loved · overall ⭐ rating. Logging a visit marks it Been automatically.
- **Mark places without visits:** add past favorites quickly ("❤️ Loved", "Been") without dates. This replaces the separate past-trip flow.

### B. Itineraries: outings and trips
- **Create an outing** (title, city, optional description and cover) or a **trip** (title, city or cities, optional dates).
- **Status:** 💡 Idea · Planned · Active · ✓ Completed. Past trips and outings are simply Completed, with optional dates.
- **Ordered stops**, reorder by dragging. Trips group stops by day.
- **Log as you go:** while an itinerary is active, adding a stop also logs a visit. Or log everything afterward.
- **Stop notes:** a recommendation note for others ("must-try stop") separate from your visit note.
- **Map:** numbered pins with straight lines in order, plus total estimated distance. Trips show each day in its own color.

### C. Sharing outings and trips
- **Publish** an itinerary to friends (or a chosen group), labeled **💡 Idea** or **✓ Done it** based on its status.
- **Save** a friend's outing or trip to a list.
- **Copy** a friend's outing or trip into your own; the copy keeps credit ("Based on Maya's") and the original is never changed.
- **Shareable itinerary page:** title, creator, stops in order with the creator's ratings and notes, map, Save and Copy buttons.

### D. Profile (Letterboxd-style)
- **Header:** name, photo, home base, short bio, stats (cities · outings · places).
- **Favorites:** places marked ❤️ Loved, grouped by category.
- **Personal map:** every place you've been.
- **Diary:** visits and completed itineraries in date order.
- **Outings & trips:** published ones, plus private ones on your own profile.
- Friends see the parts you've allowed (see privacy).

### E. Photos (optional, always chosen by the user)
- Added through the **phone's built-in photo picker**; the app never needs access to the whole camera roll.
- Compressed on the phone (about 1600 px), uploaded in the background on Wi-Fi by default, failed uploads retry.
- Location data removed from every photo before upload. Per-photo visibility (private or friends).
- Cover photos for itineraries.

### F. Saving
- **Lists** containing places and/or itineraries.
- **Want to go** for places and cities (a city is just a place).

### G. Discovery
- **Friends feed:** outings and trips friends published or completed, places they ❤️ loved, highlights. Not just "Maya created a trip."
- **City page:** "Your friends in Lisbon": places sorted by loved, then rating, then number of friends; friends' outings and trips there; photo grid.
- **Place page:** friends who've been, their overall opinions, visit notes and photos; outings that include it; Save and Want to go.
- **Itinerary page** (see C).

### H. Privacy
- **Per itinerary:** Private · Friends · a specific group.
- **Standalone visits and opinions:** a default (Friends) with a per-item Private option.
- **Photos:** follow their visit or itinerary, with a per-photo Private option.
- **Enforced in the database** (Row Level Security), with automated tests.

### Not in Phase 1
Planning map, booking status, collaborators, nearby search, location permission, camera roll access, evening reminder, hiding dates/times/route separately, typical time spent, city category filters, tags, AI.

---

## 8. Phase 1.5 — Identity and reusable outings

- **Outing details:** vibe or theme, approximate duration, transport mode, budget range.
- **"Friends who tried this"** on outings (friends who completed a copy).
- **Curated collections** ("Best rainy-day outings in NYC").
- **Richer diary and map:** filters by city, category, year; better profile presentation.
- **Lightweight shared editing** of an outing or list with a few friends.
- Brought back from v7: **evening reminder**, **hide exact dates/times/route**, **typical time spent**, **city page category filters**.

---

## 9. Phase 2 — Plan together + trip companion

### A. Planning map (for outings and trips)
- All saved places for the city on one map; unassigned places in an **Ideas** area.
- Assign stops to days (trips) and reorder; **add a saved outing to a trip day** (copies its stops).
- **Optional planned times**, with gentle warnings for overlaps or tight gaps, and friend-based duration hints.
- **Day routes** in their own colors, starting and ending at that night's 🏨 Stay.
- **Booking status:** 🟠 Need to book · 🟢 Booked, with badges, a "needs booking" filter, a trip summary, and private booking note, link, time and how far ahead you booked.
- **Friend context** on every planned stop ("Maya ❤️ loved this").

### B. Planning together
- **Collaborators with roles:** viewer · suggester · editor · owner. Sharing an itinerary to read is separate from inviting people to edit it.
- Shared candidate places, shared lists, comments or votes on stops.

### C. Trip companion (during the outing or trip)
- Ordered stops as a **checklist and map**: ✓ Went · ✗ Skipped · ➕ Add an unplanned stop.
- Planned times carry over as defaults for actual times; planned vs. actual both kept.
- See notes, recommendations and what's left for the day.
- **Offline:** read saved itineraries and queue logging without signal (early in Phase 2).
- **Nearby places** in search (optional "while using" location only).

### D. AI chat ("Ask your friends")
- Questions and actions grounded only in friends' data, citing the friend and itinerary: "Best food my friends found in Mexico City?" · "Make me a Saturday in Greenpoint from friends' outings" · "Arrange my saved Tokyo places into 4 days."
- Says clearly when there's no friend data.

### E. Export an itinerary
- **"Export" button** on any itinerary you own (or can see), for sharing with people outside the app.
- **Formats:** PDF (day by day: stops, times, notes, map image), plain text or Markdown for pasting into chats and docs, and calendar events (.ics) for stops with planned times.
- Each stop includes a Google Maps link (built from its place ID) so recipients can open it.
- **Privacy:** private fields (booking notes, links, private visits and photos) are left out unless the owner chooses to include their own.
- **Google's terms:** check how Places content may appear in exported files and include the required attribution.
- Generated on the server (an Edge Function) so every platform produces the same document.

### F. Other
- Save all highlights from a friend's trip, overlap nudges ("Maya also saved Kyoto"), optimize order.

---

## 10. Phase 3 — Smarter and growth

- **AI booking suggestions:** where and when to book, official sources first, friends' opt-in booking history, citations and "verify" labels.
- "Friends booked this ahead," booking reminders.
- Tags and tag filters.
- Opt-in camera roll scan to suggest past places (user confirms each; photos attached only when picked).
- Opt-in suggested stops during outings and trips.
- Real walking and driving routes.
- Full real-time planning together.
- Public outing and trip links that open without an account.
- Recaps, slideshows, printed photo books; disclosed affiliate booking links.
- Imports (Google Maps Timeline, booking emails); AI photo captions; richer personalization.

---

## 11. Data model (simplified)

```
User (id, username, display_name, photo, bio, home_base_place_id?)
Friendship (user_a, user_b, status: pending | accepted)
FriendGroup (owner_id, name) ── FriendGroupMember (group_id, user_id)

Place (google_place_id PK, timezone,
       lat?, lng?, coords_cached_at?,        // Google terms: coords cached ≤ 30 days
       city_place_id?)                       // the city is also a place ID

PlaceOpinion (user_id, place_id,             // unique per user + place
              want_to_go, been, loved, rating?, note?,
              visibility, updated_at)

Itinerary (id, owner_id, kind: outing | trip,      // label for UI and discovery, not structure
           status: idea | planned | active | completed,
           title, description?, cover_photo_id?,
           city_place_ids[], start_date?, end_date?,
           visibility: private | friends | group, group_id?,
           remixed_from_id?)                 // credit for copies

ItineraryStop (id, itinerary_id, place_id, category,
               day_number NOT NULL DEFAULT 1, position,     // an outing is a 1-day itinerary
               stop_status: planned | visited | skipped,
               recommendation_note?,
               planned_start?, planned_end?,                 // Phase 2 UI
               booking_status?, booking_note?, booking_url?, booked_lead_time?,  // Phase 2, private
               copied_from_stop_id?)

Visit (id, user_id, place_id, itinerary_stop_id?,
       visited_on, start_time?, end_time?,   // local time at the place
       rating?, highlight, note?, visibility, created_at)

Photo (id, owner_id, visit_id? | itinerary_id?, storage_path, visibility)

List (id, owner_id, name) ── ListItem (list_id, place_id? | itinerary_id?)   // exactly one
```

**Notes**
- **Google's terms:** place IDs can be stored permanently; coordinates can be cached for up to 30 days (a scheduled job refreshes them); other details like names are fetched fresh and cached only briefly. Storing the city as a place ID keeps city pages queryable.
- **Time zones:** derived from coordinates with an open-source time zone lookup, stored on the place. Visit times are local to the place.
- **Recommendation vs. record:** `ItineraryStop` is the route; `Visit` is what happened. Ratings shown on an outing come from the creator's linked visits.
- **Copying:** a copy gets new `Itinerary` and `ItineraryStop` rows with `remixed_from_id` / `copied_from_stop_id`; no visits are copied.
- **Phase 2 fields** (planned times, booking) are in the schema from the start so nothing has to be restructured.

---

## 12. Suggested technology

| Part | Choice | Why |
|---|---|---|
| Mobile app | React Native (Expo) | One codebase for iOS and Android; system photo picker without custom native code |
| Backend | Supabase (Postgres + PostGIS, Auth, Storage, Edge Functions, scheduled jobs) | Relational data, privacy rules in the database, fast to build |
| Place search | Google Places (New), called through an Edge Function | Keeps the API key off the phone; one place to cache, rate-limit and log |
| Maps | `react-native-maps` with the Google Maps provider on both platforms | Google's terms require Places data on a Google map |
| Photo storage | Supabase Storage plus image CDN | Cheap; photos compressed on the phone |
| Testing and CI | Database tests for privacy rules, app tests, GitHub Actions | Strong signal for recruiting |
| AI (Phase 2+) | Claude API with tool use | Answers grounded in friends' data, with citations |

---

## 13. Timeline

Assumes roughly 15–20 hours a week, solo, learning as you go. Milestone details are in the Phase 1 spec.

| Phase | Scope | Rough timeline |
|---|---|---|
| **1A: Interview-ready core** | The core of sections 7A–H: email sign-in, one platform, places and visits, itineraries and maps, friends and database-enforced privacy, sharing and copying, feed, city and place pages, photos, simple profile, beta with 5–10 friends | About **10–12 weeks** |
| **1B: Scale and depth** | Synthetic data at scale, query benchmarks, feed design experiment (fan-out on read vs. write), load testing, scaling design doc | About **3–4 weeks** |
| **1C: Complete MVP** | Apple and Google sign-in, second platform, friend groups, named lists, Want to go cities, onboarding favorites, profile map and diary | About 4–6 weeks (optional for interviews) |
| **1.5: Identity and reusable outings** | Section 8 | About 1–2 months, shaped by beta feedback |
| **2: Plan together + trip companion** | Section 9 (including itinerary export) | About 3–4 months |
| **3: Smarter and growth** | Section 10 | Ongoing |

For recruiting, the milestones that matter most are the **1A beta with real friends** and the **1B benchmarks and scaling write-up**.

---

## 14. Risks

| Risk | How to handle it |
|---|---|
| **Scope creep** | Phase 1 is fixed (section 7); new ideas go to 1.5 or later |
| **"Everything app" positioning** | Lead with the one-sentence pitch; outings and friends first |
| **Logging effort** | 3-tap logging, recents, home base search, optional details collapsed |
| **Empty app at the start** | Onboarding asks for home base and a few ❤️ Loved places; invite friends in groups |
| **Ideas weakening trust** | 💡 Idea vs. ✓ Done it labels; "Done it" ranks higher |
| **Data model complexity** | Three core concepts (PlaceOpinion, Itinerary, Visit); copies instead of live links |
| **Google terms and costs** | Proxy through an Edge Function, cache within the rules, debounce search |
| **Time zone bugs** | Store the place's time zone; test across time zones |
| **Privacy** | No location or camera roll access in Phase 1; location removed from photos; database-enforced rules with tests |

---

## 15. Measures

| Question | Measure |
|---|---|
| Is logging fast? | Median time to log a place (target under 10 seconds) |
| Do new users get going? | New users who log a place or create an itinerary in week one (target 40%+) |
| Do people share outings? | Share of active users who publish an outing; outings per active user |
| Are outings useful to others? | Saves and copies per published outing |
| Does discovery lead to action? | Saved places and outings that become planned or completed itineraries |
| Does it work between vacations? | Weekly activity from outings and local logging |
| Is the profile valuable? | Profile views by friends; places marked ❤️ Loved per user |
| Does the social graph matter? | Share of place and itinerary views that come from friends' content |
| Retention | Users still logging after 4 and 8 weeks |
| Phase 2: planning and companion | Collaborative itineraries created; planned itineraries that become completed |

Targets are starting guesses to check against real data.

# Trip Journal App — Product Plan (v7)

*A trip journal that also plans: "Remember where you went, see where your friends loved, then go."*

**Save → Plan → Go → Log → Recommend → (friends) Save...**

## Principles

- **Logging the stop is the only required step.** Times, ratings, reviews, highlights and photos are optional.
- **Manual first, and fast.** Logging a stop takes about 3 taps.
- **The user stays in control.** Nothing is attached or logged automatically. Later automatic features are opt-in suggestions the user confirms.
- **Friends' data comes first.** Recommendations, plans and AI answers are based on what friends logged.
- **Planning stays light and map-based.** Booking status is tracked, but no booking happens in the app.
- **Ask for as little as possible.** Phase 1 needs no location permission and no camera roll access.

---

## 1. Categories

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

The category is filled in from the place type and can be edited. Tags come in Phase 3.

---

## 2. Phase 1 — MVP journal (about 6–8 weeks)

### A. Fast manual logging
- **Place search with autocomplete, focused on the trip's city** (uses the trip's city, not the phone's location).
- **Recent places** (places you recently logged or saved) at the top of search.
- **About 3 taps per stop:** search → select → done.
- **"Add stops to today"** adds several places in a row without leaving search.
- **Log at any time,** during the day or all at once in the evening. Drag to reorder.
- **Optional evening reminder** (can be turned off): "Want to log today's stops?"
- **Optional extras,** collapsed under "Add details":
  - 🕐 Start and end time, with a "Now" button and quick durations (30 min · 1 hr · 2 hr)
  - ⭐ 1–5 rating
  - ❤️ Highlight
  - Note or review
  - 📷 Photos
- **Order:** stops with times sort by start time; others keep their manual order.
- **Route map** per day (from the places' coordinates) plus a whole-trip overview. The day view shows times when entered.

### B. Manual past trips
- Create a past trip (city, and optionally approximate dates).
- Same fast search. Mark places ❤️ Favorite or ✓ Been.
- No days or times required. A past trip can be just a list of 5 favorites.
- Optional rating, note, photos and times.

### C. Photos (optional, always chosen by the user)
- Added through the **phone's built-in photo picker**: the app only receives selected photos and never needs access to the whole camera roll.
- Nothing is attached automatically.
- Compressed on the phone (about 1600 px), uploaded in the background, on Wi-Fi by default.
- Location data removed from shared photos. Per-photo visibility (private or friends).
- Cover photo for each stop and trip.

### D. Saving
- Save any place from a friend's trip, a city page, a place page or search.
- **Lists** ("Lisbon ideas," "Ramen to try").
- **Want to go** for cities and places.

### E. Friends and discovery
- **Friends feed:** new trips, highlights and photos.
- **City pages:** "Your friends in Tokyo," with friends' stops sorted by highlights and ratings, filterable by category, with a photo grid.
- **Place pages:** which friends went, their ratings, notes and photos, a Save button, and typical time spent when friends logged times.
- **Trip pages:** a friend's full trip with route map, days and times.
- **Privacy per trip:** Private, Friends or a specific group. Exact dates, times and the route can be hidden while places stay visible.

### Not in Phase 1
No location permission, no "you are here" dot, no nearby search, no camera roll access, no planning interface, no booking status, no tags, no AI.

---

## 3. Phase 2 — Plan and ask (about 9–11 weeks)

### A. Planning map
1. **All saved places on one map.** A planned trip shows every saved place in that city or area, from all lists. Unassigned places are grey pins with category icons; assigned places take their day's color. Filter by list, category and booking status. Optional friends layer shows friends' highlights as faint pins.
2. **Assign places to days.** Tap a pin and pick Day 1 · Day 2 · ... · Ideas, or drag between days in the list. "Ideas" holds places you might fit in.
3. **Optional planned times.** Any planned stop can have a planned start and end time. Stops with times sort by time; others keep their dragged order. Gentle, non-blocking warnings for overlapping times or very short gaps between distant stops. Friend-based duration hints ("Friends spent about 2 hrs here").
4. **Daily routes.** Each day has its own color, with lines connecting stops in order. Day buttons (All · Day 1 · Day 2 · ...) highlight one route and fade the rest. Dragging redraws the route. Straight lines with estimated distance (real routes in Phase 3). Each day starts and ends at that night's 🏨 Stay; supports trips with several cities or hotels.
5. **Booking status.**
   - On any planned place, including Ideas: *(none)* · 🟠 Need to book · 🟢 Booked.
   - Badges on pins and list rows; "Needs booking" filter; trip summary ("3 places still need booking").
   - When marking Booked, optional: time (fills in planned start and end), booking note or link, and how far ahead you booked (Same day · A few days · 1–2 weeks · 1 month+).
   - Always private: never shown to friends. Trip collaborators can see it.
   - Booked stops with times act as anchors in the day's plan and checklist.
6. **Friend context on every planned stop:** "Maya ❤️ highlighted this · Jordan ⭐ 4."

```
┌─────────────────────────────┐
│ [All] [Day 1] [Day 2] [+]   │  ← day buttons
│ 🟠 3 places need booking  › │  ← trip summary
│                             │
│       🗺️ map with pins      │
│       and route lines       │
├─────────────────────────────┤  ← panel pulled up from the bottom
│ Day 1 · 5 stops · ~6 km     │
│ 🏨 Hotel                    │
│ 10:00 📍 Belém Tower 🟢   ≡ │
│ 11:30 🍽️ Pastéis de Belém ≡ │
│       🎟️ Fado show 🟠     ≡ │
│ Ideas (8 unassigned) ▾      │
└─────────────────────────────┘
```

### B. Plan becomes log
- When the trip starts, planned stops become a checklist: ✓ Went / ✗ Skipped / ➕ Add a stop.
- Planned times carry over as defaults for actual times and can be edited.
- Planned and actual times are both kept.

### C. Nearby places (optional location)
- Nearby places at the top of search, using "while using" location only, when the app is open and the user is adding a stop. Never tracking.
- Optional "you are here" dot on trip and planning maps.
- Everything still works if the user declines.

### D. AI chat ("Ask your friends")
- Questions: "Best food my friends found in Mexico City?" · "How long should I plan for the Louvre?"
- Actions: "Add Jordan's top 3 Lisbon restaurants to my trip" · "Arrange my saved Tokyo places into 4 days by area" · "Make me a 3-day Rome plan with times."
- Answers only from friends' data, citing the friend and trip, and saying clearly when there's no data. Only sees what friends shared with the user.
- Uses friends' logged times to suggest how long to plan for each place.

### E. Other Phase 2 features
- "Save all highlights" from a friend's trip.
- Overlap nudges: "Maya also saved Kyoto."
- Shared lists that friends can add to.
- "Optimize order" for a day (or via the AI chat).

---

## 4. Phase 3 — Smarter and growth (ongoing)

### A. AI booking suggestions
A **"How do I book this?"** button on any 🟠 Need to book place, also available in the AI chat:
- **Where to book:** the official site first, then trusted platforms (OpenTable, Resy, GetYourGuide and similar).
- **When to book:** "Timed entry, often sells out 2–3 weeks ahead in summer."
- **What friends did:** only from friends who opted in to sharing how and when they booked, never confirmation details or links.
- **Tips:** free-entry days, walk-in-only places, best times.
- **Sources:** place data (website, reservable), friends' opt-in booking history, web search for official pages and current rules. Claude combines these, cites sources, and labels anything unconfirmed with "verify on the official site."
- **Safeguards:** official sites ranked first, known resellers flagged, affiliate relationships disclosed with the official option still shown first.

### B. Other Phase 3 features
- "Friends booked this ahead" on place pages (opt-in booking history).
- Booking reminders: "Your Lisbon trip is in 2 weeks, 3 places still need booking."
- Tags and tag filters ("rooftop," "vegetarian," "kid-friendly," "cash only").
- Opt-in camera roll scan for past trips; every suggested place confirmed by the user, photos attached only when picked.
- Opt-in suggested stops during trips (the only feature that would use background location), always confirmed by the user.
- Real walking and driving routes with travel times.
- Planning together in real time.
- Public trip pages shared by link, which open without an account.
- Trip recaps and slideshows; printed photo books (revenue).
- Affiliate booking links (optional, disclosed; revenue).
- Imports: Google Maps Timeline, booking emails.
- AI photo captions for search.

---

## 5. Data model (simplified)

```
User ─┬─ Friendship (user_a, user_b, status)
      ├─ List (name, collaborators[]) ── SavedPlace (place_id, note?)
      └─ Trip (title, cities[], start/end dates?,
               status: planned | active | completed,
               visibility, collaborators[], cover_photo_id?)
            ├─ TripDay (date, day_number, lodging_place_id?)
            └─ Stop (place_id, category,
                     status: planned | visited | skipped,
                     day?, order?,
                     planned_start?, planned_end?,           // planning (Phase 2 UI)
                     start_time?, end_time?,                 // logging (actual)
                     rating?, highlight?, favorite?, note?,
                     booking_status?: need_to_book | booked, // private (Phase 2 UI)
                     booking_note?, booking_url?,            // private
                     booked_lead_time?)                      // private; opt-in share in Phase 3
                  └─ Photo (storage_url, visibility)        // location data removed

Place (provider_id, name, lat/lng, type, default_category,
       city, country, timezone, website?, reservable?)
```

- Times are stored in the **place's local time zone**. Planned and actual times are separate fields.
- Booking fields are private by default, **enforced in the database's access rules**, not just hidden in the interface.
- Phase 1 creates the full structure (planning, booking and time zone fields) even though their interfaces come later, so nothing has to be restructured.
- Place coordinates come from the place database, never from the user's phone.
- Tags are added in Phase 3 as one new field.

---

## 6. Suggested technology

| Part | Choice | Why |
|---|---|---|
| Mobile app | React Native (Expo) | One codebase; system photo picker without custom native code |
| Backend | Supabase (Postgres + PostGIS, login, storage, access rules) | Map queries, privacy enforced in the database, fast to build |
| Photo storage | Supabase Storage or Cloudflare R2, plus an image CDN | Cheap; compressed on the phone |
| Place search | Google Places (New), called through a backend function | Search, time zones, categories, website, reservable. Store place IDs permanently; cache coordinates up to 30 days (Google's terms). |
| Maps | `react-native-maps` with the Google Maps provider on both platforms | Google's terms require Places data to be shown on a Google map; pins and straight lines are enough for Phase 1 |
| AI chat (Phase 2) | Claude API with tool use | Answers from friends' data with citations; can take actions |
| AI booking help (Phase 3) | Claude with web search plus place data | Official booking sources, cited and current |

---

## 7. Build phases

| Phase | Scope | Rough timeline |
|---|---|---|
| 1: MVP journal | Accounts, friends, privacy · fast manual logging (city-focused search, recents) · categories · optional times, ratings, highlights, notes · user-picked photos · route maps · manual past trips · lists and want-to-go · feed, city, place and trip pages · **no location permission** | About 6–8 weeks (small team) |
| 2: Plan and ask | Planning map · assigning to days · planned times · daily routes from the hotel · booking status, badges, filter, summary · plan becomes log · nearby places (optional location) · AI chat · save highlights · overlap nudges · shared lists | About 9–11 weeks |
| 3: Smarter and growth | AI booking suggestions · friends booked ahead · booking reminders · tags · opt-in camera roll scan · opt-in suggested stops · real routes · planning together · public trip links · recaps and photo books · affiliate links · imports | Ongoing |

---

## 8. Risks

| Risk | How to handle it |
|---|---|
| Logging effort | 3-tap logging, city-focused search, recents, adding several stops at once, extras collapsed by default, "Now" and duration shortcuts |
| Slower logging without "nearby" | City-focused search and recents in Phase 1; nearby added in Phase 2 |
| Empty app at the start | Push manual past trips during sign-up; invite friends in groups |
| Too much scope | Journal-only MVP. Planning, booking, nearby and AI chat in Phase 2. AI booking help and automation in Phase 3. |
| Competing with Wanderlog | Compete on friend context in the map and plan, not booking features |
| Time zone bugs | Store the place's time zone from day one; test trips across several time zones |
| Privacy | No location or camera roll access in Phase 1; location data removed from photos; per-trip visibility including times; booking data private and enforced in the database |
| Wrong AI booking advice | Official sources first, citations, "verify" labels, flag known resellers |
| Place, map and AI costs | Cache place details, limit autocomplete requests, straight-line routes until Phase 3, limit AI usage per user |
| AI makes things up | Answer only from friends' data and cited sources; say clearly when there's none |

---

## 9. Measures

| Area | Measure | Early target |
|---|---|---|
| Logging speed | Median time to log one stop (without extras) | Under 10 seconds |
| Activation | New users who log at least one trip in their first week | 40% or more |
| Past trips | Average favorites per past trip | 5 or more |
| Trip completion | Live trips with stops logged on most days | 60% or more |
| Richness | Stops with at least one optional field | Tracked |
| Network value | Users who view a friend's city or trip page | Rising week over week |
| Planning (Phase 2) | Planned trips with at least 1 day assigned; planned trips that become logged trips | Tracked |
| Booking (Phase 2) | "Need to book" places later marked booked | Tracked |
| AI booking help (Phase 3) | Booking suggestions followed by marking the place booked | Tracked |
| Retention | Users who log a second trip | Tracked from launch |

Targets are starting guesses to check against real data.

---

## 10. Next steps

1. **Write the Phase 1 spec:** screen list, user stories with done criteria, and decisions that are expensive to change later (place data provider, map provider, sign-in methods).
2. **Set up the project:** Expo app, Supabase project, the full data model (including planning, booking and time zone fields), and privacy access rules from the start.
3. **Build the core flow end to end:** create a trip → search a place → log a stop (optional time and rating) → see it on the day map.
4. **Then build in this order:** friends and privacy → city and place pages → past trips → photos → lists and want-to-go → feed → polish → beta with 10–20 friends who travel.

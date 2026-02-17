# PRD: Weekend Trail Picker

## 1. Overview

**Product Name:** Trail Picker
**Owner:** smb1947
**Last Updated:** February 2026
**Architecture:** AI agentic workflow, implemented as a Claude Desktop (Cowork) shortcut

A two-phase AI decision engine for picking the **3 best hiking trails for a specific Saturday** near Seattle.

**Phase 1 — AllTrails does what it's good at.** The user applies their trail preferences (difficulty, distance, elevation, attractions, suitability) on AllTrails and copies the filtered URL. The agent opens that URL in Chrome (user is already logged in) via Claude in Chrome and extracts the trail listings.

**Phase 2 — The agent applies intelligence AllTrails can't.** From AllTrails' results, the agent layers on real-time weather forecasts, snow level vs. trailhead elevation, road/sedan accessibility, hike history avoidance, and progressive elevation gain logic — filtering and ranking until it arrives at the best 3 picks with clear reasoning.

### What AllTrails Does vs. What This Workflow Does

| Phase | Who Does It | What Happens |
|-------|------------|--------------|
| **Trail discovery** | AllTrails | Filters by difficulty, distance, elevation gain, route type, attractions (waterfall, lake, views, etc.), suitability (dog-friendly, kid-friendly, etc.) |
| **Weather-aware selection** | This workflow | NWS forecast per trail region for the specific date |
| **Snow safety check** | This workflow | NWAC snow level vs. trailhead elevation |
| **Road / sedan check** | This workflow | WSDOT conditions + trip report road mentions |
| **Hike history avoidance** | This workflow | Excludes past trails + deprioritizes repeated regions and similar trail types |
| **Elevation progression** | This workflow | Plans the season arc, targets next step-up |
| **Final 3-pick decision** | This workflow | Ranks, diversifies, explains reasoning |

---

## 2. Problem Statement

Every week, the organizer spends **over an hour** doing the same research loop: browse AllTrails with filters, check the weather for Saturday across multiple mountain regions, check snow levels on NWAC, check which roads are open on WSDOT, remember which trails they've already done, figure out the right difficulty step-up, and then mentally cross-reference all of that to pick one trail. This workflow collapses that entire loop into a single 60-second interaction.

---

## 3. Target User

The organizer, who selects the weekly hike. Not group-facing — the organizer runs the shortcut, reviews the 3 picks, and shares the chosen one with the group.

---

## 4. Core User Flow

```
Organizer triggers the trail-picker skill in Cowork
        ↓
Agent collects inputs:
  - AllTrails filtered URL (user pastes it)
  - Date (default: next Saturday)
  - Past hikes this year
  - Optional overrides
        ↓
PHASE 1: Agent opens AllTrails URL in Chrome (user is logged in)
  → Extracts top 10+ trail listings with metadata
        ↓
PHASE 2: Agent researches weather, snow, roads for those trails
        ↓
Agent applies decision-engine filters + ranking
        ↓
Output: Top 3 picks with full details and "why this trail on this day"
        ↓
(If fewer than 3 survive, user provides broader AllTrails URL and agent repeats)
```

---

## 5. Inputs

### 5.1 AllTrails Filtered URL

The user applies their own filters directly on AllTrails (they know the UI best), then pastes the resulting URL. The agent opens this URL using Claude in Chrome — the user must be logged into AllTrails in their browser.

**How it works:** AllTrails encodes all filter state in the URL query parameters. Example:
```
https://www.alltrails.com/explore?b_br_lat=47.5&b_br_lng=-120.6&b_tl_lat=48.3&b_tl_lng=-122.3
  &diff[]=moderate&diff[]=hard
  &length[]=9656.064&length[]=16093.44
  &elev[]=609.6&elev[]=-1
  &rating_min=4.5&sort=most_popular
```

The agent parses the URL to understand the user's filters (difficulty, distance range, elevation range, rating, map bounds, etc.) for context, then opens the URL in Chrome to extract the actual trail results.

**AllTrails filters available to the user** (applied on AllTrails, not in the agent):

| Filter | Options |
|--------|---------|
| **Location** | Map bounds / city search |
| **Activity** | Hiking, trail running, backpacking, etc. |
| **Difficulty** | Easy, Moderate, Hard, Strenuous |
| **Length** | 0–50+ miles |
| **Elevation Gain** | 0–5,000+ ft |
| **Route Type** | Out & back, Loop, Point to point |
| **Suitability** | Dog friendly, Kid friendly, Wheelchair friendly, Stroller friendly, Paved |
| **Attractions** | Beach, Cave, Forest, Historic site, Hot springs, Lake, River, Views, Waterfall, Wild flowers, Wildlife |
| **Rating** | Star rating minimum |
| **Trail Traffic** | Light, Moderate, Heavy |
| **Sort** | Best match, Most popular, Closest |

### 5.2 Date

| Field | Type | Required | Default |
|-------|------|----------|---------|
| Hike date | Date | No | **Next Saturday** from today. If today is Saturday, default to the following Saturday. Can be overridden (e.g., a Wednesday holiday). Must be within 10 days for reliable weather. |

### 5.3 Past Hikes This Year (Avoid List)

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| Past hikes | Free text, comma-separated trail names | No | Agent uses this to: (1) exclude those exact trails from the final 3, (2) deprioritize regions that appear 2+ times in recent history, (3) avoid trails similar in character to the last few hikes, (4) infer the current elevation gain level for progression planning. |

### 5.4 Optional Overrides

Mentioned but not forced. User can skip.

| Field | Default | Notes |
|-------|---------|-------|
| Max hike duration | 5 hours | Applied in Phase 2 |
| Target elevation gain | Auto-calculated | Override the progression logic |
| Max drive time | 3 hours one-way from Greenlake | Rarely changed |

---

## 6. Output (per trail suggestion)

Each of the 3 suggestions includes:

| Field | Description |
|-------|-------------|
| **Trail Name** | Full name of the trail |
| **Location / Region** | Which area (e.g., Mt. Rainier, Snoqualmie, Mt. Baker, Olympics) |
| **Distance** | Round-trip distance in miles |
| **Elevation Gain** | Total elevation gain in feet |
| **Estimated Duration** | Based on average hiking pace |
| **Drive Time from Greenlake** | One-way driving time |
| **Road Condition** | Paved / gravel / rough — sedan-friendly or not, with source |
| **Trail Condition** | Current condition from recent trip reports (snow, ice, mud, clear). Date of most recent report. |
| **Weather Forecast** | High/low temp, precipitation %, wind for the selected date at that specific location |
| **Snow Level** | Forecasted snow line elevation vs. trailhead and summit elevation |
| **Scenic Highlights** | What you'll see — matched against the user's stated preferences |
| **Why This Trail on This Day** | 2-3 sentences. Must reference: (a) how it matches preferences, (b) why the weather/conditions favor it on this date, (c) how it fits the elevation progression. This is the key differentiator — AllTrails can't do this. |
| **AllTrails Link** | Direct URL to the AllTrails trail page |

---

## 7. Phase 1: Browse AllTrails via Chrome

The agent opens the user's filtered AllTrails URL in Chrome using Claude in Chrome. The user must be logged into AllTrails in their browser — no credentials are passed to or stored by the agent.

| Step | Action |
|------|--------|
| 1 | Use `tabs_context_mcp` → `tabs_create_mcp` → `navigate` to open the AllTrails URL |
| 2 | Wait for page load, use `read_page` and `get_page_text` to extract trail listings |
| 3 | For each trail, capture: name, distance, elevation gain, difficulty, rating, reviews, location/region, attraction tags, AllTrails URL |
| 4 | Aim for at least 10 candidates. If fewer visible, scroll to load more and re-read |
| 5 | If page requires login or shows paywall, notify user to log into AllTrails in Chrome |

---

## 8. Phase 2: Decision Engine (Applied to AllTrails Results)

This is where the workflow earns its keep. The agent takes the 10 candidate trails from Phase 1 and applies filters and ranking that AllTrails cannot.

### 8.1 Hard Filters (Exclude or Flag)

A trail that fails any of these is dropped from consideration:

| Constraint | Rule | Data Source |
|------------|------|-------------|
| **Max drive time** | ≤ 3 hours one-way from Greenlake (or user override) | Google Maps estimate or agent knowledge |
| **Road access** | Must be sedan-friendly: paved or well-maintained gravel. Exclude if recent trip reports or WSDOT mention rough roads, washouts, or chain requirements — unless road is confirmed plowed. | WSDOT + WTA trip reports |
| **Trail accessibility** | Must be open on the target date. Not gated, closed for season, or washed out. If no recent data exists, flag as "unverified" rather than excluding. | WTA trip reports (within 14 days) + official closure notices |
| **Snow level safety** | If trailhead elevation > forecasted snow level, exclude — unless user selected snow-related attractions or explicitly wants snow. | NWAC snow level forecast |
| **Dangerous conditions** | Exclude if active avalanche warnings, severe weather advisories, or hazardous ice per recent reports. | NWAC + NWS advisories |
| **Max duration** | ≤ user's max (default 5 hours) | Agent estimate from distance + elevation |
| **Not previously hiked** | Exclude any trail in the user's past hikes list. | User input |

### 8.2 Ranking (Soft Preferences)

After hard filtering, rank the surviving trails:

| Factor | Weight | Logic |
|--------|--------|-------|
| **Weather fit** | Very High | **The killer feature.** Rank trails in regions with the best weather on the target date. If the west side of the Cascades is getting rain but the east side is clear, push east-side trails up. Compare precipitation %, temp, wind. If rain is unavoidable everywhere, prefer trails with tree cover. |
| **Trail condition quality** | High | Prefer clear/dry trails. Moderate snow acceptable if user wants it or trail has recent reports confirming passability. |
| **Progressive elevation gain** | Medium | Target the next step in the season arc. Spread the 3 picks: one at target, one ~200 ft below, one ~200 ft above. |
| **Region + type variety** | Medium | Deprioritize regions over-represented in past hikes. The 3 picks should ideally be in different regions or offer different trail types. |
| **Dissimilarity to past hikes** | Medium | If last 3 hikes were lake trails, boost a ridge or waterfall trail. Avoid repetitive experiences. |
| **Drive time** | Low | Shorter is better but not dominant. |

### 8.3 Iteration Logic

If fewer than 3 trails survive Phase 2 hard filters:

1. Relax distance/duration constraints by 20%
2. If still < 3, ask the user to provide a broader AllTrails URL with relaxed filters
3. Re-run Phase 1 (Chrome browse) + Phase 2 on the new results
4. If still < 3 after that, present what's available with a note explaining the constraint

---

## 9. Agentic Workflow Architecture

### 9.1 Platform

**Claude Desktop (Cowork) Skill** (`trail-picker`). Triggered by the user in Cowork. Requires Claude in Chrome extension connected, with the user logged into AllTrails in their browser. No API keys, no credentials stored.

### 9.2 Agent Steps (Detailed)

```
STEP 1: GATHER INPUTS
  → Ask for AllTrails filtered URL (required)
  → Ask for date (show default: next Saturday)
  → Ask for past hikes (free text, optional)
  → Mention optional overrides (duration, elevation target, drive time)
  → Parse URL params + past hikes to understand context

STEP 2: PHASE 1 — BROWSE ALLTRAILS (Claude in Chrome)
  → tabs_context_mcp → tabs_create_mcp → navigate to AllTrails URL
  → read_page + get_page_text to extract trail listings
  → Capture 10+ trails with metadata
  → Scroll to load more if needed

STEP 3: PHASE 2 — CONDITION RESEARCH (parallel web searches)
  → WebSearch: NWS point forecast for each trail's region on target date
  → WebSearch: NWAC avalanche forecast + snow level for Cascades
  → WebSearch: WSDOT road conditions for relevant passes/roads
  → WebSearch: WTA recent trip reports for each candidate trail (last 14 days)

STEP 4: PHASE 2 — HARD FILTER
  → Apply hard filters (Section 8.1) to candidates
  → Log why each rejected trail was dropped

STEP 5: PHASE 2 — RANK & SELECT
  → Score surviving trails against ranking criteria (Section 8.2)
  → Select top 3, enforcing diversity

STEP 6: ITERATE IF NEEDED
  → If < 3 trails survive, relax constraints or ask user for broader URL
  → Re-run Phase 2 on new candidates

STEP 7: COMPILE & PRESENT
  → Build full output card per Section 6 for each pick
  → Show rejected trails and reasons
  → Ask: "Want to adjust preferences and re-search?"
```

### 9.3 Tools Used

| Tool | Purpose |
|------|---------|
| **Claude in Chrome** (`tabs_context_mcp`, `tabs_create_mcp`, `navigate`, `read_page`, `get_page_text`) | Browse AllTrails with user's logged-in session to extract trail listings |
| **WebSearch** | Weather forecasts, snow levels, road conditions, WTA trip reports |
| **WebFetch** | Read specific WTA trail pages, NWS forecast pages, WSDOT reports |
| **Task** (subagents) | Parallelize condition research across multiple trails/regions |
| **Bash** | Date calculations, data processing |
| **AskUserQuestion** | Gather inputs at start, confirm re-runs |

### 9.4 Error Handling

| Failure | Fallback |
|---------|----------|
| AllTrails page won't load / requires login | Notify user to log into AllTrails in Chrome, retry |
| AllTrails page loads but few results | Ask user to provide a broader AllTrails URL |
| Weather search fails | Note "weather data unavailable" in output, rank without weather |
| No recent trip reports for a trail | Flag as "conditions unverified — check WTA before going" |
| NWAC data unavailable | Warn user to manually check avalanche conditions |
| Fewer than 3 trails after full iteration | Present what's available with explanation |

---

## 10. Progressive Elevation Gain Logic

- **If past hikes provided:** Agent looks up approximate elevation gains for listed trails (via web search). Identifies the most recent hike's gain. Target = most recent gain + 200–500 ft. This target is also fed back into the AllTrails elevation gain filter in Phase 1.
- **If no past hikes:** Default target is 500–1000 ft.
- **User override:** If the user specifies a target, use that.
- **Diversity rule:** Of the 3 suggestions, aim for one at target, one ~200 ft below, one ~200 ft above.

---

## 11. Technical Requirements

| Requirement | Detail |
|-------------|--------|
| **Platform** | Claude Desktop (Cowork) skill (`trail-picker`) |
| **Dependencies** | Claude in Chrome extension connected; user logged into AllTrails in browser |
| **Runtime** | Single Cowork session — no backend, no database |
| **Data persistence** | None — user pastes hike history each time |
| **Response time** | < 90 seconds including iteration (Chrome browsing + web searches) |
| **Error handling** | Graceful degradation per Section 9.4 |
| **No API keys** | Weather/snow/road data via web search; AllTrails via Chrome browsing |
| **No credentials stored** | Agent never sees or stores AllTrails password — uses existing browser session |

---

## 12. Nice-to-Haves (V2)

- **Persistent hike log**: A file the agent reads/updates automatically so you don't paste history each time.
- **"Surprise me" mode**: No preference input — agent picks based purely on best weather + variety.
- **WhatsApp/Slack poll output**: Format the 3 picks as a ready-to-paste group poll.
- **Carpool helper**: Suggest meeting point based on group member neighborhoods.
- **Trail photo**: Pull top photo from AllTrails for each pick.
- **GPX link**: Direct link to download GPX for offline nav.
- **Google Calendar event**: Auto-generate a calendar invite with hike details.
- **Seasonal presets**: "Winter mode" (lower elevation, forest cover) / "Summer mode" (alpine, ridge walks).

---

## 13. Success Criteria

- Returns 3 relevant, safe, condition-aware trail suggestions in under 90 seconds.
- All AllTrails preference filters are respected (user gets what they asked for in terms of trail features).
- All decision-engine filters are respected (weather, snow safety, road access, avoid list).
- Weather reasoning is visible — the user can see *why* a trail was picked for that specific date vs. alternatives.
- The 3 picks are meaningfully different (different regions or trail types).
- Over 4 weeks of use, at least 2 out of 3 suggestions are usable without further manual research.

---

## 14. Open Questions

1. **AllTrails session reliability**: The agent browses AllTrails via Claude in Chrome using the user's logged-in session. If the session expires mid-workflow, the user must re-login in Chrome. If AllTrails changes its page structure, the `read_page` / `get_page_text` extraction may need adjustment.
2. **WTA as backup trail source**: If AllTrails browsing fails entirely, fallback is WTA trail search via web search + agent's knowledge of well-known PNW trails.
3. **Elevation gain lookup for past hikes**: When the user pastes trail names, the agent must web-search their elevation gains to calculate progression. This adds latency. Alternative: ask users to paste the gain of their most recent hike.
4. **Sedan-friendly in practice**: The agent relies on trip reports and WSDOT. Consider building a known-bad-road blacklist over time (V2).
5. **Snow level threshold**: Current rule is binary (trailhead above snow level = excluded). Worth considering a softer rule: trailhead within 500 ft of snow level = warning instead of exclusion.
6. **AllTrails result count**: AllTrails search may return far more than 10 — agent should take the top 10 by AllTrails ranking (best match / most popular) to keep Phase 2 manageable.

---
name: trail-picker
license: Apache-2.0
metadata:
  author: example-org
  version: "1.0"
description: |
  Pick the 3 best hiking trails for a specific Saturday near Seattle for Kritikal Adventures.
  Two-phase decision engine: extract candidates from AllTrails, then layer real-time weather,
  snow, road, and elevation progression intelligence. Invoke when user says "pick a hike",
  "find trails", "plan Saturday hike", "trail picker", or discusses weekly hiking planning.
---

# Trail Picker — Kritikal Adventures Weekly Hike Selection

## Overview

Two-phase agentic workflow that replaces an hour of manual research with a 90-second interaction.

- **Phase 1**: Extract trail candidates from AllTrails via Chrome (or fallback)
- **Phase 2**: Layer real-time weather, snow, road, and history intelligence AllTrails can't provide

**Hike log**: `/Users/shankarmb/Library/CloudStorage/OneDrive-UW/vibing/hiking/hike-log.md`
**PRD reference**: `/Users/shankarmb/Library/CloudStorage/OneDrive-UW/vibing/hiking/PRD - Kritikal Adventures Trail Picker.md`

---

## Step 1: Load Hike History

Read the hike log at the path above. If it exists, extract:

- All 2026 trail names → **exclusion list**
- Regions hiked in last 5 weeks → **over-represented regions** (deprioritize)
- Most recent hike's elevation gain → **progression baseline**
- Trail types from last 3 hikes → **dissimilarity scoring**

If the file doesn't exist, continue with defaults (no exclusions, 500–1000 ft target elevation).

---

## Step 2: Gather Inputs

### Preference Priority Order

All configurable values follow this precedence (highest → lowest):

1. **User-stated preferences** — Anything the user explicitly says in the current session overrides everything else. If the user says "target 2000 ft," ignore hike-log progression and defaults.
2. **Hike-log derived values** — Exclusion list, progression baseline, region/type history from Step 1. Used when the user doesn't specify a preference.
3. **Default values** — Hardcoded fallbacks (e.g., 500–1000 ft target, 5 hr max duration, 3 hr max drive). Used only when both user input and hike-log are silent.

This hierarchy applies to all configurable parameters: elevation targets, duration limits, drive time, region preferences, trail exclusions, and difficulty.

Use AskUserQuestion to collect:

### Required

- **AllTrails filtered URL**: User applies their own filters on alltrails.com, then pastes the resulting URL. All filter state is encoded in query params.

### AllTrails Filter Reference

The following filters are available on the AllTrails Explore page. When parsing the user's URL, recognize these query param dimensions to understand what the user cares about:

| Category | Options | URL param hint |
|---|---|---|
| **Difficulty** | Easy, Moderate, Hard, Strenuous | `diff[]` |
| **Distance** | Range in meters (e.g., 9656–16093 = 6–10 mi) | `length[]` |
| **Elevation Gain** | Range in meters (e.g., 609.6 = 2000 ft min) | `elev[]` |
| **Route Type** | Out & Back, Loop, Point to Point | `route_type[]` |
| **Rating** | Minimum star rating (e.g., 4.5) | `rating_min` |
| **Attractions** | Waterfall, Lake, River, Beach, Views, Forest, Wildflowers, Wildlife, Cave, Hot springs, Historic site, Rails trail | `attractions[]` |
| **Suitability** | Dog friendly, Kid friendly, Stroller friendly, Wheelchair friendly, Paved | `suitability[]` |
| **Activities** | Hiking, Backpacking, Trail running, Mountain biking, Road biking, Horseback riding, Rock climbing, Cross-country skiing, Snowshoeing, Camping, Fishing, Birding | `activities[]` |
| **Sort** | Best Match, Most Popular, Closest, Newest | `sort` |
| **Map bounds** | Bounding box (top-left lat/lng, bottom-right lat/lng) | `b_tl_lat`, `b_tl_lng`, `b_br_lat`, `b_br_lng` |
| **Distance Away** | Radius from location (AllTrails+ only) | `distance_away` |
| **Completed** | Hide trails user has completed (AllTrails+ only) | `completed` |

Filters use **AND logic** — a trail must match ALL active filters to appear. When building WebSearch fallback queries (Step 3), translate these params into natural language search terms.   

### Optional Input (Ask with Default)

- **Hike date**: Default = next Saturday. Calculate with: `date -v+sat +%Y-%m-%d` (macOS). *Ask user to confirm or change.*

### Informational Defaults (Calculate & Display Only — Do NOT Ask)

Output these derived values so the user is aware, but **proceed immediately** without asking for confirmation or input on them.

- **Past hikes**: Auto-populated from hike log.
- **Max duration**: Default 5 hours
- **Target elevation gain**: Default auto-calculated (most recent gain + 200–500 ft)
- **Max drive time**: Default 3 hours one-way from Greenlake

---

## Step 3: Phase 1 — Extract Trail Candidates

**Cost discipline (always on):**

- Keep prompts and tool outputs concise.
- Return structured fields only (no long prose) until final presentation.
- Cap Phase 1 candidate set to **6 trails max** after initial extraction and quick pruning.

### Primary: Claude in Chrome

The user must be logged into AllTrails in their Chrome browser.

1. Call `mcp__Claude_in_Chrome__tabs_context_mcp` with `createIfEmpty: true` to get tab context
2. Call `mcp__Claude_in_Chrome__tabs_create_mcp` to open a new tab
3. Navigate to the AllTrails URL using `mcp__Claude_in_Chrome__navigate`
4. Wait 3 seconds for page load
5. Use `mcp__Claude_in_Chrome__read_page` and `mcp__Claude_in_Chrome__get_page_text` to extract listings

For each trail, capture:

- Trail name
- Distance (miles, round-trip)
- Elevation gain (feet)
- Difficulty (Easy / Moderate / Hard / Strenuous)
- Star rating + review count
- Location / region
- Attraction tags (waterfall, lake, views, etc.)
- Direct AllTrails URL

**Extraction target: 8-12 raw candidates, then prune to top 6** by:

1. AllTrails rating/review strength
2. Fit to URL filters (distance/elevation/difficulty)
3. Rough drive-time feasibility

If fewer than 6 are available, continue with what exists.

### If Chrome Fails

If Chrome MCP tools are unavailable, login is required, or extraction fails:

**Fallback A — User pastes data**: Ask user to copy trail listings from their browser. Accept any format (names only is fine — agent can WebSearch for details).

**Fallback B — WebSearch discovery**: Parse the AllTrails URL query params to understand filters (difficulty, elevation range, region bounds), then:

```
WebSearch: "best [difficulty] hiking trails [region] [distance range] alltrails.com"
WebSearch: "top rated moderate hikes near Snoqualmie Pass 6-10 miles"
```

Extract trail candidates from search results.

---

## Step 4: Phase 2 — Condition Research (Parallel Subagents)

**Critical: Use staged research to reduce token usage.**

### Condition Priority Order (highest to lowest)

1. **Hazards**
2. **Weather**
3. **Road conditions**
4. **Snow level**
5. **Trail conditions**
6. **Logistics**

Research each trail in this order and **stop researching that trail immediately** when a condition is "too bad" (hard reject).

### Stage 4A — Lightweight checks for up to 6 trails

For each trail, gather only:

1. HAZARD SNAPSHOT — regional avalanche/advisory status
2. WEATHER SNAPSHOT — precip %, temp range, wind

Use this fast pass to score and shortlist to top **3-4 finalists**.

Road and snow checks are deferred to Stage 4B for finalists to reduce token and search-call usage.

### Stage 4B — Deep checks for finalists only (max 4 trails)

Run full condition research only for finalists:

Each subagent prompt:

```
Research real-time conditions for "[Trail Name]" in [Region] for hiking on [Target Date].
Run checks in strict order and stop on first hard reject.

1. HAZARDS — Search: "NWAC avalanche forecast [region]" and "NWS weather advisory [region]"
   Hard reject if: active avalanche warning OR severe weather advisory for target window.
   Return: hazards_status, source, hard_reject (true/false), reject_reason

2. WEATHER — Search: "NWS forecast [nearest town/area] [Target Date]"
   Reuse Stage 4A weather if still valid for this trail area; re-query only if unavailable or clearly mismatched.
   Hard reject if any: precip_pct >= 80 OR wind_mph >= 35 OR temp_high_f < 20.
   Return: high_f, low_f, precip_pct, wind_mph, summary, hard_reject, reject_reason

3. ROAD CONDITIONS — Search: "WSDOT [highway/road to trailhead] road conditions"
   Hard reject if: road closed/gated/washout.
   Chain requirement is NOT a hard reject; capture it as an access-risk signal for ranking/output.
   Return: road_status, chain_required, sedan_friendly, source, hard_reject, reject_reason, access_risk

4. SNOW LEVEL — Search: "NWAC snow level forecast Washington Cascades [Target Date]"
   Hard reject if: trailhead_elevation_ft > snow_level_ft + 500 (unless user explicitly wants snow).
   Marginal (not reject): trailhead_elevation_ft within 0-500 ft above snow_level_ft.
   Return: snow_level_ft, trailhead_elevation_ft, snow_risk, hard_reject, reject_reason

5. TRAIL CONDITIONS — Search: "WTA trip report [Trail Name] site:wta.org"
   Find reports from last 14 days.
   Hard reject if latest credible report says trail closed/impassable or heavy snow/ice requiring technical gear.
   Return: surface, latest_report_date, closure_signal, road_mentions, hard_reject, reject_reason

6. LOGISTICS — Search: "[Trail Name] parking pass required" and "[Trail Name] wilderness group size limit"
   No hard reject unless explicit legal access prohibition.
   Return: pass_type, group_limit, permit_constraints, hard_reject, reject_reason

Return structured output only. If a step hard-rejects, stop remaining steps for this trail and return partial fields.
```

**Also run one shared subagent** for regional data that applies to all trails:

```
Search for NWAC Cascades snow level forecast and NWS regional weather overview for [Target Date].
Compare west-side Cascades vs east-side Cascades precipitation outlook.
Return: snow level elevation, west-side precip%, east-side precip%, any severe advisories.
```

Compile all subagent results into a structured dataset per trail.

**Execution caps (hard limits):**

- `max_candidates_phase2 = 6`
- `max_finalists_deep_research = 4`
- `max_parallel_subagents = 4`
- `max_search_calls_total = 20`
- `max_tokens_total` per run: set before execution and stop when reached

If a cap is reached, stop deeper research and continue with best available data + confidence flags.

---

## Step 5: Hard Filters

**Exclude** any trail failing these. Track rejections (trail name, reason, data point).

| Filter | Rule | Source |
|---|---|---|
| Drive time | > 3 hours one-way from Greenlake → exclude | Agent knowledge of PNW drive times |
| Road access | Closed, gated, washed out, or clearly non-passable road → exclude | WSDOT + WTA from subagents |
| Trail closed | Gated, closed for season, washed out → exclude | WTA reports + official closures |
| Snow level | Trailhead elevation > (forecasted snow level + 500 ft) → exclude (unless user wants snow) | NWAC from subagents |
| Hazards | Active avalanche warning, severe weather advisory, hazardous ice → exclude | NWAC + NWS from subagents |
| Duration | Estimated time > max (default 5 hrs) → exclude. Estimate: `(distance_mi / 2) + (elevation_ft / 1000)` hours | Calculated |
| Previously hiked | Trail name in exclusion list → exclude | Hike log |

**Special cases:**

- No WTA reports within 14 days → **don't exclude**, flag as "conditions unverified"
- Trailhead within 500 ft of snow level → **don't exclude**, flag as "marginal snow risk"
- No WSDOT data → check WTA reports for road mentions; if none, flag "road conditions unknown"
- Chain requirement present → **don't exclude**, flag as "chains likely". Apply ranking penalty and surface clearly in output.

**Definition of "too bad" (hard reject) used for early stop and filters:**

- Hazard warning active for target date (avalanche/severe advisory)
- Trail access road closed/gated/washout
- Trailhead elevation more than 500 ft above forecast snow level (unless user wants snow)
- Weather extremes: precip >= 80%, wind >= 35 mph, or daytime high < 20F
- Credible recent report indicates trail closed/impassable or heavy snow/ice requiring technical gear

---

## Step 6: Rank & Select Top 3

**Ranking code**: `ranker.py` (same directory as this file) implements the scoring below. Run it via Bash: `python3 ranker.py` after populating trail data.

Score each surviving trail (0–100 scale per factor):

| Factor | Weight | Scoring |
|---|---|---|
| **Weather fit** | 40% | `100 - (precip% * 0.7) - wind_penalty - temp_penalty`. West Cascades rainy (>60%) but east clear (<30%) → boost east trails +20. Rain everywhere → boost tree-cover trails +15. |
| **Trail condition** | 25% | Clear/dry=100, Light snow (passable)=80, Mud=70, Moderate snow=60, Unverified=50, Heavy snow/ice=30 |
| **Elevation progression** | 20% | Target = last hike gain + 350ft (or 750ft if no history). Score = `100 - abs(trail_gain - target) / 5` |
| **Region variety** | 10% | Region in last 5 hikes 2+ times → -20. Different region from last hike → +10 |
| **Type variety** | 5% | Last 3 hikes same type (lake/ridge/waterfall) and this matches → -15. Different type → +10 |

**Selection rules:**

1. Sort by weighted total score descending
2. Pick #1 (highest score)
3. Pick #2 and #3 ensuring: at least 2 different regions across the 3 picks, and elevation diversity (one near target, one ~200ft below, one ~200ft above)
4. Ties → prefer shorter drive time

**Access-risk adjustment (applied before final sort):**

- Chains likely and sedan-friendliness unknown/no → subtract **15** points
- Chains likely but sedan-friendly confirmed/plowed → subtract **5** points
- No chain requirement signal → subtract **0** points

**Early stop rule:**

If 3 trails already satisfy safety filters and have strong evidence coverage, skip remaining optional searches and finalize.

---

## Step 7: Iterate If < 3 Survive

**Round 1**: Relax non-safety constraints by 20%

- Duration: 5hr → 6hr
- Drive time: 3hr → 3.6hr
- Re-apply filters to original candidate set

**Round 2**: Ask user for a broader AllTrails URL with relaxed filters. If provided, re-run from Step 3.

**Round 3**: Present what's available with note: "Limited options this week due to [primary constraint]. Consider [suggestion]."

---

## Step 8: Present Output

### Per trail (3 picks)

```
## [1/2/3]. [Trail Name]

**Location**: [Region]
**Distance**: [X.X] mi | **Elevation Gain**: [XXXX] ft | **Difficulty**: [Level]
**Estimated Duration**: [X.X] hrs

### Access
- **Drive from Greenlake**: [X.X] hrs
- **Road**: [Paved/Gravel] — Sedan-friendly: [Yes/No] (source: [WSDOT/WTA MM/DD])
- **Chains**: [Likely/Not expected/Unknown] — Access risk: [Low/Medium/High]

### Logistics
- **Pass Required**: [NW Forest / Discover / Sno-Park / None]
- **Group Limit**: [Number / None]

### Conditions for [Date]
- **Hazards**: [None/Advisory details]
- **Weather**: High [XX]F / Low [XX]F | Precip: [XX]% | Wind: [X] mph | [Clear/Rain/etc.]
- **Trail**: [Clear/Snow/Mud/etc.] — Last report: [Date] via WTA [or "Unverified"]
- **Snow Level**: Forecast [XXXX] ft | Trailhead [XXXX] ft — [Safe/Marginal/Above]

### Highlights
[Scenic features matching user preferences]

### Why This Trail on This Day
[2-3 sentences: (a) how it matches filter preferences, (b) why weather/conditions favor it
on this specific date vs alternatives, (c) how it fits the elevation progression arc]

**AllTrails**: [URL]
```

### Rejected trails

```
## Trails Considered But Excluded

| Trail | Reason | Detail |
|---|---|---|
| [Name] | Snow level | Trailhead 3800ft, snow level 2800ft |
| [Name] | Road closed | WSDOT: SR-20 closed until April |
| [Name] | Previously hiked | Completed 2026-01-18 |
```

### End with

```
Want to adjust and re-search? Options:
- Relax filters and retry
- Change target date
- Override elevation target
- Provide broader AllTrails URL
```

---

## Step 9: Update Hike Log

After presenting results, ask: "Want me to log your chosen trail? Which pick — 1, 2, or 3?"

If yes:

1. Read current hike-log.md
2. Append row: `| [Date] | [Trail Name] | [Distance] | [Elevation Gain] | [Region] | [User notes] |`
3. Write updated file
4. Confirm: "Hike log updated."

---

## Error Handling

| Failure | Action |
|---|---|
| Chrome MCP unavailable | Use Fallback A (user paste) or B (WebSearch) |
| AllTrails needs login | Tell user to log into AllTrails in Chrome, retry |
| < 5 AllTrails results | Warn user, ask for broader URL |
| Weather search fails | Note "unavailable" in output, rank without weather (other factors rescaled) |
| No WTA trip reports | Flag "Unverified — check WTA before going" (don't exclude) |
| NWAC unavailable | Warn: "Snow data unavailable — check NWAC manually" |
| WSDOT unavailable | Check WTA for road mentions; if none, flag "road unknown" |
| All subagents fail | Present trails from Phase 1 without condition data, note limitations |
| Token/call budget reached | Stop additional lookups, present best available picks with confidence flags and missing fields |
| Hike log read/write fails | Continue without history; don't block workflow |

---

## Tools

| Tool | Use |
|---|---|
| **Read / Write** | Hike log persistence |
| **Bash** | Date calculation (`date -v+sat +%Y-%m-%d`) |
| **Claude in Chrome** (`mcp__Claude_in_Chrome__*`) | AllTrails browsing with user's session |
| **WebSearch** | NWS weather, NWAC snow, WSDOT roads, WTA trip reports |
| **WebFetch** | Specific WTA/NWS/WSDOT pages when WebSearch is insufficient |
| **Task** (subagents, `general-purpose` type) | Parallel per-trail condition research |
| **AskUserQuestion** | Input collection, iteration prompts |

## Data Contract (for low token usage)

During Steps 3-7, require compact structured output only (JSON-like fields), for example:

`trail_name, distance_mi, elevation_ft, difficulty, rating, region, drive_hr, hazards_status, precip_pct, wind_mph, temp_high_f, snow_level_ft, trailhead_ft, road_status, chain_required, sedan_friendly, access_risk, trail_surface, report_date, pass_type, hard_reject, reject_reason, confidence`

Expand into narrative prose only in Step 8 output.

## Caching Guidance

- Cache weather/snow/road/trip-report summaries per `(trail, target_date)` for 12-24 hours.
- Reuse cached results during reruns in the same planning session/week.
- Refresh only fields likely to change quickly (e.g., hazards, road incidents).

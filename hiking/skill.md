---
name: trail-picker
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

### Optional (show smart defaults)

- **Hike date**: Default = next Saturday. If today is Saturday, use the following Saturday. Must be within 10 days for reliable weather. Calculate with: `date -v+sat +%Y-%m-%d` (macOS)
- **Past hikes**: Auto-populated from hike log. User can override with comma-separated list.
- **Max duration**: Default 5 hours
- **Target elevation gain**: Default auto-calculated (most recent gain + 200–500 ft)
- **Max drive time**: Default 3 hours one-way from Greenlake

---

## Step 3: Phase 1 — Extract Trail Candidates

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

**Target: 10+ candidates.** If fewer visible, scroll down and re-read to load more.

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

**Critical: Use Task subagents to parallelize.** Launch one subagent per candidate trail (up to 10 in parallel).

Each subagent prompt:

```
Research real-time conditions for "[Trail Name]" in [Region] for hiking on [Target Date].

1. WEATHER — Search: "NWS forecast [nearest town/area] [Target Date]"
   Return: High/low temp (F), precipitation %, wind speed, condition summary

2. SNOW LEVEL — Search: "NWAC snow level forecast Washington Cascades [Target Date]"
   Return: Forecasted snow level elevation (ft). Compare to trailhead elevation [X ft].

3. ROAD CONDITIONS — Search: "WSDOT [highway/road to trailhead] road conditions"
   Return: Open/closed, chain requirements, sedan-friendly (yes/no), source

4. TRAIL CONDITIONS — Search: "WTA trip report [Trail Name] site:wta.org"
   Find reports from last 14 days.
   Return: Trail surface (clear/snow/ice/mud), date of latest report, road mentions

5. HAZARDS — Search: "NWAC avalanche forecast [region]" and "NWS weather advisory [region]"
   Return: Any active warnings (avalanche, severe weather, ice)

6. LOGISTICS — Search: "[Trail Name] parking pass required" and "[Trail Name] wilderness group size limit"
   Return: Pass type (NW Forest/Discover/Sno-Park), Group size limit (if any).

Return all findings as structured text. If data unavailable, say "unavailable" for that field.
```

**Also run one shared subagent** for regional data that applies to all trails:

```
Search for NWAC Cascades snow level forecast and NWS regional weather overview for [Target Date].
Compare west-side Cascades vs east-side Cascades precipitation outlook.
Return: snow level elevation, west-side precip%, east-side precip%, any severe advisories.
```

Compile all subagent results into a structured dataset per trail.

---

## Step 5: Hard Filters

**Exclude** any trail failing these. Track rejections (trail name, reason, data point).

| Filter | Rule | Source |
|---|---|---|
| Drive time | > 3 hours one-way from Greenlake → exclude | Agent knowledge of PNW drive times |
| Road access | Rough road, washout, chain requirement (unless confirmed plowed) → exclude | WSDOT + WTA from subagents |
| Trail closed | Gated, closed for season, washed out → exclude | WTA reports + official closures |
| Snow level | Trailhead elevation > forecasted snow level → exclude (unless user wants snow) | NWAC from subagents |
| Hazards | Active avalanche warning, severe weather advisory, hazardous ice → exclude | NWAC + NWS from subagents |
| Duration | Estimated time > max (default 5 hrs) → exclude. Estimate: `(distance_mi / 2) + (elevation_ft / 1000)` hours | Calculated |
| Previously hiked | Trail name in exclusion list → exclude | Hike log |

**Special cases:**

- No WTA reports within 14 days → **don't exclude**, flag as "conditions unverified"
- Trailhead within 500 ft of snow level → **don't exclude**, flag as "marginal snow risk"
- No WSDOT data → check WTA reports for road mentions; if none, flag "road conditions unknown"

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

### Logistics
- **Pass Required**: [NW Forest / Discover / Sno-Park / None]
- **Group Limit**: [Number / None]

### Conditions for [Date]
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
| [Name] | Snow level | Trailhead 3200ft, snow level 2800ft |
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

---
name: trail-picker
license: Apache-2.0
metadata:
  author: smb1947
  version: "1.1"
description: |
  Pick the 3 best hiking trails for weekend hikes near Seattle.
  Two-phase decision engine: extract candidates from AllTrails, then layer real-time weather,
  snow, road, and elevation progression intelligence. Invoke when user says "pick a hike",
  "find trails", "plan Saturday hike", "trail picker", or discusses weekly hiking planning.
---

# Agentic Trail Researcher

## Overview

An agentic workflow that replaces an hour of manual research with a 5 mins of interaction. It operates in 6 steps:

1. **Load Hike History**: Extract past hikes for exclusions and variety ranking.
2. **Gather Inputs**: Collect AllTrails filters and user preferences.
3. **Extract Candidates**: Pull 8-12 trail candidates from AllTrails.
4. **Condition Research**: Use parallel subagents to check weather, snow, roads, trail status, and hazards.
5. **Hard Filters**: Exclude trails that are unsafe or inaccessible.
6. **Rank & Select**: Score surviving trails based on weather, conditions, and variety.

**PRD reference**: `references/PRD - Trail Picker.md`
---

## Step 1: Load Hike History

**Hike log**: `references/hike-log.md`

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
3. **Default values** — Hardcoded fallbacks (e.g., 500–1000 ft target, 3 hr max drive). Used only when both user input and hike-log are silent.

This hierarchy applies to all configurable parameters: elevation targets, duration limits, drive time, region preferences, trail exclusions, and difficulty.

Use AskUserQuestion to collect:

### Required

- **JSON File Path**: User must provide a local path to a JSON file containing extracted trail candidates from AllTrails.
  - **Immediate Action**: As soon as this path is provided, read the JSON file and extract the top-level `url` key. This URL contains the query parameters representing the user's active filters.

*If the JSON file path is not provided, do not proceed with the workflow.*

### AllTrails Filter Reference

The following filters are available on the AllTrails Explore page. When parsing the URL embedded within the user's JSON file, recognize these query param dimensions to understand what the user cares about:

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

- **Hike date**: Default = next Saturday. Calculate using your standard date tools or a cross-platform command (e.g. `python3 -c "from datetime import date, timedelta; d=date.today(); print(d + timedelta(days=(5-d.weekday()+7)%7 or 7))"`). *Ask user to confirm or change.*

### Informational Defaults (Calculate & Display Only — Do NOT Ask)

Output these derived values so the user is aware, but **proceed immediately** without asking for confirmation or input on them.

- **Past hikes**: Auto-populated from hike log.
- **Target elevation gain**: Default auto-calculated (most recent gain + 200–500 ft)
- **Max drive time**: Default 3 hours one-way from Greenlake

---

### Output: Preference Summary

After gathering inputs and applying the priority order, **output a summary** of the final preferences that will be used for trail selection. This confirms to the user what criteria are active before proceeding with research.

**Format:**

```text
Trail Preferences for [Date]:

Date: [YYYY-MM-DD] (next Saturday / user override)
Max duration: [X] hrs
Target elevation gain: [XXX–XXX] ft (from hike log progression / default / user override)
Max drive time: [X] hrs from Greenlake

From JSON URL:
  - Difficulty: [Easy/Moderate/Hard/Strenuous]
  - Distance: [X–X] mi
  - Elevation range: [XXX–XXX] ft
  - Attractions: [Waterfall, Lake, Views, etc.]
  - Route type: [Loop/Out & Back/Point to Point]
  - Rating: [X.X+] stars
  - Region: [Map bounds or location description]

Exclusions:
  - Previously hiked: [Trail 1, Trail 2, ...]
  - Over-represented regions: [Region A (X recent hikes), Region B (X recent hikes)]

✓ Step 2 completed in 0m 15s
```

This output should be **concise** and only show non-default values. If the user didn't apply a filter (e.g., no difficulty filter in the JSON data), omit that line.

---

## Step 3:

**Cost discipline (always on):**

- Keep prompts and tool outputs concise.
- Return structured fields only (no long prose) until final presentation.
- Cap Phase 1 candidate set to **6 trails max** after initial extraction and quick pruning.

### Primary: Read JSON File

Extract trail candidates by reading the JSON file path provided by the user in Step 2.

1. Read the provided JSON file.
2. Parse the trail listings to extract:
   - Trail name
   - Distance (miles)
   - Elevation gain (feet)
   - Difficulty (Easy / Moderate / Hard / Strenuous)
   - Star rating + review count
   - Location / region
   - Direct AllTrails URL
3. Print the first 10 trails from the JSON file to the user.
4. Use these 10 trails as your candidate set for Phase 2.

*Do not perform any web searches or browser automation to find trails.*

### Step 3 Expected Output

```text
Trail Candidates Extracted (8 trails):

Source: user_provided_trails.json

1. Lake Ingalls via Ingalls Way Trail
   - 9.5 mi | 2,600 ft gain | Hard | 4.8★ (1,234 reviews)
   - Region: East Cascades (Cle Elum area)
   
2. Mount Townsend Trail
   - 8.2 mi | 2,850 ft gain | Moderate | 4.7★ (892 reviews)
   - Region: Olympics (Quilcene area)

... (6 more trails)

Next: Grouping trails by region for condition research...

✓ Step 3 completed in 0m 22s
```

---

## Step 4: Condition Research (Region-Based Subagents)

**Critical: Use region-based research to reduce token usage and redundant searches.** Trails in the same area share the same weather, snow levels, and regional hazards.

### Condition Priority Order (highest to lowest)

1. **Hazards (Regional)**
2. **Weather (Regional)**
3. **Snow level (Regional)**
4. **Road conditions (Trail-specific)**
5. **Trail conditions (Trail-specific)**
6. **Logistics (Trail-specific)**

### Step 4A — Regional Environmental Checks

1. **Group candidates by region/area** (e.g., "North Bend", "Snoqualmie Pass", "Mountain Loop Hwy").
2. **Spawn one subagent per unique area** to research the environmental baselines:

```
Research conditions for the [Region] area for hiking on [Target Date].
1. HAZARDS — Search: "NWAC avalanche forecast [Region]" and "NWS weather advisory [Region]"
2. WEATHER — Search: "NWS forecast [nearest town/area] [Target Date]"
3. SNOW LEVEL — Search: "NWAC snow level forecast Washington Cascades [Target Date]"

Return: avalanche_risk, weather_summary, precip_pct, wind_mph, high_f, low_f, snow_level_ft, hard_reject (true/false if severe weather/avalanche), reject_reason
```

**Apply these regional results to all trails in that area.**
- If the region hard-rejects (e.g., active avalanche warning or 90% rain), **drop all trails in that region immediately**.
- If a trail's trailhead elevation is > (regional snow level + 500 ft), drop it.

Shortlist the surviving trails to the top **3-4 finalists**.

### Step 4B — Trail-Specific Checks (Finalists Only)

For the surviving 3-4 finalists, run a highly targeted subagent to check local access:

```
Research access for "[Trail Name]" in [Region]:
1. ROAD CONDITIONS — Search: "WSDOT [highway/road to trailhead] road conditions"
   Hard reject if: road closed/gated/washout.
   Return: road_status, chain_required, sedan_friendly
2. TRAIL CONDITIONS — Search: "WTA trip report [Trail Name] site:wta.org" (last 14 days)
   Hard reject if: latest credible report says trail closed/impassable.
   Return: surface, latest_report_date
3. LOGISTICS — Search: "[Trail Name] parking pass required"
   Return: pass_type

Return structured output only. Stop on first hard reject.
```

Compile the regional (4A) and specific (4B) results into a complete dataset per trail.

**Execution caps (hard limits):**

- `max_candidates_phase2 = 10`
- `max_regions_researched = 4`
- `max_finalists_deep_research = 4`
- `max_search_calls_total = 15`
- `max_tokens_total` per run: set before execution and stop when reached

If a cap is reached, stop deeper research and continue with best available data + confidence flags.

### Step 4 Expected Output

```text
Condition Research Complete:

Step 4A: Regional Environment
  ✓ East Cascades (Cle Elum area): 
    - Weather: Clear, High 65F, Low 42F, Wind 5mph
    - Snow level forecast: 4,000 ft
    - Hazards: None
  ✓ Olympics (Quilcene area): 
    - Weather: 20% precip, High 55F, Low 38F
    - Snow level forecast: 3,500 ft
    - Hazards: None
  ✗ West Cascades (Snoqualmie Pass): Active avalanche warning → Region dropped

Step 4B: Trail-Specific Access
Finalists (4 trails passed):
  ✓ Lake Ingalls 
    - Road: Clear, paved, sedan-friendly
    - Trail: Clear, dry (WTA 05/10)
    - Pass: NW Forest Pass
  ✓ Mount Townsend 
    - Road: Clear, gravel, sedan-friendly
    - Trail: Light snow, passable (WTA 05/12)
    - Pass: None

Rejected (4 trails):
  ✗ Snow Lake — Region dropped (Avalanche hazard)
  ✗ Mount Pilchuck — Road closed (WSDOT gate at mile 7)
  ... (2 more)

Next: Applying hard filters and ranking...

✓ Step 4 completed in 1m 45s
```

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

### Step 5 Expected Output

```text
Hard Filters Applied:

Survivors (3 trails):
  ✓ Lake Ingalls
  ✓ Mount Townsend
  ✓ Oyster Dome

Rejected (1 trail):
  ✗ Colchuck Lake — Drive time 3.2 hrs (exceeds 3 hr max)
    Calculation: Greenlake to Leavenworth = 3.2 hrs

Next: Ranking survivors...

✓ Step 5 completed in 0m 12s
```

---

## Step 6: Rank & Select Top 3

**Ranking code**: `ranker.py` (same directory as this file) implements the scoring below. Run it via Bash: `python3 ranker.py` after populating trail data.

Score each surviving trail (0–100 scale per factor):

| Factor | Weight | Scoring |
|---|---|---|
| **Weather fit** | 50% | `100 - (precip% * 0.7) - wind_penalty - temp_penalty`. West Cascades rainy (>60%) but east clear (<30%) → boost east trails +20. Rain everywhere → boost tree-cover trails +15. |
| **Trail condition** | 35% | Clear/dry=100, Light snow (passable)=80, Mud=70, Moderate snow=60, Unverified=50, Heavy snow/ice=30 |
| **Region variety** | 10% | Region in last 5 hikes 2+ times → -20. Different region from last hike → +10 |
| **Type variety** | 5% | Last 3 hikes same type (lake/ridge/waterfall) and this matches → -15. Different type → +10 |

**Selection rules:**

1. Sort by weighted total score descending
2. Pick #1 (highest score)
3. Pick #2 and #3 ensuring: at least 2 different regions across the 3 picks
4. Ties → prefer shorter drive time

**Access-risk adjustment (applied before final sort):**

- Chains likely and sedan-friendliness unknown/no → subtract **15** points
- Chains likely but sedan-friendly confirmed/plowed → subtract **5** points
- No chain requirement signal → subtract **0** points

**Early stop rule:**

If 3 trails already satisfy safety filters and have strong evidence coverage, skip remaining optional searches and finalize.

### Step 6 Expected Output

```text
Ranking Results:

1. Lake Ingalls — 87.3 points
   - Weather fit: 95/100 (clear, east-side advantage)
   - Trail condition: 100/100 (clear/dry per WTA 05/10)
   - Region variety: 80/100 (new region)
   - Type variety: 90/100 (ridge trail)
   
... (Top 3 listed)

Selection ensures:
  ✓ 3 different regions (East Cascades, Olympics, Puget Sound)

Next: Preparing detailed output...

✓ Step 6 completed in 0m 05s
```

---

## Step 7: Iterate If < 3 Survive

**Round 1**: Relax non-safety constraints by 20%

- Duration: 5hr → 6hr
- Drive time: 3hr → 3.6hr
- Re-apply filters to original candidate set

**Round 2**: Pull the *next* batch of up to 10 trails from the original JSON file (e.g., trails 11-20) and re-run the research pipeline from Step 4.

If < 3 trails survive after Round 2, **stop iterating** and present the best available options (even if 0-2 trails) with the note: "Limited options this week due to [primary constraint]. Consider adjusting filters for next time."

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
on this specific date vs alternatives, (c) how it adds variety to recent hikes]

**AllTrails**: [URL]
```

### Rejected trails

```text
## Trails Considered But Excluded

| Trail | Region | Reason | Detail |
|---|---|---|---|
| [Name] | [Region] | Snow level | Trailhead 3800ft, snow level 2800ft |
| [Name] | [Region] | Road closed | WSDOT: SR-20 closed until April |
| [Name] | [Region] | Previously hiked | Completed 2026-01-18 |
```

### End with

```text
Want to adjust and re-search? Options:
- Relax filters and retry
- Change target date
- Override elevation target
- Provide a new JSON file with broader filters

✓ Step 8 completed in 0m 18s
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
| < 5 AllTrails results | Warn user, ask for a new JSON file with broader filters |
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
| **WebSearch** | NWS weather, NWAC snow, WSDOT roads, WTA trip reports |
| **WebFetch** | Specific WTA/NWS/WSDOT pages when WebSearch is insufficient |
| **Task** (subagents, `general-purpose` type) | Parallel per-trail condition research |
| **AskUserQuestion** | Input collection, iteration prompts |

## Data Contract (for low token usage)

During Steps 3-7, require compact structured output only (JSON-like fields), for example:

`trail_name, distance_mi, elevation_ft, difficulty, rating, region, drive_hr, hazards_status, precip_pct, wind_mph, temp_high_f, snow_level_ft, trailhead_ft, road_status, chain_required, sedan_friendly, access_risk, trail_surface, report_date, pass_type, hard_reject, reject_reason, confidence`

Expand into narrative prose only in Step 8 output.

## Caching Guidance

- **Regional Data**: Cache weather, snow level, and hazard summaries per `(region, target_date)` for 12-24 hours.
- **Trail-Specific Data**: Cache road conditions and trip-report summaries per `(trail, target_date)` for 12-24 hours.
- Reuse cached results during reruns in the same planning session/week to avoid duplicate searches.
- Refresh only fields likely to change quickly (e.g., severe weather advisories, sudden road closures).

## Execution Time Tracking

- **After every step**, print the summary output of the step.
- Track and append the **time taken to complete the step** directly after the step's output (e.g., `✓ Step 4 completed in 1m 45s`).

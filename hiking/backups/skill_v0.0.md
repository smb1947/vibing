---
name: trail-picker
description: |
  Pick the 3 best hiking trails for a specific Saturday near Seattle for Kritikal Adventures.
  Two-phase decision engine: extract candidates from AllTrails results, then layer real-time weather,
  snow, road, and elevation progression intelligence. Invoke when user says "pick a hike",
  "find trails", "plan Saturday hike", "trail picker", or discusses weekly hiking planning.
---

# Trail Picker — Kritikal Adventures Weekly Hike Selection

## Overview

Two-phase agentic workflow that replaces an hour of manual research with a 90-second interaction.
- **Phase 1**: Extract trail candidates from AllTrails results using Gemini's web capabilities.
- **Phase 2**: Layer real-time weather, snow, road, and history intelligence.

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

Use AskUserQuestion to collect:

### Required
- **AllTrails filtered URL**: User applies their own filters on alltrails.com, then pastes the resulting URL.

### Optional (show smart defaults)
- **Hike date**: Default = next Saturday.
- **Past hikes**: Auto-populated from hike log.
- **Max duration**: Default 5 hours.
- **Target elevation gain**: Default auto-calculated (most recent gain + 200–500 ft).
- **Max drive time**: Default 3 hours one-way from Greenlake.

---

## Step 3: Phase 1 — Extract Trail Candidates

### Primary: Gemini Web Integration

1. Use `web_fetch` on the provided AllTrails URL to retrieve the search results.
2. If `web_fetch` is blocked or returns insufficient data, use `google_web_search` with parameters parsed from the URL (e.g., "site:alltrails.com [region] [difficulty] [distance range]").
3. Parse the page content to extract:
   - Trail name
   - Distance (miles, round-trip)
   - Elevation gain (feet)
   - Difficulty (Moderate / Hard)
   - Star rating
   - Direct AllTrails URL

**Target: 10+ candidates.**

---

## Step 4: Phase 2 — Condition Research (Parallel Subagents)

**Critical: Use Task subagents to parallelize.** Launch one subagent per candidate trail (up to 10 in parallel).

Each subagent prompt:
```
Research real-time conditions for "[Trail Name]" in [Region] for hiking on [Target Date].
1. WEATHER: NWS forecast for [Target Date].
2. SNOW LEVEL: NWAC forecast for [Target Date].
3. ROAD CONDITIONS: WSDOT status for trailhead access.
4. TRAIL CONDITIONS: WTA trip reports from last 14 days.
5. HAZARDS: Avalanche or severe weather warnings.
```

---

## Step 5: Hard Filters

**Exclude** any trail failing these:
- Drive time > 3 hours.
- Road access issues (washouts, closures).
- Trail closed.
- Trailhead elevation > snow level (unless requested).
- Active avalanche or severe weather warnings.
- Previously hiked in 2026.

---

## Step 6: Rank & Select Top 3

Score (0–100) based on:
- **Weather fit (40%)**: Low precip and wind.
- **Trail condition (25%)**: Clear/Dry preferred over Snow/Mud.
- **Elevation progression (20%)**: Matches target gain arc.
- **Region/Type variety (15%)**: Preference for new regions and trail types.

---

## Step 7: Present Output & Log

### Per trail (3 picks):
- Location, Distance, Elevation, Difficulty, Duration.
- Access details (Road/Drive time).
- Specific conditions for [Date] (Weather/Snow/Trail).
- **Why This Trail**: Justification based on conditions and progression.

### Update Hike Log
Ask to log the chosen trail and append to `hike-log.md`.

---

## Tools
- **Read / Write**: Hike log persistence.
- **google_web_search**: Condition research and fallback discovery.
- **web_fetch**: Direct extraction from AllTrails and WTA.
- **Task**: Parallel research subagents.
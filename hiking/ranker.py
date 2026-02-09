"""
Trail Ranker — Kritikal Adventures
Implements the weighted scoring system from skill.md Step 6.
"""

from __future__ import annotations
from dataclasses import dataclass, field


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

@dataclass
class TrailConditions:
    precip_pct: float = 50.0          # 0-100
    wind_mph: float = 5.0
    temp_high_f: float = 55.0
    temp_low_f: float = 35.0
    west_cascades: bool = True        # True = west side, False = east side
    west_precip_pct: float = 50.0     # regional west-side precip
    east_precip_pct: float = 30.0     # regional east-side precip
    tree_cover: bool = False          # trail is mostly forested
    trail_surface: str = "unverified" # clear|light_snow|mud|moderate_snow|unverified|heavy_snow_ice
    elevation_gain_ft: float = 0.0
    region: str = ""
    trail_type: str = ""              # lake|ridge|waterfall|summit|forest|river
    drive_hours: float = 1.5


@dataclass
class HikeHistory:
    last_gain_ft: float | None = None           # most recent hike elevation gain
    recent_regions: list[str] = field(default_factory=list)  # regions from last 5 hikes
    last_region: str = ""                        # single most recent region
    recent_types: list[str] = field(default_factory=list)    # trail types from last 3 hikes


# ---------------------------------------------------------------------------
# Individual scoring functions (each returns 0–100)
# ---------------------------------------------------------------------------

def score_weather(c: TrailConditions) -> float:
    """
    Weather fit — 40% weight.
    Base: 100 - (precip% * 0.7) - wind_penalty - temp_penalty
    Bonuses: east-side boost, tree-cover boost in rain.
    """
    # Base score from precipitation
    base = 100.0 - (c.precip_pct * 0.7)

    # Wind penalty: ramps up above 15 mph
    wind_penalty = max(0.0, (c.wind_mph - 15) * 2)

    # Temperature penalty: too cold (<25F) or too hot (>85F)
    temp_penalty = 0.0
    if c.temp_high_f < 25:
        temp_penalty += (25 - c.temp_high_f) * 1.5
    if c.temp_high_f > 85:
        temp_penalty += (c.temp_high_f - 85) * 1.0

    score = base - wind_penalty - temp_penalty

    # East-side boost: west rainy (>60%) but east clear (<30%)
    if c.west_precip_pct > 60 and c.east_precip_pct < 30 and not c.west_cascades:
        score += 20

    # Tree-cover boost: rain everywhere but trail is forested
    if c.west_precip_pct > 50 and c.east_precip_pct > 50 and c.tree_cover:
        score += 15

    return max(0.0, min(100.0, score))


SURFACE_SCORES = {
    "clear":          100,
    "light_snow":      80,
    "mud":             70,
    "moderate_snow":   60,
    "unverified":      50,
    "heavy_snow_ice":  30,
}


def score_trail_condition(c: TrailConditions) -> float:
    """Trail condition — 25% weight."""
    return float(SURFACE_SCORES.get(c.trail_surface, 50))


def score_elevation_progression(c: TrailConditions, history: HikeHistory) -> float:
    """
    Elevation progression — 20% weight.
    Target = last gain + 350 ft (or 750 ft if no history).
    Score = 100 - |trail_gain - target| / 5, floored at 0.
    """
    if history.last_gain_ft is not None:
        target = history.last_gain_ft + 350
    else:
        target = 750

    deviation = abs(c.elevation_gain_ft - target)
    return max(0.0, 100.0 - deviation / 5)


def score_region_variety(c: TrailConditions, history: HikeHistory) -> float:
    """
    Region variety — 10% weight.
    Penalize over-represented regions, reward fresh ones.
    """
    score = 50.0  # neutral baseline

    # Penalty: region appeared 2+ times in last 5 hikes
    region_count = history.recent_regions.count(c.region)
    if region_count >= 2:
        score -= 20

    # Bonus: different region from most recent hike
    if history.last_region and c.region != history.last_region:
        score += 10

    return max(0.0, min(100.0, score))


def score_type_variety(c: TrailConditions, history: HikeHistory) -> float:
    """
    Type variety — 5% weight.
    Penalize same type repeated, reward diversity.
    """
    score = 50.0  # neutral baseline

    if len(history.recent_types) >= 3:
        # All 3 recent hikes same type AND this matches
        if len(set(history.recent_types)) == 1 and c.trail_type == history.recent_types[0]:
            score -= 15

    # Bonus: different type from any recent
    if c.trail_type and c.trail_type not in history.recent_types:
        score += 10

    return max(0.0, min(100.0, score))


# ---------------------------------------------------------------------------
# Weighted composite
# ---------------------------------------------------------------------------

WEIGHTS = {
    "weather":              0.40,
    "trail_condition":      0.25,
    "elevation_progression": 0.20,
    "region_variety":       0.10,
    "type_variety":         0.05,
}


@dataclass
class ScoredTrail:
    name: str
    scores: dict[str, float]
    weighted_total: float
    conditions: TrailConditions


def rank_trail(name: str, conditions: TrailConditions, history: HikeHistory) -> ScoredTrail:
    """Score a single trail across all factors."""
    scores = {
        "weather":               score_weather(conditions),
        "trail_condition":       score_trail_condition(conditions),
        "elevation_progression": score_elevation_progression(conditions, history),
        "region_variety":        score_region_variety(conditions, history),
        "type_variety":          score_type_variety(conditions, history),
    }

    weighted_total = sum(scores[k] * WEIGHTS[k] for k in WEIGHTS)

    return ScoredTrail(
        name=name,
        scores=scores,
        weighted_total=weighted_total,
        conditions=conditions,
    )


# ---------------------------------------------------------------------------
# Selection logic (top 3 with diversity constraints)
# ---------------------------------------------------------------------------

def select_top_3(scored: list[ScoredTrail]) -> list[ScoredTrail]:
    """
    Pick top 3 from scored list.
    Rules:
      1. #1 = highest weighted total
      2. #2 and #3 ensure at least 2 different regions across the 3 picks
      3. Ties → prefer shorter drive time
    """
    # Sort by weighted total desc, then drive time asc for tiebreak
    ranked = sorted(scored, key=lambda s: (-s.weighted_total, s.conditions.drive_hours))

    if len(ranked) <= 3:
        return ranked

    picks = [ranked[0]]
    remaining = ranked[1:]

    for _ in range(2):
        picked_regions = {p.conditions.region for p in picks}

        # If we only have 1 region so far, prefer a different region next
        if len(picked_regions) < 2:
            different_region = [t for t in remaining if t.conditions.region not in picked_regions]
            if different_region:
                picks.append(different_region[0])
                remaining.remove(different_region[0])
                continue

        # Otherwise just take the next highest scorer
        picks.append(remaining[0])
        remaining.remove(remaining[0])

    return picks


# ---------------------------------------------------------------------------
# Pretty-print
# ---------------------------------------------------------------------------

def print_rankings(picks: list[ScoredTrail]) -> None:
    """Display the top 3 picks with score breakdowns."""
    print("=" * 60)
    print("  KRITIKAL ADVENTURES — TRAIL RANKINGS")
    print("=" * 60)

    for i, trail in enumerate(picks, 1):
        print(f"\n{'─' * 60}")
        print(f"  #{i}  {trail.name}")
        print(f"  Weighted Total: {trail.weighted_total:.1f} / 100")
        print(f"{'─' * 60}")
        for factor, weight in WEIGHTS.items():
            raw = trail.scores[factor]
            contrib = raw * weight
            bar = "█" * int(raw / 5)
            print(f"  {factor:<24s}  {raw:5.1f} × {weight:.2f} = {contrib:5.1f}  {bar}")
        print(f"\n  Region: {trail.conditions.region}  |  "
              f"Gain: {trail.conditions.elevation_gain_ft:.0f} ft  |  "
              f"Drive: {trail.conditions.drive_hours:.1f} hrs")

    print(f"\n{'=' * 60}\n")


# ---------------------------------------------------------------------------
# Example usage
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    # Sample data from our Feb 14 session
    history = HikeHistory(
        last_gain_ft=None,    # empty log — no prior hikes
        recent_regions=[],
        last_region="",
        recent_types=[],
    )

    trails = {
        "Wallace Falls & Lake Loop": TrailConditions(
            precip_pct=80, wind_mph=20, temp_high_f=48, temp_low_f=38,
            west_cascades=True, west_precip_pct=80, east_precip_pct=40,
            tree_cover=True, trail_surface="mud",
            elevation_gain_ft=1906, region="Highway 2 — Gold Bar",
            trail_type="waterfall", drive_hours=1.2,
        ),
        "Mount Si": TrailConditions(
            precip_pct=75, wind_mph=25, temp_high_f=45, temp_low_f=35,
            west_cascades=True, west_precip_pct=80, east_precip_pct=40,
            tree_cover=True, trail_surface="mud",
            elevation_gain_ft=3395, region="I-90 — North Bend",
            trail_type="summit", drive_hours=0.8,
        ),
        "Lake Serene": TrailConditions(
            precip_pct=85, wind_mph=15, temp_high_f=46, temp_low_f=37,
            west_cascades=True, west_precip_pct=80, east_precip_pct=40,
            tree_cover=True, trail_surface="unverified",
            elevation_gain_ft=2723, region="Highway 2 — Index",
            trail_type="lake", drive_hours=1.3,
        ),
    }

    scored = [rank_trail(name, cond, history) for name, cond in trails.items()]
    picks = select_top_3(scored)
    print_rankings(picks)

from ranker import TrailConditions, HikeHistory, rank_trail, select_top_3, print_rankings

# Hike History from references/hike-log.md
# Recent hikes (last 5 weeks): 
# 1. Margaret's Way (Issaquah Alps) - Mar 7, 2026, 1706 ft
# 2. Bridal Veil Falls (Central Cascades) - Mar 1, 2026, 2785 ft
# 3. Oyster Dome (Chuckanuts) - Feb 14, 2026, 2129 ft
# 4. Franklin Falls (Snoqualmie Pass) - Feb 7, 2026, 1056 ft
# 5. Annette Lake (Snoqualmie Pass) - Jan 24, 2026, 1667 ft

history = HikeHistory(
    last_gain_ft=1706,
    recent_regions=["Issaquah Alps", "Central Cascades", "Chuckanuts", "Snoqualmie Pass", "Snoqualmie Pass"],
    last_region="Issaquah Alps",
    recent_types=["forest", "waterfall", "summit", "waterfall", "lake"]
)

# Regional Weather (North Bend - Mar 14, 2026)
# High 48, Low 34, Precip 70%, Wind 2 mph, West Cascades, Regional Snow Level 440 ft

trails = {
    "Mount Si Trail": TrailConditions(
        precip_pct=70, wind_mph=2, temp_high_f=48, temp_low_f=34,
        west_cascades=True, west_precip_pct=70, east_precip_pct=25,
        tree_cover=True, trail_surface="heavy_snow_ice", # final 0.5 miles is ice
        elevation_gain_ft=3150, region="North Bend",
        trail_type="summit", drive_hours=0.7
    ),
    "Mailbox Peak Trail Loop": TrailConditions(
        precip_pct=70, wind_mph=2, temp_high_f=48, temp_low_f=34,
        west_cascades=True, west_precip_pct=70, east_precip_pct=25,
        tree_cover=True, trail_surface="heavy_snow_ice", # upper ridge is slick ice
        elevation_gain_ft=4000, region="North Bend",
        trail_type="summit", drive_hours=0.8
    ),
    "Mount Washington Trail": TrailConditions(
        precip_pct=70, wind_mph=2, temp_high_f=48, temp_low_f=34,
        west_cascades=True, west_precip_pct=70, east_precip_pct=25,
        tree_cover=True, trail_surface="moderate_snow", # consistent snow from 3000 ft
        elevation_gain_ft=3200, region="North Bend",
        trail_type="summit", drive_hours=0.7
    ),
    "Little Si": TrailConditions(
        precip_pct=70, wind_mph=2, temp_high_f=48, temp_low_f=34,
        west_cascades=True, west_precip_pct=70, east_precip_pct=25,
        tree_cover=True, trail_surface="mud", # lower elevation
        elevation_gain_ft=1300, region="North Bend",
        trail_type="summit", drive_hours=0.7
    ),
    "Rattlesnake Ledges to East Peak": TrailConditions(
        precip_pct=70, wind_mph=2, temp_high_f=48, temp_low_f=34,
        west_cascades=True, west_precip_pct=70, east_precip_pct=25,
        tree_cover=True, trail_surface="mud", # lower to mid elevation
        elevation_gain_ft=2500, region="North Bend",
        trail_type="summit", drive_hours=0.8
    )
}

scored = [rank_trail(name, cond, history) for name, cond in trails.items()]
picks = select_top_3(scored)
print_rankings(picks)

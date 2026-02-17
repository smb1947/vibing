Hi everyone, I’m Shankar, and I built an agentic AI workflow called Trail Picker for weekend hike planning.

The problem I’m solving is for hike organizers, especially around Seattle. Washington has over 4,500 hiking trails, and there are at least 10 active hiking groups organizing trips. Most organizers are full-time working professionals doing this unpaid. Every week, they open multiple tabs to shortlist trails, then manually check weather, snow level, road access, and recent trail reports across 4-5 different sites. It’s repetitive, slow, and easy to miss a risk. In many cases, finding one suitable trail takes 3-4 hours. The moment for me was realizing this same checklist was repeated every week.

What I built is a decision agent, not a chatbot. The input is a filtered AllTrails URL plus simple constraints like date, max drive time, and max duration. The output is a ranked top 3 trails with clear reasons, plus a rejection table that explains why other trails were excluded.

If this product only did one thing well, it would be this: give a safe, defensible top 3 in minutes, with transparent tradeoffs.

Quick walkthrough of the happy path:  
I paste the AllTrails URL with my preferences already applied.  
The agent extracts candidates, then runs staged checks.  
First, it runs lightweight hazard and weather checks to quickly narrow the set.  
Then it runs deeper checks on finalists for road access, snow risk, trail conditions, and logistics.  
Finally, it applies hard filters and scoring, and returns:
- top 3 options,
- conditions summary,
- chain/access risk flags,
- and rejected trails with exact reasons.

As a PM, the key decision I made was balancing confidence vs cost. Earlier versions tried deep research on too many candidates and burned tokens quickly. I changed that to staged pruning with hard caps and early-stop logic.

What changed through iteration:  
Version 1 was too broad and expensive. I initially planned to collect high-level preferences like elevation and area, then let the agent discover trails from scratch. I realized that duplicated what AllTrails already does well, so I shifted to AllTrails integration and used the filtered URL as the source of truth for discovery. 

The next major iteration was cost reduction: early versions ran deep research across too many candidates, so I moved to staged pruning, hard execution caps, and early-stop logic to cut token usage while preserving decision quality.

If I had two more weeks, I’d focus on:
- defining clearer safety thresholds for each condition (hazards, weather, snow, road, and trail reports) so “safe vs unsafe” is explicit and consistent,
- scaling the workflow beyond Seattle by adapting regional data sources and route logic for other geographies,
- further cost optimization through tighter candidate pruning, smarter caching, and fewer deep-research calls.

The biggest open risk is data reliability and timing: conditions can change fast, and some sources can be incomplete. Before investing real resources, I’d run an 8-week pilot and compare this agent against manual planning on three metrics: planning time, recommendation acceptance rate, and day-of feasibility/safety accuracy.

That’s the product. Happy to share the workflow and get feedback on where to tighten decision logic further.

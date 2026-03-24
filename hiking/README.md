# Trail Picker (Hiking Skill)

A two-phase decision engine to pick the best hiking trails for weekend hikes.

## Features

- **Phase 1**: Extracts candidates from AllTrails.
- **Phase 2**: Layers real-time weather, snow, road conditions, and user history.

## Usage
Clone the repo and run the skill.md in one of the agents (claude/gemini/codex).

```bash
git clone https://github.com/smb1947/vibing.git
cd vibing
# Open your preferred agent (Claude/Gemini/Codex) and run:
hiking/SKILL.md "hiking/demos/mar28th_alltrails.json"
```

**NOTE:**
- **Monitor your terminal** as you might have to provide permission for agents to run web search and python commands.
- It usually takes upto **5mins** to run successfully. If it takes more time, please **cancel** the execution.

## License

Apache-2.0

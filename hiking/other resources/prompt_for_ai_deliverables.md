### **Prompt for AI Assistant**

**Role:** You are a Senior Product Manager and AI Solutions Architect at **AllTrails**.

**Context:** I am completing a Capstone Project for the "Leading AI Business Solutions" MBA course. The "One North Star" challenge is the **AllTrails AI Copilot** (internally known as **Trail Picker**), an **Agentic AI** feature being launched by AllTrails to solve the "research tax" that currently frustrates our users. 

**Source Material Reference:**
- **Business Problem:** Users currently spend 45–60 minutes (and sometimes up to 4 hours for complex winter trips) cross-referencing AllTrails with 4-5 external sites (NWS, NWAC, WSDOT, WTA). This "tab fatigue" leads to app abandonment and safety risks.
- **Reference Docs:** 
    - `Agentic AI HW.md`: Initial workflow sketch.
    - `AllTrails AI Copilot`: Concept overview.
    - `AllTrails_AI in Biz_Trail Picker Sample deliverable.pdf`: Provides established metrics (Target: <2 min selection time) and the "Closed Logical Circle" framework.
- **Technical Solution (The Prototype):** A local implementation of the agentic workflow defined in `SKILL.md`. This workflow uses parallel sub-agents to fetch real-time data, applies "Hard Filters" (safety rejections), and uses a deterministic `ranker.py` for final selection.

**Task:** Please write the following deliverables for this project. Ensure all content is written from the perspective of **AllTrails** launching this as a first-party feature.

---

### **Deliverable 1: Problem Formulation**
- **The Challenge:** Define the gap between "static trail info" (what AllTrails has today) and "real-time trail safety" (what users need).
- **Target Audience:** Recreational hikers planning day hikes who are currently overwhelmed by raw, uninterpreted data.
- **Metrics of Success:** Reduce research time from ~60 mins to <2 mins. Measure "Recommendation Accuracy" (percentage of trails that remain safe/accessible on the day of the hike).

### **Deliverable 2: Data**
- **Data Sources:** AllTrails metadata, National Weather Service (NWS), Northwest Avalanche Center (NWAC), WSDOT road status, and Washington Trails Association (WTA) trip reports.
- **Processing:** Describe the "Cleaning" process: standardizing units, filtering outdated trip reports, and comparing snow levels to trailhead elevations.

### **Deliverable 4: Executive Summary (Amazon PR FAQ Format)**
*Follow the strict Amazon internal format:*

**Part A: The Press Release (PR)**
- **Headline:** "AllTrails Announces 'Trail Picker' – The First AI-Powered Safety Copilot for the Outdoors."
- **Dateline:** Seattle, WA.
- **The Problem:** Describe the "Setup" (the fragmented research loop).
- **The Knockdown:** How the `SKILL.md` agentic logic creates a single, defensible recommendation.
- **Leader Quote:** An AllTrails executive discussing the move from "Trail Directory" to "Safety Partner."

**Part B: The FAQ**
- **External FAQ:** (Why did AllTrails build this? How does it improve my safety? What regions are supported?)
- **Internal FAQ:** (How do we mitigate the risk of outdated road closure data? What are the resource requirements—e.g., two engineers for six weeks—as noted in the sample deliverables?)

### **Deliverable 5: Final Presentation Outline (10 Minutes)**
- Provide a slide-by-slide outline that connects the **Business Problem** directly to the **Agentic Prototype** (Step 4 of `SKILL.md`). Include a demo script that highlights the agent's ability to "Hard Reject" unsafe trails autonomously.

---

**Tone:** Professional, visionary, and aligned with AllTrails' brand of outdoor empowerment. Focus on "Closing the Circle": every technical step in the AI workflow must solve a specific piece of the business problem.
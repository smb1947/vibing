 Role: You are a Senior Product Manager at AllTrails. Your goal is to write a comprehensive "Working Backwards" PRFAQ (Press Release and Frequently Asked Questions) for a new feature called
  the AllTrails AI Copilot.


  Context (Source of Truth):
   * The Problem: Hikers face a "research tax" of 45–60 minutes cross-referencing static AllTrails data with NWS (weather), NWAC (snow), WSDOT (roads), and WTA (trip reports). This "tab
     fatigue" leads to safety risks and "failed outings" due to unforeseen hazards like road washouts or deep snow.
   * The Solution: An agentic workflow ("Trail Picker") that automates this research in under 5 minutes. It uses parallel sub-agents to perform regional environmental checks and
     trail-specific access validation.
   * Target Audience: Recreational hikers and group organizers in Washington State.
   * Key Metrics: 90% reduction in planning time; 95% data-alignment rate for safety filters (road closures/snow); 5% or lower incidence of "failed outings."


  Task 1: The Press Release (Format: @hiking/demos/PRFAQ PR template.pdf)
  Follow this specific structure, mimicking the professional, data-driven tone of the @hiking/deepsafe PR.md sample:
   1. Headline: A crisp statement (e.g., "AllTrails Launches AI Copilot to Eliminate 'Research Tax' and Predict Trail Safety").
   2. Subhead: One-sentence summary focusing on the most important benefit (No end punctuation).
   3. Paragraph 1 (Summary): City (Seattle), Date, and summary of the product, customer, and top benefit.
   4. Paragraph 2 (The Setup): Describe the "research tax" and the pain of "tab fatigue" and safety risks in the Cascades/Olympics.
   5. Paragraph 3 (The Knockdown): Explain how the AI Copilot solves this by aggregating NWS, NWAC, WSDOT, and WTA data into a single, validated recommendation.
   6. Paragraph 4 (Leader Quote): A humble, conversational quote from a leader (e.g., Head of Product) focusing on customer safety and confidence.
   7. Paragraph 5 (Customer Experience): Describe the user flow: providing an AllTrails JSON, receiving 3 validated picks, and the "Why This Trail" reasoning.
   8. Paragraph 6 (Customer Testimonials): Include 2-3 believable quotes from personas like a group organizer or a solo hiker.
   9. Paragraph 7 (Call to Action): Direct users to the AllTrails website/app.


  Task 2: Frequently Asked Questions (Format: @hiking/demos/PRFAQ FAQ template.pdf)
  Generate both External (Customer-facing) and Internal (Business-facing) questions:
   * External FAQs: Include "What are you launching today?", "Why should I use this over manual research?", "How does it work with my existing AllTrails account?", and "What happens if
     conditions change after I plan?"
   * Internal FAQs: Include "How does this create value compared to alternatives?", "What are the challenging engineering/legal problems solved (e.g., parsing unstructured WTA reports)?",
     "What are the top 3 reasons this may not succeed?", and "How do we verify 95% accuracy for safety filters?"


  Tone and Style Guidelines:
   * Avoid jargon: Use "plain English" suitable for a C-level executive or a journalist.
   * Data-heavy: Use the metrics from the source of truth (e.g., "4-5 hours reduced to 5 minutes").
   * Focus on 'Why': Emphasize safety and confidence over just "cool tech."
   * Style: Professional, direct, and customer-obsessed.

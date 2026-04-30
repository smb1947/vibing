# PRD: Gym Prep Companion

## 1. Product Summary

Gym Prep Companion helps students keep up with a gym routine after they have already decided which days and time slots they want to work out.

The app does not solve calendar optimization or recommend the best gym slot. Instead, it helps students follow through on their chosen gym plan by preparing their bag, food, mindset, and post-workout tracking.

## 2. Problem

Students often want to go to the gym and may even know when they plan to go, but the gym process creates friction before the workout starts.

Common breakdowns:

- They forget clothes, shoes, towel, lock, water bottle, or shower items.
- They do not eat early enough or prepare a snack/protein.
- They carry a heavy bag through the day and may avoid doing so.
- They are not mentally prepared when the workout time arrives.
- They miss one session and lose momentum.
- They do not track progress, mood, or consistency, so the routine feels easy to abandon.

## 3. Target User

University students who:

- Already want to work out.
- Have access to a gym.
- Are willing to commit to a fixed number of workout days.
- Need help preparing and following through.
- Struggle with consistency because the pre-gym process feels heavy.

## 4. Product Goal

Help students convert gym intention into repeated gym attendance by reducing preparation friction and reinforcing commitment.

## 5. Non-Goals

This product will not:

- Find the best workout slot based on a student's calendar.
- Optimize around classes, work, labs, recruiting, or errands.
- Recommend commute routes.
- Predict crowding.
- Match users with gym buddies.

The user is expected to decide their own workout days and time slots before or during onboarding.

## 6. Core Features

### 6.1 Onboarding: Motivation Capture

The app asks users why going to the gym matters to them.

Motivation options may include:

- Better energy
- Mental clarity
- Stress relief
- Better mood
- Better sleep
- Strength
- Appearance or aesthetics
- Health
- Confidence
- Getting back into routine
- Custom motivation

The app should reuse these motivations in reminders, tone, and guide-character behavior.

Example:

> You said gym helps your mood and energy. Pack your bag tonight so tomorrow is easier.

Motivation should affect the message style:

- Mental clarity: calm, grounded, low-pressure tone
- Better energy: energetic, action-oriented tone
- Stress relief: reassuring, decompressing tone
- Better mood: warm, encouraging tone
- Strength: disciplined, progress-oriented tone
- Appearance or aesthetics: confidence-focused tone
- Health: steady, long-term tone
- Getting back into routine: restart-friendly tone

The app should also ask users how they felt after their last workout and use that memory in future reminders.

Example:

> Last time you logged feeling clearer after your workout. Pack your bag tonight so tomorrow starts with less friction.

If the user has not logged a previous workout yet, use the onboarding motivation instead.

### 6.2 Workout Commitment Setup

Users select:

- Number of gym days per week
- Specific planned days
- Planned time slots
- Preferred workout duration
- Gym type: university gym, non-university gym, apartment gym, or other
- Starting location for each session: home, college/campus, work, or other
- Whether they need to shower after
- Whether they usually need a snack/protein

Example:

- Monday, 8:00 AM, 60 minutes, from home to university gym
- Wednesday, 5:30 PM, 45 minutes, from college to university gym
- Saturday, 10:00 AM, 75 minutes, from home to outside gym

This is a commitment feature, not a schedule optimizer.

### 6.2.1 Gym Logistics Setup

The app asks basic logistics questions so reminders and checklists match the user's real gym flow.

Questions:

- Where do you usually start from before this gym session?
  - Home
  - College/campus
  - Work
  - Other
- Which gym are you going to?
  - University gym
  - Non-university gym
  - Apartment gym
  - Other
- Do you need to carry your gym bag through the day?
- Do you have a locker or place to store items?
- Do you need shower items after this session?
- Do you need clean clothes after this session?
- Do you usually need a snack/protein before or after this session?

The purpose is to personalize prep reminders. For example, a student going from college to the university gym may need a heavier packing reminder, while a student going from home to an apartment gym may need a simpler checklist.

### 6.3 Packing And Prep Checklist

For each planned gym session, the app generates a prep checklist.

Checklist items:

- Gym clothes
- Shoes
- Towel
- Lock
- Water bottle
- Headphones
- Protein or snack
- Shower items
- Clean clothes
- Rain gear, optional
- Custom items

The checklist should support:

- Reusable default checklist
- Per-session edits
- Marking items as packed
- "Bag ready" completion state
- Optional "leave at locker" or "already in bag" status

### 6.4 Food And Protein Prep

The app reminds users to prepare food around their planned workout.

Features:

- Snack/protein reminder
- Pre-workout meal note
- Post-workout protein note
- "I already ate" or "packed snack" quick check

The goal is not nutrition coaching. The goal is preventing hunger or lack of protein from becoming a gym blocker.

### 6.5 Day-Before Reminder

The app sends a reminder the day before a planned gym session.

Reminder should include:

- Tomorrow's planned workout time
- Bag checklist
- Snack/protein reminder
- Shower/clean clothes reminder if needed
- Motivation-based nudge

Example:

> Gym tomorrow at 8:00 AM. Pack shoes, towel, lock, water, and protein tonight. You said working out helps you feel less foggy.

### 6.6 Same-Day Reminder

The app sends a lighter reminder before the planned workout.

Reminder should include:

- Planned workout time
- Bag-ready status
- Quick mental commitment prompt

Example:

> Gym at 5:30 PM today. Bag ready? Keep it simple: show up, start, and log it.

### 6.7 Mental Commitment Prompt

Before the session, the app asks the user to make a small commitment.

Examples:

- "I will show up even if I do a short workout."
- "My goal today is consistency."
- "I only need to start."

This helps address the moment when other tasks start to feel more urgent.

### 6.8 Gym Session Tracker

After a planned session, the user logs:

- Did you go?
- Workout duration
- Workout type
- What did you do?
- How did you feel before?
- How did you feel after?
- What feeling do you want to remember before the next session?
- What got in the way, if they skipped?

Workout type options:

- Strength
- Cardio
- Stretching/mobility
- Sports
- Class
- Light session
- Custom

Feeling options:

- Tired
- Stressed
- Energized
- Clear-headed
- Proud
- Neutral
- Frustrated
- Better than before

### 6.9 Streaks And Progress

The app shows progress around consistency.

Metrics:

- Weekly commitment completion
- Current streak
- Longest streak
- Total sessions completed
- Total workout minutes
- Mood shift before vs. after
- Missed sessions and restart prompts

The focus should be consistency, not performance optimization.

### 6.10 Guide Character

The app includes a friendly guide character, similar in role to Duolingo's guide.

The guide character should be selected based on the user's primary motivation from onboarding.

Initial guide-character mapping:

| Primary motivation | Popular character inspiration | Message tone |
| --- | --- | --- |
| Mental clarity | Yoda-inspired calm mentor | Calm, wise, minimal, grounding |
| Better energy | Goku-inspired training partner | Energetic, upbeat, momentum-focused |
| Stress relief | Mr. Miyagi-inspired calm coach | Reassuring, gentle, pressure-reducing |
| Better mood | Olaf-inspired friendly companion | Warm, light, encouraging |
| Strength | Rocky Balboa-inspired trainer | Focused, direct, progress-oriented |
| Appearance or aesthetics | Barbie-inspired confidence coach | Positive, self-image supportive |
| Health | Uncle Iroh-inspired wellness guide | Steady, practical, sustainable |
| Getting back into routine | Ted Lasso-inspired restart coach | Forgiving, habit-focused, low-pressure |

Note: these are character inspirations for tone and interaction style. The product should create original guide characters rather than directly copying protected character names, visuals, dialogue, or branding.

The character should:

- Welcome users during onboarding
- Remind users to pack
- Celebrate completed sessions
- Help users restart after missing a workout
- Use the user's motivation in messages
- Reference the user's last logged feeling when available
- Keep the tone light, direct, and supportive

Character behavior:

- Encouraging, but not guilt-heavy
- Practical, not overly motivational
- Focused on reducing friction
- Uses short nudges instead of long explanations
- Adapts wording to the user's selected motivation

Example messages:

- Mental clarity: "Pack tonight. Clear path, clear mind tomorrow."
- Better energy: "Gear up tonight. Tomorrow's session starts before you leave."
- Stress relief: "Set the bag now. One less thing to carry in your head tomorrow."
- Strength: "Prep the basics. Show up ready to train."
- "Shoes, towel, water. Small checklist, big difference."
- "Missed today? Log why. We restart with the next planned session."
- "You showed up. That keeps the routine alive."

## 7. Key User Flow

1. User opens the app for the first time.
2. User enters motivations for going to the gym.
3. User commits to fixed workout days and time slots.
4. User creates a default packing checklist.
5. App sends a day-before prep reminder.
6. User marks bag/snack/shower items as ready.
7. App sends a same-day commitment reminder.
8. User goes to the gym.
9. User logs duration, activity, and feelings.
10. App updates streak and weekly commitment progress.

## 8. MVP Feature Set

MVP should include:

- Motivation onboarding
- Fixed workout day/time commitment setup
- Default packing checklist
- Day-before prep reminder mockup
- Same-day reminder mockup
- Session logging
- Streak and weekly completion tracker
- Guide character messages

## 9. Success Metrics

Product metrics:

- Percentage of users who set at least one weekly gym commitment
- Percentage of planned sessions with completed prep checklist
- Percentage of planned sessions completed
- Weekly workout adherence rate
- Average streak length
- Percentage of missed sessions followed by a completed next session

User outcome metrics:

- Users feel more prepared before gym sessions
- Users forget fewer items
- Users report lower pre-gym friction
- Users maintain a more consistent routine

## 10. Product Positioning

Gym Prep Companion is not a calendar optimizer or workout planner.

It is a preparation and follow-through tool for students who already want to go to the gym but need help making the process easier to execute.

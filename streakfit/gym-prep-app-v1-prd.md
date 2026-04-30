# PRD: Gym Prep Companion V1

## Product Summary

Gym Prep Companion V1 helps students follow through on gym plans they have already chosen.

The app focuses on five things:

1. Capturing motivation
2. Recording planned workout days and time slots
3. Preparing a packing list
4. Sending reminders
5. Tracking completed gym sessions

A character guide is present throughout the entire experience. The guide introduces the app, asks onboarding questions, helps users commit to days, reminds them to pack, nudges them before gym time, and reacts to their tracker entries.

V1 is intentionally simple. It does not optimize schedules, recommend workout slots, predict gym crowding, or create detailed workout plans.

## Problem

Students often want to go to the gym and may already know when they plan to go, but they fail to follow through because the pre-gym process creates friction.

The common issues are:

- They forget gym clothes, shoes, towel, lock, water bottle, or shower items.
- They forget or delay food/protein prep.
- They carry a bag through the day and need to prepare it ahead of time.
- They are not mentally ready when the gym time arrives.
- They miss sessions and lose track of consistency.

## Target User

University students who:

- Want to go to the gym consistently
- Have already decided which days or time slots they want to try
- Need help preparing before gym sessions
- Want a simple way to track whether they followed through

## V1 Goals

- Make gym preparation easier.
- Help users commit to fixed workout days and time slots.
- Reduce missed sessions caused by forgotten items or lack of prep.
- Help users see consistency over time.
- Make the experience feel guided and engaging through a lightweight character companion.

## V1 Non-Goals

V1 will not:

- Choose the best time slot for the user
- Analyze calendar availability
- Recommend commute routes
- Predict crowding
- Match gym buddies
- Build workout programs
- Give nutrition coaching

## Feature 1: Motivation

During onboarding, the character guide asks users why they want to go to the gym.

Motivation options:

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

The selected motivation should be used in reminders.

The selected motivation also determines the character guide style.

| Motivation | Guide inspiration | Tone |
| --- | --- | --- |
| Mental clarity | Yoda-inspired mentor | Calm, wise, grounding |
| Better energy | Goku-inspired training partner | Energetic, upbeat, momentum-focused |
| Stress relief | Mr. Miyagi-inspired coach | Gentle, reassuring, pressure-reducing |
| Better mood | Olaf-inspired companion | Warm, light, encouraging |
| Strength | Rocky-inspired trainer | Direct, disciplined, progress-oriented |
| Appearance or aesthetics | Barbie-inspired confidence coach | Positive, confident, self-image supportive |
| Health | Uncle Iroh-inspired guide | Steady, practical, long-term |
| Getting back into routine | Ted Lasso-inspired restart coach | Forgiving, habit-focused, low-pressure |

Note: these are tone inspirations. The actual app should use original character designs, names, visuals, and dialogue.

Example:

- If motivation is mental clarity: "You said workouts help you feel clearer. Pack your bag tonight."
- If motivation is better energy: "Tomorrow's workout is part of getting your energy back. Get your gear ready."

## Feature 2: Workout Days And Time Slots

The character guide asks users to manually enter the days and time slots they plan to work out.

Inputs:

- Workout day
- Workout time
- Expected duration
- Gym location name, optional

Example:

- Monday, 8:00 AM, 60 minutes
- Wednesday, 5:30 PM, 45 minutes
- Saturday, 10:00 AM, 75 minutes

This feature is only for commitment. The app should not suggest or optimize the schedule.

Guide role:

- Frames the time slot as a commitment
- Confirms the user's plan back to them
- Keeps the interaction simple and non-judgmental

Example:

> Got it. Monday at 8:00 AM is your first planned session. I will help you get ready the night before.

## Feature 3: Packing List

The character guide helps users create a default packing list for gym sessions.

Default items:

- Gym clothes
- Shoes
- Towel
- Lock
- Water bottle
- Headphones
- Protein or snack
- Shower items
- Clean clothes
- Rain gear

Users can:

- Add custom items
- Remove items
- Mark items as packed
- Reset the list for the next session

Completion state:

- Not started
- Partially packed
- Bag ready

Guide role:

- Walks the user through the list
- Celebrates when the bag is ready
- Reminds the user that the goal is to reduce tomorrow's friction

Example:

> Shoes, towel, water. Small prep now, easier workout later.

## Feature 4: Reminders

The app sends reminders around planned gym sessions.

V1 reminder types:

1. Day-before reminder
2. Same-day reminder

Day-before reminder should include:

- Planned workout time
- Packing list reminder
- Motivation-based message
- Character guide message

Example:

> Gym tomorrow at 8:00 AM. Pack clothes, shoes, towel, water, and protein tonight. You said workouts help your energy.

Same-day reminder should include:

- Workout time
- Quick bag check
- Simple motivational nudge
- Character guide message

Example:

> Gym at 5:30 PM today. Bag ready? Just show up and log what you did.

Guide role:

- Keeps reminders short
- Uses the user's selected motivation
- Nudges preparation instead of guilt
- Encourages showing up even if the workout is simple

## Feature 5: Simple Gym Tracker

After each planned gym session, the character guide asks users to log what happened.

Fields:

- Did you go?
- Date
- Workout duration
- What did you do?
- How did you feel before?
- How did you feel after?

Workout examples:

- Strength
- Cardio
- Stretching
- Sports
- Light workout
- Custom note

Feeling options:

- Tired
- Stressed
- Neutral
- Energized
- Clear-headed
- Proud
- Better than before
- Frustrated

The tracker should show:

- Total sessions completed
- Current weekly progress
- Simple streak count

Guide role:

- Asks quick check-in questions
- Responds to completed sessions
- Responds gently to missed sessions
- Uses logged feelings in future reminders

Example after completed session:

> You showed up. That keeps the streak alive. How did you feel after?

Example after missed session:

> Missed sessions happen. Log what got in the way and we reset for the next planned workout.

## MVP User Flow

1. Character guide welcomes the user.
2. User selects motivation.
3. Character guide adapts tone based on that motivation.
4. User adds planned workout days and times.
5. Character guide confirms the commitment.
6. User creates or edits packing list.
7. Character guide helps the user mark the bag as ready.
8. App sends day-before reminder through the guide.
9. User marks bag as ready.
10. App sends same-day reminder through the guide.
11. User logs whether they went, what they did, and how they felt.
12. Character guide reacts to the log.
13. App updates progress and streak.

## Success Metrics

- Users who create at least one planned workout slot
- Users who complete the packing list before a planned workout
- Planned workouts completed
- Sessions logged per week
- Streak length
- Users reporting better post-workout feeling than pre-workout feeling

## One-Sentence V1 Concept

A simple character-guided gym prep app that helps students commit to workout days, pack ahead, get reminders, and track whether they followed through.

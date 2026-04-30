# Prompt Pack: Gym Prep Companion Visual Prototype

Use these prompts to create the V1 visual prototype in stages. The target prototype is a static web app using HTML, CSS, JavaScript, and `localStorage`.

## Prompt 1: Build The App Skeleton

Create a static web app prototype for "Gym Prep Companion V1" using HTML, CSS, and JavaScript only.

The app helps university students follow through on gym plans they already chose. It should not optimize schedules or recommend workout slots.

Create these files:

- `index.html`
- `styles.css`
- `app.js`

The app should have client-side navigation between these screens:

- Welcome
- Motivation onboarding
- Workout days/time slots setup
- Packing list setup
- Home dashboard
- Reminder preview
- Session tracker
- Progress

Use `localStorage` to persist all user choices.

Design tone: simple, student-friendly, habit-focused, lightly playful, and practical.

## Prompt 2: Create The Welcome And Character Guide

Build the welcome screen for Gym Prep Companion.

The welcome screen should explain:

- The user chooses their own workout days and time slots.
- The app helps them prepare and follow through.
- The app focuses on motivation, packing, reminders, and tracking.

Include a character guide area that appears throughout the app. The guide should have:

- Avatar placeholder
- Short message bubble
- Tone that changes later based on user motivation

Welcome message:

> I will not pick your workout time. You choose the plan. I help you show up prepared.

Add a primary button: `Start setup`.

## Prompt 3: Build Motivation Onboarding

Create the motivation onboarding screen.

The character guide asks:

> Why do you want to keep going to the gym?

Show selectable motivation cards:

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

When the user selects a motivation, store it in `localStorage`.

Map motivation to guide style:

- Mental clarity: Yoda-inspired calm mentor
- Better energy: Goku-inspired training partner
- Stress relief: Mr. Miyagi-inspired calm coach
- Better mood: Olaf-inspired friendly companion
- Strength: Rocky-inspired trainer
- Appearance or aesthetics: Barbie-inspired confidence coach
- Health: Uncle Iroh-inspired wellness guide
- Getting back into routine: Ted Lasso-inspired restart coach

Use original generic visuals and names in the UI. Do not copy protected characters directly.

After selection, show a short guide response based on motivation.

Examples:

- Mental clarity: `Clear path, clear mind. I will help you prep before the day gets noisy.`
- Better energy: `Good. We start building tomorrow's momentum tonight.`

## Prompt 4: Build Workout Commitment Setup

Create the workout days and time slots setup screen.

The app should let users manually add planned workout sessions.

Each session includes:

- Day of week
- Time
- Expected duration
- Optional gym name

Example sessions:

- Monday, 8:00 AM, 60 minutes
- Wednesday, 5:30 PM, 45 minutes
- Saturday, 10:00 AM, 75 minutes

The app should not suggest the best time. This is only a commitment input.

Character guide message:

> Pick the days you already want to try. I will help you prepare for them.

After a session is added, show:

> Your session is set. I will remind you to prep the day before.

Store sessions in `localStorage`.

## Prompt 5: Build Packing List Setup

Create the packing list setup screen.

Default packing list items:

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

Users should be able to:

- Mark items as packed
- Add custom items
- Remove items
- Reset all items to unpacked

Show packing status:

- Not started
- Partially packed
- Bag ready

Character guide message:

> Shoes, towel, water. Small prep now, easier workout later.

When all items are packed:

> Bag ready. Tomorrow you only need to show up.

Store checklist state in `localStorage`.

## Prompt 6: Build Home Dashboard

Create the home dashboard.

The dashboard should show:

- Next planned workout
- Packing status
- Current streak
- Weekly progress
- Character guide message

Add quick action buttons:

- Pack bag
- Preview reminders
- Log workout
- View progress

Guide message should use the user's selected motivation.

Examples:

- Mental clarity: `Your next session is a chance to clear the noise. Prep the bag first.`
- Better energy: `Next session is coming. Gear ready means momentum ready.`
- Stress relief: `Set up the bag now. One less thing to carry tomorrow.`

## Prompt 7: Build Reminder Preview

Create a reminder preview screen.

Show two reminder cards:

1. Day-before reminder
2. Same-day reminder

The reminders should use:

- Next planned workout time
- Packing list status
- Selected motivation
- Character guide tone

Day-before reminder example:

> Gym tomorrow at 8:00 AM. Pack clothes, shoes, towel, water, and protein tonight. You said workouts help your energy.

Same-day reminder example:

> Gym at 5:30 PM today. Bag ready? Just show up and log what you did.

Since this is a static prototype, do not implement real push notifications. Make it clear these are reminder previews.

## Prompt 8: Build Simple Session Tracker

Create the session tracker screen.

Fields:

- Did you go? Yes/No
- Date
- Workout duration
- What did you do?
- How did you feel before?
- How did you feel after?

Workout options:

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

When submitted:

- Save the session log to `localStorage`
- Update streak if the user went
- Show a character guide reaction

Completed session message:

> You showed up. That keeps the routine alive.

Missed session message:

> Missed sessions happen. Log it, reset, and prep for the next one.

## Prompt 9: Build Progress Screen

Create the progress screen.

Show:

- Current streak
- Total completed sessions
- Planned sessions this week
- Completed sessions this week
- Recent session history
- Recent feelings before and after workouts

Keep charts simple:

- Progress bar for weekly completion
- Streak badge
- Recent logs list

Character guide message should connect progress back to motivation.

Examples:

- Mental clarity: `You logged feeling clearer after your last session. Remember that before the next one.`
- Better energy: `Your last workout ended with more energy. Let that pull you into the next one.`

## Prompt 10: Add Responsive Visual Polish

Polish the visual prototype.

Requirements:

- Mobile-first layout
- Works on desktop too
- No text overflow
- Clear buttons
- Checklist interactions are easy to tap
- Character guide remains visible without dominating the screen
- Use compact cards and simple sections
- Avoid a marketing landing page
- Avoid complex calendar UI
- Avoid fitness influencer styling

Visual style:

- Friendly but practical
- Clean background
- Two or three accent colors
- Rounded cards, but not overly bubbly
- Progress indicators for packing and streaks

## Prompt 11: Add Sample Data And Reset

Add a reset/sample data utility.

Include two small buttons in a settings or footer area:

- `Load sample data`
- `Reset prototype`

Sample data should include:

- Motivation: Mental clarity
- Workout slots:
  - Monday 8:00 AM, 60 minutes, IMA
  - Wednesday 5:30 PM, 45 minutes, IMA
- Packing list with some items packed
- Two completed session logs
- One missed session log

Reset should clear `localStorage` and return the app to welcome screen.

## Prompt 12: Final QA Checklist

Review and fix the prototype.

Checklist:

- First-time user can complete onboarding
- Motivation is saved
- Guide tone changes based on motivation
- User can add workout slots
- User can edit packing list
- Packing status updates correctly
- Reminder preview uses workout time and motivation
- User can log completed and missed workouts
- Streak and total sessions update
- Progress screen reflects saved logs
- Data persists after refresh
- Reset clears data
- App works on mobile width and desktop width

Do not add production login, backend, calendar integration, or real push notifications.

## Single Combined Prompt

Use this if you want to generate the whole prototype in one pass:

Create a static visual prototype for "Gym Prep Companion V1" using HTML, CSS, and JavaScript only. Store all data in browser `localStorage`.

The app helps university students follow through on gym sessions they already chose. It does not optimize schedules, recommend workout slots, predict crowding, plan commutes, match gym buddies, create workout programs, or give nutrition coaching.

Build these screens:

- Welcome
- Motivation onboarding
- Workout days and time slots setup
- Packing list setup
- Home dashboard
- Reminder preview
- Session tracker
- Progress

Core features:

1. Motivation: user selects why they want to go to the gym.
2. Workout commitment: user manually enters workout days, times, expected duration, and optional gym name.
3. Packing list: user manages gym clothes, shoes, towel, lock, water bottle, headphones, protein/snack, shower items, clean clothes, rain gear, and custom items.
4. Reminders: show day-before and same-day reminder previews using selected motivation and next workout time.
5. Tracker: user logs whether they went, what they did, duration, feeling before, and feeling after.

Include a character guide throughout the app. The guide asks onboarding questions, confirms commitments, nudges packing, previews reminders, reacts to completed or missed workouts, and connects progress back to the user's motivation.

Map motivation to guide tone:

- Mental clarity: Yoda-inspired calm mentor, calm and grounding
- Better energy: Goku-inspired training partner, energetic and upbeat
- Stress relief: Mr. Miyagi-inspired calm coach, gentle and pressure-reducing
- Better mood: Olaf-inspired companion, warm and encouraging
- Strength: Rocky-inspired trainer, direct and disciplined
- Appearance or aesthetics: Barbie-inspired confidence coach, positive and confident
- Health: Uncle Iroh-inspired guide, steady and practical
- Getting back into routine: Ted Lasso-inspired restart coach, forgiving and low-pressure

Use original character visuals and names. Do not copy protected characters directly.

Design should be mobile-first, practical, student-friendly, lightly playful, and not a marketing landing page. Add sample data and reset controls. Ensure all interactions persist after refresh.

# Visual Prototype Plan: Gym Prep Companion V1

## Goal

Build a clickable visual prototype for Gym Prep Companion V1 that demonstrates the core user experience:

1. Motivation onboarding
2. Workout days and time slots
3. Packing list
4. Reminders
5. Simple gym tracker
6. Character guide throughout the flow

The prototype should feel like a real product, but it does not need production authentication, real push notifications, or a backend yet.

## Recommended Platform

### Platform: Static Web App

Build the prototype as a static web app using:

- HTML
- CSS
- JavaScript
- Browser `localStorage`

### Why Static Web

This is the best fit for the current stage because:

- Fast to build and iterate
- Easy to run locally
- No dependency setup required
- No backend needed for a visual prototype
- Works well for clickable onboarding, checklist, reminder mockups, and tracker flows
- Easy to later convert into React, Next.js, Flutter, or a mobile app once the concept is validated

The prototype can live inside:

```text
prototype/visual-prototype/
```

## Database Plan

### V1 Prototype: No Real Database

For the visual prototype, use browser `localStorage`.

This is enough to store:

- Selected motivation
- Selected guide character style
- Planned workout days and time slots
- Packing list items
- Packed/not-packed status
- Session logs
- Streak count
- Recent feelings

### Why No Database Yet

A real database is unnecessary for this prototype because:

- There is only one local user
- The goal is to test the flow, not multi-user persistence
- No account login is needed
- Data can safely reset or remain local during prototype testing
- It avoids backend complexity while the product concept is still changing

### Later Database Option

If this becomes a real app, use Supabase or Firebase.

Recommended future option: Supabase.

Why Supabase later:

- Simple hosted Postgres database
- Built-in authentication
- Easy session log storage
- Good fit for structured data like workouts, checklist items, reminders, and user profiles
- Easier to query progress and streaks over time

Possible future tables:

- `users`
- `motivations`
- `workout_slots`
- `packing_items`
- `session_logs`
- `reminder_preferences`

## Prototype Scope

### In Scope

- Onboarding screens
- Motivation selection
- Character guide selection based on motivation
- Planned workout day/time setup
- Default packing list
- Marking items as packed
- Day-before reminder screen mockup
- Same-day reminder screen mockup
- Simple tracker form
- Progress dashboard
- Streak display
- Recent session history

### Out Of Scope

- Login/signup
- Real push notifications
- Calendar integration
- Schedule optimization
- Commute planning
- Gym crowd prediction
- Gym buddy matching
- Workout plan generation
- Nutrition coaching
- Real backend/database

## Main Screens

### 1. Welcome Screen

Purpose:

- Introduce the app.
- Introduce the character guide.
- Explain that the user chooses their own gym time and the app helps them prepare.

Key elements:

- Character guide illustration/avatar
- Short product promise
- Start button

### 2. Motivation Screen

Purpose:

- Capture why the user wants to go to the gym.
- Use that motivation to set guide tone.

Inputs:

- Motivation cards
- Custom motivation text field

Output:

- Selected motivation
- Assigned guide character style

Example:

- Mental clarity -> calm mentor
- Better energy -> energetic training partner
- Stress relief -> calm coach

### 3. Workout Commitment Screen

Purpose:

- Let the user manually enter fixed workout days and time slots.

Inputs:

- Day
- Time
- Expected duration
- Optional gym name

Key rule:

- The app does not recommend or optimize time slots.

### 4. Packing List Setup Screen

Purpose:

- Create a reusable gym packing checklist.

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

Interactions:

- Add item
- Remove item
- Mark item as packed
- Reset list

### 5. Home Dashboard

Purpose:

- Show the user's next planned session and prep status.

Key elements:

- Next workout day/time
- Packing progress
- Guide message
- Current streak
- Weekly progress
- Quick actions:
  - Pack bag
  - Log workout
  - View reminders

### 6. Reminder Preview Screen

Purpose:

- Demonstrate reminder experience without real notifications.

Reminder types:

- Day-before reminder
- Same-day reminder

Examples:

- Day-before: "Gym tomorrow at 8:00 AM. Pack shoes, towel, water, and protein tonight."
- Same-day: "Gym at 5:30 PM today. Bag ready? Just show up and log it."

### 7. Session Tracker Screen

Purpose:

- Let users log whether they went, what they did, and how they felt.

Fields:

- Did you go?
- Duration
- Workout type
- Notes
- Feeling before
- Feeling after

Output:

- Session log
- Updated streak
- Updated progress

### 8. Progress Screen

Purpose:

- Show simple consistency feedback.

Metrics:

- Current streak
- Total completed sessions
- Planned sessions this week
- Completed sessions this week
- Recent workouts
- Recent feelings

## Character Guide Behavior

The guide should appear across all screens.

Guide roles:

- Welcome the user
- Ask onboarding questions
- Confirm gym commitments
- Nudge packing
- Encourage same-day follow-through
- React to session logs
- Help user recover from missed sessions

Tone should depend on selected motivation.

Examples:

- Mental clarity: "Clear path, clear mind. Pack tonight."
- Better energy: "Gear up now. Tomorrow's momentum starts here."
- Stress relief: "Set the bag now. One less thing to carry tomorrow."
- Getting back into routine: "One planned session at a time. Prep first."

## Data Model For Prototype

Store one object in `localStorage`:

```json
{
  "motivation": "Mental clarity",
  "guideStyle": "calm mentor",
  "workoutSlots": [
    {
      "day": "Monday",
      "time": "8:00 AM",
      "duration": 60,
      "gymName": "IMA"
    }
  ],
  "packingItems": [
    {
      "label": "Shoes",
      "packed": false
    }
  ],
  "sessionLogs": [
    {
      "date": "2026-04-30",
      "went": true,
      "duration": 45,
      "activity": "Strength",
      "feelingBefore": "Tired",
      "feelingAfter": "Energized"
    }
  ],
  "streak": 2
}
```

## Visual Design Direction

The app should feel:

- Student-friendly
- Simple
- Habit-focused
- Slightly playful because of the guide character
- Practical rather than motivational-heavy

Avoid:

- Marketing-style landing page
- Overly complex dashboards
- Calendar-heavy UI
- Fitness influencer aesthetic
- Too many charts

Use:

- Checklist UI
- Cards for motivation choices
- Compact dashboard
- Progress rings or bars
- Friendly guide avatar
- Clear buttons
- Short copy

## Build Approach

### Step 1: Create Static App Structure

Files:

```text
prototype/visual-prototype/index.html
prototype/visual-prototype/styles.css
prototype/visual-prototype/app.js
```

### Step 2: Build Screens

Implement screens as client-side views:

- Welcome
- Motivation
- Workout setup
- Packing list
- Dashboard
- Reminder preview
- Tracker
- Progress

### Step 3: Add Local Persistence

Use `localStorage` so user choices persist after refresh.

### Step 4: Add Character Guide Logic

Guide message should change based on:

- Current screen
- Selected motivation
- Packing status
- Session result

### Step 5: Verify Locally

Open the static HTML file in a browser or run a simple local server.

## Recommended Prototype Deliverable

Deliver:

- A working static prototype
- A clear first-run onboarding flow
- Preloaded sample state option or reset button
- Responsive layout for desktop and mobile

## Decision Summary

Use a static web app with `localStorage`.

This is the right platform because the current need is visual validation, not production infrastructure. A real database should wait until the product concept is tested and the app needs user accounts, cross-device sync, or real notifications.

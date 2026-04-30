# Gym Prep Companion Customer Journey

## Purpose

This document outlines the customer journey for Gym Prep Companion V1.

The app is built around a character guide that helps students commit to gym days, prepare their bag, receive reminders, and track gym sessions.

## Journey 1: New User Onboarding

### 1. First Open

User goal:

- Understand what the app does.
- Feel that the app is about gym follow-through, not workout optimization.

App experience:

- Character guide welcomes the user.
- App explains that it will help them prepare for planned gym sessions.
- App clarifies that the user chooses their own workout days and time slots.

Guide message example:

> I will not pick your workout time. You choose the plan. I help you show up prepared.

### 2. Motivation Capture

User goal:

- Tell the app why going to the gym matters.

App experience:

- User selects one primary motivation.
- User can optionally add a custom reason.
- Character guide adapts tone based on the selected motivation.

Motivation examples:

- Mental clarity
- Better energy
- Stress relief
- Better mood
- Better sleep
- Strength
- Appearance or aesthetics
- Health
- Confidence
- Getting back into routine

Output:

- User has a motivation profile.
- App selects a character-guide style.

### 3. Workout Commitment Setup

User goal:

- Enter the days and time slots they already plan to work out.

App experience:

- User adds planned workout sessions.
- Each session includes day, time, expected duration, and optional gym name.
- Character guide confirms the commitment.

Example:

- Monday, 8:00 AM, 60 minutes
- Wednesday, 5:30 PM, 45 minutes
- Saturday, 10:00 AM, 75 minutes

Guide message example:

> Monday at 8:00 AM is set. I will help you prep the night before.

### 4. Packing List Setup

User goal:

- Create a default gym packing list.

App experience:

- App shows default items.
- User removes irrelevant items.
- User adds custom items.
- User can mark items as always packed or locker items.

Default list:

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

Output:

- User has a reusable packing list.

### 5. Reminder Preferences

User goal:

- Decide when they want reminders.

App experience:

- User enables day-before reminder.
- User enables same-day reminder.
- App explains what each reminder does.

Reminder types:

- Day-before: pack bag, food/protein, shower items, clean clothes
- Same-day: bag check and mental commitment

Output:

- Reminder schedule is tied to planned gym sessions.

### 6. Onboarding Complete

User goal:

- Feel ready for the first planned workout.

App experience:

- Character guide summarizes the user's plan.
- App shows next planned gym session.
- App shows current packing status.

Guide message example:

> Your next session is Wednesday at 5:30 PM. I will remind you tomorrow to pack.

## Journey 2: Existing User Day-Before Flow

### Trigger

The app sends a reminder the day before a planned gym session.

### User Goal

- Prepare the bag before the day gets busy.
- Avoid forgetting items.
- Mentally prepare for the planned workout.

### App Experience

- Character guide reminds the user of tomorrow's gym time.
- App opens directly to the packing checklist.
- User marks items as packed.
- App shows progress toward "Bag ready."

Reminder example:

> Gym tomorrow at 8:00 AM. Pack shoes, towel, water, and protein tonight. Tomorrow gets easier when the bag is ready.

### Completion State

Possible states:

- Not started
- Partially packed
- Bag ready

Guide response when complete:

> Bag ready. Tomorrow you only need to show up.

## Journey 3: Existing User Same-Day Flow

### Trigger

The app sends a same-day reminder before the planned workout.

### User Goal

- Confirm readiness.
- Stay mentally committed.
- Avoid dropping the plan when other tasks feel urgent.

### App Experience

- Reminder shows workout time.
- App shows bag status.
- Character guide gives a short motivation-based nudge.
- User can tap:
  - "Bag ready"
  - "Need to pack"
  - "I went"
  - "I missed it"

Reminder example:

> Gym at 5:30 PM today. Bag ready? Keep it simple: show up and log it.

## Journey 4: Post-Gym Tracking Flow

### Trigger

After the planned workout time, the app asks the user to log the session.

### User Goal

- Quickly record whether they went.
- Capture what they did.
- Capture how they felt.

### App Experience

User answers:

- Did you go?
- How long did you work out?
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

Guide response after completed session:

> You showed up. That keeps the routine alive.

Output:

- Session is added to history.
- Streak and weekly progress update.
- Last logged feeling can be reused in future reminders.

## Journey 5: Missed Session Flow

### Trigger

User marks a planned gym session as missed, or the session passes without a completed log.

### User Goal

- Log what happened without feeling punished.
- Preserve momentum for the next planned workout.

### App Experience

- Character guide asks what got in the way.
- User selects or writes a reason.

Missed reason examples:

- Forgot clothes
- Did not pack bag
- Too tired
- Hungry or no food prepared
- Other tasks took over
- Did not feel mentally ready
- Other

Guide response:

> Missed sessions happen. Log the reason, then we prep for the next one.

Output:

- Missed session is recorded.
- Streak may reset, but the app highlights the next planned workout.
- App suggests preparing earlier for the next session.

## Journey 6: Progress Review Flow

### Trigger

User opens the app outside a reminder or tracking moment.

### User Goal

- See consistency.
- Know what is next.
- Stay motivated.

### App Experience

Dashboard shows:

- Next planned gym session
- Packing status for next session
- Current weekly progress
- Current streak
- Total sessions completed
- Recent feelings after workouts

Guide message examples:

- "Next session: Thursday at 6:00 PM. Bag prep starts tomorrow."
- "You completed 2 of 3 planned sessions this week."
- "Last time you logged feeling energized after your workout."

## High-Level Journey Map

| Stage | User action | App support | Character guide role |
| --- | --- | --- | --- |
| Onboarding | Select motivation | Save motivation profile | Sets tone and guide style |
| Commitment | Enter workout days and times | Stores fixed plan | Confirms commitment |
| Prep | Build packing list | Creates reusable checklist | Walks user through prep |
| Day before | Pack bag | Sends checklist reminder | Nudges preparation |
| Same day | Confirm readiness | Shows workout time and bag status | Reinforces commitment |
| Post-gym | Log session | Tracks activity and feelings | Celebrates or helps reset |
| Progress | Review streak and weekly completion | Shows simple metrics | Connects progress to motivation |

## V1 Journey Principle

The user owns the schedule. The app owns the follow-through support.

Gym Prep Companion should not decide when the user goes to the gym. It should help the user prepare for the gym time they already committed to.

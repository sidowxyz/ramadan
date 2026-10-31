NAFIS PRD: Somali Deen, Wellbeing and Life App
Oct 24, 2026 · @mascud
1. Vision
NAFIS is a mobile companion that brings a Somali Muslim's faith, mind, body and culture into one daily routine. Its promise: "One small step a day for your heart, mind, body and roots."
It borrows the playful, reward-driven feel of apps like WalkWin (mascot, progress gauge, levels, collectible cards, leagues) and applies it to Deen, wellbeing and Somali life instead of step counting. Working name: NAFIS (inner self); alternatives are Nolol and NUUR (see open questions).
2. Problem and goals
Somali Muslims, especially younger people in the diaspora, juggle separate apps for prayer, Qur'an, mood, fitness and language. None speak Somali well, none reflect Somali culture, and most gamified apps feel secular or shame users for missed days.
Goals
1. Give users one gentle daily routine across Deen, mind, body and Somali culture.
2. Make consistency enjoyable through rewards that never score someone's faith.
3. Be fully usable in Somali and English, with Arabic for Qur'anic text.
4. Earn trust through sourced religious content and private-by-default data.
Non-goals (v1)
• Issuing fatwas or religious rulings.
• Diagnosing or treating medical or mental-health conditions.
• Public leaderboards of worship.
• A full social network.
3. Target users
Persona
Who
Needs
Hook
Hodan, 19-30
Diaspora student or young professional
Stay consistent with prayer and Qur'an, manage stress, reconnect with Somali
Streaks, garden, mood check-in, daily Somali word
Faadumo, 28-45
Mother and caregiver
Quiet time, family routines, private health tracking (cycle, sleep)
Private mode, family challenges, breathing and du'a
Cabdi, 45+
Parent or elder, lower digital literacy
Simple prayer times, adhkar, health reminders in Somali
Large text, Somali-first UI, audio
Primary launch persona: Hodan. Design for her first, but keep text size and Somali-first mode usable by Cabdi.
4. Design direction
The WalkWin reference has seven screens that set the tone: a bold orange splash with a panda mascot, a circular progress gauge with one big number and a pill CTA, white rounded stat cards, a league ranking screen, a collectible cards grid, brand search cards, and a profile with level and weekly XP. NAFIS keeps that structure (friendly, rewarding, card-based) but with its own identity so it is not a copy.
WalkWin element
NAFIS version
Panda mascot on orange splash
A Somali-inspired mascot, proposed: a baby camel (loon) who reacts to mood and progress
Step gauge with big number
Daily Journey ring: prayers, water, movement, reflection fill one ring
"Convert my steps" pill CTA
"Complete today's check-in" pill CTA
Stat cards (rank, friends, earned)
Cards for streak, level, garden stage, gratitude count
Leagues and rankings
Private family and friends circles; no public worship ranking
Collectible cards with locked state
Growth Garden plants and Somali proverb (maahmaah) cards to unlock
Brand search and offers
Somali Soul library: phrases, recipes, stories, poetry
Profile with level and weekly XP bars
Profile with level, weekly insights and mood trend
Look and feel
• Palette: sunset orange (primary), warm yellow, forest green, soft cream, sky blue. Green leads in Deen screens, orange in Home and rewards.
• Rounded 24 px cards, soft shadows, pill buttons, floating bottom nav.
• Expressive 3D-style mood characters; subtle Somali pattern (sadu weave, geometric) as backgrounds only.
• Type: a friendly rounded sans for UI; a proper Naskh or Uthmani font for Arabic.
• Light and dark mode, large-text support, minimum 4.5:1 contrast.
5. Feature requirements
P0 = in the MVP, P1 = version 2, P2 = version 3.
Module
Feature
Detail
Priority
Home
Daily Journey dashboard
Progress ring, greeting, today's tasks, daily reminder
P0
Home
Mood check-in
Pick from 6 moods with characters; suggests one activity
P0
Deen
Prayer times and reminders
Location-based times, adhan notifications, optional tracker
P0
Deen
Qur'an reading
Arabic text, Somali/English translation, bookmarks, daily goal
P0
Deen
Adhkar and du'a
Morning/evening sets, digital tasbih, favourites
P0
Deen
Ramadan and Eid
Fasting tracker, Hijri calendar, Ramadan planner
P1
Deen
Learn Islam
Short sourced lessons and quizzes
P2
Mind
Mood history
Weekly and monthly charts, patterns
P0
Mind
Journal and gratitude
Text entries, three-gratitudes prompt
P0
Mind
Guided breathing
1 to 5 minute sessions
P0
Mind
Support resources
When and where to seek professional help
P0
Health
Water, sleep, steps
Simple logging and daily goals
P0
Health
Exercise and meal ideas
Short plans, Somali recipes with nutrition
P1
Health
Cycle tracking, medication reminders
Optional and private; stored encrypted
P1
Somali Life
Daily Somali word and phrase
Audio pronunciation
P0
Somali Life
Maahmaahyo and dhaqan
Proverbs, stories, traditions
P1
Somali Life
Recipes, poetry, events
Permissioned content
P2
Gamification
Growth Garden, XP, levels
Habits grow plants; no loss penalty for missed days
P1
Gamification
Weekly challenges
Walking, reading, gratitude, Ramadan routines
P1
Community
Family and friends circles
Private, invite-only challenges
P2
AI
NAFIS Companion
Routines, reflections, Somali practice; refuses rulings and diagnoses
P2
Platform
Somali, English, Arabic (RTL)
Language switch from onboarding
P0
Platform
Accounts, backup, offline
Sign-in, cloud sync, saved content offline
P0
6. Navigation and key screens
Five bottom tabs (six is too crowded on a phone): Home, Deen, Wellbeing, Somali, Me. Mood and health sit together under Wellbeing; the garden and companion open from Home.
Screen
What it shows
Splash and onboarding
Mascot on orange, language choice, goals, notification and location permission
Home
Greeting, Daily Journey ring, mood check-in, next prayer, today's habits, daily reminder
Deen
Prayer times, Qur'an progress, adhkar sets, tasbih, Hijri date
Qur'an reader
Arabic text, translation, audio, bookmark, goal
Wellbeing
Mood chart, journal, breathing, water/sleep/steps cards
Somali
Word of the day, proverb cards, stories, recipes
Growth Garden
Plants by stage, locked and unlocked cards, weekly challenge
Circles
Private groups and shared challenges (later)
Me
Level, XP, weekly insights, settings, language, privacy, data export
7. Content, safety and privacy principles
• No faith scoring. Points and streaks reward habits, never rank someone's piety. Missed days reset gently, with encouragement instead of guilt.
• Sourced religious content. Qur'an text from a verified source; adhkar and lessons cite their reference and are reviewed by a qualified scholar before release.
• No rulings from AI. The companion points to scholars and trusted resources for fiqh questions.
• Not medical care. Health and mood features give general wellbeing guidance and show crisis and professional-help links; the app does not diagnose.
• Private by default. Mood, worship and cycle data stay on the account, are encrypted, can be exported or deleted, and are never shown to friends unless the user shares them.
• Respectful culture. Poetry, stories and recipes are used with permission and credited.
8. Technical approach
Area
Choice
App
Flutter, one codebase for iPhone and Android
Backend
Supabase (auth, Postgres, storage, row-level security)
Design
Figma, tested as a clickable prototype with 5-10 Somali users before the build
Prayer times
On-device calculation library with selectable method and madhab, plus local notifications
Languages
Somali and English strings from day one; Arabic with right-to-left layout
Offline
Prayer times, saved adhkar and Qur'an pages cached locally
Health data
Optional Apple Health and Google Health Connect for steps and sleep
AI (P2)
Hosted LLM with a restricted system prompt, safety filters and no storage of chats by default
Analytics
Privacy-respecting, anonymous event counts only
9. Release roadmap
1. Phase 0, Design (4-6 weeks): brand, mascot, full screen designs, clickable prototype, user testing with Somali users.
2. Phase 1, MVP (about 3 months): onboarding, Home ring, mood check-in and history, prayer times, Qur'an goals, adhkar, water/sleep/steps, daily Somali word, English and Somali.
3. Phase 2, Grow: Growth Garden, XP and levels, weekly challenges, Ramadan and Eid mode, proverbs and stories, recipes, offline packs.
4. Phase 3, Expand: family and friends circles, NAFIS Companion, Learn Islam, advanced insights, subscription if chosen.
Timings are estimates for a small team and change with team size.
10. Success metrics
Targets are starting hypotheses to adjust after the first beta.
Metric
Target at 3 months after launch
Onboarding completion
70%
Day-1 / Day-7 / Day-30 retention
40% / 25% / 15%
Daily check-ins per active user
4 of 7 days per week
Users who enable prayer reminders
60%
Average session
3-5 minutes, 2 sessions per day
App store rating
4.5 or higher
11. Risks and open questions
Risks
• Religious content errors damage trust. Mitigation: scholar review and cited sources.
• Scope is too wide for a first release. Mitigation: the MVP above; one tab at a time.
• Gamification feels like judging worship. Mitigation: habit-only rewards, no public worship ranking.
• Somali-language content and audio are costly to produce. Mitigation: start with a small, high-quality daily set.
Decisions needed
[ ] App name: NAFIS, Nolol, NUUR or another
[ ] Primary audience: diaspora youth, women, or all Somalis
[ ] Main focus: Deen-first or balanced
[ ] Platform: iPhone and Android together, or one first
[ ] Mascot: baby camel or another character
[ ] Monetisation: free, subscription, or sponsored content
[ ] Content partners: scholars, Somali language experts, poets
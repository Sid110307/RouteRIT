# CampusConnect

> A campus navigation platform for students, faculty, and researchers.

## Problem Statement

Many universities and colleges face two long-standing challenges:

Students struggle to find:

- Which professor works on what research area
- Which labs or departments host specific equipment
- Ongoing projects, research groups, or student clubs
- Senior students or peers with matching academic interests
- Opportunities for capstone projects, mentorship, or collaboration

LinkedIn and existing platforms fail in the academic context:

- No verified university-level data
- No mapping of labs, rooms, or buildings
- No filtering by research domain or department
- No proximity or campus-aware connections

Large campuses are equally difficult to navigate:

- Freshers take weeks to figure out classrooms and labs
- Visitors wander during fests, conferences, and open days
- Students rushing between classes lose time
- Faculty and researchers struggle to locate cross-department facilities

There is no existing tool that provides:

- Turn-by-turn directions inside campus
- Indoor + outdoor hybrid routing
- Multiple route types (shortest, accessible, main paths)
- Offline operation

As a result, time is wasted, productivity drops, and accessibility suffers, especially for new students.

## Proposed Solution

CampusConnect is a fully client-side offline academic discovery and campus navigation platform. It helps:

- Find professors by research domain
- Explore labs, equipment, research groups, and student clubs
- Search for peers with matching interests
- View verified academic profiles (via institutional identity)
- Accurate lab-to-lab and building-to-building routes
- Turn-by-turn instructions generated from actual campus geometry
- Alternate paths, accessibility routing, and node-level graph navigation
- Offline client-side functionality (no backend server used)

Our solution can be extended to any campus with similar needs by updating the map data.

## Features

- Universal support for multiple universities and campuses
- Structured academic directory of people, labs, research groups, and rooms
- Verified academic profiles (faculty, researchers, students)
- Category-based and floor-based room mapping (classrooms, labs, offices, etc.)
- A* graph-based pathfinding for highly accurate navigation
- Turn-by-turn directions with visual cues
- Works offline after initial load
- Multiple routing modes (shortest, main paths, accessible)
- Lightweight, fast, and fully client-side

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Zustand

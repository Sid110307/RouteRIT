# RouteRIT

> A real-time offline campus navigation system for RIT.

## Problem Statement

Large college campuses like RIT are extremely difficult to navigate for:

- Freshers, who take weeks to learn where everything is
- Parents & visitors, who get lost during events
- Students rushing between classes, trying to find the shortest route
- New faculty & staff, navigating labs, offices, and blocks
- Competition participants or fest crowds, exploring locations for events

Current solutions are inadequate:

- Google Maps does not map inside campuses
- No app gives turn-by-turn indoor/outdoor hybrid routing
- No tool shows alternate paths, avoids stairs, or uses campus-specific geometry

As a result, time is wasted, productivity drops, and accessibility suffers—especially for new students.

## Proposed Solution

RouteRIT is a fully client-side offline campus navigation web app built specifically for RIT. It gives students:

- Precise building-to-building routes
- Turn-by-turn instructions based on actual campus geometry
- Clean and easy-to-use navigation UI
- Works without internet after loading once
- No backend (all data stored in browser)

Our solution can be extended to other campuses with similar needs by updating the map data.

## Features

- A hand designed schematic map of RIT campus covering Apex, ESB, DES, LHC, etc. blocks.
- Unlike marker-to-marker routing, RouteRIT provides algorithmic routing based on A* pathfinding on a graph
  representation of the campus.
- Turn-by-turn navigation instructions with visual cues.
- Offline functionality: Once loaded, the app works without internet access. No backend server is used.
- Lightweight and fast: Minimal data usage and quick load times.
- Accessibility features: Options for avoiding stairs, etc.

## Tech Stack

- React
- Vite
- TypeScript
- Tailwind CSS
- Motion (Framer Motion)
- Zustand

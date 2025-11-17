# CampusConnect

> A unified academic collaboration, research discovery, and campus-wide networking platform.

## Problem Statement

Universities face a persistent gap in how academic information, research activity, and collaboration opportunities are
distributed. Students, professors, and researchers struggle due to fragmented systems and siloed data:

### Students cannot easily find:

* Which professor works on which research topic
* Available research groups, labs, or ongoing projects
* Collaboration opportunities for papers, capstones, or open-source work
* Internships, grants, and funding opportunities
* International research connections
* Upcoming conferences, seminars, or academic events

### Professors and researchers struggle with:

* Finding collaborators across departments or internationally
* Organizing student contributors for ongoing research
* Showcasing their work or accessing centralized research records
* Licensing and government compliance for sharing academic data
* Discovering relevant papers, emerging topics, or similar researchers

### Existing platforms fall short:

* LinkedIn lacks verified academic data and research-oriented filters
* ResearchGate is isolated and not campus-aware
* No platform combines research discovery, collaboration, and institutional mapping
* No centralized hub for research papers, project sources, and lab directories

### Additionally, campuses themselves are increasingly difficult to navigate:

* Students and visitors often get lost across large buildings and blocks
* Freshers spend weeks locating facilities, labs, and offices
* No hybrid indoor–outdoor routing or accessibility-based pathfinding

As a result, productivity suffers, research collaboration is hindered, and students miss out on valuable academic and
funding opportunities.

## Proposed Solution

CampusConnect is a centralized academic ecosystem that integrates professor discovery, research collaboration, funding
access, and campus navigation—powered by AI-assisted research tools.

The platform provides:

* Comprehensive profiles of professors, researchers, and students
* All profiles linked through verified institutional identities
* Research groups, labs, equipment, and project sources in one place

* Finds relevant academic papers
* Sorts research topics and identifies emerging domains
* Summarizes papers and provides topic overviews
* Suggests professors working on similar topics
* Offers personalized research recommendations (premium)

* Students can join research projects (like GitHub for academia)
* Open-source style contribution to papers or ongoing work
* Forums for research discussions and Q&A with profs and students
* International student–professor collaboration channels

* Government funding info and compliance tools
* Licensing pathways for using academic data ethically
* Internships, grants, and funding institutions can post opportunities
* Platform earns commission from successful funding/grants

## Key Features

### Academic Discovery

* Filter professors by research domain, department, or keywords
* Verified, structured academic profiles
* Explore research groups, labs, and equipment inventories

### Research Collaboration

* Host and contribute to research projects
* Version-controlled submissions (GitHub-like model)
* Forums for academic discussions
* Share research papers, datasets, and project sources
* Post and browse academic job openings

### AI Features (Freemium Model)

* Free: basic search, limited summaries, topic overviews
* Premium:
    * Advanced paper summarization
    * Topic modeling & trend detection
    * Personalized research recommendations
    * Enhanced filtering and analytical dashboards

### Funding & Opportunities Hub

* Internship postings
* Research grants and financial aid listings
* Funding institution partnerships
* Commission-based revenue from successful funding connections

### Events & Community

* Track upcoming conferences and seminars
* Post campus-wide academic events
* International academic networking

### Campus Navigation

* Turn-by-turn indoor/outdoor navigation
* A* graph-based pathfinding
* Shortest, accessible, and main-path routes
* Works offline after initial load

### Storage

* Cloud-based storage for projects, papers, and data
* Optional local storage for premium users

## Tech Stack

* Frontend: React, Vite, TypeScript
* UI: Tailwind CSS, Framer Motion
* State Management: Zustand
* AI Layer: ChatGPT / LLM-based research assistant (not included in this repo)
* Storage: Cloud + optional local persistence

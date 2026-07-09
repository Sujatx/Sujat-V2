# Sujat Khan — Portfolio

A clean and immersive personal portfolio built with a focus on performance, motion, and cinematic presentation. The project uses modern web technologies to create a smooth, interactive experience that showcases skills, personality, and selected work.

##  🚀 Overview

This portfolio consists of two core experiences:

* A **cinematic entry page** featuring animated elements, custom canvas starfield, and parallax text.
* An **interactive About Room**, containing draggable objects that reveal structured information such as skills, stats, and personal interests.

The project is modular, scalable, and optimized for smooth animation across modern devices.

## 🛠️Tech Stack

* **Next.js 15** (App Router)
* **React**
* **TailwindCSS**
* **Framer Motion**
* **Custom Canvas Rendering** for the starfield

## ⚙️Setup

Clone the repository and install dependencies:

```
npm install
```

Run the development server:

```
npm run dev
```

Navigate to:

```
http://localhost:3000
```

## Build

Generate a production build:

```
npm run build
```

Start the optimized server:

```
npm start
```

##  📂 File Structure

```
app/
  page.tsx              # Single-page layout (all chapters)
  layout.tsx            # Fonts & metadata
  globals.css           # Global styles & utilities

components/
  Hero.tsx              # Landing with ASCII portrait
  About.tsx             # Bio, tech stack, profile
  Craft.tsx             # What I do + skills marquee
  Work.tsx              # Sticky-stacking project cards
  Beyond.tsx            # Off-screen facets (story cards)
  Contact.tsx           # Say hello footer

public/
  images/pfp.png
  projects/
  sketches/
  fonts/
```

## 🤝Contribution

Contributions, improvements, and suggestions are welcome. If you want to add features, improve animations, or enhance the design:

1. Fork the repository
2. Create a feature branch
3. Commit changes with clear messages
4. Open a pull request

This ensures a clean workflow and maintainable progress.

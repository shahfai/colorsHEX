# What The HEX?!

A gorgeous, fast-paced color guessing game where your designer eyes are put to the ultimate test.

## Overview
**What The HEX?!** challenges players to rely purely on their memory and intuition to recreate randomly generated HEX colors. Over a span of 5 intense rounds, players must memorize a color snippet and meticulously dial in the correct HEX code to get the highest score possible out of 50 points. The game focuses on a sleek, responsive, and tactile UI, providing instant visual feedback for every user action.

## Features

### Two Difficulty Modes
1. **Normal Mode**
   - The game generates a completely random full 6-character HEX code (e.g. `#EFA541`).
   - The user must guess all 6 characters using values from `0-9` and `A-F`.
   - Offers the highest level of detail for seasoned designers and developers.

2. **Easy Mode**
   - Ideal for quick gameplay or those unfamiliar with deep HEX nuances.
   - Generates and assesses short 3-character equivalents where the secondary digits are locked at `0`.
   - The possible values are strictly restricted to `0`, `8`, or `F` (e.g., `#F08000`).
   - Greatly accelerates the game by shifting the focus to determining the core red, green, and blue primary intensities. 

### Visually Tactile UI
- **Shake Animations:** Any invalid character entered or any input beyond the maximum character limit triggers a subtle 'shake' and flashes the input interface red.
- **Smart Focus Management:** Form focus is permanently locked during the guessing phase, allowing players to instantly type without losing their cursor.
- **Micro-interactions:** Transitions, score counting, and fluid layout morphs are powered by Framer Motion. 

### Granular Scoring System
The scoring algorithm computes the accuracy of the player's guess based on the RGB distances in 3D color space. A perfect guess yields a maximum score of **10.0** per round. Cumulative scores grant unique humorous remarks ranging from praising machine-like perfection to gently criticizing the player's eyesight.

## Project Structure
- `src/components/StartScreen.tsx`: Initial entry screen housing the mode switch (Easy/Normal).
- `src/components/GameScreen.tsx`: Core game loop containing the timer, text-shaking validation logic, custom slot-based input rendering, and per-round score displays.
- `src/components/ResultScreen.tsx`: Final tally interface that scores the player and offers link sharing capabilities.
- `src/utils/color.ts`: Game engine utilities containing random color generation scoped by difficulty modes, distance calculation algorithms, and validation checks.

## Development Setup

The project is built around **React**, **Vite**, and **TypeScript**.

### Installation 
Ensure you have Node.js installed, then execute:

```bash
npm install
```

### Running Locally
To spin up the development environment, run:

```bash
npm run dev
```

### Production Build
To create a production-ready optimized bundle:
```bash
npm run build
```

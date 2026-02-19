# Color HEX Guessing Game (dialed.gg but with HEX)

🎯 **A sleek, minimalist web game to test your color memory and hex-code knowledge.**

Humans are notoriously bad at perfectly recalling colors, let alone defining them in HEX. This simple game challenges you to memorize a randomly generated color and then reproduce it by typing its exact HEX code. 

## ✨ Features
- **Modern "Card-based" UI**: A beautiful, minimalist interface using soft shadows and modern typography.
- **Interactive Split-Card Results**: Upon guessing, the screen reveals a satisfying split-card view, allowing you to directly compare your guess with the original target color side-by-side.
- **Fluid Animations**: Smooth transitions and sleek micro-interactions powered by `framer-motion`.
- **Dynamic Scoring System**: Calculates a similarity score out of 10 for each round based on the Euclidean distance in the RGB color space. 
- **Responsive & Dynamic Colors**: The UI automatically adjusts text colors (black/white) to maintain contrast against any randomly generated background.

## 🛠️ Built With
- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Framer Motion](https://www.framer.com/motion/)

## 🎮 How to Play
1. Click **Play Game** to start.
2. You will be shown a full-screen color for **3 seconds** — memorize it!
3. After the timer ends, type your best guess of the color's HEX code (e.g., `#1A2B3C`).
4. See your result! The game will score your guess out of 10 based on how close it is to the original color.
5. The game consists of **5 rounds**. Try to get the highest total score possible out of a maximum of 50!

## 🚀 Getting Started Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/colorshex.git
   cd colorshex
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to the URL provided in the terminal (usually `http://localhost:5173`).

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/yourusername/colorshex/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

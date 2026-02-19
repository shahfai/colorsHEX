import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import ResultScreen from './components/ResultScreen';
import { generateRandomColor } from './utils/color';

export type GameState = 'start' | 'playing' | 'result';

export interface RoundData {
  targetHex: string;
  guessHex: string;
  score: number;
}

function App() {
  const [gameState, setGameState] = useState<GameState>('start');
  const [currentRound, setCurrentRound] = useState(1);
  const [roundsData, setRoundsData] = useState<RoundData[]>([]);
  const [targetColor, setTargetColor] = useState('#000000');

  const TOTAL_ROUNDS = 5;

  const startGame = () => {
    setGameState('playing');
    setCurrentRound(1);
    setRoundsData([]);
    setTargetColor(generateRandomColor());
  };

  const handleRoundComplete = (guessHex: string, score: number) => {
    const newRoundData = {
      targetHex: targetColor,
      guessHex,
      score
    };

    setRoundsData(prev => [...prev, newRoundData]);

    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound(prev => prev + 1);
      setTargetColor(generateRandomColor());
    } else {
      setGameState('result');
    }
  };

  return (
    <AnimatePresence mode="wait">
      {gameState === 'start' && <StartScreen key="start" onStart={startGame} />}
      {gameState === 'playing' && (
        <GameScreen
          key={`playing-${currentRound}`}
          currentRound={currentRound}
          totalRounds={TOTAL_ROUNDS}
          targetColor={targetColor}
          onRoundComplete={handleRoundComplete}
        />
      )}
      {gameState === 'result' && (
        <ResultScreen
          key="result"
          roundsData={roundsData}
          onPlayAgain={startGame}
        />
      )}
    </AnimatePresence>
  );
}

export default App;

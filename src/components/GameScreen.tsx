import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isValidHex, calculateColorScore, hexToHsv } from '../utils/color';

interface GameScreenProps {
    currentRound: number;
    totalRounds: number;
    targetColor: string;
    onRoundComplete: (guessHex: string, score: number) => void;
}

type RoundStatus = 'memorize' | 'guess' | 'round_result';

export default function GameScreen({
    currentRound,
    totalRounds,
    targetColor,
    onRoundComplete
}: GameScreenProps) {
    const [status, setStatus] = useState<RoundStatus>('memorize');
    const [guessText, setGuessText] = useState('#');
    const [timeLeft, setTimeLeft] = useState(3);
    const [roundScore, setRoundScore] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setStatus('memorize');
        setGuessText('#');
        setTimeLeft(3);

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setStatus('guess');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [targetColor]);

    useEffect(() => {
        if (status === 'guess' && inputRef.current) {
            inputRef.current.focus();
        }
    }, [status]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!isValidHex(guessText)) return;

        const score = calculateColorScore(targetColor, guessText);
        setRoundScore(score);
        setStatus('round_result');
    };

    const handleNextRound = () => {
        onRoundComplete(guessText, roundScore);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = e.target.value;
        if (!val.startsWith('#')) {
            val = '#' + val.replace(/#/g, '');
        }
        if (val.length <= 7) {
            setGuessText(val.toUpperCase());
        }
    };

    const getRemark = (score: number) => {
        if (score >= 9.5) return 'Unbelievable. You are a printer.';
        if (score >= 8.0) return 'Great job. Almost perfect.';
        if (score >= 6.0) return 'Not bad. You\'re getting there.';
        if (score >= 3.0) return 'Right hemisphere. Wrong everything.';
        return 'Are you even looking at the screen?';
    };

    const getLuma = (hex: string) => {
        if (!isValidHex(hex)) return 255;
        const rgb = parseInt(hex.replace('#', ''), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const isDarkBackground = isValidHex(guessText) ? getLuma(guessText) < 128 : false;
    const textColor = isDarkBackground ? '#ffffff' : '#000000';

    if (status === 'round_result') {
        const guessHsv = hexToHsv(guessText);
        const targetHsv = hexToHsv(targetColor);
        const guessLuma = getLuma(guessText);
        const targetLuma = getLuma(targetColor);
        const guessTextColor = guessLuma < 128 ? '#ffffff' : '#000000';
        const targetTextColor = targetLuma < 128 ? '#ffffff' : '#000000';

        return (
            <div className="game-container">
                <motion.div
                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="game-card"
                >
                    {/* Top Half - Guess */}
                    <div style={{ flex: 1, backgroundColor: guessText, position: 'relative', padding: '32px', transition: 'background-color 0.5s' }}>
                        <div style={{ color: guessTextColor, fontWeight: '500', opacity: 0.8, fontSize: '1rem' }}>
                            {currentRound} / {totalRounds}
                        </div>

                        <div style={{ position: 'absolute', top: '32px', right: '32px', textAlign: 'right', color: guessTextColor }}>
                            <div style={{ fontSize: '6rem', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em' }}>
                                {roundScore.toFixed(2)}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: 600, opacity: 0.9, marginTop: '8px', letterSpacing: '-0.01em' }}>
                                {getRemark(roundScore)}
                            </div>
                        </div>

                        <div style={{ position: 'absolute', bottom: '32px', left: '32px', color: guessTextColor }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 500, marginBottom: '2px' }}>Your selection</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                                H{guessHsv.h} S{guessHsv.s} B{guessHsv.v}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Half - Target */}
                    <div style={{ flex: 1, backgroundColor: targetColor, position: 'relative', padding: '32px', transition: 'background-color 0.5s' }}>
                        <div style={{ position: 'absolute', bottom: '32px', left: '32px', color: targetTextColor }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 500, marginBottom: '2px' }}>Original</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                                H{targetHsv.h} S{targetHsv.s} B{targetHsv.v}
                            </div>
                        </div>

                        <button
                            onClick={handleNextRound}
                            style={{
                                position: 'absolute',
                                bottom: '32px',
                                right: '32px',
                                width: '56px',
                                height: '56px',
                                borderRadius: '50%',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
                                cursor: 'pointer',
                                border: 'none',
                                outline: 'none',
                                transition: 'transform 0.2s ease',
                            }}
                            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
                            onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        >
                            <ArrowRight size={28} />
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    const currentBg = status === 'memorize' ? targetColor : (isValidHex(guessText) ? guessText : '#ffffff');

    return (
        <div className="game-container">
            <motion.div
                animate={{ backgroundColor: currentBg, opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="game-card"
            >
                <div style={{
                    position: 'absolute',
                    top: 32, left: 32,
                    fontWeight: '500',
                    fontSize: '1rem',
                    color: textColor,
                    transition: 'color 0.5s ease',
                    opacity: 0.8,
                    zIndex: 10
                }}>
                    {currentRound} / {totalRounds}
                </div>

                <AnimatePresence mode="wait">
                    {status === 'memorize' ? (
                        <motion.div
                            key="timer"
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 1.2, opacity: 0 }}
                            style={{
                                position: 'absolute',
                                top: 32, right: 32,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                color: textColor,
                                transition: 'color 0.5s ease'
                            }}
                        >
                            <div style={{ fontSize: '6rem', fontWeight: '600', lineHeight: 1, letterSpacing: '-0.03em' }}>
                                {timeLeft}
                            </div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', opacity: 0.9 }}>
                                Seconds to remember
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="guess"
                            onSubmit={handleSubmit}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            style={{
                                width: '100%', height: '100%',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                color: textColor,
                                position: 'relative', zIndex: 10
                            }}
                        >
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>Enter the HEX</h2>

                            <div style={{ position: 'relative', width: '60%', marginTop: '24px' }}>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={guessText}
                                    onChange={handleInputChange}
                                    spellCheck={false}
                                    style={{
                                        fontSize: '3rem',
                                        color: 'inherit',
                                        textAlign: 'center',
                                        textTransform: 'uppercase',
                                        borderBottom: `2px solid ${isDarkBackground ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)'}`,
                                        padding: '8px 48px 8px 8px',
                                        width: '100%',
                                        letterSpacing: '0.1em',
                                        fontWeight: 600,
                                        transition: 'border-color 0.2s ease',
                                        outline: 'none',
                                        background: 'transparent'
                                    }}
                                />

                                <AnimatePresence>
                                    {isValidHex(guessText) && (
                                        <motion.button
                                            initial={{ scale: 0, opacity: 0 }}
                                            animate={{ scale: 1, opacity: 1 }}
                                            exit={{ scale: 0, opacity: 0 }}
                                            type="submit"
                                            style={{
                                                position: 'absolute',
                                                right: '0',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                backgroundColor: textColor,
                                                color: currentBg,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                border: 'none',
                                                outline: 'none'
                                            }}
                                        >
                                            <ArrowRight size={20} />
                                        </motion.button>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { isValidHex, calculateColorScore } from '../utils/color';

interface GameScreenProps {
    currentRound: number;
    totalRounds: number;
    targetColor: string;
    isHardMode: boolean;
    onRoundComplete: (guessHex: string, score: number) => void;
}

type RoundStatus = 'memorize' | 'guess' | 'round_result';

export default function GameScreen({
    currentRound,
    totalRounds,
    targetColor,
    isHardMode,
    onRoundComplete
}: GameScreenProps) {
    const [status, setStatus] = useState<RoundStatus>('memorize');
    const [guessText, setGuessText] = useState('#');
    const [timeLeft, setTimeLeft] = useState(5);
    const [roundScore, setRoundScore] = useState(0);
    const [shakeError, setShakeError] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setStatus('memorize');
        setGuessText('#');
        setTimeLeft(5);

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
        const actualGuess = getPreviewHex(guessText);
        if (!isValidHex(actualGuess)) return;

        const score = calculateColorScore(targetColor, actualGuess);
        setRoundScore(score);
        setStatus('round_result');
    };

    const handleNextRound = () => {
        const actualGuess = getPreviewHex(guessText);
        onRoundComplete(actualGuess, roundScore);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawVal = e.target.value.toUpperCase();
        let val = rawVal.replace(/[^#0-9A-F]/g, '');
        let hasInvalid = rawVal !== val; // If non-hex chars were stripped

        if (!val.startsWith('#')) {
            val = '#' + val.replace(/#/g, '');
        }

        if (!isHardMode) {
            let hexPart = val.replace(/#/g, '');
            let easyInvalid = false;
            hexPart = hexPart.split('').filter(char => {
                const isValid = ['0', '8', 'F'].includes(char);
                if (!isValid) easyInvalid = true;
                return isValid;
            }).join('');

            if (easyInvalid) hasInvalid = true;
            val = '#' + hexPart;
        }

        const maxLen = isHardMode ? 7 : 4;

        if (rawVal.length > maxLen && rawVal.length > guessText.length && !hasInvalid) {
            hasInvalid = true; // Shake if typing beyond max length
        }

        if (hasInvalid) {
            setShakeError(true);
            setTimeout(() => setShakeError(false), 300);
        }

        if (val.length <= maxLen) {
            setGuessText(val);
        }
    };

    const getRemark = (score: number) => {
        if (score >= 9.5) return 'Невероятно. Вы принтер.';
        if (score >= 8.0) return 'Отлично. Почти идеально.';
        if (score >= 6.0) return 'Неплохо. Уже близко.';
        if (score >= 3.0) return 'Правое полушарие. Неверное все.';
        return 'Вы вообще смотрите на экран?';
    };

    const getLuma = (hex: string) => {
        if (!isValidHex(hex)) return 255;
        const rgb = parseInt(hex.replace('#', ''), 16);
        const r = (rgb >> 16) & 0xff;
        const g = (rgb >> 8) & 0xff;
        const b = (rgb >> 0) & 0xff;
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };

    const getPreviewHex = (hex: string) => {
        let clean = hex.toUpperCase().replace('#', '');
        if (isHardMode) {
            while (clean.length < 6) clean += '0';
            return '#' + clean;
        } else {
            let easyExpanded = '';
            for (let i = 0; i < 3; i++) {
                easyExpanded += (clean[i] || '0') + '0';
            }
            return '#' + easyExpanded;
        }
    };

    const actualGuess = getPreviewHex(guessText);
    const currentBg = status === 'memorize' ? targetColor : actualGuess;
    const isDarkBackground = getLuma(currentBg) < 128;
    const textColor = isDarkBackground ? '#ffffff' : '#000000';

    if (status === 'round_result') {

        const guessLuma = getLuma(actualGuess);
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
                    <div style={{ flex: 1, backgroundColor: actualGuess, position: 'relative', padding: '32px', transition: 'background-color 0.5s' }}>
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
                            <div style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 500, marginBottom: '2px' }}>Ваш выбор</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                                {isHardMode ? guessText : actualGuess}
                            </div>
                        </div>
                    </div>

                    {/* Bottom Half - Target */}
                    <div style={{ flex: 1, backgroundColor: targetColor, position: 'relative', padding: '32px', transition: 'background-color 0.5s' }}>
                        <div style={{ position: 'absolute', bottom: '32px', left: '32px', color: targetTextColor }}>
                            <div style={{ fontSize: '0.9rem', opacity: 0.7, fontWeight: 500, marginBottom: '2px' }}>Оригинал</div>
                            <div style={{ fontSize: '1.2rem', fontWeight: 600 }}>
                                {targetColor}
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
                                Секунд на запоминание
                            </div>
                        </motion.div>
                    ) : (
                        <motion.form
                            key="guess"
                            onSubmit={handleSubmit}
                            onClick={() => inputRef.current?.focus()}
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
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 500, margin: 0 }}>Введите HEX</h2>

                            <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginTop: '32px' }}>
                                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                                    {/* Visual Text */}
                                    {isHardMode ? (
                                        <motion.div
                                            animate={{ x: shakeError ? [-5, 5, -5, 5, 0] : 0, color: shakeError ? '#ef4444' : 'inherit' }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                fontSize: '3.5rem',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 600,
                                                whiteSpace: 'nowrap',
                                                color: 'inherit',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span style={{ paddingRight: '12px' }}>#</span>
                                            {[0, 1, 2].map(i => {
                                                const char1 = guessText.length > i * 2 + 1 ? guessText[i * 2 + 1] : '';
                                                const char2 = guessText.length > i * 2 + 2 ? guessText[i * 2 + 2] : '';
                                                return (
                                                    <span key={i} style={{ display: 'flex', alignItems: 'center', marginRight: i < 2 ? '24px' : '0' }}>
                                                        <span style={{ width: '36px', textAlign: 'center' }}>
                                                            {char1 ? char1 : <span style={{ opacity: 0.3 }}>0</span>}
                                                        </span>
                                                        <span style={{ width: '36px', textAlign: 'center' }}>
                                                            {char2 ? char2 : <span style={{ opacity: 0.3 }}>0</span>}
                                                        </span>
                                                    </span>
                                                )
                                            })}
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            animate={{ x: shakeError ? [-5, 5, -5, 5, 0] : 0, color: shakeError ? '#ef4444' : 'inherit' }}
                                            transition={{ duration: 0.3 }}
                                            style={{
                                                fontSize: '3.5rem',
                                                fontFamily: 'var(--font-mono)',
                                                fontWeight: 600,
                                                whiteSpace: 'nowrap',
                                                color: 'inherit',
                                                display: 'flex',
                                                alignItems: 'center',
                                            }}
                                        >
                                            <span style={{ paddingRight: '12px' }}>#</span>
                                            {[0, 1, 2].map(i => {
                                                const hasChar = guessText.length > i + 1;
                                                const char = hasChar ? guessText[i + 1] : '';
                                                return (
                                                    <span key={i} style={{ display: 'flex', alignItems: 'center', marginRight: i < 2 ? '24px' : '0' }}>
                                                        <span style={{ width: '36px', textAlign: 'center' }}>
                                                            {hasChar ? char : <span style={{ opacity: 0.3 }}>0</span>}
                                                        </span>
                                                        <span style={{ width: '36px', textAlign: 'center', opacity: 0.3 }}>
                                                            0
                                                        </span>
                                                    </span>
                                                )
                                            })}
                                        </motion.div>
                                    )}

                                    {/* Hidden Input for Typing */}
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        value={guessText}
                                        onChange={handleInputChange}
                                        spellCheck={false}
                                        autoFocus
                                        style={{
                                            position: 'absolute',
                                            inset: 0,
                                            width: '100%',
                                            height: '100%',
                                            fontSize: '3.5rem',
                                            fontFamily: 'var(--font-mono)',
                                            letterSpacing: '0.1em',
                                            fontWeight: 600,
                                            cursor: 'text',
                                            background: 'transparent',
                                            border: 'none',
                                            outline: 'none',
                                            color: 'transparent',
                                            caretColor: 'transparent',
                                            margin: 0,
                                            padding: 0
                                        }}
                                    />
                                </div>
                            </div>

                            <AnimatePresence>
                                {isValidHex(guessText) && (
                                    <motion.button
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        type="submit"
                                        style={{
                                            position: 'absolute',
                                            right: '32px',
                                            bottom: '32px',
                                            width: '56px',
                                            height: '56px',
                                            borderRadius: '50%',
                                            backgroundColor: textColor,
                                            color: currentBg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            border: 'none',
                                            outline: 'none',
                                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <ArrowRight size={28} />
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </motion.form>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}

import { motion, type Variants } from 'framer-motion';
import { RotateCcw } from 'lucide-react';
import type { RoundData } from '../App';

interface ResultScreenProps {
    roundsData: RoundData[];
    onPlayAgain: () => void;
}

const containerVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
        opacity: 1,
        scale: 1,
        transition: {
            duration: 0.4, ease: [0.16, 1, 0.3, 1],
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    },
    exit: { opacity: 0, y: 20 }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export default function ResultScreen({ roundsData, onPlayAgain }: ResultScreenProps) {
    const totalScore = roundsData.reduce((acc, curr) => acc + curr.score, 0);
    const formattedScore = (Math.round(totalScore * 10) / 10).toFixed(1);

    return (
        <div className="game-container">
            <motion.div
                className="modal"
                style={{ maxWidth: '600px', backgroundColor: 'var(--modal-bg)' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.h2 variants={itemVariants} style={{ fontSize: '3rem', fontWeight: 700, margin: 0 }}>
                    Results
                </motion.h2>

                <motion.p variants={itemVariants} className="modal-text" style={{ fontSize: '1.25rem', marginTop: 0 }}>
                    You scored <span style={{ color: 'var(--modal-text)', fontWeight: 600 }}>{formattedScore}</span> out of 50.0
                </motion.p>

                <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px' }}>
                    {roundsData.map((round, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '16px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                padding: '16px',
                                borderRadius: '12px',
                                border: '1px solid rgba(255,255,255,0.05)'
                            }}
                        >
                            <span style={{ fontSize: '1.2rem', fontWeight: 600, width: '30px', opacity: 0.5 }}>
                                #{index + 1}
                            </span>

                            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '8px',
                                        backgroundColor: round.targetHex,
                                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                                    }} />
                                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>{round.targetHex}</span>
                                </div>

                                <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '100%', maxWidth: '40px', height: '2px', backgroundColor: 'rgba(255,255,255,0.1)' }} />
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '8px',
                                        backgroundColor: round.guessHex,
                                        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)'
                                    }} />
                                    <span style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', opacity: 0.7 }}>{round.guessHex}</span>
                                </div>
                            </div>

                            <div style={{ fontSize: '1.5rem', fontWeight: 700, width: '60px', textAlign: 'right' }}>
                                {round.score.toFixed(1)}
                            </div>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div variants={itemVariants} style={{ display: 'flex', marginTop: '24px' }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onPlayAgain}
                        style={{
                            padding: '16px 32px',
                            backgroundColor: 'var(--modal-text)',
                            color: 'var(--modal-bg)',
                            borderRadius: 'var(--border-radius-full)',
                            fontSize: '1.1rem',
                            fontWeight: 600,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        <RotateCcw size={20} />
                        Play Again
                    </motion.button>
                </motion.div>
            </motion.div>
        </div>
    );
}

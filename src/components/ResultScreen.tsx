import { useState } from 'react';
import { motion, type Variants } from 'framer-motion';
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
    const [copied, setCopied] = useState(false);
    const totalScore = roundsData.reduce((acc, curr) => acc + curr.score, 0);
    const formattedScore = (Math.round(totalScore * 10) / 10).toFixed(2);

    const getTotalRemark = (score: number) => {
        if (score >= 48) return 'Невероятно. Вы принтер.';
        if (score >= 40) return 'Отлично. Почти идеально.';
        if (score >= 30) return 'Неплохо. Уже близко.';
        if (score >= 15) return 'Правое полушарие. Неверное все.';
        return 'Живое доказательство того, что некоторым глаза даны зря.';
    };

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
        }
    };

    return (
        <div className="game-container">
            <motion.div
                className="game-card"
                style={{ backgroundColor: '#050505', color: '#ffffff' }}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <div style={{ padding: '32px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                        <span style={{ fontSize: '5rem', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.03em' }}>
                            {formattedScore}
                        </span>
                        <span style={{ fontSize: '3rem', fontWeight: 500, color: 'rgba(255,255,255,0.4)', letterSpacing: '-0.03em' }}>
                            /50
                        </span>
                    </motion.div>

                    <motion.p variants={itemVariants} style={{
                        fontSize: '1.1rem',
                        lineHeight: 1.4,
                        color: 'rgba(255,255,255,0.7)',
                        marginTop: '16px',
                        maxWidth: '90%'
                    }}>
                        {getTotalRemark(totalScore)}
                    </motion.p>

                    <div style={{ flex: 1 }} />

                    <motion.div variants={itemVariants} style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '32px' }}>
                        <motion.button
                            onClick={handleShare}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            style={{
                                width: '100%',
                                padding: '16px 0',
                                backgroundColor: '#ffffff',
                                color: '#000000',
                                borderRadius: '12px',
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                cursor: 'pointer',
                                border: 'none'
                            }}
                        >
                            {copied ? 'Скопировано!' : 'Поделиться'}
                        </motion.button>

                        <button
                            onClick={onPlayAgain}
                            style={{
                                color: 'rgba(255,255,255,0.6)',
                                fontSize: '1rem',
                                fontWeight: 500,
                                margin: '0 auto',
                                transition: 'color 0.2s',
                                cursor: 'pointer',
                                background: 'none',
                                border: 'none',
                                padding: '8px'
                            }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
                            onMouseOut={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.6)'}
                        >
                            Играть снова
                        </button>
                    </motion.div>
                </div>
            </motion.div>
        </div>
    );
}

import { useState } from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Play, HelpCircle } from 'lucide-react';

interface StartScreenProps {
    onStart: (isHardMode: boolean) => void;
}

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
};

export default function StartScreen({ onStart }: StartScreenProps) {
    const [isHardMode, setIsHardMode] = useState(true);
    const [showTutorial, setShowTutorial] = useState(false);

    return (
        <div className="game-container">
            <motion.div
                className="game-card"
                style={{ backgroundColor: 'var(--modal-bg)', color: 'var(--modal-text)', padding: '48px', justifyContent: 'flex-start', position: 'relative', overflow: 'hidden' }}
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <div style={{ position: 'absolute', top: '32px', right: '32px', zIndex: 20, display: 'flex', alignItems: 'center', height: '44px' }}>
                    <AnimatePresence mode="wait">
                        {!showTutorial ? (
                            <motion.button
                                key="btn"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => {
                                    setShowTutorial(true);
                                    setTimeout(() => setShowTutorial(false), 2000);
                                }}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: 'var(--modal-text-dim)',
                                    cursor: 'pointer',
                                    padding: '8px',
                                    display: 'flex',
                                    transition: 'color 0.2s',
                                    alignItems: 'center'
                                }}
                                onMouseOver={(e) => e.currentTarget.style.color = '#ffffff'}
                                onMouseOut={(e) => e.currentTarget.style.color = 'var(--modal-text-dim)'}
                            >
                                <HelpCircle size={28} />
                            </motion.button>
                        ) : (
                            <motion.div
                                key="text"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                style={{
                                    color: '#ffffff71',
                                    fontSize: '0.9rem',
                                    fontWeight: 500,
                                    padding: '8px 16px',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Скоро!
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <h1 className="modal-title">What The HEX?!</h1>
                    <p className="modal-text">
                        Симулятор унижения для тех, кто считает себя знатоком палитры.
                        <p className="modal-text">
                            Попробуй воссоздать их HEX-код и докажи, что твои глаза и мозги тут не просто для красоты.
                        </p>
                    </p>

                    <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                        <div style={{ display: 'flex', gap: '32px', alignItems: 'center', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                                <motion.button
                                    whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => onStart(isHardMode)}
                                    style={{
                                        padding: '16px',
                                        borderRadius: '50%',
                                        backgroundColor: 'transparent',
                                        border: '2px solid var(--modal-text)',
                                        color: 'var(--modal-text)',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        outline: 'none',
                                        transition: 'background-color 0.2s',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <Play size={24} fill="currentColor" />
                                </motion.button>
                                <span style={{ color: 'var(--modal-text-dim)', fontSize: '1.2rem', fontWeight: '500' }}>
                                    Играть
                                </span>
                            </div>

                            {/* Toggle Container */}
                            <div
                                style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
                                onClick={() => setIsHardMode(!isHardMode)}
                            >
                                <div style={{
                                    width: '48px', height: '28px',
                                    borderRadius: '24px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '2px',
                                    boxSizing: 'border-box',
                                    justifyContent: isHardMode ? 'flex-end' : 'flex-start'
                                }}>
                                    <motion.div
                                        layout
                                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        style={{
                                            width: '20px', height: '20px',
                                            borderRadius: '50%',
                                            backgroundColor: isHardMode ? '#ffffff' : 'transparent',
                                            border: isHardMode ? 'none' : '2px solid rgba(255,255,255,0.6)',
                                            boxSizing: 'border-box'
                                        }}
                                    />
                                </div>
                                <span style={{ color: isHardMode ? '#ffffff' : 'rgba(255,255,255,0.6)', fontWeight: 500, fontSize: '1.1rem', width: '80px' }}>
                                    {isHardMode ? 'Обычный' : 'Легкий'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

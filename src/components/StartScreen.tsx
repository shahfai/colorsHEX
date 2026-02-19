import { motion, type Variants } from 'framer-motion';
import { Play } from 'lucide-react';

interface StartScreenProps {
    onStart: () => void;
}

const modalVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 }
};

export default function StartScreen({ onStart }: StartScreenProps) {
    return (
        <div className="game-container">
            <motion.div
                className="modal"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
                <h1 className="modal-title">color</h1>
                <p className="modal-text">
                    Humans can't reliably recall colors. This is a simple game to see how good (or bad!) you are at it.
                </p>
                <p className="modal-text">
                    We'll show you five colors, then you'll try and recreate them.
                </p>

                <div style={{ marginTop: '32px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onStart}
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
                            transition: 'background-color 0.2s'
                        }}
                    >
                        <Play size={24} fill="currentColor" />
                    </motion.button>
                    <span style={{ color: 'var(--modal-text-dim)', fontSize: '0.9rem', fontWeight: '500' }}>
                        Play Game
                    </span>
                </div>
            </motion.div>
        </div>
    );
}

'use client';

import { useState, useCallback } from 'react';

const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';

export const useTextScramble = (originalText: string) => {
    const [displayText, setDisplayText] = useState(originalText);
    const [isScrambling, setIsScrambling] = useState(false);

    const scramble = useCallback(() => {
        if (isScrambling) return;
        setIsScrambling(true);

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(prev =>
                originalText
                    .split('')
                    .map((char, index) => {
                        if (index < iteration) {
                            return originalText[index];
                        }
                        if (char === ' ') return ' ';
                        return characters[Math.floor(Math.random() * characters.length)];
                    })
                    .join('')
            );

            if (iteration >= originalText.length) {
                clearInterval(interval);
                setIsScrambling(false);
            }

            iteration += 1 / 3;
        }, 30);
    }, [originalText, isScrambling]);

    const reset = useCallback(() => {
        // No need to do anything here if iteration completes, 
        // but can be used for explicit reset if needed.
    }, []);

    return { displayText, scramble, reset };
};

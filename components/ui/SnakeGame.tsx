'use client';

import React, { useEffect, useRef, useState } from 'react';

interface Position {
    x: number;
    y: number;
}

const GRID_SIZE = 20; // Size of each square cell in pixels
const CELL_COUNT_X = 32; // Number of columns
const CELL_COUNT_Y = 18; // Number of rows
const SPEED = 90; // Speed of game loop in ms

const BUG_EMOJIS = ['🐞', '🐛', '👾', '🐜', '🕷️'];

export default function SnakeGame({ onExit }: { onExit: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    // Keep state values in refs to access them inside the canvas loop without closures stale states
    const snakeRef = useRef<Position[]>([
        { x: 10, y: 9 },
        { x: 9, y: 9 },
        { x: 8, y: 9 }
    ]);
    const directionRef = useRef<string>('RIGHT');
    const foodRef = useRef<Position>({ x: 22, y: 9 });
    const foodEmojiRef = useRef<string>('🐞');
    const isPausedRef = useRef<boolean>(false);

    // Play retro beeps and buzzes natively using Web Audio API
    const playSynthesizerSound = (type: 'eat' | 'crash') => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) return;
            const audioCtx = new AudioContextClass();

            if (type === 'eat') {
                // Short retro synth beep
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sine';
                osc.frequency.setValueAtTime(600, audioCtx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1300, audioCtx.currentTime + 0.08);
                
                gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.1);
            } else if (type === 'crash') {
                // Deep retro slide buzz
                const osc = audioCtx.createOscillator();
                const gain = audioCtx.createGain();
                
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(180, audioCtx.currentTime);
                osc.frequency.linearRampToValueAtTime(40, audioCtx.currentTime + 0.3);
                
                gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
                
                osc.connect(gain);
                gain.connect(audioCtx.destination);
                
                osc.start();
                osc.stop(audioCtx.currentTime + 0.35);
            }
        } catch (e) {
            console.error('Synthesizer sound play error:', e);
        }
    };

    const spawnFood = () => {
        const snake = snakeRef.current;
        let newFood: Position;
        let isOccupied: boolean;

        do {
            isOccupied = false;
            newFood = {
                x: Math.floor(Math.random() * CELL_COUNT_X),
                y: Math.floor(Math.random() * CELL_COUNT_Y)
            };

            // Check if food coordinates land on the snake body
            for (const cell of snake) {
                if (cell.x === newFood.x && cell.y === newFood.y) {
                    isOccupied = true;
                    break;
                }
            }
        } while (isOccupied);

        foodRef.current = newFood;
        foodEmojiRef.current = BUG_EMOJIS[Math.floor(Math.random() * BUG_EMOJIS.length)];
    };

    const resetGame = () => {
        snakeRef.current = [
            { x: 10, y: 9 },
            { x: 9, y: 9 },
            { x: 8, y: 9 }
        ];
        directionRef.current = 'RIGHT';
        spawnFood();
        setScore(0);
        setGameOver(false);
        isPausedRef.current = false;
    };

    // Keyboard handlers
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const currentDir = directionRef.current;

            // Suppress default window scrolls for standard gaming keys
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space', ' '].includes(e.key)) {
                e.preventDefault();
            }

            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    if (currentDir !== 'DOWN') directionRef.current = 'UP';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    if (currentDir !== 'UP') directionRef.current = 'DOWN';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    if (currentDir !== 'RIGHT') directionRef.current = 'LEFT';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    if (currentDir !== 'LEFT') directionRef.current = 'RIGHT';
                    break;
                case 'Enter':
                    if (gameOver) {
                        resetGame();
                    }
                    break;
                case 'Escape':
                    onExit();
                    break;
                case ' ':
                case 'Spacebar':
                    if (!gameOver) {
                        isPausedRef.current = !isPausedRef.current;
                    }
                    break;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [gameOver, onExit]);

    // Main Game Loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let intervalId: NodeJS.Timeout;

        const loop = () => {
            if (gameOver || isPausedRef.current) return;

            const snake = [...snakeRef.current];
            const direction = directionRef.current;
            const head = { ...snake[0] };

            // 1. Move Snake Head
            switch (direction) {
                case 'UP': head.y -= 1; break;
                case 'DOWN': head.y += 1; break;
                case 'LEFT': head.x -= 1; break;
                case 'RIGHT': head.x += 1; break;
            }

            // 2. Wall Collisions
            if (head.x < 0 || head.x >= CELL_COUNT_X || head.y < 0 || head.y >= CELL_COUNT_Y) {
                playSynthesizerSound('crash');
                setGameOver(true);
                return;
            }

            // 3. Self Collisions
            for (const cell of snake) {
                if (head.x === cell.x && head.y === cell.y) {
                    playSynthesizerSound('crash');
                    setGameOver(true);
                    return;
                }
            }

            // 4. Move Snake Body & Check Food Eat
            snake.unshift(head); // prepend new head

            const food = foodRef.current;
            if (head.x === food.x && head.y === food.y) {
                playSynthesizerSound('eat');
                setScore(prev => {
                    const newScore = prev + 10;
                    if (newScore > highScore) setHighScore(newScore);
                    return newScore;
                });
                spawnFood();
            } else {
                snake.pop(); // remove tail if food not eaten
            }

            snakeRef.current = snake;
        };

        intervalId = setInterval(loop, SPEED);
        return () => clearInterval(intervalId);
    }, [gameOver, highScore]);

    // Canvas Render Loop (Render separately for smooth graphics matching monitor updates)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            // Clear board
            ctx.fillStyle = '#050505';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Draw bounding border
            ctx.strokeStyle = '#10b98120';
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);

            const snake = snakeRef.current;
            const food = foodRef.current;

            // Draw Bug Food (emoji)
            ctx.font = `${GRID_SIZE - 2}px serif`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(
                foodEmojiRef.current,
                food.x * GRID_SIZE + GRID_SIZE / 2,
                food.y * GRID_SIZE + GRID_SIZE / 2
            );

            // Draw Snake Body
            snake.forEach((cell, index) => {
                const isHead = index === 0;
                
                // Outer glow shadow
                ctx.shadowColor = '#10b981';
                ctx.shadowBlur = isHead ? 6 : 2;

                ctx.fillStyle = isHead ? '#34d399' : '#047857'; // bright head, darker tail
                ctx.fillRect(
                    cell.x * GRID_SIZE + 1,
                    cell.y * GRID_SIZE + 1,
                    GRID_SIZE - 2,
                    GRID_SIZE - 2
                );

                // Reset shadow values for next draw pass
                ctx.shadowBlur = 0;
            });

            // Pause screen layout overlay
            if (isPausedRef.current && !gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = '#10b981';
                ctx.font = '16px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('GAME PAUSED', canvas.width / 2, canvas.height / 2);
                ctx.font = '9px monospace';
                ctx.fillText('Press SPACE to Resume', canvas.width / 2, canvas.height / 2 + 25);
            }

            // Game over screen layout overlay
            if (gameOver) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                ctx.shadowColor = '#ef4444';
                ctx.shadowBlur = 8;
                ctx.fillStyle = '#ef4444';
                ctx.font = '22px monospace';
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText('DEBUG FAILURE: SYSTEM CRASHED', canvas.width / 2, canvas.height / 2 - 30);
                
                ctx.shadowBlur = 0;
                ctx.fillStyle = '#10b981';
                ctx.font = '13px monospace';
                ctx.fillText(`Eradicated Bugs: ${score / 10}`, canvas.width / 2, canvas.height / 2 + 10);
                ctx.fillText(`Mainframe Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
                
                ctx.fillStyle = '#6b7280';
                ctx.font = '10px monospace';
                ctx.fillText('Press ENTER to compile & restart', canvas.width / 2, canvas.height / 2 + 65);
                ctx.fillText('Press ESC to exit mainframe shell', canvas.width / 2, canvas.height / 2 + 85);
            }

            animationFrameId = requestAnimationFrame(render);
        };

        animationFrameId = requestAnimationFrame(render);
        return () => cancelAnimationFrame(animationFrameId);
    }, [gameOver, score]);

    return (
        <div className="w-full flex flex-col items-center gap-6 select-none relative z-50">
            {/* Header Score Display Dashboard */}
            <div className="w-full max-w-[640px] flex justify-between px-6 py-2 border border-emerald-500/20 bg-emerald-500/5 rounded-xl font-mono text-[10px] md:text-xs text-emerald-400">
                <div>SCORE: <span className="text-white font-bold">{score}</span></div>
                <div className="text-emerald-500/60 font-semibold animate-pulse">TERMINAL ARCADE // DE-BUGGER RUN</div>
                <div>HIGH SCORE: <span className="text-white font-bold">{highScore}</span></div>
            </div>

            {/* Game Canvas Box */}
            <div className="relative border border-emerald-500/30 rounded-2xl overflow-hidden shadow-[0_0_20px_rgba(16,185,129,0.1)] bg-[#050505] p-[1px]">
                <canvas
                    ref={canvasRef}
                    width={CELL_COUNT_X * GRID_SIZE}
                    height={CELL_COUNT_Y * GRID_SIZE}
                    className="block w-full max-w-[640px] aspect-[16/9]"
                />
            </div>

            {/* Bottom Instructions Panel */}
            <div className="font-mono text-[9px] text-gray-500 flex gap-6 tracking-wider uppercase select-none pointer-events-none">
                <span>W, A, S, D or ARROWS to Navigate</span>
                <span>•</span>
                <span>SPACE to Pause</span>
                <span>•</span>
                <span>ESC to Quit</span>
            </div>
        </div>
    );
}

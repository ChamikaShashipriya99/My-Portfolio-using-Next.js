'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiTerminal, HiX, HiChevronRight } from 'react-icons/hi';
import SnakeGame from './SnakeGame';

// CRT Screen Matrix Digital Rain canvas overlay
function MatrixRain({ onExit }: { onExit: () => void }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        let animationFrameId: number;

        const resizeCanvas = () => {
            canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
            canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const columns = Math.floor(canvas.width / 18);
        const yPositions = Array(columns).fill(0);
        const charSet = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz$@#%&';

        const draw = () => {
            // Semi-transparent black rectangle to fade out previous characters
            ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#10b981'; // emerald green
            ctx.font = '15px monospace';

            for (let i = 0; i < yPositions.length; i++) {
                const char = charSet[Math.floor(Math.random() * charSet.length)];
                const x = i * 18;
                const y = yPositions[i];

                ctx.fillText(char, x, y);

                // Reset position to top with small randomness if it reaches end of screen
                if (y > canvas.height && Math.random() > 0.98) {
                    yPositions[i] = 0;
                } else {
                    yPositions[i] = y + 18;
                }
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        animationFrameId = requestAnimationFrame(draw);

        // Escape key to exit matrix rain
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onExit();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onExit]);

    return (
        <div className="absolute inset-0 z-50 bg-black cursor-pointer" onClick={onExit} title="Click anywhere or press ESC to exit matrix mode">
            <canvas ref={canvasRef} className="w-full h-full block" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 font-mono text-[9px] md:text-xs text-emerald-500/60 uppercase tracking-[0.3em] pointer-events-none select-none animate-pulse">
                Click screen or press ESC to terminate
            </div>
        </div>
    );
}

interface LogLine {
    text: string;
    isInput: boolean;
}

export default function DevConsole() {
    const [isOpen, setIsOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'console' | 'matrix' | 'snake'>('console');
    const [inputValue, setInputValue] = useState('');
    const [history, setHistory] = useState<LogLine[]>([]);
    const [cmdHistory, setCmdHistory] = useState<string[]>([]);
    const [historyIdx, setHistoryIdx] = useState(-1);

    const inputRef = useRef<HTMLInputElement>(null);
    const logContainerRef = useRef<HTMLDivElement>(null);

    // Toggle overlay on tilde / backtick key
    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === '`' || e.key === '~') {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
        };
        window.addEventListener('keydown', handleKeyPress);

        // Listen for custom trigger event (e.g. from navbar)
        const handleToggle = () => {
            setIsOpen(prev => !prev);
        };
        window.addEventListener('toggle-terminal', handleToggle);

        return () => {
            window.removeEventListener('keydown', handleKeyPress);
            window.removeEventListener('toggle-terminal', handleToggle);
        };
    }, []);

    // Set initial greeting log on first open
    useEffect(() => {
        if (isOpen && history.length === 0) {
            setHistory([
                { text: 'CHAMIKA_SHASHIPRIYA MAINFRAME [Version 1.0.0]', isInput: false },
                { text: '(c) 2026 Chamika. All rights reserved.', isInput: false },
                { text: '---------------------------------------------------', isInput: false },
                { text: 'INITIALIZING SYSTEM CHECK... OK', isInput: false },
                { text: 'CPU ARSENAL: NEXT.JS + THREE.JS FIBER... OK', isInput: false },
                { text: 'SECURE LINK: UPLINK ESTABLISHED... OK', isInput: false },
                { text: '---------------------------------------------------', isInput: false },
                { text: 'Type "help" to list all available commands.', isInput: false },
                { text: ' ', isInput: false }
            ]);
            setViewMode('console');
        }

        if (isOpen) {
            // Small timeout to allow element rendering before focusing
            setTimeout(() => {
                inputRef.current?.focus();
            }, 100);
        }
    }, [isOpen]);

    // Scroll to bottom when history log updates
    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [history]);

    // Command executions
    const executeCommand = (cmd: string) => {
        const trimmed = cmd.trim();
        if (!trimmed) return;

        // Save command in history
        const newCmdHistory = [trimmed, ...cmdHistory.filter(c => c !== trimmed)].slice(0, 50);
        setCmdHistory(newCmdHistory);
        setHistoryIdx(-1);

        // Add the user command typed to the screen output log
        const updatedHistory = [...history, { text: `chamika@portfolio:~$ ${trimmed}`, isInput: true }];
        
        const args = trimmed.toLowerCase().split(' ');
        const mainCmd = args[0];

        switch (mainCmd) {
            case 'help':
                setHistory([
                    ...updatedHistory,
                    { text: 'Available commands:', isInput: false },
                    { text: '  about    - Print developer biography and diagnostics', isInput: false },
                    { text: '  skills   - Output hierarchical skills tree matrix', isInput: false },
                    { text: '  projects - Sync & list featured showcase repositories', isInput: false },
                    { text: '  contact  - View communication points (Email, Phone, WhatsApp)', isInput: false },
                    { text: '  matrix   - Initiate falling digital matrix rain sequence', isInput: false },
                    { text: '  snake    - Launch retro debugger snake game', isInput: false },
                    { text: '  clear    - Clear console output history', isInput: false },
                    { text: '  exit     - Close the mainframe shell terminal', isInput: false },
                    { text: ' ', isInput: false }
                ]);
                break;
            case 'about':
                setHistory([
                    ...updatedHistory,
                    { text: 'DEVELOPER DIAGNOSTICS & SUMMARY', isInput: false },
                    { text: '================================', isInput: false },
                    { text: 'Name:     Chamika Shashipriya', isInput: false },
                    { text: 'Profile:  Full-Stack Developer & Modern UI Designer', isInput: false },
                    { text: 'Loc:      Ambalangoda & Malabe, Sri Lanka', isInput: false },
                    { text: 'Status:   Active & open to new opportunities', isInput: false },
                    { text: 'Stack:    JavaScript, TypeScript, Next.js, React, Node.js', isInput: false },
                    { text: 'Motto:    "Let\'s Build Something New"', isInput: false },
                    { text: ' ', isInput: false }
                ]);
                break;
            case 'skills':
                setHistory([
                    ...updatedHistory,
                    { text: 'SKILLSET MATRIX', isInput: false },
                    { text: '===============', isInput: false },
                    { text: '[LANGUAGES]   JavaScript, TypeScript, Java, Python, C, C++, C#, PHP, Kotlin, HTML5, CSS3', isInput: false },
                    { text: '[DATABASES]   MongoDB, MySQL, MS SQL Server, XAMPP, WAMP', isInput: false },
                    { text: '[FRAMEWORKS]  Next.js, React, Node.js, Express.js, Bootstrap, Tailwind, .NET, Spring', isInput: false },
                    { text: '[TOOLS & IDE] Git, GitHub, NPM, Figma, Canva, Cisco, Trello, Nodemon, Apache Tomcat', isInput: false },
                    { text: ' ', isInput: false }
                ]);
                break;
            case 'projects':
                setHistory([
                    ...updatedHistory,
                    { text: 'CHAMIKA FEATURED PROJECTS INVENTORY', isInput: false },
                    { text: '=====================================', isInput: false },
                    { text: '1. Next.js Portfolio Core Mainframe', isInput: false },
                    { text: '   - Stack: Next.js 16, Three.js Fiber, TailwindCSS, Framer Motion', isInput: false },
                    { text: '2. Hacker Sequence Boot Loader Screen', isInput: false },
                    { text: '   - Stack: TypeScript, React, CSS Keyframes', isInput: false },
                    { text: '3. WhatsApp Redirection Endpoint Service', isInput: false },
                    { text: '   - Stack: React, Form Validation, WhatsApp Web API integration', isInput: false },
                    { text: '4. Interactive 3D Orbit Skills Cloud', isInput: false },
                    { text: '   - Stack: React, HTML5 Canvas, Sphere Layout Physics, Momentum Inertia', isInput: false },
                    { text: ' ', isInput: false }
                ]);
                break;
            case 'contact':
                // Try copy email to clipboard
                try {
                    navigator.clipboard.writeText('chamikashashipriya3@gmail.com');
                    setHistory([
                        ...updatedHistory,
                        { text: 'CONTACT DIRECTORY (Email copied to clipboard!)', isInput: false },
                        { text: '===============================================', isInput: false },
                        { text: 'Email:    chamikashashipriya3@gmail.com [COPIED]', isInput: false },
                        { text: 'Phone:    0704120358', isInput: false },
                        { text: 'WhatsApp: https://wa.me/94750471511', isInput: false },
                        { text: 'Loc:      Ambalangoda & Malabe, Sri Lanka', isInput: false },
                        { text: ' ', isInput: false }
                    ]);
                } catch {
                    setHistory([
                        ...updatedHistory,
                        { text: 'CONTACT DIRECTORY', isInput: false },
                        { text: '=================', isInput: false },
                        { text: 'Email:    chamikashashipriya3@gmail.com', isInput: false },
                        { text: 'Phone:    0704120358', isInput: false },
                        { text: 'WhatsApp: https://wa.me/94750471511', isInput: false },
                        { text: 'Loc:      Ambalangoda & Malabe, Sri Lanka', isInput: false },
                        { text: ' ', isInput: false }
                    ]);
                }
                break;
            case 'matrix':
                setViewMode('matrix');
                setHistory([
                    ...updatedHistory,
                    { text: 'Initiating Matrix falling rain override...', isInput: false },
                    { text: ' ', isInput: false }
                ]);
                break;
            case 'snake':
            case 'game':
                setViewMode('snake');
                setHistory([
                    ...updatedHistory,
                    { text: 'Loading retro debugger game modules... OK', isInput: false },
                    { text: 'Compiling snake vector elements... OK', isInput: false },
                    { text: ' ', isInput: false }
                ]);
                break;
            case 'clear':
                setHistory([]);
                break;
            case 'exit':
                setIsOpen(false);
                break;
            default:
                setHistory([
                    ...updatedHistory,
                    { text: `Shell error: Command not recognized: "${trimmed}".`, isInput: false },
                    { text: 'Type "help" for a list of valid commands.', isInput: false },
                    { text: ' ', isInput: false }
                ]);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        executeCommand(inputValue);
        setInputValue('');
    };

    // Cycle command history using ArrowUp/ArrowDown keys
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length === 0) return;
            const nextIdx = historyIdx + 1;
            if (nextIdx < cmdHistory.length) {
                setHistoryIdx(nextIdx);
                setInputValue(cmdHistory[nextIdx]);
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            const nextIdx = historyIdx - 1;
            if (nextIdx >= 0) {
                setHistoryIdx(nextIdx);
                setInputValue(cmdHistory[nextIdx]);
            } else {
                setHistoryIdx(-1);
                setInputValue('');
            }
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md px-4 select-none"
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 30 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 30 }}
                        transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                        className="relative w-full max-w-4xl h-[70vh] rounded-2xl border border-green-500/30 bg-[#080808]/95 backdrop-blur-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] flex flex-col overflow-hidden select-text"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* CRT Screen Scanline Overlay */}
                        <div className="absolute inset-0 pointer-events-none z-40 bg-[linear-gradient(rgba(18,16,16,0)_50%,_rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-10" />

                        {/* Visual Matrix rain override screen */}
                        {viewMode === 'matrix' && (
                            <MatrixRain onExit={() => setViewMode('console')} />
                        )}

                        {/* Visual Snake Game overlay screen */}
                        {viewMode === 'snake' && (
                            <div className="absolute inset-0 z-50 bg-[#050505] flex items-center justify-center p-6">
                                <SnakeGame onExit={() => setViewMode('console')} />
                            </div>
                        )}

                        {/* Shell Header Bar */}
                        <div className="flex items-center justify-between px-6 py-4 bg-white/[0.02] border-b border-white/5 font-mono text-xs font-bold text-gray-400">
                            <div className="flex items-center gap-2 text-emerald-500">
                                <HiTerminal className="text-base animate-pulse" />
                                <span>CHAMIKA_SHASHIPRIYA_MAINFRAME_v1.0.0</span>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-gray-500 hover:text-white transition-colors p-1 rounded-md hover:bg-white/5"
                            >
                                <HiX className="text-base" />
                            </button>
                        </div>

                        {/* Log Output History Screen */}
                        <div
                            ref={logContainerRef}
                            onClick={() => inputRef.current?.focus()}
                            className="flex-1 overflow-y-auto px-8 py-6 font-mono text-xs md:text-sm text-emerald-400/90 leading-relaxed scrollbar-thin scrollbar-thumb-white/5 scrollbar-track-transparent cursor-text"
                        >
                            {history.map((line, i) => (
                                <div
                                    key={i}
                                    className={line.isInput ? 'text-white font-bold' : 'text-emerald-500/80 whitespace-pre-wrap'}
                                >
                                    {line.text}
                                </div>
                            ))}
                        </div>

                        {/* Input Prompt Panel */}
                        <form
                            onSubmit={handleFormSubmit}
                            className="flex items-center gap-3 px-8 py-4 bg-white/[0.01] border-t border-white/5 font-mono text-xs md:text-sm"
                        >
                            <span className="text-emerald-500/60 shrink-0 select-none">chamika@portfolio:~$</span>
                            <HiChevronRight className="text-white shrink-0 animate-pulse" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Type a command (try 'help')..."
                                className="flex-1 bg-transparent text-white focus:outline-none placeholder:text-emerald-950 font-mono"
                                autoFocus
                            />
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

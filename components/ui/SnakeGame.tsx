'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';
import { Pause, Play, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { columns, rows, newFood, nextSnake, opposite, type Cell, type Direction } from '@/lib/snake-game';

type Status = 'ready' | 'running' | 'paused' | 'over' | 'won';
interface Board { snake: Cell[]; food: Cell | null; direction: Direction; score: number; status: Status }
const initialBoard = (): Board => ({ snake: [{ x: 6, y: 8 }, { x: 5, y: 8 }, { x: 4, y: 8 }], food: { x: 15, y: 8 }, direction: 'RIGHT', score: 0, status: 'ready' });
const highScoreKey = 'portfolio-snake-best-v1';

export default function SnakeGame({ onExit }: { onExit: () => void }) {
    const canvas = useRef<HTMLCanvasElement>(null);
    const [board, setBoard] = useState<Board>(initialBoard);
    const current = useRef(board);
    const nextDirection = useRef<Direction>('RIGHT');
    const queuedTurn = useRef(false);
    const [speed, setSpeed] = useState(130);
    const [muted, setMuted] = useState(true);
    const mutedRef = useRef(true);
    const audio = useRef<AudioContext | null>(null);
    const [best, setBest] = useState(0);
    const [storageAvailable, setStorageAvailable] = useState(true);
    const reducedMotion = useReducedMotion();
    const commit = useCallback((next: Board) => { current.current = next; setBoard(next); }, []);
    const focusBoard = () => canvas.current?.focus({ preventScroll: true });
    useEffect(() => {
        const frame = requestAnimationFrame(focusBoard);
        try { const value = Number(localStorage.getItem(highScoreKey)); if (Number.isSafeInteger(value) && value >= 0) setBest(value); }
        catch { setStorageAvailable(false); }
        return () => { cancelAnimationFrame(frame); void audio.current?.close().catch(() => {}); };
    }, []);
    useEffect(() => {
        if (board.score <= best) return;
        setBest(board.score);
        try { localStorage.setItem(highScoreKey, String(board.score)); } catch { setStorageAvailable(false); }
    }, [board.score, best]);
    const pause = useCallback(() => { if (current.current.status === 'running') commit({ ...current.current, status: 'paused' }); }, [commit]);
    useEffect(() => {
        const hidden = () => { if (document.hidden) pause(); };
        document.addEventListener('visibilitychange', hidden);
        window.addEventListener('blur', pause);
        return () => { document.removeEventListener('visibilitychange', hidden); window.removeEventListener('blur', pause); };
    }, [pause]);
    const sound = useCallback((crash: boolean) => {
        if (mutedRef.current || !audio.current) return;
        try {
            const context = audio.current;
            const oscillator = context.createOscillator(), gain = context.createGain();
            oscillator.type = crash ? 'triangle' : 'sine';
            oscillator.frequency.setValueAtTime(crash ? 160 : 650, context.currentTime);
            oscillator.frequency.exponentialRampToValueAtTime(crash ? 50 : 1000, context.currentTime + 0.12);
            gain.gain.setValueAtTime(0.07, context.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, context.currentTime + 0.18);
            oscillator.connect(gain); gain.connect(context.destination);
            oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
            oscillator.start(); oscillator.stop(context.currentTime + 0.2);
        } catch { /* Audio is optional; the game remains playable. */ }
    }, []);
    useEffect(() => {
        const timer = window.setInterval(() => {
            const previous = current.current;
            if (previous.status !== 'running' || !previous.food) return;
            const result = nextSnake(previous.snake, nextDirection.current, previous.food);
            queuedTurn.current = false;
            if (result.crashed) { sound(true); commit({ ...previous, status: 'over' }); return; }
            const food = result.ate ? newFood(result.snake) : previous.food;
            if (result.ate) sound(false);
            commit({ snake: result.snake, direction: nextDirection.current, food, score: previous.score + (result.ate ? 10 : 0), status: food ? 'running' : 'won' });
        }, speed);
        return () => window.clearInterval(timer);
    }, [speed, sound, commit]);
    useEffect(() => {
        const context = canvas.current?.getContext('2d');
        if (!context) return;
        const cellSize = 20;
        context.fillStyle = '#050b09'; context.fillRect(0, 0, columns * cellSize, rows * cellSize);
        context.strokeStyle = '#103327'; context.lineWidth = 0.5;
        for (let x = 0; x <= columns; x++) { context.beginPath(); context.moveTo(x * cellSize, 0); context.lineTo(x * cellSize, rows * cellSize); context.stroke(); }
        for (let y = 0; y <= rows; y++) { context.beginPath(); context.moveTo(0, y * cellSize); context.lineTo(columns * cellSize, y * cellSize); context.stroke(); }
        if (board.food) {
            context.fillStyle = '#fb7185'; context.beginPath(); context.arc(board.food.x * cellSize + 10, board.food.y * cellSize + 10, 6, 0, Math.PI * 2); context.fill();
        }
        board.snake.forEach((cell, index) => { context.shadowBlur = reducedMotion ? 0 : index === 0 ? 4 : 0; context.shadowColor = '#34d399'; context.fillStyle = index === 0 ? '#6ee7b7' : '#059669'; context.fillRect(cell.x * cellSize + 1, cell.y * cellSize + 1, 18, 18); });
        context.shadowBlur = 0;
    }, [board, reducedMotion]);
    const startOrPause = () => {
        const status = current.current.status;
        if (status === 'over' || status === 'won') return;
        commit({ ...current.current, status: status === 'running' ? 'paused' : 'running' }); focusBoard();
    };
    const restart = () => { nextDirection.current = 'RIGHT'; queuedTurn.current = false; commit({ ...initialBoard(), status: 'running' }); focusBoard(); };
    const turn = (direction: Direction) => {
        const previous = current.current;
        if (previous.status === 'over' || previous.status === 'won' || previous.status === 'paused') return;
        if (!queuedTurn.current && direction !== opposite[previous.direction]) { nextDirection.current = direction; queuedTurn.current = true; }
        if (previous.status === 'ready') commit({ ...previous, status: 'running' });
    };
    const keyDown = (event: React.KeyboardEvent<HTMLCanvasElement>) => {
        if (event.altKey || event.ctrlKey || event.metaKey) return;
        const keys: Record<string, Direction> = { ArrowUp: 'UP', w: 'UP', ArrowDown: 'DOWN', s: 'DOWN', ArrowLeft: 'LEFT', a: 'LEFT', ArrowRight: 'RIGHT', d: 'RIGHT' };
        const direction = keys[event.key] || keys[event.key.toLowerCase()];
        if (direction) { event.preventDefault(); turn(direction); }
        else if (event.key === ' ' || event.key.toLowerCase() === 'p') { event.preventDefault(); if (!event.repeat) startOrPause(); }
        else if (event.key.toLowerCase() === 'r') { event.preventDefault(); if (!event.repeat) restart(); }
    };
    const toggleSound = async () => {
        const nextMuted = !mutedRef.current; mutedRef.current = nextMuted; setMuted(nextMuted);
        if (!nextMuted) {
            try { audio.current ??= new AudioContext(); await audio.current.resume(); }
            catch { mutedRef.current = true; setMuted(true); }
        } else if (audio.current?.state === 'running') await audio.current.suspend().catch(() => {});
    };
    const buttonClass = 'inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 px-3 py-2.5 text-xs sm:text-sm text-gray-200 hover:border-emerald-400/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 focus-visible:outline-offset-2 disabled:opacity-40';
    const finished = board.status === 'over' || board.status === 'won';
    const announcement = board.status === 'over' ? `Game over. Final score: ${board.score}. Choose Restart to try again.` : board.status === 'won' ? `Board complete! Final score: ${board.score}.` : board.status === 'paused' ? 'Game paused. Choose Resume when ready.' : board.status === 'ready' ? 'Ready to play. Choose Start or use an arrow key on the board.' : 'Game running.';
    return <div className="w-full max-w-4xl mx-auto space-y-4" onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) pause(); }} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); onExit(); } }}>
        <div className="flex flex-wrap justify-between gap-3 text-xs sm:text-sm"><p className="text-gray-400">Score <strong className="text-white ml-2">{board.score}</strong></p><p className="text-gray-400">{storageAvailable ? 'Best on this device' : 'Best this session'} <strong className="text-emerald-300 ml-2">{best}</strong></p></div>
        <div className="flex flex-wrap gap-2">
            <button type="button" onClick={startOrPause} disabled={finished} className={buttonClass}>{board.status === 'running' ? <Pause size={15} /> : <Play size={15} />}{board.status === 'running' ? 'Pause' : board.status === 'ready' ? 'Start' : 'Resume'}</button>
            <button type="button" onClick={restart} className={buttonClass}><RotateCcw size={15} />Restart</button>
            <button type="button" onClick={toggleSound} aria-pressed={!muted} className={buttonClass}>{muted ? <VolumeX size={15} /> : <Volume2 size={15} />}{muted ? 'Unmute sound' : 'Mute sound'}</button>
            <button type="button" onClick={onExit} className={buttonClass}><X size={15} />Exit game</button>
        </div>
        <p id="arcade-keyboard-help" className="text-xs text-gray-500 leading-relaxed">Focus the board to use arrows or WASD. Space / P: pause or resume. R: restart. Escape: exit. Moving focus outside the game pauses it.</p>
        <div className="relative rounded-xl border border-emerald-500/30 overflow-hidden bg-[#050b09]">
            <canvas ref={canvas} width={columns * 20} height={rows * 20} tabIndex={0} aria-label="Snake game board. Collect pink bugs and avoid walls and your tail." aria-describedby="arcade-keyboard-help" onKeyDown={keyDown} className="block w-full aspect-[4/3] focus-visible:outline focus-visible:outline-2 focus-visible:outline-emerald-300 focus-visible:outline-offset-[-3px]" style={{ touchAction: 'pan-y' }}>Use the on-screen controls or arrow keys on this canvas to steer the snake.</canvas>
            {board.status !== 'running' && <div aria-hidden="true" className="absolute inset-0 flex items-center justify-center bg-black/65 pointer-events-none p-4"><span className="text-center text-base sm:text-2xl font-semibold text-white">{finished ? board.status === 'won' ? 'Board complete!' : 'Game over' : board.status === 'paused' ? 'Paused' : 'Ready to play'}</span></div>}
        </div>
        <p role="status" aria-live="polite" aria-atomic="true" className="text-xs text-gray-400 leading-relaxed">{announcement}</p>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5">
            <div role="group" aria-label="Direction controls" className="grid grid-cols-3 gap-2">
                {(['UP', 'LEFT', 'DOWN', 'RIGHT'] as Direction[]).map((direction, index) => <button key={direction} type="button" aria-label={`Move ${direction.toLowerCase()}`} disabled={finished || board.status === 'paused'} onClick={() => turn(direction)} className={`${buttonClass} w-12 h-12 ${index === 0 ? 'col-start-2' : index === 1 ? 'col-start-1 row-start-2' : 'row-start-2'}`}>{direction === 'UP' ? '↑' : direction === 'LEFT' ? '←' : direction === 'DOWN' ? '↓' : '→'}</button>)}
            </div>
            <label className="text-xs text-gray-400 flex items-center gap-3">Difficulty<select value={speed} onChange={event => { setSpeed(Number(event.target.value)); pause(); }} className="rounded-xl border border-white/15 bg-neutral-950 px-3 py-2.5 text-gray-200 focus-visible:outline focus-visible:outline-emerald-300"><option value={130}>Easy</option><option value={90}>Normal</option><option value={60}>Fast</option><option value={40}>Expert</option></select></label>
        </div>
    </div>;
}

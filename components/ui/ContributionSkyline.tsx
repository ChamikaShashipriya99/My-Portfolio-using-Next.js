'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { Activity, ArrowUpRight, CalendarDays, Flame, RefreshCw } from 'lucide-react';

interface DayData { date: string; contributionCount: number; color: string }
interface CalendarData { totalContributions: number; weeks: { contributionDays: DayData[] }[] }
const palette = ['#161b22', '#0e4429', '#006d32', '#26a641', '#39d353'];
const point = (radius: number, angle: number) => `${(260 + radius * Math.sin(angle)).toFixed(3)},${(260 - radius * Math.cos(angle)).toFixed(3)}`;
function segment(inner: number, outer: number, start: number, end: number) {
    return `M ${point(inner, start)} L ${point(outer, start)} A ${outer} ${outer} 0 0 1 ${point(outer, end)} L ${point(inner, end)} A ${inner} ${inner} 0 0 0 ${point(inner, start)} Z`;
}
const formatDate = (date: string) => new Date(`${date}T12:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function ContributionSkyline() {
    const currentYear = new Date().getFullYear();
    const [year, setYear] = useState(currentYear);
    const [data, setData] = useState<CalendarData | null>(null);
    const [source, setSource] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selected, setSelected] = useState<DayData | null>(null);
    const [pinned, setPinned] = useState<DayData | null>(null);
    const [selectionVersion, setSelectionVersion] = useState(0);
    const [previous, setPrevious] = useState<CalendarData | null>(null);
    const [comparisonLoading, setComparisonLoading] = useState(false);
    const [replay, setReplay] = useState(0);
    const reducedMotion = useReducedMotion();
    const sectionRef = useRef<HTMLElement>(null);
    const isInView = useInView(sectionRef, { amount: 0.2 });

    useEffect(() => {
        const controller = new AbortController();
        setLoading(true);
        setError(false);
        setSelected(null);
        setPinned(null);
        setData(null);
        async function load() {
            try {
                const response = await fetch(`/api/github-contributions?year=${year}`, { signal: controller.signal });
                if (!response.ok) throw new Error('Contribution request failed');
                const result = await response.json();
                if (result.source !== 'github' || !result.data?.weeks?.length) throw new Error('No contribution calendar');
                if (controller.signal.aborted) return;
                setData(result.data);
                setSource(result.source);
            } catch {
                if (!controller.signal.aborted) setError(true);
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }
        load();
        return () => controller.abort();
    }, [year]);

    useEffect(() => {
        const controller = new AbortController();
        setPrevious(null);
        if (year <= 2023) { setComparisonLoading(false); return; }
        setComparisonLoading(true);
        async function loadPrevious() {
            try {
                const response = await fetch('/api/github-contributions?year=' + (year - 1), { signal: controller.signal });
                if (!response.ok) throw new Error('Previous year unavailable');
                const result = await response.json();
                if (!controller.signal.aborted && result.source === 'github' && result.data?.weeks?.length) setPrevious(result.data);
            } catch { /* Keep the selected year's chart available if comparison fails. */ }
            finally { if (!controller.signal.aborted) setComparisonLoading(false); }
        }
        loadPrevious();
        return () => controller.abort();
    }, [year]);

    useEffect(() => {
        if (!pinned) return;
        const timer = window.setTimeout(() => {
            setPinned(null);
            setSelected(null);
        }, 10_000);
        return () => window.clearTimeout(timer);
    }, [pinned, selectionVersion]);

    const pinDay = (day: DayData) => {
        setPinned(day);
        setSelectionVersion(value => value + 1);
    };

    const stats = useMemo(() => {
        const days = data?.weeks.flatMap(week => week.contributionDays) ?? [];
        let streak = 0, longest = 0;
        for (const day of days) {
            streak = day.contributionCount > 0 ? streak + 1 : 0;
            longest = Math.max(longest, streak);
        }
        return { days, active: days.filter(day => day.contributionCount > 0).length, longest, peak: Math.max(0, ...days.map(day => day.contributionCount)) };
    }, [data]);
    const maxCount = Math.max(1, stats.peak);
    const colorFor = (count: number) => palette[count === 0 ? 0 : Math.min(4, Math.ceil(count / maxCount * 4))];
    const first = stats.days[0]?.date;
    const last = stats.days[stats.days.length - 1]?.date;

    const displayDay = selected ?? pinned;
    const months = useMemo(() => {
        const positions = new Map<string, number[]>();
        data?.weeks.forEach((week, index) => week.contributionDays.forEach(day => {
            const month = day.date.slice(0, 7);
            positions.set(month, [...(positions.get(month) ?? []), index]);
        }));
        return Array.from(positions, ([month, indices]) => {
            const angle = Math.PI / 2 + (indices.reduce((sum, index) => sum + index, 0) / indices.length + 0.5) * Math.PI * 2 / (data?.weeks.length || 1);
            return { month, angle, label: new Date(month + '-15T12:00:00Z').toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' }) };
        });
    }, [data]);
    const previousTotal = previous?.weeks.flatMap(week => week.contributionDays)
        .filter(day => year !== currentYear || !last || day.date.slice(5) <= last.slice(5))
        .reduce((sum, day) => sum + day.contributionCount, 0);
    const difference = data && previousTotal !== undefined ? data.totalContributions - previousTotal : null;
    const percent = difference !== null && previousTotal ? Math.abs(difference / previousTotal * 100).toFixed(1) : null;

    return (
        <section ref={sectionRef} id="skyline" className="py-12 sm:py-16 5xl:py-20 relative overflow-hidden bg-black/30 border-y border-white/5">
            <span aria-hidden="true" className="pointer-events-none absolute top-8 right-6 text-[10rem] md:text-[18rem] font-black leading-none tracking-tighter text-white/[0.03]">05</span>
            <div className="container mx-auto px-6 relative z-10">
                <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
                    <div className="space-y-4">
                        <p className="font-mono text-xs uppercase tracking-[0.3em] text-blue-400">Consistency, one day at a time</p>
                        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tighter uppercase text-white">Contribution <span className="text-blue-500">Orbit</span></h2>
                        <div className="w-24 h-1.5 rounded-full bg-blue-600" />
                        <p className="font-mono text-xs text-gray-500 uppercase tracking-[0.2em]">A year of GitHub activity, in a new perspective</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <label htmlFor="contribution-year" className="flex items-center gap-3 font-mono text-xs text-gray-400">
                            Year
                            <select id="contribution-year" value={year} onChange={event => setYear(Number(event.target.value))} className="rounded-full border border-blue-500/30 bg-neutral-950 px-4 py-2 text-blue-300 focus-visible:outline focus-visible:outline-blue-400">
                                {Array.from({ length: currentYear - 2022 }, (_, index) => currentYear - index).map(option => <option key={option} value={option}>{option}</option>)}
                            </select>
                        </label>
                    {data && <span className={`rounded-full border px-4 py-2 font-mono text-[10px] uppercase tracking-widest ${source === 'github' ? 'border-blue-500/30 text-blue-300 bg-blue-500/10' : 'border-amber-500/30 text-amber-300 bg-amber-500/10'}`}>{source === 'github' ? 'GitHub data · cached up to 24h' : 'Data unavailable'}</span>}
                    </div>
                </div>

                <div className="relative rounded-[2rem] border border-white/10 bg-gradient-to-br from-blue-950/20 via-neutral-950 to-neutral-950 overflow-hidden">
                    {loading || error ? (
                        <div className="min-h-[440px] flex items-center justify-center gap-3 text-blue-300 font-mono text-sm" role="status">
                            {loading && <RefreshCw size={18} className="animate-spin motion-reduce:animate-none" />}
                            {error ? 'Data unavailable — unable to load GitHub contributions. Please refresh to try again.' : 'Mapping your contribution orbit…'}
                        </div>
                    ) : data && (
                        <div className="grid lg:grid-cols-[1.2fr_1fr] items-center gap-4 lg:gap-12 p-5 sm:p-10 lg:p-12">
                            <div className="relative w-full max-w-[580px] mx-auto">
                                <div aria-hidden="true" className="absolute inset-[18%] rounded-full bg-green-600/10 blur-3xl pointer-events-none" />
                                <svg viewBox="0 0 520 520" className="relative w-full overflow-visible" role="group" aria-label="Circular GitHub contribution calendar. Each segment is one day, weeks run clockwise from the right, Sunday is the innermost ring.">
                                    <circle cx="260" cy="260" r="109" fill="none" stroke="#22c55e" strokeOpacity="0.15" />
                                    <circle cx="260" cy="260" r="231" fill="none" stroke="#22c55e" strokeOpacity="0.12" strokeDasharray="2 6" />
                                    <motion.g key={`${year}-${replay}`} >
                                        {data.weeks.flatMap((week, weekIndex) => week.contributionDays.map(day => {
                                            const weekday = new Date(`${day.date}T12:00:00Z`).getUTCDay();
                                            const step = Math.PI * 2 / data.weeks.length;
                                            const inner = 119 + weekday * 14;
                                            return <motion.path
                                                key={day.date}
                                                d={segment(inner, inner + 11, Math.PI / 2 + weekIndex * step + 0.008, Math.PI / 2 + (weekIndex + 1) * step - 0.008)}
                                                fill={colorFor(day.contributionCount)}
                                                stroke={displayDay?.date === day.date ? '#fff' : 'transparent'} strokeWidth="1.5"
                                                initial={reducedMotion ? false : { opacity: 0 }}
                                                animate={{ opacity: reducedMotion || isInView ? 1 : 0 }}
                                                transition={{ duration: reducedMotion || !isInView ? 0 : 0.35, delay: reducedMotion || !isInView ? 0 : weekIndex * 0.035 }}
                                                className="cursor-pointer outline-none hover:brightness-150 focus:stroke-white"
                                                tabIndex={0} role="button" aria-pressed={pinned?.date === day.date} aria-label={`${formatDate(day.date)}: ${day.contributionCount} contributions`}
                                                onMouseEnter={() => setSelected(day)} onMouseLeave={() => setSelected(null)}
                                                onFocus={() => setSelected(day)} onBlur={() => setSelected(null)}
                                                onClick={() => pinDay(day)}
                                                onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pinDay(day); } }}
                                            ><title>{formatDate(day.date)}: {day.contributionCount} contributions</title></motion.path>;
                                        }))}
                                    </motion.g>
                                    {months.map(month => {
                                        const [x, y] = point(246, month.angle).split(',');
                                        return <text key={month.month} x={x} y={y} dy="0.35em" textAnchor="middle" fill="#9ca3af" fontSize="10" fontFamily="monospace">{month.label}</text>;
                                    })}
                                    <text x="260" y="246" textAnchor="middle" fill="#fff" fontSize="37" fontWeight="800" letterSpacing="-2">{(displayDay ? displayDay.contributionCount : data.totalContributions).toLocaleString()}</text>
                                    <text x="260" y="270" textAnchor="middle" fill="#86efac" fontSize="9" fontFamily="monospace" letterSpacing="1.5">{displayDay ? 'CONTRIBUTIONS' : `${year} CONTRIBUTIONS`}</text>
                                    <text x="260" y="292" textAnchor="middle" fill="#6b7280" fontSize="10" fontFamily="monospace">{displayDay ? formatDate(displayDay.date) : 'Every day leaves a mark'}</text>

                                </svg>
                                <div className="flex justify-center items-center gap-2 text-[10px] text-gray-500 font-mono mt-2">
                                    <span>Less</span>{palette.map(color => <span key={color} className="w-3 h-3 rounded-sm" style={{ backgroundColor: color }} />)}<span>More</span>
                                </div>
                                <button type="button" onClick={() => { setSelected(null); setReplay(value => value + 1); }} className="flex items-center gap-2 mx-auto mt-6 text-xs text-gray-400 hover:text-blue-300 transition-colors focus-visible:outline focus-visible:outline-blue-400 rounded px-3 py-2"><RefreshCw size={13} /> Replay animation</button>
                            </div>

                            <div className="space-y-8 pb-4 lg:pb-0">
                                <div>
                                    <div className="flex items-center gap-2 font-mono text-xs tracking-widest uppercase text-blue-400"><Activity size={16} /> The activity behind the work</div>
                                    <p className="text-6xl sm:text-7xl font-black tracking-tighter text-white mt-5">{data.totalContributions.toLocaleString()}<span className="text-blue-500">.</span></p>
                                    <p className="text-gray-400 mt-2">contributions in {year}{year === currentYear ? ' · year to date' : ''}</p>
                                    {first && last && <p className="font-mono text-[10px] text-gray-500 mt-3">{formatDate(first)} — {formatDate(last)}</p>}
                                </div>
                                <div className="rounded-2xl border border-blue-500/20 bg-blue-500/5 p-4" aria-live="polite">
                                    <p className="text-[10px] font-mono uppercase tracking-widest text-blue-400">Year comparison</p>
                                    <p className="text-sm text-gray-300 mt-2">
                                        {year === 2023 ? 'Comparisons start with 2024; history begins in 2023.' : comparisonLoading ? 'Loading previous year…' : source !== 'github' || difference === null ? 'Comparison unavailable — requires real GitHub data for both years.' : difference === 0 ? 'No change from ' + (year - 1) + '.' : (difference > 0 ? '↑ ' : '↓ ') + Math.abs(difference).toLocaleString() + (difference > 0 ? ' more' : ' fewer') + ' contributions than ' + (year - 1) + (percent ? ' (' + percent + '%)' : '')}
                                    </p>
                                    {year > 2023 && <p className="text-[10px] text-gray-500 mt-2">{year === currentYear ? 'Same period: January 1 through ' + (last ? formatDate(last).replace(', ' + year, '') : 'today') + ' in each year.' : 'Full calendar years compared.'}</p>}
                                </div>
                                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 min-h-[110px]" aria-live="polite">
                                    <div className="flex items-center justify-between gap-3">
                                        <p className="text-[10px] font-mono uppercase tracking-widest text-blue-400">Selected day</p>
                                        {pinned && <button type="button" className="text-xs text-gray-400 hover:text-white" onClick={() => { setPinned(null); setSelected(null); }}>Clear</button>}
                                    </div>
                                    {pinned ? <div className="mt-3"><p className="text-sm text-white">{formatDate(pinned.date)}</p><p className="text-gray-400 text-sm mt-1"><span className="text-white font-bold">{pinned.contributionCount.toLocaleString()}</span> {pinned.contributionCount === 1 ? 'contribution' : 'contributions'}</p></div> : <p className="text-sm text-gray-500 mt-3">Click or tap a tile to keep its date and contribution count here.</p>}
                                </div>
                                <div className="grid grid-cols-3 gap-3 border-y border-white/10 py-6">
                                    {[{ icon: CalendarDays, value: stats.active, label: 'Active days' }, { icon: Flame, value: stats.longest, label: 'Day streak', detail: 'Longest consecutive streak' }, { icon: Activity, value: stats.peak, label: 'Best day', detail: 'Most contributions in a day' }].map(stat => <div key={stat.label} title={stat.detail}>
                                        <stat.icon size={16} className="text-blue-400 mb-3" />
                                        <div className="text-2xl sm:text-3xl text-white font-bold">{stat.value}</div>
                                        <div className="text-[10px] sm:text-xs text-gray-500 mt-1">{stat.label}</div>
                                    </div>)}
                                </div>
                                <p className="text-sm leading-relaxed text-gray-400 max-w-sm">Each tile is a day. Follow the weeks clockwise from the right; the seven rings run from Sunday inside to Saturday outside. Brighter greens mark busier days. Hover, focus, or tap a tile to explore.</p>
                                <a href="https://github.com/ChamikaShashipriya99" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:text-blue-200 transition-colors">Explore my GitHub <ArrowUpRight size={16} /></a>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}

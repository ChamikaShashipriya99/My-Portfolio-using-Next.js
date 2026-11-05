export interface Cell { x: number; y: number }
export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';
export const columns = 24, rows = 18;
export const opposite: Record<Direction, Direction> = { UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT' };
export function nextSnake(snake: Cell[], direction: Direction, food: Cell) {
    const head = { ...snake[0] };
    if (direction === 'UP') head.y--;
    if (direction === 'DOWN') head.y++;
    if (direction === 'LEFT') head.x--;
    if (direction === 'RIGHT') head.x++;
    const ate = head.x === food.x && head.y === food.y;
    const body = ate ? snake : snake.slice(0, -1);
    const crashed = head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows || body.some(cell => cell.x === head.x && cell.y === head.y);
    return { snake: crashed ? snake : [head, ...body], ate: !crashed && ate, crashed };
}
export function newFood(snake: Cell[], random = Math.random): Cell | null {
    const occupied = new Set(snake.map(cell => `${cell.x},${cell.y}`));
    const free: Cell[] = [];
    for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) if (!occupied.has(`${x},${y}`)) free.push({ x, y });
    return free.length ? free[Math.min(free.length - 1, Math.floor(random() * free.length))] : null;
}

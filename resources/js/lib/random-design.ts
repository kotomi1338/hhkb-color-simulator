import { HHKB_PALETTE } from '@/constants/colors';
import type { KeyDefinition } from '@/types/keyboard';

type ColorMap = Record<string, string>;

const PALETTE = Object.values(HHKB_PALETTE);

function pick<T>(items: T[]): T {
    return items[Math.floor(Math.random() * items.length)];
}

/** Return `count` distinct, randomly ordered palette colors. */
function sampleColors(count: number): string[] {
    const shuffled = [...PALETTE];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled.slice(0, count);
}

/** Wide keys and Esc act as modifier/accent keys. */
function isAccentKey(key: KeyDefinition): boolean {
    return key.w > 1 || key.id === 'esc' || key.id === 'fn';
}

type Strategy = (layout: KeyDefinition[]) => ColorMap;

/** Single base color with a contrasting accent on the modifier keys. */
const baseAccent: Strategy = (layout) => {
    const [base, accent] = sampleColors(2);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = isAccentKey(key) ? accent : base;
    });
    return map;
};

/** Base + modifier accent, with a third "pop" color on Esc and Space. */
const baseAccentPop: Strategy = (layout) => {
    const [base, accent, pop] = sampleColors(3);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = isAccentKey(key) ? accent : base;
    });
    map.esc = pop;
    map.space = pop;
    return map;
};

/** Each row gets its own color. */
const perRow: Strategy = (layout) => {
    const rowColors = sampleColors(5);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = rowColors[key.y % rowColors.length];
    });
    return map;
};

/** Vertical stripes cycling a small set of colors by column. */
const columnStripes: Strategy = (layout) => {
    const colors = sampleColors(pick([2, 3]));
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = colors[Math.floor(key.x) % colors.length];
    });
    return map;
};

/** Checkerboard of two colors. */
const checker: Strategy = (layout) => {
    const [a, b] = sampleColors(2);
    const map: ColorMap = {};
    layout.forEach((key) => {
        map[key.id] = (Math.floor(key.x) + key.y) % 2 === 0 ? a : b;
    });
    return map;
};

/** A calm base color sprinkled with random accent "confetti". */
const confetti: Strategy = (layout) => {
    const [base, ...accents] = sampleColors(3);
    const map: ColorMap = {};
    layout.forEach((key) => {
        if (!isAccentKey(key) && Math.random() < 0.28) {
            map[key.id] = pick(accents);
        } else {
            map[key.id] = base;
        }
    });
    return map;
};

const STRATEGIES: Strategy[] = [
    baseAccent,
    baseAccentPop,
    perRow,
    columnStripes,
    checker,
    confetti,
];

/**
 * Build a random "cute" color map for the given layout using only the
 * existing palette colors. Cuteness comes from the variety of patterns.
 */
export function generateRandomDesign(layout: KeyDefinition[]): ColorMap {
    return pick(STRATEGIES)(layout);
}
